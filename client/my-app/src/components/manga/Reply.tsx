import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { MoreVertical, Reply as ReplyIcon, ThumbsUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { useAppSelector } from '@/lib/redux/hook';
import CommentForm from './CommentForm';
import { CommentContext } from './Comment';

interface ReplyProps {
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
}

const Reply = ({ comment }: { comment: ReplyProps }) => {
  const auth = useAppSelector((state) => state.auth);
  const [replyContent, setReplyContent] = useState('');
  const { activeReplyId, setActiveReplyId } = useContext(CommentContext);

  // Check if this reply is the one being replied to
  const isReplying = activeReplyId === comment.comment_id;

  const handleReplyClick = () => {
    setActiveReplyId(isReplying ? null : comment.comment_id);
  };

  return (
    <div className="bg-muted/10 hover:bg-muted/20 border-manga-600/30 rounded-lg border-l-2 p-3 transition-colors">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar className="ring-manga-500/30 ring-offset-background h-8 w-8 ring-1 ring-offset-1">
            <img
              data-slot="avatar-image"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.comment_user_id}`}
              alt={comment.user?.usr_name || 'User'}
            />
          </Avatar>
          <div>
            <h5 className="text-manga-50 text-sm font-medium">
              {comment.user.usr_name}
            </h5>
            <p className="text-muted-foreground text-xs">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>
        {String(comment.comment_user_id) === auth.user?.id && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-manga-500/10 h-6 w-6 p-0"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card/90 border-manga-600/30 backdrop-blur-lg"
            >
              <DropdownMenuItem className="hover:bg-destructive/10 text-destructive cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="mt-1 text-sm">{comment.comment_content}</p>
      <div className="mt-3 flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-manga-500/10 h-8 gap-1 text-xs"
          onClick={handleReplyClick}
        >
          <ReplyIcon className="h-4 w-4" /> Reply
        </Button>
      </div>

      {/* Reply form */}
      {isReplying && auth.clientId && (
        <div className="animate-fade-in mt-3 ml-4">
          <CommentForm
            avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user?.id}`}
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
    </div>
  );
};

export default Reply;
