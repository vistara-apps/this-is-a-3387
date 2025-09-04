import { createContext, useContext, useState, useEffect } from 'react';
import { saveMeme, getUserMemes, getPublicMemes, recordMemeGeneration } from '../utils/supabase';
import { useUserContext } from './useUserContext';
import toast from 'react-hot-toast';

const MemeContext = createContext();

export function MemeProvider({ children }) {
  const { user } = useUserContext();
  const [userMemes, setUserMemes] = useState([]);
  const [publicMemes, setPublicMemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user memes when user changes
  useEffect(() => {
    if (user && !user.isLocal) {
      loadUserMemes();
    } else {
      setUserMemes([]);
    }
  }, [user]);

  // Load public memes on mount
  useEffect(() => {
    loadPublicMemes();
  }, []);

  const loadUserMemes = async () => {
    if (!user || user.isLocal) return;
    
    setLoading(true);
    try {
      const memes = await getUserMemes(user.id);
      setUserMemes(memes);
    } catch (error) {
      console.error('Error loading user memes:', error);
      toast.error('Failed to load your memes');
    } finally {
      setLoading(false);
    }
  };

  const loadPublicMemes = async () => {
    try {
      const memes = await getPublicMemes(20);
      setPublicMemes(memes);
    } catch (error) {
      console.error('Error loading public memes:', error);
      // Don't show error toast for public memes as it's not critical
    }
  };

  const addMeme = async (memeData) => {
    // Add to local state immediately for better UX
    const newMeme = {
      ...memeData,
      id: memeData.id || Date.now(),
      created_at: new Date().toISOString()
    };

    setUserMemes(prev => [newMeme, ...prev]);

    // Save to database if user is not local
    if (user && !user.isLocal) {
      try {
        const savedMeme = await saveMeme({
          ...memeData,
          userId: user.id
        });
        
        // Update local state with saved meme data
        setUserMemes(prev => 
          prev.map(meme => 
            meme.id === newMeme.id ? savedMeme : meme
          )
        );

        // Record analytics
        await recordMemeGeneration(user.id, memeData.prompt, true);
        
        // Add to public memes if it's public
        if (savedMeme.is_public) {
          setPublicMemes(prev => [savedMeme, ...prev.slice(0, 19)]);
        }
      } catch (error) {
        console.error('Error saving meme:', error);
        toast.error('Meme generated but failed to save to your gallery');
        
        // Record failed analytics
        if (user && !user.isLocal) {
          await recordMemeGeneration(user.id, memeData.prompt, false);
        }
      }
    }

    return newMeme;
  };

  const deleteMeme = async (memeId) => {
    // Remove from local state immediately
    setUserMemes(prev => prev.filter(meme => meme.id !== memeId));
    
    // TODO: Implement delete in Supabase when needed
    toast.success('Meme removed from gallery');
  };

  const shareMeme = async (memeId, platform) => {
    // TODO: Implement sharing analytics
    console.log(`Sharing meme ${memeId} on ${platform}`);
  };

  const refreshMemes = async () => {
    await Promise.all([
      loadUserMemes(),
      loadPublicMemes()
    ]);
  };

  const value = {
    userMemes,
    publicMemes,
    loading,
    addMeme,
    deleteMeme,
    shareMeme,
    refreshMemes,
    loadUserMemes,
    loadPublicMemes
  };

  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  );
}

export function useMemeContext() {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMemeContext must be used within a MemeProvider');
  }
  return context;
}
