import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { toast } from 'sonner';
import {
  useCreateCommentMutation,
  useGetListCommentsQuery,
  useGetUserAvatarQuery
} from '@/services/apiManga';
import { CommentContext } from './Comment';
import { useAppSelector } from '@/lib/redux/hook';

// Mock user data - in a real app this would come from auth context
const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  avatar: 'https://picsum.photos/200/200?random=1'
};

interface CommentSectionProps {
  mangaId?: string;
  chapterId?: string;
}

const CommentSection = ({ mangaId, chapterId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError
  } = useGetListCommentsQuery({
    chapter_id: Number(chapterId)
  });
  const auth = useAppSelector((state) => state.auth);
  const { data } = useGetUserAvatarQuery(Number(auth.clientId), {
    skip: !auth.clientId
  });
  return (
    <CommentContext.Provider value={{ activeReplyId, setActiveReplyId }}>
      <div className="from-card to-card/70 border-manga-600/30 animate-fade-in space-y-6 rounded-lg border bg-gradient-to-br p-4 shadow-lg backdrop-blur-sm md:p-6">
        <div className="border-manga-600/30 mb-6 flex items-center gap-x-4 border-b pb-4">
          <MessageCircle className="text-manga-400 h-5 w-5" />
          <h3 className="from-manga-300 to-manga-500 bg-gradient-to-r bg-clip-text text-xl font-medium text-transparent">
            Comments & Discussion
          </h3>
          <div className="text-muted-foreground ml-auto text-sm">comments</div>
        </div>

        {/* Add new comment */}
        <CommentForm
          chapterId={Number(chapterId)}
          avatarUrl={
            data?.usr_avatar
              ? `${process.env.NEXT_PUBLIC_API_URL_IPFS}${data.usr_avatar}`
              : currentUser.avatar
          }
          userName={currentUser.name}
          placeholder="Share your thoughts on this chapter..."
          buttonText="Post Comment"
          value={newComment}
          onChange={setNewComment}
        />

        {/* Comments list */}
        <div className="mt-8 space-y-6">
          {commentsData &&
            commentsData.map((comment) => (
              <Comment
                key={comment.comment_id}
                comment={comment}
                chapterId={String(chapterId)}
              />
            ))}

          {commentsData && commentsData.length === 0 && (
            <div className="text-muted-foreground py-10 text-center">
              <MessageCircle className="text-manga-500/50 mx-auto mb-2 h-10 w-10" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </CommentContext.Provider>
  );
};

export default CommentSection;
