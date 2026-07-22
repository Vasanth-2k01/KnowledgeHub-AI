import { auth, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b h-16 flex items-center justify-between px-6 bg-white shadow-sm">
        <h1 className="font-semibold text-lg">AI Knowledge Workspace</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">Welcome, {session?.user?.name || 'User'}</p>
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}>
            <Button variant="outline" size="sm" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center text-gray-500">
          <p>Dashboard functionality will be implemented in future phases.</p>
        </div>
      </main>
    </div>
  );
}
