import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// User management functions
export async function createUser(walletAddress, email = null) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          wallet_address: walletAddress,
          email,
          credits: 3, // Start with 3 free credits
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUser(walletAddress) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUserCredits(walletAddress, credits) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ credits, updated_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}

// Meme management functions
export async function saveMeme(memeData) {
  try {
    const { data, error } = await supabase
      .from('memes')
      .insert([
        {
          user_id: memeData.userId,
          prompt: memeData.prompt,
          enhanced_prompt: memeData.enhancedPrompt,
          image_url: memeData.imageUrl,
          template_used: memeData.templateUsed,
          is_demo: memeData.isDemo || false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving meme:', error);
    throw error;
  }
}

export async function getUserMemes(userId, limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user memes:', error);
    return [];
  }
}

export async function getPublicMemes(limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select(`
        *,
        users (
          wallet_address
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public memes:', error);
    return [];
  }
}

// Payment tracking functions
export async function recordPayment(walletAddress, amount, creditsAdded) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          wallet_address: walletAddress,
          amount,
          credits_added: creditsAdded,
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
}

// Analytics functions
export async function recordMemeGeneration(userId, prompt, success = true) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .insert([
        {
          user_id: userId,
          action: 'meme_generation',
          metadata: { prompt, success },
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording analytics:', error);
  }
}

// Database schema creation (for reference)
export const databaseSchema = {
  users: `
    CREATE TABLE users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      wallet_address TEXT UNIQUE NOT NULL,
      email TEXT,
      credits INTEGER DEFAULT 3,
      total_memes_generated INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  memes: `
    CREATE TABLE memes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      prompt TEXT NOT NULL,
      enhanced_prompt TEXT,
      image_url TEXT NOT NULL,
      template_used TEXT,
      is_demo BOOLEAN DEFAULT false,
      is_public BOOLEAN DEFAULT true,
      sharing_stats JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  payments: `
    CREATE TABLE payments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      wallet_address TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      credits_added INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      transaction_hash TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  analytics: `
    CREATE TABLE analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      action TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
};
