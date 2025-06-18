"use client";

import { useState } from "react";
import Link from "next/link";
import type { Clip } from "@prisma/client";
import { Loader2, UploadCloud } from "lucide-react";
import Dropzone, { type DropzoneState } from "shadcn-dropzone";

import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { generateUploadUrl } from "~/actions/s3";
import { toast } from "sonner";
import { processVideo } from "~/actions/generation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";


type DashboardClientProps = {
  uploadedFiles: {
    id: string;
    s3Key: string;
    filename: string;
    status: string;
    clipsCount: number;
    createdAt: Date;
  }[];
  clips: Clip[];
}

export function DashboardClient({ uploadedFiles, clips }: DashboardClientProps) {

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }

  const handleUpload = async () => {
    if (files.length === 0) return;

    const file = files[0]!;
    setUploading(true);

    try {
      const { success, signedUrl, uploadedFileId } = await generateUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      if (!success) throw new Error("Failed to get upload URL");

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload file with status: ${uploadResponse.status}`);
      }

      await processVideo(uploadedFileId);

      setFiles([]);

      toast.success("Video uploaded successfully", {
        description: "Your video has been scheduled for processing. Check the status below.",
        duration: 5000,
      });

    } catch (error) {
      toast.error("Upload failed", {
        description: "There was a problem uploading your video. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Podcast Clipper AI
          </h1>
          <p className="text-muted-foreground">
            Upload your podcast and get AI-generated clips instantly
          </p>
        </div>
        <Link href="/dashboard/billing">
          <Button>Buy Credits</Button>
        </Link>
      </div>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="my-clips">My Clips</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Podcast</CardTitle>
              <CardDescription>Upload your audio or video file to generate clips</CardDescription>
            </CardHeader>
            <CardContent>
              <Dropzone
                onDrop={handleDrop}
                accept={{ "video/mp4": [".mp4"] }}
                maxSize={500 * 1024 * 1024}
                disabled={uploading}
                maxFiles={1}
              >
                {(dropzone: DropzoneState) => (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg p-10 text-center">
                      <UploadCloud className="text-muted-foreground h-12 w-12" />
                      <p className="font-medium">Drag and drop your file</p>
                      <p className="text-muted-foreground text-sm">or click to browse (MP4 upto 500MB)</p>
                      <Button variant="default" size="sm" className="cursor-pointer">
                        Select File
                      </Button>
                    </div>
                  </>
                )}
              </Dropzone>

              <div className="flex items-start justify-between mt-5">
                <div>
                  {files.length > 0 && (
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">Selected file:</p>
                      {files.map((file) => (
                        <p key={file.name} className="text-muted-foreground">
                          {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  disabled={files.length === 0 || uploading}
                  onClick={handleUpload}
                >
                  {uploading ?
                    <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Uploading...</>
                    : "Upload and Generate Clips"
                  }
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-base mb-2 font-medium">Queue status</h3>
                  <div className="max-h-[300px] overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Clips created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadedFiles.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="max-w-xs truncate font-medium">{item.filename}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {item.status === "queued" && <Badge variant="outline">Queued</Badge>}
                              {item.status === "processing" && <Badge variant="outline">Processing</Badge>}
                              {item.status === "processed" && <Badge variant="outline">Processed</Badge>}
                              {item.status === "no-credits" && <Badge variant="destructive">No Credits</Badge>}
                              {item.status === "failed" && <Badge variant="destructive">Failed</Badge>}
                            </TableCell>
                            <TableCell>
                              {item.clipsCount > 0 ?
                                <span>{item.clipsCount} clip{item.clipsCount !== 1 ? "s" : ""}</span>
                                : <span className="text-muted-foreground">No Clips yet</span>
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-clips"></TabsContent>
      </Tabs>
    </div>
  );
}
