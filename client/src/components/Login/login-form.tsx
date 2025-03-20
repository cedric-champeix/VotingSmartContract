import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const handleImageLoaded = () => {
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-background p-6 relative'>
      {/* Spinner Loader */}
      {loading && (
        <div className="flex flex-col items-center space-y-4">
          {/* Dual Ring Spinner */}
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary opacity-30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          {/* Loading Text */}
          <p className="text-sm text-primary font-medium animate-pulse">{t('login.loading')}</p>
        </div>

      )}

      {/* Image cachée juste pour le chargement */}
      <img
        src='/images/logo-vert.png'
        alt='hidden-preload'
        onLoad={handleImageLoaded}
        className='hidden'
      />

      {/* Login Form affiché une fois l'image chargée */}
      {!loading && (
        <Card className='w-full max-w-4xl overflow-hidden shadow-lg'>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 p-0'>
            <div className='flex flex-col items-center justify-center p-10'>
              <h1 className='text-3xl font-bold mb-6'>{t('login.title')}</h1>
              <p className='text-gray-600 dark:text-gray-400 text-center mb-8 max-w-sm'>{t('login.subtitle')}</p>
              <ConnectButton label={`${t('login.button')}`} />
            </div>
            <div className='relative hidden md:block bg-muted'>
              <img
                src='/images/logo-vert.png'
                alt='Login Illustration'
                className='w-full h-full object-cover'
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
