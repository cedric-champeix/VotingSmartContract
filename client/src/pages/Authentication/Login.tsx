import { useWeb3 } from '../../hooks/useWeb3';
import { motion } from 'framer-motion';

export const Login = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <div
      className='h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4'
      id='login-section'
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='text-4xl md:text-6xl font-bold text-white text-center mb-8 drop-shadow-lg'
      >
        Connect Your Wallet
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className='text-white text-center mb-10 max-w-xl text-lg'
      >
        Access your dashboard and interact with the blockchain in one click. Secure, fast, and decentralized.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        onClick={connectWallet}
        className='px-8 py-4 bg-white text-purple-600 font-bold rounded-3xl shadow-xl hover:bg-purple-100 transition-all duration-300'
      >
        Connect with MetaMask
      </motion.button>
    </div>
  );
};
