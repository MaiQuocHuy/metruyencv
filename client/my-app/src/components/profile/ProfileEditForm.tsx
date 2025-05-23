'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Save, Loader2, User, Upload } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hook';
import { useUpdateUserProfileMutation } from '@/services/apiManga';
import { toast } from 'sonner';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

// Define validation schema for profile update
const profileSchema = z.object({
  usr_name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(50),
  usr_sex: z.string().min(1, { message: 'Gender must be selected' }),
  // Make usr_avatar optional and accept any type since we'll handle it separately
  usr_avatar: z.any().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  user: any; // Replace with proper type
  onSuccess: () => void;
  onCancel: () => void;
}

const ProfileEditForm = ({
  user,
  onSuccess,
  onCancel
}: ProfileEditFormProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = useAppSelector((state) => state.auth);
  const userId = auth.clientId || 0;

  // Update profile mutation
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      usr_name: user?.usr_name || '',
      usr_sex: user?.usr_sex || ''
    }
  });

  // Update form values and avatar preview when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        usr_name: user.usr_name || '',
        usr_sex: user?.usr_sex || ''
      });

      // Set avatar preview if user has an avatar
      if (user.usr_avatar) {
        setAvatarPreview(user.usr_avatar);
      }
    }
  }, [user, form]);

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the file for later use in form submission
      setAvatarFile(file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // This is just to satisfy the form validation
      form.setValue('usr_avatar', file, { shouldValidate: true });
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) {
      toast('Error', {
        description: 'User ID not found. Please log in again.'
      });
      return;
    }

    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('usr_name', data.usr_name);

      if (data.usr_sex) {
        formData.append('usr_sex', data.usr_sex);
      }

      // Add the avatar file if it exists
      if (avatarFile) {
        formData.append('usr_avatar', avatarFile);
      }

      // Call the update profile mutation
      await updateProfile({
        userId: Number(userId),
        data: formData
      }).unwrap();

      // Show success message
      toast('Profile Updated', {
        description: 'Your profile information has been updated successfully.'
      });

      // Call success callback
      onSuccess();
    } catch (error) {
      console.log('error to update profile:', error);
      toast('Update Failed', {
        description:
          'There was an error updating your profile. Please try again.'
      });
    }
  };

  // Determine the avatar source URL
  const getAvatarSrc = () => {
    if (typeof avatarPreview === 'string') {
      if (avatarPreview.startsWith('blob:')) {
        return avatarPreview;
      } else if (avatarPreview.startsWith('http')) {
        return avatarPreview;
      } else {
        return `${process.env.NEXT_PUBLIC_API_URL_IPFS}${avatarPreview}`;
      }
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Avatar upload section */}
      <div className="mb-6 flex justify-start">
        <div className="relative">
          <Avatar className="ring-manga-500/40 ring-offset-background h-24 w-24 ring-2 ring-offset-2">
            {getAvatarSrc() ? (
              <Image
                src={getAvatarSrc() || '/placeholder.jpg'}
                alt="Avatar preview"
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User size={48} />
            )}
          </Avatar>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          {/* Upload button */}
          <Button
            type="button"
            size="icon"
            className="bg-manga-600 hover:bg-manga-700 absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            onClick={triggerFileInput}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="usr_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usr_sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border-manga-600/30 bg-background focus-visible:ring-manga-500/50 w-full max-w-md rounded-md border p-2"
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-manga-600 hover:bg-manga-700"
              disabled={isUpdating || (!form.formState.isDirty && !avatarFile)}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
