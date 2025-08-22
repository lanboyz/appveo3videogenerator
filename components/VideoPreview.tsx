import React, { forwardRef } from 'react';
import { DownloadIcon, VideoIcon } from './Icons';

interface VideoPreviewProps {
  videoUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  aspectRatio: string;
  generationCount: number;
}

const VideoPreview = forwardRef<HTMLDivElement, VideoPreviewProps>(
  ({ videoUrl, isLoading, loadingMessage, error, aspectRatio, generationCount }, ref) => {
    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="text-center text-blue-700">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-semibold text-lg">Sedang Membuat Video Anda</p>
            <p className="text-blue-500 animate-pulse">{loadingMessage}</p>
          </div>
        );
      }
      if (error) {
        return (
          <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">
            <p className="font-bold">Pembuatan Gagal</p>
            <p className="text-sm">{error}</p>
          </div>
        );
      }
      if (videoUrl) {
        return (
          <div className="w-full h-full relative flex flex-col">
            {generationCount > 0 && (
              <div className="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
                VIDEO #{generationCount}
              </div>
            )}
            <video src={videoUrl} controls autoPlay loop className="w-full flex-grow min-h-0 rounded-lg shadow-inner object-contain" />
            <a
              href={videoUrl}
              download={`generated-video-${generationCount}.mp4`}
              className="mt-4 flex-shrink-0 w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
            >
              <DownloadIcon />
              Unduh Video
            </a>
          </div>
        );
      }
      return (
        <div className="text-center text-blue-400">
          <VideoIcon />
          <p className="mt-2 font-medium">Video yang Anda buat akan muncul di sini</p>
          <p className="text-sm">Isi formulir di bawah untuk memulai</p>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className="relative bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-blue-300/50 hover:ring-2 hover:ring-blue-400/50 transform hover:-translate-y-1"
        style={{ aspectRatio: aspectRatio }}
      >
        {renderContent()}
      </div>
    );
  }
);

export default VideoPreview;