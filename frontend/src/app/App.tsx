import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors />
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}