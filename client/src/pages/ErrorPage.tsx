import FuzzyText from '@/components/ui/reactBits/textAnimations/FuzzyText/FuzzyText';
import { useTheme } from '@/providers/theme-provider';
import { ArrowBigLeftDash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const { theme } = useTheme();
  const reactivColor = theme === 'dark' ? 'white' : 'black';

  const navigate = useNavigate();

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-4 p-4 text-lg cursor-pointer hover:underline' onClick={() => navigate('/')}>
        <ArrowBigLeftDash size={24} />
        <span>Go back</span>
      </div>
      <div className='flex flex-grow justify-center items-center p-4'>
        <FuzzyText baseIntensity={0.2} hoverIntensity={1} enableHover={true} color={reactivColor}>
          404 - Page not found
        </FuzzyText>
      </div>
    </div>
  );
};
