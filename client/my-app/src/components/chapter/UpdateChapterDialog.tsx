import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpdateChapterMutation } from '@/services/apiManga';
import { toast } from 'sonner';

interface UpdateChapterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: string;
}

const UpdateChapterDialog: React.FC<UpdateChapterDialogProps> = ({
  isOpen,
  onClose,
  chapterId,
  chapterTitle,
  chapterNumber
}) => {
  const [title, setTitle] = useState(chapterTitle);
  const [number, setNumber] = useState(chapterNumber);
  const [updateChapter, { isLoading }] = useUpdateChapterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('chap_title', title);
      formData.append('chap_number', number.toString());
      await updateChapter({ chap_id: Number(chapterId), formData }).unwrap();
      toast.success('Chapter updated successfully!');
      onClose();
    } catch (error) {
      console.log('Failed to update chapter:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>Update Chapter</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Chapter Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="number" className="block text-sm font-medium">
              Chapter Number
            </label>
            <input
              id="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(String(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="ml-2" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChapterDialog;
