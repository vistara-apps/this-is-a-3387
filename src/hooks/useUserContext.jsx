import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUser, createUser, updateUserCredits, recordPayment } from '../utils/supabase';
import toast from 'react-hot-toast';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);

  // Initialize user when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      initializeUser(address);
    } else {
      setUser(null);
      setCredits(0);
    }
  }, [isConnected, address]);

  const initializeUser = async (walletAddress) => {
    setLoading(true);
    try {
      let userData = await getUser(walletAddress);
      
      if (!userData) {
        // Create new user with 3 free credits
        userData = await createUser(walletAddress);
        toast.success('Welcome to MemeSynth! You have 3 free credits to get started.');
      }
      
      setUser(userData);
      setCredits(userData.credits);
    } catch (error) {
      console.error('Error initializing user:', error);
      toast.error('Failed to load user data');
      
      // Fallback to local state if database is unavailable
      setUser({
        id: 'local-user',
        wallet_address: walletAddress,
        credits: 3,
        isLocal: true
      });
      setCredits(3);
    } finally {
      setLoading(false);
    }
  };

  const useCredit = async () => {
    if (credits <= 0) {
      toast.error('No credits remaining');
      return false;
    }

    const newCredits = credits - 1;
    setCredits(newCredits);

    // Update in database if user is not local
    if (user && !user.isLocal) {
      try {
        await updateUserCredits(user.wallet_address, newCredits);
        setUser(prev => ({ ...prev, credits: newCredits }));
      } catch (error) {
        console.error('Error updating credits:', error);
        // Revert on error
        setCredits(credits);
        toast.error('Failed to update credits');
        return false;
      }
    }

    return true;
  };

  const addCredits = async (amount, paymentData = null) => {
    const newCredits = credits + amount;
    setCredits(newCredits);

    // Update in database if user is not local
    if (user && !user.isLocal) {
      try {
        await updateUserCredits(user.wallet_address, newCredits);
        setUser(prev => ({ ...prev, credits: newCredits }));

        // Record payment if provided
        if (paymentData) {
          await recordPayment(user.wallet_address, paymentData.amount, amount);
        }

        toast.success(`Added ${amount} credits to your account!`);
      } catch (error) {
        console.error('Error adding credits:', error);
        // Revert on error
        setCredits(credits);
        toast.error('Failed to add credits');
        return false;
      }
    } else {
      toast.success(`Added ${amount} credits!`);
    }

    return true;
  };

  const refreshUser = async () => {
    if (user && !user.isLocal) {
      try {
        const userData = await getUser(user.wallet_address);
        if (userData) {
          setUser(userData);
          setCredits(userData.credits);
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  const value = {
    user,
    credits,
    loading,
    isConnected,
    useCredit,
    addCredits,
    refreshUser,
    walletAddress: address
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
