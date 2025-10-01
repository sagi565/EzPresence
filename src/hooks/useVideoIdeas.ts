import { useState, useCallback } from 'react';
import { VideoIdea, generateRandomIdeas } from '@models/VideoIdea';

export const useVideoIdeas = () => {
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateIdeas = useCallback(async (userPrompt: string): Promise<VideoIdea[]> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate random ideas
    const newIdeas = generateRandomIdeas(4);
    setIdeas(newIdeas);
    setIsLoading(false);
    
    return newIdeas;
  }, []);

  const updateIdea = useCallback((ideaId: string, updates: Partial<VideoIdea>) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, ...updates } : idea
    ));
  }, []);

  return {
    ideas,
    isLoading,
    generateIdeas,
    updateIdea,
  };
};