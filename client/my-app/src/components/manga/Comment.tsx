import { useState, useContext, createContext } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Flag,
  MoreVertical,
  Reply as ReplyIcon,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Reply from './Reply';
import CommentForm from './CommentForm';
import { useAppSelector } from '@/lib/redux/hook';
import { formatDate } from '@/lib/utils';
import {
  useDeleteCommentMutation,
  useGetListCommentsQuery,
  useGetUserAvatarQuery
} from '@/services/apiManga';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

// Create a context to track which comment is being replied to
interface CommentContextType {
  activeReplyId: number | null;
  setActiveReplyId: (id: number | null) => void;
}

export const CommentContext = createContext<CommentContextType>({
  activeReplyId: null,
  setActiveReplyId: () => {}
});

export interface CommentType {
  comment: {
    comment_id: number;
    comment_user_id: number;
    comment_content: string;
    comment_chapter_id: number;
    comment_manga_id: number;
    comment_parent_id: number | null;
    createdAt: string;
    updatedAt: string;
    user: {
      usr_id: number;
      usr_name: string;
    };
  };
}

interface CommentProps extends CommentType {
  chapterId: string;
}

const CommentItem = ({ comment, chapterId }: CommentProps) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetUserAvatarQuery(comment.comment_user_id);
  console.log('User avatar:', data);
  // Use the comment context to track active reply
  const { activeReplyId, setActiveReplyId } = useContext(CommentContext);

  // Check if this comment is the one being replied to
  const isReplying = activeReplyId === comment.comment_id;
  const [deleteComment] = useDeleteCommentMutation(); // 👈 hook gọi ở đây

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
    refetch: refetchComments
  } = useGetListCommentsQuery({
    chapter_id: Number(chapterId),
    parent_id: comment.comment_id
  });

  const replyCount = commentsData?.length || 0;
  const hasReplies = replyCount > 1;

  const toggleReplies = () => {
    if (!showReplies && hasReplies) {
      refetchComments();
    }
    setShowReplies(!showReplies);
  };

  // Toggle reply form and close any other open reply forms
  const toggleReplyForm = () => {
    if (isReplying) {
      setActiveReplyId(null);
    } else {
      setActiveReplyId(comment.comment_id);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!auth.isAuthenticated) {
      toast('Please log in to delete comment');
      return;
    }
    try {
      await deleteComment(Number(commentId)).unwrap();
      toast('Comment deleted successfully');
      refetchComments();
    } catch (err) {
      console.log('Failed to delete comment:', err);
      toast('Failed to delete comment', {
        description:
          'There was an error deleting your comment. Please try again.'
      });
    }
  };

  return (
    <div className="space-y-4 transition-all duration-300 hover:translate-x-1">
      {/* Main comment */}
      <div className="bg-muted/20 hover:bg-muted/30 border-manga-600/20 rounded-lg border p-4 transition-colors">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Avatar className="ring-manga-500/30 ring-offset-background h-8 w-8 ring-1 ring-offset-1">
              <img
                src={`${data?.usr_avatar ? `${process.env.NEXT_PUBLIC_API_URL_IPFS}${data?.usr_avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.comment_user_id}`}`}
                alt={comment.user?.usr_name || 'User'}
              />
            </Avatar>
            <div>
              <h4 className="text-manga-50 font-medium">
                {comment.user?.usr_name || `User ${comment.comment_user_id}`}
              </h4>
              <p className="text-muted-foreground text-xs">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-manga-500/10 h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card/90 border-manga-600/30 backdrop-blur-lg"
            >
              {Number(auth.clientId) === comment.comment_user_id && (
                <DropdownMenuItem
                  className="hover:bg-destructive/10 text-destructive cursor-pointer"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <p className="mt-2 text-sm">{comment.comment_content}</p>

        <div className="mt-3 flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-manga-500/10 h-8 gap-1 text-xs"
            onClick={toggleReplyForm}
          >
            <ReplyIcon className="h-4 w-4" /> Reply
          </Button>

          {!comment.comment_parent_id && hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-manga-500/10 ml-auto h-8 gap-1 text-xs"
              onClick={toggleReplies}
            >
              {showReplies ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Hide Replies
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <Badge
                    variant="secondary"
                    className="bg-manga-500/20 hover:bg-manga-500/30 ml-1"
                  >
                    {replyCount - 1}
                  </Badge>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {isReplying && auth.clientId && (
        <div className="ml-8">
          <CommentForm
            avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.comment_user_id}`}
            userName={auth.user?.name || 'User'}
            placeholder={`Reply to @${comment.user.usr_name}`}
            buttonText="Reply"
            value={replyContent}
            onChange={setReplyContent}
            isReply={true}
            onCancel={() => setActiveReplyId(null)}
            chapterId={comment.comment_chapter_id}
            parentId={comment.comment_id}
            parentName={`@${comment.user.usr_name}`}
          />
        </div>
      )}

      {/* Replies */}
      {!comment.comment_parent_id && (
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-manga-600/20 ml-8 space-y-3 border-l-2 pt-2 pl-4">
                {commentsLoading ? (
                  // Skeleton loading for replies
                  Array(Math.min(3, replyCount || 2))
                    .fill(0)
                    .map((_, index) => (
                      <div key={`skeleton-${index}`} className="animate-pulse">
                        <div className="mb-2 flex gap-2">
                          <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded bg-gray-800/50" />
                            <Skeleton className="h-3 w-16 rounded bg-gray-800/30" />
                          </div>
                        </div>
                        <Skeleton className="h-12 w-full rounded bg-gray-800/30" />
                      </div>
                    ))
                ) : commentsData && commentsData.length > 0 ? (
                  commentsData.map((item) =>
                    item.comment_parent_id != null ? (
                      <Reply key={item.comment_id} comment={item} />
                    ) : null
                  )
                ) : (
                  <div className="text-muted-foreground py-4 text-center">
                    <MessageCircle className="mx-auto mb-2 h-5 w-5 opacity-50" />
                    <p className="text-sm">No replies yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default CommentItem;
