// components/services/ServiceVideo.tsx
import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface ServiceVideoProps {
  videoUrl: string;
}

const ServiceVideo: React.FC<ServiceVideoProps> = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl) return null;

  // Check if it's a YouTube URL and extract video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  const isYouTube = !!youtubeVideoId;

  // YouTube thumbnail URL
  const getThumbnailUrl = (videoId: string) => 
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
      <div className="h-1 bg-gradient-to-r from-red-500 to-purple-500"></div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3 text-white">Видео о процедуре</h3>
        
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800">
          {!isPlaying ? (
            // Thumbnail with play button
            <div className="relative w-full h-full group cursor-pointer" onClick={handlePlay}>
              {isYouTube ? (
                <img
                  src={getThumbnailUrl(youtubeVideoId!)}
                  alt="Видео превью"
                  className="w-full h-full object-cover"
                />
              ) : (
                // For non-YouTube videos, show a generic thumbnail
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <Play size={24} className="text-white mx-auto mb-1" />
                    <p className="text-white text-xs">Нажмите для воспроизведения</p>
                  </div>
                </div>
              )}
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={18} className="text-gray-800 ml-0.5" />
                </div>
              </div>
            </div>
          ) : (
            // Video player
            <div className="w-full h-full">
              {isYouTube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title="Service Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Ваш браузер не поддерживает воспроизведение видео.
                </video>
              )}
            </div>
          )}
        </div>

        {/* External link for YouTube videos */}
        {isYouTube && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={12} className="mr-1" />
            Смотреть на YouTube
          </a>
        )}
      </div>
    </div>
  );
};

export default ServiceVideo;