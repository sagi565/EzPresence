import { useState, useEffect, useCallback } from 'react';
import type { Platform } from './useDashboardStats';

export interface DashboardComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  publishedAt: string;
  likes: number;
}

export interface DashboardPost {
  id: string;
  platform: Exclude<Platform, 'all'>;
  type: 'post' | 'story' | 'reel' | 'video';
  thumbnail: string;
  caption: string;
  publishedAt: string;
  createdByEzPresence: boolean;
  stats: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  comments: DashboardComment[];
}

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  tiktok: '#010101',
  youtube: '#FF0000',
};

const sampleCaptions = [
  "Excited to share our latest update! 🚀 Check out what we've been working on.",
  "Behind the scenes of our creative process 🎬 Art takes time, passion, and dedication.",
  "New week, new goals 💪 Let's make this one count!",
  "Sharing some thoughts on growth and creativity ✨",
  "Our team just hit a major milestone 🎉 Couldn't be more proud!",
  "Morning routine that changed everything ☀️ Consistency is key.",
  "The secret to great content? Authenticity. Always. 🌟",
  "Weekend vibes and good energy 🌈 Life is beautiful.",
  "Quick tutorial on how we edit our posts 📱 Swipe for more!",
  "Thankful for this amazing community 💜 You make it all worth it.",
  "Live session coming up tomorrow — set your reminders! ⏰",
  "Top 5 tips for growing your social presence 📈 Save this post!",
];

const sampleUsernames = [
  'creativemind', 'techgirl92', 'johndo3', 'sarah_smiles',
  'pixel_ninja', 'the_real_mv', 'brandlover', 'xoxo_studio',
  'visionary99', 'growthking', 'designhero', 'socialxpert',
];

const sampleComments = [
  "This is amazing! 😍", "Love this content!", "Keep it up! 🔥", "So helpful, thanks!",
  "This is exactly what I needed 💜", "Can't wait for more!", "You always deliver 💯",
  "Saved this for later 🙌", "Great work team!", "Sharing this with my friends!",
  "This changed my perspective 🤯", "More of this please!",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateThumbnailGradient(platform: string, index: number): string {
  const palettes: Record<string, string[][]> = {
    instagram: [
      ['#1a1a2e', '#16213e', '#0f3460'],
      ['#2d1b69', '#11998e', '#38ef7d'],
      ['#4a1942', '#c01f79', '#f7971e'],
      ['#0f0c29', '#302b63', '#24243e'],
      ['#232526', '#414345', '#232526'],
    ],
    facebook: [
      ['#0f2027', '#203a43', '#2c5364'],
      ['#1c3c6e', '#1565c0', '#42a5f5'],
      ['#0d1b2a', '#1b3a4b', '#065a82'],
    ],
    tiktok: [
      ['#0a0a0a', '#1a1a1a', '#25f4ee'],
      ['#10002b', '#240046', '#5a189a'],
      ['#03071e', '#370617', '#6a040f'],
    ],
    youtube: [
      ['#1a0000', '#3d0000', '#ff0000'],
      ['#0d0d0d', '#1a1a1a', '#cc0000'],
      ['#1c0a00', '#3b1f0a', '#ff6b35'],
    ],
  };
  const palette = palettes[platform] || palettes['instagram'];
  const colors = palette[index % palette.length];
  const angle = 130 + (index % 3) * 15;
  return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 55%, ${colors[2]} 100%)`;
}

const PLATFORMS: Array<Exclude<Platform, 'all'>> = ['instagram', 'facebook', 'tiktok', 'youtube'];
const POST_TYPES: DashboardPost['type'][] = ['post', 'story', 'reel', 'video'];

function generatePost(index: number, forcePlatform?: Exclude<Platform, 'all'>): DashboardPost {
  const seed = index * 137.5;
  const platform = forcePlatform || PLATFORMS[Math.floor(seededRandom(seed) * 4)];
  const type = POST_TYPES[Math.floor(seededRandom(seed + 1) * 4)];
  const daysAgo = Math.floor(seededRandom(seed + 2) * 30);
  const publishedAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
  const views = Math.round(800 + seededRandom(seed + 3) * 12000);
  const likes = Math.round(views * (0.04 + seededRandom(seed + 4) * 0.12));
  const shares = Math.round(views * (0.01 + seededRandom(seed + 5) * 0.04));
  const commentCount = Math.round(likes * (0.1 + seededRandom(seed + 6) * 0.3));
  const numComments = Math.min(commentCount, 8);
  const comments: DashboardComment[] = Array.from({ length: numComments }, (_, ci) => {
    const cseed = seed + ci * 31;
    const minutesAgo = Math.floor(seededRandom(cseed + 10) * 60 * 24 * daysAgo + 1);
    return {
      id: `comment-${index}-${ci}`,
      username: sampleUsernames[Math.floor(seededRandom(cseed) * sampleUsernames.length)],
      avatar: '',
      text: sampleComments[Math.floor(seededRandom(cseed + 1) * sampleComments.length)],
      publishedAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
      likes: Math.floor(seededRandom(cseed + 2) * 50),
    };
  });
  return {
    id: `post-${index}`,
    platform,
    type,
    thumbnail: generateThumbnailGradient(platform, index),
    caption: sampleCaptions[index % sampleCaptions.length],
    publishedAt,
    createdByEzPresence: seededRandom(seed + 7) > 0.45, // ~55% created by EzPresence
    stats: { views, likes, shares, comments: commentCount },
    comments,
  };
}

const ALL_MOCK_POSTS: DashboardPost[] = Array.from({ length: 40 }, (_, i) => generatePost(i));

export const useDashboardPosts = (platforms: string[], limit = 8) => {
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const filtered = !platforms.length || platforms.includes('all')
        ? ALL_MOCK_POSTS
        : ALL_MOCK_POSTS.filter(p => platforms.includes(p.platform));
      setTotal(filtered.length);
      setPosts(filtered.slice(0, limit));
      setLoading(false);
    }, 200);
  }, [platforms.join(','), limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, total, refetch: fetchPosts };
};

export { platformColors };
