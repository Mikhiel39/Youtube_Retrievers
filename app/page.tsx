"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
}

export default function PlaylistVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/playlist"); // API endpoint fetching videos
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Error fetching playlist videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white">
      <header className="bg-white shadow-md py-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 tracking-tight">
          YouTube Playlist Videos
        </h1>
      </header>

      <main className="p-6 md:p-10 lg:p-16">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg font-medium text-blue-600">
              Loading videos...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full rounded-t-lg"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-blue-800 truncate">
                    {video.title}
                  </h2>
                  <p className="text-sm text-blue-600 mt-2 line-clamp-3">
                    {video.description}
                  </p>
                  <div className="mt-4 text-blue-500 text-sm space-y-1">
                    <p>
                      <strong>Published:</strong>{" "}
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Channel:</strong> {video.channelTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-10 text-center text-blue-600 text-sm">
        <p>
          Powered by{" "}
          <a
            href="https://www.youtube.com"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube API
          </a>
        </p>
      </footer>
    </div>
  );
}
