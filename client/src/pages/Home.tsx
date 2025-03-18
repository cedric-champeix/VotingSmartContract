import { motion } from 'framer-motion';
import { useWeb3 } from '../hooks/useWeb3';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { account, setAccount } = useWeb3();

  const navigate = useNavigate();

  function logout() {
    setAccount(null);
    localStorage.removeItem('account');
    navigate('/login');
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className='bg-white rounded-2xl px-6 py-4 shadow-xl'
      >
        <p className='text-gray-800'>
          Connected wallet: <span className='font-mono text-purple-600'>{account}</span>
        </p>
      </motion.div>

      <Button onClick={() => logout()} className='mt-4' variant='link'>
        Deco
      </Button>
    </>
  );
};
