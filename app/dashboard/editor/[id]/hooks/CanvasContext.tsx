import { extractColors } from '@/lib/canvas/colors';
import { fabric } from 'fabric';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type CanvasContextType = {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  isReady: boolean;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundImageUrl: string;
  setBackgroundImageUrl: React.Dispatch<React.SetStateAction<string>>;
  dominantColors: string[];
  setDominantColors: React.Dispatch<React.SetStateAction<string[]>>;
  projectColor: string;
  setProjectColor: React.Dispatch<React.SetStateAction<string>>;
};

const CanvasContext = createContext<CanvasContextType>({
  fabricRef: { current: null },
  isReady: false,
  setIsReady: () => {},
  backgroundImageUrl: '',
  setBackgroundImageUrl: () => {},
  dominantColors: [],
  setDominantColors: () => {},
  projectColor: '#000',
  setProjectColor: () => {},
});

const CanvasContextProvider = ({ children }: { children: React.ReactNode }) => {
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [projectColor, setProjectColor] = useState<string>('#000');

  return (
    <CanvasContext.Provider
      value={{
        fabricRef,
        isReady,
        setIsReady,
        backgroundImageUrl,
        setBackgroundImageUrl,
        dominantColors,
        setDominantColors,
        projectColor,
        setProjectColor,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  const {
    fabricRef,
    isReady,
    setIsReady,
    backgroundImageUrl,
    setBackgroundImageUrl,
    dominantColors,
    setDominantColors,
    projectColor,
    setProjectColor,
  } = context;

  useEffect(() => {
    const img = document.createElement('img');
    img.src = backgroundImageUrl;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const colors = extractColors(img);
      if (colors) setDominantColors(colors);
    };
  }, [backgroundImageUrl, setDominantColors]);

  if (!context) {
    throw new Error(
      'useCanvasContext must be used within a CanvasContextProvider',
    );
  }
  return context;
};

export default CanvasContextProvider;
