from pytubefix import YouTube
from pytubefix.cli import on_progress

url1="https://www.youtube.com/watch?v=eD_RtSQTeRM&t=4108s"
url2="https://www.youtube.com/watch?v=r8pDXO6zRUg"

yt = YouTube(url2, on_progress_callback=on_progress)
print(yt.title)

# ys = yt.streams.get_highest_resolution()
ys = yt.streams.get_by_resolution("360p")
ys.download()
