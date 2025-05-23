import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ErrorReport, useCreateReportMutation } from '@/services/apiError'; // Import ErrorReport type and mutation hook type

// Define the possible error types
const ERROR_TYPES = {
  ERROR_IMAGES: 'error-image',
  DUPLICATE_CHAPTER: 'duplicate-chapter',
  NOT_TRANSLATED: 'chapter-not-translated-yet'
} as const;

type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

// Define the expected result type from the mutation hook more accurately
type CreateReportMutationTrigger = ReturnType<
  typeof useCreateReportMutation
>[0];

interface ReportChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: number | undefined;
  mangaId: number | undefined; // Keep mangaId if needed for context, though not sent in report
  reportChapter: CreateReportMutationTrigger; // Use the correct type for the mutation trigger
}

export function ReportChapterDialog({
  open,
  onOpenChange,
  chapterId,
  // mangaId, // mangaId might not be needed for the report itself
  reportChapter // Destructure the correctly typed prop
}: ReportChapterDialogProps) {
  const [selectedError, setSelectedError] = useState<ErrorType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedError || !chapterId) {
      toast('Error', {
        description: 'Please select an error type.'
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting report:', { chapterId, selectedError });

    // Prepare the report data according to ErrorReport structure
    // Assuming report_user_id is handled by the backend/auth state
    const reportData: Partial<ErrorReport> = {
      report_chapter_id: chapterId,
      report_kind_of_error: selectedError,
      report_description: `Reported issue: ${selectedError}` // Add a default description or a text area later
      // is_fixed will likely default to false on the backend
    };

    try {
      // Call the mutation trigger with the report data
      const result = await reportChapter(reportData).unwrap(); // Use unwrap() to handle promise resolution/rejection

      console.log('Report submission successful:', result);
      toast('Report Submitted', {
        description: `Thank you for reporting the issue with chapter ${chapterId}.`
      });
      setSelectedError(null); // Reset selection
      onOpenChange(false); // Close dialog
    } catch (error) {
      console.log('Failed to submit report:', error);
      // Provide more specific error feedback if possible
      let errorMessage = 'Could not submit the report. Please try again.';
      if (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data?.message === 'string'
      ) {
        errorMessage = (error as any).data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast('Submission Failed', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedError(null);
      setIsSubmitting(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Chapter</DialogTitle>
          <DialogDescription>
            Select the type of issue you encountered with this chapter. Your
            feedback helps improve the quality.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedError ?? ''}
            onValueChange={(value) => setSelectedError(value as ErrorType)}
            className="grid gap-2"
            disabled={isSubmitting}
          >
            {/* ... RadioGroupItems ... */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={ERROR_TYPES.ERROR_IMAGES}
                id={ERROR_TYPES.ERROR_IMAGES}
              />
              <Label htmlFor={ERROR_TYPES.ERROR_IMAGES}>Image Errors</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={ERROR_TYPES.DUPLICATE_CHAPTER}
                id={ERROR_TYPES.DUPLICATE_CHAPTER}
              />
              <Label htmlFor={ERROR_TYPES.DUPLICATE_CHAPTER}>
                Duplicate Chapter
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={ERROR_TYPES.NOT_TRANSLATED}
                id={ERROR_TYPES.NOT_TRANSLATED}
              />
              <Label htmlFor={ERROR_TYPES.NOT_TRANSLATED}>
                Not Translated / Poor Translation
              </Label>
            </div>
          </RadioGroup>
          {/* TODO: Consider adding a Textarea for optional description */}
          {/* <Textarea placeholder="Optional: Add more details..." /> */}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedError || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
