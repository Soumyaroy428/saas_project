'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Video, 
  Zap, 
  Share2, 
  Shield, 
  ArrowRight,
  Play
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Video Compression',
      desc: 'Reduce file sizes by up to 80% without losing quality',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      desc: 'Powered by Cloudinary for instant processing',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Easy Sharing',
      desc: 'Share directly to all major social platforms',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Storage',
      desc: 'Your videos are encrypted and safely stored',
      color: 'from-emerald-400 to-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            VideoSaaS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/sign-in" 
            className="btn btn-ghost text-white hover:text-primary"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up" 
            className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-0"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto text-center">

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Compress Videos
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
              Like Magic
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Reduce video file sizes by up to 80% without losing quality. 
            Share faster, store smarter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/sign-up"
              className="btn btn-lg btn-primary bg-gradient-to-r from-primary to-secondary border-0 gap-2 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn btn-lg btn-ghost text-white gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 mt-16 pt-16 border-t border-white/10">
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-primary">80%</p>
              <p className="text-gray-400">Smaller Files</p>
            </div>
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-secondary">10K+</p>
              <p className="text-gray-400">Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-accent">1M+</p>
              <p className="text-gray-400">Videos Processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400">Powerful features to supercharge your video workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            <span className="font-semibold">VideoSaaS</span>
          </div>
          <p className="text-sm text-gray-400">
            ©2026 VideoSaas SoumyaRoy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
