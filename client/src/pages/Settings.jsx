import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Shield, Camera } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),
});

const Settings = () => {
  const { user, updateProfile, loading } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      bio: user?.bio || '',
      password: '',
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('bio', data.bio || '');
    
    if (data.password) {
      formData.append('password', data.password);
    }
    
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const result = await updateProfile(formData, true);
    if (result.success) {
      toast.success('Profile updated successfully!');
      // Clear password field
      reset({ username: data.username, bio: data.bio, password: '' });
      setAvatarFile(null);
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  return (
    <PageWrapper className="max-w-2xl">
      <section className="mb-8 border-b border-cream-border/20 pb-6">
        <h1 className="font-display text-4xl font-bold text-cream-light mb-1">Settings</h1>
        <p className="text-cream-muted text-sm font-serif">
          Manage your author profile, biography, and credentials.
        </p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
        {/* Avatar Upload block */}
        <div className="bg-bg-card border border-neutral-900 rounded p-6">
          <h3 className="text-base font-display font-semibold text-cream-light mb-4 flex items-center gap-2">
            <Camera size={16} className="text-amber" /> Profile Image
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group cursor-pointer">
              <Avatar src={avatarPreview} name={user?.username} size="xl" className="border-2 border-neutral-850" />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity cursor-pointer border border-neutral-800"
              >
                <Camera size={20} className="text-cream-light" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <p className="text-sm font-medium text-cream-light">Upload a profile photo</p>
              <p className="text-xs text-cream-muted leading-relaxed">
                Accepted formats: JPEG, JPG, PNG, WEBP, GIF.<br />
                Maximum file size: 5MB.
              </p>
              {avatarFile && (
                <span className="inline-block text-xs bg-amber/10 text-amber px-2 py-0.5 rounded border border-amber/30 mt-2">
                  Image selected for upload
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info block */}
        <div className="bg-bg-card border border-neutral-900 rounded p-6 space-y-4">
          <h3 className="text-base font-display font-semibold text-cream-light border-b border-neutral-900 pb-2 flex items-center gap-2">
            <User size={16} className="text-amber" /> Author Biography
          </h3>

          <Input
            label="Username"
            placeholder="johndoe"
            error={errors.username}
            {...register('username')}
          />

          <Input
            label="Biography (Max 200 chars)"
            textarea={true}
            rows={3}
            placeholder="Introduce yourself to your readers..."
            error={errors.bio}
            {...register('bio')}
          />
        </div>

        {/* Security Credentials block */}
        <div className="bg-bg-card border border-neutral-900 rounded p-6 space-y-4">
          <h3 className="text-base font-display font-semibold text-cream-light border-b border-neutral-900 pb-2 flex items-center gap-2">
            <Shield size={16} className="text-amber" /> Security & Credentials
          </h3>

          <Input
            label="Change Password"
            type="password"
            placeholder="Leave blank to keep current password"
            error={errors.password}
            {...register('password')}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            loading={loading}
          >
            Save Profile Settings
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default Settings;
