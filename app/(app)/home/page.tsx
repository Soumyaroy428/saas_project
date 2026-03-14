'use client';

import React, { useEffect, useState } from 'react';
import VideoCard from '@/components/videoCard';
import { Video, Loader2, Film } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  publicId: string;
  originalsize: string;
  compressedsize: string;
  duration: string;
  createdAt: string;
}

export default function HomePage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/video');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch videos' }));
        setError(errorData.error || `Server error: ${response.status}`);
        setVideos([]);
        return;
      }
      const data = await response.json();
      // Check if data is an array
      if (!Array.isArray(data)) {
        setError('Invalid response format from server');
        setVideos([]);
        return;
      }
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (videoId: string, url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg">Loading videos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error}</p>
          <button onClick={fetchVideos} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            My Videos
          </span>
        </h1>
        <p className="text-gray-400">
          {videos.length} {videos.length === 1 ? 'video' : 'videos'} uploaded
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
            <Film className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
          <p className="text-gray-400 mb-6">Upload your first video to get started</p>
          <a 
            href="/video-upload" 
            className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-0"
          >
            Upload Video
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={{
                id: video.id,
                title: video.title,
                description: video.description || '',
                originalSize: parseInt(video.originalsize) || 0,
                compressedSize: parseInt(video.compressedsize) || 0,
                createdAt: new Date(video.createdAt),
                videoUrl: video.publicId,
                thumbnailUrl: video.publicId
              }}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}