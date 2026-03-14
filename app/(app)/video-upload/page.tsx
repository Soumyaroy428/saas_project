"use client";

import React, { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB

export default function VideoUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];

      if (!selectedFile) return;

      if (!selectedFile.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File too large. Max 70MB allowed.");
        return;
      }

      setFile(selectedFile);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!file) {
        alert("Please select a video file");
        return;
      }

      const cleanTitle = title.trim();
      const cleanDescription = description.trim();

      if (!cleanTitle || !cleanDescription) {
        alert("Title and description are required");
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);

        // Create FormData and upload to the unified API route
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", cleanTitle);
        formData.append("description", cleanDescription);
        formData.append("originalSize", file.size.toString());

        const { data, status } = await axios.post(
          "/api/videoUpload",
          formData,
          {
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              if (!progressEvent.total) return;

              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              setUploadProgress(progress);
            },
          },
        );

        if (status === 207) {
          alert(`Video uploaded to Cloudinary but database save failed.\nWarning: ${data.warning}`);
        } else {
          alert("Video uploaded successfully!");
        }
        console.log("Upload result:", data);

        router.push("/home");
      } catch (error) {
        console.error("Upload failed:", error);

        let message = "Upload failed";

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ error?: string; details?: string }>;
          const status = axiosError.response?.status;
          
          if (status === 504) {
            message = "Upload timed out. The video is too large or your connection is slow. Try a smaller file (under 5MB) or check your internet connection.";
          } else {
            message = axiosError.response?.data?.details || axiosError.response?.data?.error || axiosError.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }

        alert(message);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [file, title, description, router],
  );

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video File</label>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            disabled={isUploading}
          />

          {file && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {isUploading && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>

            <progress
              className="progress progress-primary w-full"
              value={uploadProgress}
              max="100"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || !file}
          className="btn btn-primary w-full"
        >
          {isUploading ? `Uploading ${uploadProgress}%` : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
