import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NewProjectForm from './newProjectForm';

const CreateNewProjectCard = () => {
  const handleCreateNewProject = () => {
    console.log('Create new project');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='rounded-lg flex flex-col items-center justify-center py-7 border border-primary-100 text-primary-500 hover:text-primary-600 overflow-hidden'
        >
          <PlusIcon className='h-6 w-6' />
          <h3 className='text-lg p-3 font-semibold'>إنشاء مشروع جديد</h3>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء مشروع جديد</DialogTitle>
        </DialogHeader>
        <NewProjectForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProjectCard;
