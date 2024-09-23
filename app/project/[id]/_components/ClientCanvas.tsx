'use client';

import Canvas from '@/app/dashboard/editor/[id]/components/canvas';
import { Project } from '@/lib/supabase/schema';

interface ClientCanvasProps {
  project: Project;
}

const ClientCanvas: React.FC<ClientCanvasProps> = ({ project }) => {
  return (
    <>
      <Canvas />
    </>
  );
};

export default ClientCanvas;
