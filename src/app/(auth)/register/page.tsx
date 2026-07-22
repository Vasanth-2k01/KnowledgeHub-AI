import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Register - AI Knowledge Workspace',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <Card className="w-full border-zinc-200/60 shadow-lg rounded-2xl dark:border-zinc-800/60 dark:bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader className="space-y-1.5 text-center pt-6 pb-4">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Enter your details below to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6 px-6 sm:px-8">
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
