import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { s } from 'vite/dist/node/types.d-aGj9QkWt';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(localStorage.getItem('account') || null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send('eth_requestAccounts', []);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();

        setProvider(browserProvider);
        setSigner(signer);
        setAccount(address);
        localStorage.setItem('account', address);
      } catch (err) {
        console.error('Error connecting to wallet:', err);
      } finally {
        setLoading(false);
        navigate('/');
      }
    } else {
      alert('Please install MetaMask extension!');
    }
  };

  return { provider, signer, account, connectWallet, loading, setAccount };
};
