import React, { useState, useEffect, useCallback } from 'react';
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary';
import { Download, Clock, FileDown, FileUp, Video } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { filesize } from 'filesize';

dayjs.extend(relativeTime);

interface VideoCardProps { 
    video: {
        compressedSize: number;
        id: string;
        title: string;
        description: string;
        originalSize: number;
        createdAt: Date;
        videoUrl: string;
        thumbnailUrl: string;
    };
    onDownload: (videoId: string,url:string,title:string) => void;
}

const videoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
    
    const [ isHovered, setIsHovered ] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [thumbnailError, setThumbnailError] = useState(false);
    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 300,
            crop: 'fill',
            format: 'jpg',
            gravity: 'auto',
            quality: 'auto',
            assetType: 'video',
        })
    }, []);
    
    const getFullVideoUrl = useCallback(
      (publicId: string) => {
        return getCldVideoUrl({
          src: publicId,
            width: 1920,
            height: 1080,
        });
      },
      [],
    );

    const getPreviewVideoUrl = useCallback((publicId: string) => {
      return getCldVideoUrl({
        src: publicId,
        width: 400,
          height: 225,
        rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_duration_1"],
      });
    }, []);

    const formateSize = useCallback((size: number) => {
        return filesize(size, { round: 1 });
    }, []);
    
    const formatDate = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }, []);
    
    const compressionPercentage = Math.round(((video.originalSize - video.compressedSize) / video.originalSize) * 100);

    useEffect(() => {
        setPreviewError(false);
    }, [isHovered]);

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden group">
     
      <figure 
        className="relative aspect-video bg-gray-900"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <Video className="w-16 h-16 text-gray-600" />
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.videoUrl)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={() => setPreviewError(true)}
            />
          )
        ) : thumbnailError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Video className="w-16 h-16 text-gray-600" />
          </div>
        ) : (
          <img
            src={getThumbnailUrl(video.thumbnailUrl)}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setThumbnailError(true)}
          />
        )}
        
     
        <div className="absolute top-2 right-2 badge badge-success gap-1">
          <FileDown className="w-3 h-3" />
          {compressionPercentage}%
        </div>

   
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onDownload(video.id, getFullVideoUrl(video.videoUrl), video.title)}
            className="btn btn-primary btn-circle"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </figure>


      <div className="card-body p-4">
        <h3 className="card-title text-lg font-semibold truncate">
          {video.title}
        </h3>
        
        {video.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {video.description}
          </p>
        )}


        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1" title="Original size">
            <FileUp className="w-4 h-4" />
            <span>{formateSize(video.originalSize)}</span>
          </div>
          <div className="flex items-center gap-1" title="Compressed size">
            <FileDown className="w-4 h-4" />
            <span>{formateSize(video.compressedSize)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-3 pt-3 border-t">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{dayjs(video.createdAt).fromNow()}</span>
          </div>
          
          <button
            onClick={() => onDownload(video.id, getFullVideoUrl(video.videoUrl), video.title)}
            className="btn btn-primary btn-sm gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default videoCard