export interface StreamInfo {
  platform: 'youtube' | 'facebook';
  status: 'live' | 'scheduled' | 'completed';
  title: string;
  subtitle?: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelName: string;
  channelUrl: string;
  publishedAt?: string;
}

export interface LivestreamsData {
  youtube: StreamInfo;
  facebook: StreamInfo;
  activeStream: 'youtube' | 'facebook' | null;
  lastUpdated: number;
}

// In-memory cache
let cachedData: LivestreamsData | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Default fallback data for resilience
const defaultData: LivestreamsData = {
  youtube: {
    platform: 'youtube',
    status: 'completed',
    title: 'PRAYER MEETING & MIDWEEK SERVICE',
    subtitle: 'Inicbulan Fundamental Baptist Bible Church',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/@ifbbc/streams',
    channelName: 'IFBBC Official',
    channelUrl: 'https://www.youtube.com/@ifbbc',
  },
  facebook: {
    platform: 'facebook',
    status: 'completed',
    title: 'WORSHIP LIVESTREAM',
    subtitle: 'Live from IFBBC',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
    channelName: 'Inicbulan Fundamental Baptist Bible Church',
    channelUrl: 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
  },
  activeStream: null,
  lastUpdated: Date.now(),
};

async function fetchYouTubeLivestream(): Promise<StreamInfo> {
  const fallback = defaultData.youtube;
  try {
    // 1. Check if official API Key exists
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&q=ifbbc&key=${apiKey}`
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.items && searchData.items.length > 0) {
            const item = searchData.items[0];
            return {
              platform: 'youtube',
              status: 'live',
              title: item.snippet.title,
              subtitle: 'Broadcasting live on YouTube',
              thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              channelName: 'IFBBC Official',
              channelUrl: 'https://www.youtube.com/@ifbbc',
            };
          }
        }
      } catch (err) {
        console.warn('[livestreamService] YouTube API search error, falling back:', err);
      }
    }

    // 2. Check /live directly to see if currently streaming
    try {
      const liveRes = await fetch('https://www.youtube.com/@ifbbc/live', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      const liveHtml = await liveRes.text();
      const isLiveNow =
        liveHtml.includes('"isLive":true') ||
        liveHtml.includes('"isLiveBroadcast":true') ||
        liveHtml.includes('BADGE_STYLE_TYPE_LIVE_NOW');
      const isScheduled = liveHtml.includes('"upcomingEventData"');

      // Check if URL redirected to a specific video
      const liveVideoMatch = liveRes.url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      const videoId = liveVideoMatch
        ? liveVideoMatch[1]
        : (liveHtml.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)?.[1] ?? null);

      if ((isLiveNow || isScheduled) && videoId) {
        // Fetch metadata via oEmbed
        let title = 'IFBBC LIVE WORSHIP SERVICE';
        try {
          const oembed = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
          );
          if (oembed.ok) {
            const data = await oembed.json();
            if (data.title) title = data.title;
          }
        } catch {
          // ignore
        }

        return {
          platform: 'youtube',
          status: isLiveNow ? 'live' : 'scheduled',
          title,
          subtitle: isLiveNow
            ? "Broadcasting live from IFBBC Sanctuary"
            : 'Scheduled Upcoming Livestream',
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          channelName: 'IFBBC Official',
          channelUrl: 'https://www.youtube.com/@ifbbc',
        };
      }
    } catch (e) {
      console.warn('[livestreamService] /live check failed, falling back to /streams:', e);
    }

    // 3. If not live, fetch the latest completed livestream from /streams
    const streamsRes = await fetch('https://www.youtube.com/@ifbbc/streams', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (streamsRes.ok) {
      const html = await streamsRes.text();
      const videoIds = [
        ...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g),
      ].map((m) => m[1]);
      const uniqueIds = [...new Set(videoIds)];

      if (uniqueIds.length > 0) {
        const latestId = uniqueIds[0];
        let title = 'LATEST IFBBC LIVESTREAM';
        try {
          const oembed = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${latestId}&format=json`
          );
          if (oembed.ok) {
            const data = await oembed.json();
            if (data.title) title = data.title;
          }
        } catch {
          // ignore
        }

        return {
          platform: 'youtube',
          status: 'completed',
          title,
          subtitle: 'Latest Streamed Gathering & Message',
          thumbnailUrl: `https://i.ytimg.com/vi/${latestId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/watch?v=${latestId}`,
          channelName: 'IFBBC Official',
          channelUrl: 'https://www.youtube.com/@ifbbc',
        };
      }
    }

    return fallback;
  } catch (error) {
    console.error('[livestreamService] Error fetching YouTube:', error);
    return fallback;
  }
}

async function fetchFacebookLivestream(): Promise<StreamInfo> {
  const fallback = defaultData.facebook;
  try {
    // 1. Check if Facebook Graph API Token is configured
    const fbToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID || 'inicbulanfundamental.baptistbiblechurch';

    if (fbToken) {
      try {
        const graphRes = await fetch(
          `https://graph.facebook.com/v19.0/${pageId}/live_videos?fields=id,status,title,description,creation_time,video{source,permalink_url}&access_token=${fbToken}`
        );
        if (graphRes.ok) {
          const data = await graphRes.json();
          if (data.data && data.data.length > 0) {
            const latest = data.data[0];
            const isLive = latest.status === 'LIVE';
            return {
              platform: 'facebook',
              status: isLive ? 'live' : 'completed',
              title: latest.title || latest.description || 'IFBBC Sunday Divine Worship',
              subtitle: isLive ? "Streaming live on Facebook" : 'Latest Facebook Service Broadcast',
              thumbnailUrl: fallback.thumbnailUrl,
              videoUrl: latest.video?.permalink_url || `https://www.facebook.com/${pageId}/live_videos`,
              channelName: 'Inicbulan Fundamental Baptist Bible Church',
              channelUrl: 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
              publishedAt: latest.creation_time,
            };
          }
        }
      } catch (err) {
        console.warn('[livestreamService] Facebook Graph API error, falling back:', err);
      }
    }

    // 2. Smart public page detection
    try {
      const pageRes = await fetch(
        'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );

      if (pageRes.ok) {
        const html = await pageRes.text();
        const isLiveNow =
          html.includes('live_video') &&
          (html.includes('"is_live":true') || html.includes('LIVE NOW') || html.includes('was live'));

        return {
          platform: 'facebook',
          status: isLiveNow ? 'live' : 'completed',
          title: isLiveNow
            ? 'IFBBC SUNDAY CELEBRATION (LIVE)'
            : 'SUNDAY DIVINE WORSHIP CELEBRATION',
          subtitle: isLiveNow
            ? "Broadcasting live on Facebook Watch"
            : 'Latest Facebook Video Broadcast',
          thumbnailUrl: fallback.thumbnailUrl,
          videoUrl: isLiveNow
            ? 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch/live_videos'
            : 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
          channelName: 'Inicbulan Fundamental Baptist Bible Church',
          channelUrl: 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
        };
      }
    } catch {
      // ignore
    }

    return fallback;
  } catch (error) {
    console.error('[livestreamService] Error fetching Facebook:', error);
    return fallback;
  }
}

export async function getLivestreamsData(): Promise<LivestreamsData> {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedData && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedData;
  }

  try {
    const [youtube, facebook] = await Promise.all([
      fetchYouTubeLivestream(),
      fetchFacebookLivestream(),
    ]);

    let activeStream: 'youtube' | 'facebook' | null = null;
    if (youtube.status === 'live') {
      activeStream = 'youtube';
    } else if (facebook.status === 'live') {
      activeStream = 'facebook';
    }

    cachedData = {
      youtube,
      facebook,
      activeStream,
      lastUpdated: now,
    };
    lastFetchTime = now;

    return cachedData;
  } catch (err) {
    console.error('[livestreamService] getLivestreamsData error:', err);
    return cachedData || defaultData;
  }
}
