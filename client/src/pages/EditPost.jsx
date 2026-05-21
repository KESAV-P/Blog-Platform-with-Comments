import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PenTool, Image as ImageIcon, Sparkles } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import PostEditor from '../components/posts/PostEditor';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const postSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  category: z.enum(['Tech', 'Lifestyle', 'Travel', 'Food', 'Science', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  const statusValue = watch('status');

  // Load post details
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await api.get(`/posts/id/${id}`);
        const post = response.data;
        
        reset({
          title: post.title,
          category: post.category,
          tags: post.tags ? post.tags.join(', ') : '',
          status: post.status,
        });

        setContent(post.content || '');
        setCoverPreview(post.coverImage || '');
      } catch (error) {
        toast.error('Failed to load article details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id, reset, navigate]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Cover image must be less than 5MB');
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const contentText = content.replace(/<[^>]*>/g, '').trim();
    if (contentText.length < 10) {
      toast.error('Post content must be at least 10 characters long');
      return;
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', content);
    formData.append('category', data.category);
    formData.append('status', data.status);
    
    if (data.tags) {
      const tagsArray = data.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)
        .slice(0, 5);
      formData.append('tags', JSON.stringify(tagsArray));
    } else {
      formData.append('tags', JSON.stringify([]));
    }

    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    try {
      const response = await api.put(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(
        data.status === 'published'
          ? 'Article updated & published!'
          : 'Article draft updated!'
      );
      navigate(`/blog/${response.data.slug}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update article');
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-5xl">
      <section className="mb-8 border-b border-cream-border/20 pb-6">
        <h1 className="font-display text-4xl font-bold text-cream-light mb-1 flex items-center gap-2">
          <PenTool size={32} className="text-amber" /> Edit Article
        </h1>
        <p className="text-cream-muted text-sm font-serif">
          Modify draft details or publish updates to your article.
        </p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Article Title"
              placeholder="E.g., Crafting the Perfect Monorepo"
              error={errors.title}
              {...register('title')}
            />
          </div>

          <div>
            <label className="block text-cream-muted text-sm font-medium mb-1.5">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full bg-bg-input text-cream border border-neutral-800 rounded px-4 py-2.5 outline-none transition-all duration-200 focus:border-amber focus:ring-2 focus:ring-amber/20 cursor-pointer"
            >
              <option value="Tech">Tech</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Science">Science</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-xs mt-1 block">{errors.category.message}</span>
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="bg-bg-card border border-neutral-900 rounded p-6">
          <label className="block text-cream-light text-sm font-semibold mb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-amber" /> Cover Image
          </label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-80 aspect-video bg-neutral-900 rounded border border-neutral-850 flex items-center justify-center overflow-hidden shrink-0">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-cream-muted text-xs font-mono">No cover image chosen</span>
              )}
            </div>

            <div className="space-y-3 w-full">
              <label
                htmlFor="cover-upload"
                className="inline-flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-cream px-4 py-2 border border-neutral-700 rounded text-sm font-medium cursor-pointer transition-colors"
              >
                Choose Cover File
              </label>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <p className="text-xs text-cream-muted leading-relaxed">
                We recommend standard landscape dimensions (16:9). Max file size: 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* TipTap Rich Editor */}
        <div className="space-y-1.5">
          <label className="block text-cream-muted text-sm font-medium">
            Body Content
          </label>
          <PostEditor content={content} onChange={(html) => setContent(html)} />
        </div>

        {/* Tags & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-bg-card border border-neutral-900 rounded p-6 items-end">
          <div className="md:col-span-2">
            <Input
              label="Tags (Comma separated, max 5)"
              placeholder="e.g. react, tutorial, design"
              error={errors.tags}
              {...register('tags')}
            />
          </div>

          <div>
            <label className="block text-cream-muted text-sm font-medium mb-1.5">
              Publish Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center justify-center border rounded py-2 px-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  statusValue === 'draft'
                    ? 'border-amber/40 bg-amber/10 text-amber'
                    : 'border-neutral-850 text-cream-muted hover:border-neutral-800'
                }`}
              >
                <input
                  type="radio"
                  value="draft"
                  className="sr-only"
                  {...register('status')}
                />
                Draft
              </label>
              <label
                className={`flex items-center justify-center border rounded py-2 px-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  statusValue === 'published'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-neutral-850 text-cream-muted hover:border-neutral-800'
                }`}
              >
                <input
                  type="radio"
                  value="published"
                  className="sr-only"
                  {...register('status')}
                />
                Publish
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={submitLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default EditPost;
