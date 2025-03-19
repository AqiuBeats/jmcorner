// app/providers.tsx
import { Toaster } from 'sonner';

export function ToastProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
