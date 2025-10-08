import React, { useState, useRef, useEffect, useCallback } from 'react';
import CreatorSlide from './CreatorSlide';
import ScrollNavigation from '../ScrollNavigation/ScrollNavigation';
import NotesModal from '../NotesModal/NotesModal';
import { styles } from './styles';

interface Creator {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  mediaType: string;
  credits: number;
  previewClass: string;
  icon: string;
}

const CREATORS: Creator[] = [
  {
    id: 'show-time',
    name: 'Show Time',
    subtitle: 'Idea → Short Video',
    description: "Bring your idea to life as a cinematic short video. Matrix isn't generative AI—it's a decision-making AI agent that curates, selects, and assembles resources from online stock libraries on your behalf. It analyzes your concept, allocates the right visuals, audio, and pacing, and transforms your idea into a polished short video that feels both intentional and alive.",
    mediaType: 'Video',
    credits: 380,
    previewClass: 'show-time',
    icon: '⏰',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    subtitle: 'Idea → Short Video',
    description: "Bring your idea to life as a cinematic short video. Matrix isn't generative AI—it's a decision-making AI agent that curates, selects, and assembles resources from online stock libraries on your behalf. It analyzes your concept, allocates the right visuals, audio, and pacing, and transforms your idea into a polished short video that feels both intentional and alive.",
    mediaType: 'Video',
    credits: 180,
    previewClass: 'matrix',
    icon: '🎥',
  },
  {
    id: 'notes',
    name: 'Notes',
    subtitle: 'Write Your Thoughts',
    description: "Turn your words into cinematic moments. Choose from a curated gallery of elegant note themes, type your thoughts, and watch them come alive as if handwritten or typed in real-time. Notes frames your ideas with dynamic camera motion and atmospheric styling—turning a simple entry into a visually captivating scene.",
    mediaType: 'Video',
    credits: 200,
    previewClass: 'notes',
    icon: '📝',
  },
  {
    id: 'picasso',
    name: 'Picasso',
    subtitle: 'Your Own Artist',
    description: "Collaborate with your personal AI artist. With Picasso, you can edit images directly or simply chat through a mini prompt interface. Describe your vision and watch as Picasso updates your image in real time—whether it's swapping backgrounds from online sources, adjusting effects for the perfect look, or suggesting creative enhancements. Picasso transforms editing into a conversation, making every image feel crafted just for you.",
    mediaType: 'Image',
    credits: 100,
    previewClass: 'picasso',
    icon: '🎨',
  },
];

const CreatorsShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLElement[]>([]);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);
  const scrollVelocity = useRef(0);
  const velocityCheckInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  }, [currentIndex, isScrolling]);

  // Track scroll velocity for hard scrolling detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    velocityCheckInterval.current = setInterval(() => {
      const currentScrollTop = container.scrollTop;
      const delta = currentScrollTop - lastScrollTop.current;
      scrollVelocity.current = Math.abs(delta);
      lastScrollTop.current = currentScrollTop;
    }, 50);

    return () => {
      if (velocityCheckInterval.current) {
        clearInterval(velocityCheckInterval.current);
      }
    };
  }, []);

  // Handle scroll event
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Update index immediately
      updateCurrentIndex();

      // Check for hard scrolling (velocity > 100 pixels per 50ms)
      const isHardScroll = scrollVelocity.current > 100;

      // Set timeout to snap to closest section after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isScrolling) {
          const scrollTop = container.scrollTop;
          const scrollHeight = container.scrollHeight;
          const containerHeight = container.clientHeight;
          const scrollCenter = scrollTop + containerHeight / 2;

          // If hard scrolling and near top, snap to top
          if (isHardScroll && scrollTop < containerHeight * 0.3) {
            scrollToCreator(0);
            return;
          }

          // If hard scrolling and near bottom, snap to bottom
          if (isHardScroll && scrollTop > scrollHeight - containerHeight * 1.3) {
            scrollToCreator(CREATORS.length - 1);
            return;
          }

          // Otherwise, snap to closest section
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

          // Snap to the closest section
          scrollToCreator(closestIndex);
        }
      }, 150);
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

// Wheel event handler with direct deltaY strength detection
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  let accumulated = 0;
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;
  let direction = 1;

  const handleWheel = (e: WheelEvent) => {
    if (isScrolling || showNotesModal) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    direction = e.deltaY > 0 ? 1 : -1;
    accumulated += e.deltaY;

    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const total = Math.abs(accumulated);
      console.log("Total scroll in burst:", total);

      let step = 0;
      if (total > 3500) step = 4;
      else if (total > 2000) step = 3;
      else if (total > 900) step = 2;
      else if (total > 200) step = 1;

      console.log("→ Jump step:", step);

      if (step > 0) {
        const nextIndex = Math.max(
          0,
          Math.min(CREATORS.length - 1, currentIndex + step * direction)
        );
        scrollToCreator(nextIndex);
      }

      accumulated = 0;
      scrollTimer = null;
    }, 30);
  };

  container.addEventListener("wheel", handleWheel, { passive: false });
  return () => {
    container.removeEventListener("wheel", handleWheel);
    if (scrollTimer) clearTimeout(scrollTimer);
  };
}, [currentIndex, isScrolling, showNotesModal]);


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
    } else {
      alert(
        `Opening ${creatorId.charAt(0).toUpperCase() + creatorId.slice(1)} wizard...`
      );
    }
  };

  const handleLearnMore = (creatorId: string) => {
    alert(
      `Loading more information about ${
        creatorId.charAt(0).toUpperCase() + creatorId.slice(1)
      }...`
    );
  };

  return (
    <>
      <div ref={containerRef} style={styles.container} className="creators-scroll-container">
        {CREATORS.map((creator, index) => (
          <CreatorSlide
            key={creator.id}
            ref={(el) => {
              if (el) slidesRef.current[index] = el;
            }}
            creator={creator}
            isActive={index === currentIndex}
            onTry={handleTryCreator}
            onLearnMore={handleLearnMore}
          />
        ))}
      </div>

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