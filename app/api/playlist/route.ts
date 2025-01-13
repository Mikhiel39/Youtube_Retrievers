
import { NextResponse } from 'next/server';

interface YouTubeVideo {
  snippet: {
    resourceId: {
      videoId: string;
    };
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    publishedAt: string;
    channelTitle: string;
  };
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = 'PLZRYrzB6yemdoVphs4IC43La_DM29NZQ1';

  // Check if the API key is provided
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 400 });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=100&key=${apiKey}`;

  try {
    // Fetch data from the YouTube API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validate `data.items` is an array
    if (Array.isArray(data.items)) {
      // Use the defined `YouTubeVideo` interface
      const formattedVideos = data.items.map((video: YouTubeVideo) => {
        const snippet = video.snippet;

        if (!snippet || !snippet.resourceId) {
          console.warn('Invalid video snippet:', video);
          return null;
        }

        return {
          id: snippet.resourceId.videoId || 'Unknown ID',
          title: snippet.title || 'Untitled',
          description: snippet.description || 'No description available.',
          thumbnailUrl: snippet.thumbnails?.medium?.url || '',
          publishedAt: snippet.publishedAt || 'Unknown Date',
          channelTitle: snippet.channelTitle || 'Unknown Channel',
        };
      }).filter(Boolean); // Remove null or invalid entries

      return NextResponse.json({ videos: formattedVideos });
    } else {
      console.error('Invalid data format: `items` is not an array.');
      return NextResponse.json(
        { error: 'Invalid data format. `items` is not an array.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}
