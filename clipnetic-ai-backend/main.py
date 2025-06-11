import json
import pathlib
import subprocess
import time
import uuid
import boto3
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import modal
from pydantic import BaseModel
import os

import whisperx


class ProcessVideoRequest(BaseModel):
    s3_key: str


image = (modal.Image.from_registry(
    "nvidia/cuda:12.4.0-devel-ubuntu22.04", add_python="3.12")
    .apt_install(["ffmpeg", "libgl1-mesa-glx", "wget", "libcudnn8", "libcudnn8-dev"])
    .pip_install_from_requirements("requirements.txt")
    .run_commands([
        "mkdir -p /usr/share/fonts/truetype/custom",
        "wget -O /usr/share/fonts/truetype/custom/Anton-Regular.ttf https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf",
        "fc-cache -f -v "])
    .add_local_dir("asd", "/asd", copy=True))

app = modal.App("clipnetic-ai", image=image)

volume = modal.Volume.from_name(
    "clipnetic-ai-model-cache", create_if_missing=True
)

mount_path = "/root/.cache/torch"

auth_scheme = HTTPBearer()


@app.cls(gpu="L40S", timeout=900, retries=0, scaledown_window=20, secrets=[modal.Secret.from_name("clipnetic-ai-secret")], volumes={mount_path: volume})
class ClipneticAI:
    @modal.enter()
    def load_models(self):
        print("Loading models")

        self.whisperx_model = whisperx.load_model(
            "large-v2", device="cuda", compute_type="float16")

        self.alignment_model, self.metadata = whisperx.load_align_model(
            language_code="en",
            device="cuda"
        )

        print("Transcription models loaded...")

    def transcribe_video(self, base_dir: str, video_path: str) -> str:
        audio_path = base_dir / "audio.wav"
        extract_cmd = f"ffmpeg -i {video_path} -vn -acodec pcm_s16le -ar 16000 -ac 1 {audio_path}"
        subprocess.run(extract_cmd, shell=True,
                       check=True, capture_output=True)

        print("Starting transcription with WhisperX...")
        start_time = time.time()

        audio = whisperx.load_audio(str(audio_path))
        result = self.whisperx_model.transcribe(audio, batch_size=16)

        result = whisperx.align(
            result["segments"],
            self.alignment_model,
            self.metadata,
            audio,
            device="cuda",
            return_char_alignments=False
        )

        duration = time.time() - start_time
        print("Transcription and alignment took " + str(duration) + " seconds")

        print(json.dumps(result, indent=2))

    @modal.fastapi_endpoint(method="POST")
    def process_video(self, request: ProcessVideoRequest, token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
        s3_key = request.s3_key

        if token.credentials != os.environ["AUTH_TOKEN"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Incorrect bearer token", headers={"WWW-Authenticate": "Bearer"})

        run_id = str(uuid.uuid4())
        base_dir = pathlib.Path("/tmp") / run_id
        base_dir.mkdir(parents=True, exist_ok=True)

        # Download video file
        video_path = base_dir / "input.mp4"
        s3_client = boto3.client("s3")
        s3_client.download_file("clipnetic-ai", s3_key, str(video_path))

        self.transcribe_video(base_dir, video_path)


@app.local_entrypoint()
def main():
    import requests

    clipnetic_ai = ClipneticAI()

    url = clipnetic_ai.process_video.web_url

    payload = {
        "s3_key": "test1/eisr6min.mp4"
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer supersection_clipnetic-ai_soumosarkar"
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    result = response.json()
    print(result)
