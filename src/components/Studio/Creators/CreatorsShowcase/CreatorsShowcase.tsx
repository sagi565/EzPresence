import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorSlide from './CreatorSlide';
import ScrollNavigation from '../ScrollNavigation/ScrollNavigation';
import NotesModal from '../NotesModal/NotesModal';
import { ShowcaseContainer } from './styles';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Creator {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  mediaType: string;
  previewClass: string;
  icon: string;
}

const CREATORS: Creator[] = [
  {
    id: 'vision',
    name: 'Vision',
    subtitle: 'Idea → Cinematic Video',
    description: "Give Vision an idea—a feeling, a story, a single sentence—and watch it unfold into a fully rendered cinematic video. Vision doesn't just generate; it interprets. It understands mood, pacing, and narrative arc. Powered by generative AI, Vision crafts original footage, soundscapes, and visual poetry from your words alone. Type your thought. Vision does the rest.",
    mediaType: 'Video',
    previewClass: 'vision',
    icon: '✨',
  },
  {
    id: 'frames',
    name: 'Frames',
    subtitle: 'Idea → Short Video',
    description: "Bring your idea to life as a cinematic short video. Frames isn't generative AI—it's a decision-making AI agent that curates, selects, and assembles resources from online stock libraries on your behalf. It analyzes your concept, allocates the right visuals, audio, and pacing, and transforms your idea into a polished short video that feels both intentional and alive.",
    mediaType: 'Video',
    previewClass: 'frames',
    icon: '🎥',
  },
  {
    id: 'show-time',
    name: 'Show Time',
    subtitle: 'Idea → Short Video',
    description: "Bring your idea to life as a cinematic short video. Show Time isn't generative AI—it's a decision-making AI agent that curates, selects, and assembles resources from online stock libraries on your behalf. It analyzes your concept, allocates the right visuals, audio, and pacing, and transforms your idea into a polished short video that feels both intentional and alive.",
    mediaType: 'Video',
    previewClass: 'show-time',
    icon: '⏰',
  },
  {
    id: 'notes',
    name: 'Notes',
    subtitle: 'Write Your Thoughts',
    description: "Turn your words into cinematic moments. Choose from a curated gallery of elegant note themes, type your thoughts, and watch them come alive as if handwritten or typed in real-time. Notes frames your ideas with dynamic camera motion and atmospheric styling—turning a simple entry into a visually captivating scene.",
    mediaType: 'Video',
    previewClass: 'notes',
    icon: '📝',
  },
  {
    id: 'picasso',
    name: 'Picasso',
    subtitle: 'Your Own Artist',
    description: "Collaborate with your personal AI artist. With Picasso, you can edit images directly or simply chat through a mini prompt interface. Describe your vision and watch as Picasso updates your image in real time—whether it's swapping backgrounds from online sources, adjusting effects for the perfect look, or suggesting creative enhancements. Picasso transforms editing into a conversation, making every image feel crafted just for you.",
    mediaType: 'Image',
    previewClass: 'picasso',
    icon: '🎨',
  },
];

const CreatorsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLElement[]>([]);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(0);

  // Keep ref in sync to avoid constant listener re-attachment
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Update current index based on scroll position
  const updateCurrentIndex = useCallback(() => {
    if (!containerRef.current || isScrolling) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollCenter = scrollTop + containerHeight / 2;

    // Find which slide is closest to the center
    let closestIndex = 0;
    let closestDistance = Infinity;

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      const slideTop = slide.offsetTop;
      const slideHeight = slide.offsetHeight;
      const slideCenter = slideTop + slideHeight / 2;
      const distance = Math.abs(scrollCenter - slideCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndexRef.current) {
      setCurrentIndex(closestIndex);
    }
  }, [isScrolling]);



  // Handle scroll event
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        updateCurrentIndex();
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateCurrentIndex, isScrolling]);

  // IntersectionObserver for better tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slidesRef.current.findIndex(
            (slide) => slide === entry.target
          );
          if (index !== -1 && index !== currentIndex) {
            setCurrentIndex(index);
          }
        }
      });
    }, observerOptions);

    slidesRef.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => {
      observer.disconnect();
    };
  }, [isScrolling, currentIndex]);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showNotesModal) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextIndex = Math.min(CREATORS.length - 1, currentIndex + 1);
        scrollToCreator(nextIndex);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        scrollToCreator(prevIndex);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToCreator(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToCreator(CREATORS.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showNotesModal]);

  const scrollToCreator = (index: number) => {
    if (isScrolling) return;
    setIsScrolling(true);

    const targetSlide = slidesRef.current[index];
    const container = containerRef.current;

    if (targetSlide && container) {
      // Calculate scroll position to center the slide
      const containerHeight = container.clientHeight;
      const slideTop = targetSlide.offsetTop;
      const slideHeight = targetSlide.offsetHeight;
      const scrollPosition = slideTop - (containerHeight - slideHeight) / 2;

      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });

      setCurrentIndex(index);

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  const handleTryCreator = (creatorId: string) => {
    if (creatorId === 'notes') {
      setShowNotesModal(true);
    } else if (creatorId === 'vision') {
      navigate('/studio/vision');
    } else {
      alert(
        `Opening ${creatorId.charAt(0).toUpperCase() + creatorId.slice(1)} wizard...`
      );
    }
  };

  const handleLearnMore = (creatorId: string) => {
    alert(
      `Loading more information about ${creatorId.charAt(0).toUpperCase() + creatorId.slice(1)
      }...`
    );
  };

  return (
    <>
      <ShowcaseContainer ref={containerRef} className="creators-scroll-container">
        {CREATORS.map((creator, index) => (
          <CreatorSlide
            key={creator.id}
            ref={(el) => {
              if (el) slidesRef.current[index] = el;
            }}
            creator={creator}
            isActive={index === currentIndex}
            isMobile={isMobile}
            onTry={handleTryCreator}
            onLearnMore={handleLearnMore}
          />
        ))}
      </ShowcaseContainer>

      <ScrollNavigation
        creators={CREATORS}
        currentIndex={currentIndex}
        onNavigate={scrollToCreator}
      />

      {showNotesModal && <NotesModal onClose={() => setShowNotesModal(false)} />}
    </>
  );
};

export default CreatorsShowcase;