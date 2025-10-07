import { useState, useEffect } from 'react';
import { Post, Platform, PostStatus, MediaType } from '@models/Post';

// Helper function to generate random posts
const generateRandomPosts = (brandId: string, count: number = 80): Post[] => {
  const platforms: Platform[] = ['youtube', 'instagram', 'tiktok', 'facebook'];
  const statuses: PostStatus[] = ['success', 'failed', 'scheduled'];
  const mediaTypes: MediaType[] = ['image', 'video'];
  
  const burgerTitles = [
    'Weekend Burger Special',
    'New Menu Launch',
    'Behind the Scenes',
    'Customer Testimonials',
    'Happy Hour Deals',
    'Fresh Ingredients Showcase',
    'Summer BBQ Special',
    'Chef Special Today',
    'Limited Time Offer',
    'Grilling Techniques 101',
    'Quick Burger Assembly',
    'Back to School Special',
    'Kitchen Tour Video',
    'Customer Favorites',
    'Evening Specials',
    'Late Night Menu',
    'Fresh Daily Ingredients',
    'Fall Menu Preview',
    'Seasonal Ingredients',
    'Quick Fall Recipes',
    'Comfort Food Special',
    'Harvest Season Menu',
  ];
  
  const steakhouseTitles = [
    'Prime Cut Selection',
    'Steak Preparation Masterclass',
    'Weekend Steak Special',
    'Quick Marinade Tips',
    'Monthly Prime Selection',
    'Fall Steak Menu',
    'Seasonal Wine Pairings',
    'Executive Chef Special',
    'Harvest Season Steaks',
    'Autumn Prime Cuts',
    'Holiday Menu Preview',
    'Steakhouse Secrets',
    'Premium Dining Experience',
    'Perfect Steak Preparation',
    'Wine Pairing Night',
    'Premium Cut Showcase',
    'Chef Masterclass',
    'Date Night Special',
    'Behind the Grill',
  ];
  
  const titles = brandId === 'burger' ? burgerTitles : steakhouseTitles;
  
  const posts: Post[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random date within -30 to +30 days from today
    const daysOffset = Math.floor(Math.random() * 61) - 30;
    const postDate = new Date(today);
    postDate.setDate(today.getDate() + daysOffset);
    
    // Random hour (0-23)
    const hour = Math.floor(Math.random() * 24);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    const minutes = Math.random() > 0.5 ? '00' : '30';
    const time = `${displayHour}:${minutes} ${period}`;
    
    // Random number of platforms (1-3)
    const numPlatforms = Math.floor(Math.random() * 3) + 1;
    const shuffledPlatforms = [...platforms].sort(() => Math.random() - 0.5);
    const selectedPlatforms = shuffledPlatforms.slice(0, numPlatforms);
    
    // Status based on date (past = success/failed, future = scheduled)
    let status: PostStatus;
    if (postDate < today) {
      status = Math.random() > 0.85 ? 'failed' : 'success';
    } else {
      status = 'scheduled';
    }
    
    // Random media type
    const media: MediaType = Math.random() > 0.4 ? 'image' : 'video';
    
    // Random title
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    posts.push({
      id: `${brandId}-${i}-${Date.now()}`,
      date: postDate,
      time,
      platforms: selectedPlatforms,
      status,
      media,
      title,
    });
  }
  
  // Sort by date
  return posts.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const usePosts = (brandId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Generate random posts on mount and when brand changes
    const randomPosts = generateRandomPosts(brandId);
    setPosts(randomPosts);
  }, [brandId]);

  return { posts };
};
