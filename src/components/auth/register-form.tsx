'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react';

import { RegisterInput, registerSchema } from '@/validators/auth';
import { registerAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from './google-sign-in-button';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const result = await registerAction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Account created successfully! Please log in.');
        router.push('/login');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2.5">
          
          {/* Name Field */}
          <div className="grid gap-1 text-zinc-950 dark:text-zinc-50 relative">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                className="h-9 pl-9 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 dark:bg-zinc-950/50 rounded-xl"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.name.message}</p>
            )}
          </div>
          
          {/* Email Field */}
          <div className="grid gap-1 text-zinc-950 dark:text-zinc-50 relative">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="h-9 pl-9 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 dark:bg-zinc-950/50 rounded-xl"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.email.message}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="grid gap-1 text-zinc-950 dark:text-zinc-50 relative">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={isLoading}
                className="h-9 pl-9 pr-10 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 dark:bg-zinc-950/50 rounded-xl"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.password.message}</p>
            )}
          </div>
          
          {/* Confirm Password Field */}
          <div className="grid gap-1 text-zinc-950 dark:text-zinc-50 relative">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={isLoading}
                className="h-9 pl-9 pr-10 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 dark:bg-zinc-950/50 rounded-xl"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button 
            type="submit"
            disabled={isLoading} 
            className="h-9 w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] mt-1 font-semibold rounded-xl"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
          <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400">
            Or continue with
          </span>
        </div>
      </div>
      
      <GoogleSignInButton />
      
      <div className="text-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold hover:underline underline-offset-4 dark:text-blue-400 transition-colors">
          Log in instead
        </Link>
      </div>
    </div>
  );
}
