import { fabric } from 'fabric';
import { createContext, useContext, useRef } from 'react';

type CanvasContextType = {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
};

const CanvasContext = createContext<CanvasContextType>({
  fabricRef: { current: null },
});

const CanvasContextProvider = ({ children }: { children: React.ReactNode }) => {
  const fabricRef = useRef<fabric.Canvas | null>(null);

  return (
    <CanvasContext.Provider
      value={{
        fabricRef,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasContextProvider');
  }
  return context;
};

export default CanvasContextProvider;
