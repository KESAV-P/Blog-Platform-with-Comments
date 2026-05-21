import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const Register = () => {
  const { register: registerCall, user, token, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && token) {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate]);

  // Clean errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const result = await registerCall(data.username, data.email, data.password);
    if (result.success) {
      toast.success(`Account created successfully!`);
      navigate('/', { replace: true });
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-[#161616] border border-neutral-900 rounded p-8 shadow-glass animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-display font-bold text-cream-light mb-2">Create Account</h2>
          <p className="text-cream-muted text-sm">Join the editorial blogging community</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 text-sm px-4 py-2.5 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            placeholder="johndoe"
            error={errors.username}
            {...register('username')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Register
          </Button>
        </form>

        <div className="text-center mt-6 text-xs text-cream-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-amber hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
