import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Project, ProjectSettings } from '@/lib/supabase/schema';
import {
  ChevronDown,
  ChevronUp,
  Circle,
  Minus,
  Plus,
  Spline,
  Square,
} from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type ControlsSliderProps = {
  project: Project;
  projectSettings: ProjectSettings;
  setProjectSettings: Dispatch<SetStateAction<ProjectSettings>>;
  updateProject: (projectId: string, data: any) => Promise<Project>;
  setIsControlsOpen: Dispatch<SetStateAction<boolean>>;
};

const ControlsSlider = ({
  project,
  projectSettings,
  setProjectSettings,
  updateProject,
  setIsControlsOpen,
}: ControlsSliderProps) => {
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    await updateProject(project.id, {
      settings: projectSettings,
    });
    setSaving(false);
    setIsControlsOpen(false);
  };

  const onCancel = () => {
    setProjectSettings(project.settings || {});
  };

  return (
    <SheetContent className='pt-16 flex flex-col justify-between'>
      <SheetHeader className='mb-16'>
        <SheetTitle>لوحة التحكم</SheetTitle>
        <SheetDescription>
          هنا يمكنك تغيير ما تريده في شكل الإعلان الظاهر على الموقع للعامة.
        </SheetDescription>
      </SheetHeader>
      <section className='flex flex-col'>
        <div className='flex items-center justify-between gap-4 p-4 border-y border-neutral-200'>
          <h5 className='text-primary-600 font-medium'>مكان شريط التقدم</h5>
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={() =>
                setProjectSettings({
                  ...projectSettings,
                  displacement: (projectSettings.displacement || 0) + 5,
                })
              }
            >
              <ChevronUp className='h-6 w-6' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                setProjectSettings({
                  ...projectSettings,
                  displacement: (projectSettings.displacement || 0) - 5,
                });
              }}
            >
              <ChevronDown className='h-6 w-6' />
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between gap-4 p-4 border-b border-neutral-200'>
          <h5 className='text-primary-600 font-medium'>شكل شريط التقدم</h5>
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={() =>
                setProjectSettings({
                  ...projectSettings,
                  shape: 'rounded',
                })
              }
            >
              <Spline className='h-6 w-6' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                setProjectSettings({
                  ...projectSettings,
                  shape: 'square',
                });
              }}
            >
              <Square className='h-6 w-6' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                setProjectSettings({
                  ...projectSettings,
                  shape: 'circle',
                });
              }}
            >
              <Circle className='h-6 w-6' />
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between gap-4 p-4 border-b border-neutral-200'>
          <h5 className='text-primary-600 font-medium'>حجم الشريط</h5>
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={() =>
                setProjectSettings({
                  ...projectSettings,
                  size: (projectSettings.size || 0) + 10,
                })
              }
            >
              <Plus className='h-5 w-5' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                setProjectSettings({
                  ...projectSettings,
                  padding: (projectSettings.size || 0) - 10,
                });
              }}
            >
              <Minus className='h-5 w-5' />
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between gap-4 p-4 border-b border-neutral-200'>
          <h5 className='text-primary-600 font-medium'>حجم اطار الشريط</h5>
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={() =>
                setProjectSettings({
                  ...projectSettings,
                  padding: (projectSettings.padding || 0) + 1,
                })
              }
            >
              <Plus className='h-5 w-5' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                setProjectSettings({
                  ...projectSettings,
                  padding: (projectSettings.padding || 0) - 1,
                });
              }}
            >
              <Minus className='h-5 w-5' />
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between gap-4 p-4 border-b border-neutral-200'>
          <h5 className='text-primary-600 font-medium'>عرض نسبة التقدم</h5>
          <Switch
            checked={projectSettings.showPercentage}
            onCheckedChange={(value) =>
              setProjectSettings({ ...projectSettings, showPercentage: value })
            }
          />
        </div>
      </section>
      <SheetFooter className='flex gap-4'>
        <Button
          variant='default'
          className='w-full'
          onClick={onSave}
          isLoading={saving}
        >
          حفظ
        </Button>
        <SheetClose>
          <Button variant='secondary' className='px-8' onClick={onCancel}>
            إلغاء
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default ControlsSlider;
