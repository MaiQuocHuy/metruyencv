import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Send, Smile, Loader2 } from 'lucide-react';
import { useCreateCommentMutation } from '@/services/apiManga';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { useAppSelector } from '@/lib/redux/hook';
import { toast } from 'sonner';

// Define Zod schema for comment validation
const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Comment must be at least 2 characters' })
    .max(1000, { message: 'Comment cannot exceed 1000 characters' })
    .trim()
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  avatarUrl: string;
  userName: string;
  placeholder: string;
  buttonText: string;
  value: string;
  onChange: (value: string) => void;
  isReply?: boolean;
  onCancel?: () => void;
  chapterId: number;
  parentId?: number | null;
  parentName?: string | null;
}

const CommentForm = ({
  avatarUrl,
  userName,
  placeholder,
  buttonText,
  value,
  onChange,
  isReply = false,
  onCancel,
  chapterId,
  parentId = null,
  parentName = null
}: CommentFormProps) => {
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const auth = useAppSelector((state) => state.auth);

  // Initialize react-hook-form with zod resolver
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: value
    }
  });

  // Update form value when external value changes
  if (form.getValues().content !== value) {
    form.setValue('content', value);
  }

  // Handle form submission
  const handleSubmit = async (data: CommentFormValues) => {
    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      toast('Please log in to post comment');
      return;
    }
    try {
      // Prepare comment data
      const commentData = {
        comment_chapter_id: chapterId,
        comment_content: `${parentName ? `${parentName} ${data.content}` : data.content}`,
        comment_parent_id: parentId
      };

      // Call the API to create comment
      await createComment(commentData).unwrap();

      // Clear the input field
      onChange('');
      form.reset({ content: '' });

      // Show success toast
      toast(`${isReply ? 'Reply posted' : 'Comment posted'}`, {
        description: 'Your comment has been posted successfully'
      });

      // Close the reply form if it's a reply
      if (isReply && onCancel) {
        onCancel();
      }
    } catch (err) {
      console.log('Failed to post comment:', err);

      // Show error toast
      toast(`Failed to post comment`, {
        description:
          'There was an error posting your comment. Please try again.'
      });
    }
  };

  return (
    <div
      className={`flex gap-${isReply ? '3' : '4'} ${isReply ? 'animate-fade-in' : ''}`}
    >
      <Avatar
        className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} ring-${isReply ? '1' : '2'} ring-offset-${isReply ? '1' : '2'} ring-manga-500/${isReply ? '30' : '40'} ring-offset-background`}
      >
        <img src={avatarUrl} alt={userName} />
      </Avatar>
      <div className="flex-1 space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        placeholder={placeholder}
                        className={`${isReply ? 'min-h-[60px] text-sm' : 'min-h-[80px]'} bg-background/40 border-manga-600/30 focus-visible:ring-manga-500/50 w-full backdrop-blur-sm`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange(e.target.value);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />

            <div
              className={`flex ${isReply ? 'justify-end gap-2' : 'justify-end'}`}
            >
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="border-manga-600/30 hover:bg-manga-500/10"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className={`bg-manga-600 hover:bg-manga-700 ${isReply ? 'gap-1' : 'gap-2 transition-all duration-300 hover:gap-3'}`}
                disabled={!form.formState.isValid || isLoading}
                size={isReply ? 'sm' : 'default'}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className={`${isReply ? 'h-3 w-3' : 'h-4 w-4'} animate-spin`}
                    />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <Send className={`${isReply ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CommentForm;
