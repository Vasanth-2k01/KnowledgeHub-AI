import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Login - AI Knowledge Workspace',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <Card className="w-full border-zinc-200/60 shadow-lg rounded-2xl dark:border-zinc-800/60 dark:bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader className="space-y-1.5 text-center pt-6 pb-4">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6 px-6 sm:px-8">
        <LoginForm />
      </CardContent>
    </Card>
  );
}
