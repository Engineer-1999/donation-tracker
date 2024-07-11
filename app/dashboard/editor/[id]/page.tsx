import { notFound } from 'next/navigation';
import { fetchProjectById } from '../../[id]/actions';
import Editor from './components/editor';

const EditorPage = async ({ params }: { params: { id: string } }) => {
  const { project, error } = await fetchProjectById(params.id);

  if (error || !project) {
    return notFound();
  }

  return <Editor project={project} />;
};

export default EditorPage;
