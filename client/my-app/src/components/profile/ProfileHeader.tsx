'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Edit, User } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hook';
import { format } from 'date-fns';
import Image from 'next/image';
import ProfileEditForm from './ProfileEditForm';

interface ProfileHeaderProps {
  user: any; // Replace with proper type
  refetchUser: () => void;
}

const ProfileHeader = ({ user, refetchUser }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  // Format join date
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Member since recently';
    try {
      return `Member since ${format(new Date(dateString), 'MMMM yyyy')}`;
    } catch (error) {
      return 'Member since recently';
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    refetchUser();
  };

  return (
    <div className="bg-card mb-8 rounded-lg p-6">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Only show avatar when not editing */}
        {!isEditing && (
          <div className="relative">
            <Avatar className="ring-manga-500/40 ring-offset-background h-24 w-24 ring-2 ring-offset-2">
              {user?.usr_avatar ? (
                <Image
                  src={
                    user.usr_avatar.startsWith('http')
                      ? user.usr_avatar
                      : `${process.env.NEXT_PUBLIC_API_URL_IPFS}${user.usr_avatar}`
                  }
                  alt="User Avatar"
                  width={96}
                  height={96}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User size={48} />
              )}
            </Avatar>
          </div>
        )}

        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <ProfileEditForm
              user={user}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <h2 className="mb-2 text-2xl font-bold">
                {user?.usr_name || 'User'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {user?.usr_sex || 'No Sex provided'}
              </p>
              <p className="text-muted-foreground text-sm">
                {formatJoinDate(user?.createdAt)}
              </p>
            </>
          )}
        </div>

        {!isEditing && (
          <div>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-manga-600 hover:bg-manga-700"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
