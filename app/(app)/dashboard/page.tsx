'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  Video, 
  Share2, 
  BarChart3, 
  Upload,
  ArrowRight,
  Clock,
  FileVideo,
  TrendingUp,
  Activity,
  Loader2
} from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description: string;
  originalsize: string;
  compressedsize: string;
  createdAt: string;
  publicId: string;
}

export default function DashboardPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/video');
      setVideos(data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats dynamically
  const stats = React.useMemo(() => {
    const totalVideos = videos.length;
    
    // Calculate total original size in bytes, then convert to GB
    const totalOriginalBytes = videos.reduce((acc, v) => {
      return acc + (parseInt(v.originalsize) || 0);
    }, 0);
    const totalOriginalGB = (totalOriginalBytes / (1024 * 1024 * 1024)).toFixed(1);
    
    // Calculate total compressed size in bytes, then convert to GB
    const totalCompressedBytes = videos.reduce((acc, v) => {
      return acc + (parseInt(v.compressedsize) || 0);
    }, 0);
    const totalCompressedGB = (totalCompressedBytes / (1024 * 1024 * 1024)).toFixed(1);
    
    // Calculate space saved
    const savedGB = (parseFloat(totalOriginalGB) - parseFloat(totalCompressedGB)).toFixed(1);
    
    // Calculate this month's uploads
    const now = new Date();
    const thisMonthVideos = videos.filter(v => {
      const videoDate = new Date(v.createdAt);
      return videoDate.getMonth() === now.getMonth() && 
             videoDate.getFullYear() === now.getFullYear();
    });
    const thisMonthCount = thisMonthVideos.length;

    return [
      { label: 'Videos', value: totalVideos.toString(), icon: <FileVideo className="w-5 h-5" />, color: 'from-pink-500 to-rose-500' },
      { label: 'Processed', value: `${totalOriginalGB}GB`, icon: <TrendingUp className="w-5 h-5" />, color: 'from-cyan-400 to-blue-500' },
      { label: 'Saved', value: `${savedGB}GB`, icon: <Activity className="w-5 h-5" />, color: 'from-emerald-400 to-green-500' },
      { label: 'This Month', value: thisMonthCount.toString(), icon: <Clock className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500' }
    ];
  }, [videos]);

  const actions = [
    {
      title: 'Video Upload',
      desc: 'Upload and compress your videos',
      icon: <Upload className="w-8 h-8" />,
      href: '/video-upload',
      color: 'from-primary to-secondary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Social Share',
      desc: 'Share to all platforms instantly',
      icon: <Share2 className="w-8 h-8" />,
      href: '/social-share',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Analytics',
      desc: 'Track your video performance',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '#',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      disabled: true
    }
  ];

  // Get recent videos (last 5)
  const recentVideos = videos.slice(0, 5);

  // Helper functions
  const formatSize = (bytes: string) => {
    const num = parseInt(bytes) || 0;
    if (num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Welcome back! Here's what's happening</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{loading ? '-' : stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className={`group p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] ${
                  action.disabled 
                    ? 'bg-white/5 opacity-60 cursor-not-allowed' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={action.disabled ? (e) => e.preventDefault() : undefined}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{action.desc}</p>
                {!action.disabled && (
                  <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Recent Activity
            </h2>
            <Link href="/home" className="text-sm text-primary hover:text-secondary transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-gray-400">{error}</p>
                <button 
                  onClick={fetchVideos}
                  className="mt-2 btn btn-sm btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : recentVideos.length === 0 ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">No recent uploads</p>
                  <p className="text-sm text-gray-400">Start by uploading your first video</p>
                </div>
                <Link 
                  href="/video-upload"
                  className="btn btn-sm btn-primary bg-gradient-to-r from-primary to-secondary border-0"
                >
                  Upload Now
                </Link>
              </div>
            ) : (
              recentVideos.map((video) => (
                <div 
                  key={video.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{video.title}</p>
                    <p className="text-sm text-gray-400">
                      {formatSize(video.compressedsize)} • {formatDate(video.createdAt)}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-emerald-400">
                      -{((1 - parseInt(video.compressedsize) / parseInt(video.originalsize)) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">saved</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
