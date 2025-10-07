import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(CREATORS.length - 1, currentIndex + scrollDirection));

      if (nextIndex !== currentIndex) {
        scrollToCreator(nextIndex);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex, isScrolling]);

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
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(index);

      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  };

  const handleTryCreator = (creatorId: string) => {
    if (creatorId === 'notes') {
      setShowNotesModal(true);
    } else {
      alert(`Opening ${creatorId.charAt(0).toUpperCase() + creatorId.slice(1)} wizard...`);
    }
  };

  const handleLearnMore = (creatorId: string) => {
    alert(`Loading more information about ${creatorId.charAt(0).toUpperCase() + creatorId.slice(1)}...`);
  };

  return (
    <>
      <div ref={containerRef} style={styles.container}>
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

      {showNotesModal && (
        <NotesModal onClose={() => setShowNotesModal(false)} />
      )}
    </>
  );
};

export default CreatorsShowcase;