'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Settings,
  BookOpen,
  BookMarked,
  Clock,
  Loader2
} from 'lucide-react';
import { useGetUserProfileQuery } from '@/services/apiManga';
import { useAppSelector } from '@/lib/redux/hook';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatisticsTab from '@/components/profile/StatisticsTab';
import SettingsTab from '@/components/profile/SettingsTab';
import FavoritesTab from '@/components/profile/FavoritesTab';

const UserProfile = () => {
  const auth = useAppSelector((state) => state.auth);
  const userId = auth.clientId || 0;

  // Fetch user profile data
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser
  } = useGetUserProfileQuery(Number(userId));

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-manga-500 mx-auto h-8 w-8 animate-spin" />
          <p className="text-manga-400 mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in container mx-auto px-4 py-8 md:px-6">
      <h1 className="manga-heading mb-8 text-3xl md:text-4xl">My Profile</h1>

      {/* Profile Header */}
      <ProfileHeader user={user} refetchUser={refetchUser} />

      {/* Tabs */}
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="bg-card mb-8 grid h-auto w-full grid-cols-4 gap-4 p-1">
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:bg-manga-600/20 py-3"
          >
            <BookMarked className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">Favs</span>
          </TabsTrigger>
        </TabsList>

        {/* Favorites Tab */}
        {Number(auth.clientId) != 1 && (
          <TabsContent value="favorites" className="bg-card rounded-lg p-6">
            <FavoritesTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfile;
