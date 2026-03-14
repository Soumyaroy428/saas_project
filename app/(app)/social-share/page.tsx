"use client"
import React, { useState, useEffect, useRef } from "react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialSharePage() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setTransforming] = useState(false);
  const imageref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setTransforming(true)
    }
  }, [selectedFormat, uploadedImage])
  
 const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
   if (!file) return;
   setIsUploading(true);
   const formData = new FormData();
   formData.append("file", file);
    try {
      const response = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageref.current || !uploadedImage) return;
    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${uploadedImage}`;
    fetch(cloudinaryUrl)
      .then((Response) => Response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `social-share-${selectedFormat
          .replace(/\s/g, "-")
          .toLowerCase()}.jpg`;
        link.click();
        window.URL.revokeObjectURL(url);
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Share</h1>
          <p className="text-lg text-gray-600">Transform and share your content across social media platforms</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
            />
            {isUploading && (
              <div className="mt-2 flex items-center justify-center">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="ml-2 text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.keys(socialFormats).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="flex justify-center items-center min-h-[300px] relative">
            {isTransforming && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg">
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-2 text-sm text-gray-600">Transforming image...</p>
                </div>
              </div>
            )}
            {uploadedImage ? (
              <img
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${uploadedImage}`}
                alt="Transformed image for social media"
                ref={imageref}
                onLoad={() => setTransforming(false)}
                className="rounded-lg shadow-md max-w-full h-auto"
                style={{ 
                  aspectRatio: socialFormats[selectedFormat].aspectRatio,
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div className="w-full max-w-md h-64 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Upload an image to see preview</p>
                </div>
              </div>
            )}
          </div>

          {uploadedImage && (
            <div className="mt-6 flex justify-center space-x-4">
              <button 
                onClick={() => setTransforming(!isTransforming)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isTransforming ? 'Stop Loading' : 'Toggle Loading'}
              </button>
              <button 
                onClick={handleDownload}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}