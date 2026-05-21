import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login, user, token, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && token) {
      navigate(from, { replace: true });
    }
  }, [user, token, navigate, from]);

  // Clean errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success(`Welcome back!`);
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || 'Authentication failed');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-[#161616] border border-neutral-900 rounded p-8 shadow-glass animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-display font-bold text-cream-light mb-2">Sign In</h2>
          <p className="text-cream-muted text-sm">Welcome back to the BlogSphere registry</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 text-sm px-4 py-2.5 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6 text-xs text-cream-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber hover:underline font-medium">
            Register for free
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
