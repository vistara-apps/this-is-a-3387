import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import SocialShareButton from './ui/SocialShareButton';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { generateMemeWithAI, generateMemeSuggestions } from '../utils/aiGeneration';
import { useUserContext } from '../hooks/useUserContext';
import toast from 'react-hot-toast';

function MemeGenerator({ credits, onUseCredit, onAddMeme, onAddCredits }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeme, setGeneratedMeme] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const { createSession } = usePaymentContext();
  const { isConnected } = useUserContext();

  // Load meme suggestions on component mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const newSuggestions = await generateMemeSuggestions();
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a meme description');
      toast.error('Please enter a meme description');
      return;
    }

    if (credits <= 0) {
      setError('No credits remaining. Please purchase more credits.');
      toast.error('No credits remaining. Please purchase more credits.');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet to generate memes');
      toast.error('Please connect your wallet to generate memes');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Use a credit first
      const creditUsed = await onUseCredit();
      if (!creditUsed) {
        setIsGenerating(false);
        return;
      }
      
      // Generate meme with AI
      const memeData = await generateMemeWithAI(prompt);
      
      setGeneratedMeme(memeData);
      await onAddMeme(memeData);
      setPrompt('');
      
      if (memeData.isDemo) {
        toast.success('Demo meme generated! Connect API keys for real AI generation.');
      } else {
        toast.success('Meme generated successfully!');
      }
    } catch (err) {
      setError('Failed to generate meme. Please try again.');
      toast.error('Failed to generate meme. Please try again.');
      console.error('Meme generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayForCredits = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to purchase credits');
      return;
    }

    try {
      const paymentData = await createSession();
      const success = await onAddCredits(10, paymentData); // Add 10 credits after payment
      if (success) {
        setError('');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">AI Meme Generator</h2>
        <p className="text-white/70 text-lg">
          Describe your meme idea and let AI create it for you
        </p>
      </div>

      {/* Generator Interface */}
      <Card className="p-6 lg:p-8">
        <div className="space-y-6">
          {/* Input Section */}
          <div>
            <label className="block text-white font-medium mb-3">
              Describe your meme idea
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A cat wearing sunglasses saying 'Deal with it' in a cool pose"
              className="text-lg"
              disabled={isGenerating}
            />
            <div className="text-white/60 text-sm mt-2">
              Tip: Be specific about the scene, characters, and text you want
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating || credits <= 0 || !prompt.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                <>✨ Generate Meme ({credits} credits)</>
              )}
            </Button>

            {credits <= 0 && (
              <Button
                variant="accent"
                onClick={handlePayForCredits}
                className="flex-1 sm:flex-none"
              >
                💳 Buy Credits ($1.00)
              </Button>
            )}
          </div>

          {/* Credits Info */}
          <div className="text-center text-white/60 text-sm">
            {credits > 0 ? (
              `You have ${credits} credit${credits !== 1 ? 's' : ''} remaining`
            ) : (
              'Purchase credits to continue generating memes'
            )}
          </div>
        </div>
      </Card>

      {/* Generated Meme Display */}
      {generatedMeme && (
        <Card className="p-6 lg:p-8 animate-scale-in">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-semibold text-white">Your Generated Meme</h3>
            
            <div className="max-w-lg mx-auto">
              <img
                src={generatedMeme.imageUrl}
                alt={generatedMeme.prompt}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-4">
              <div className="text-white/70 text-sm">
                "{generatedMeme.prompt}"
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <SocialShareButton
                  variant="twitter"
                  imageUrl={generatedMeme.imageUrl}
                  prompt={generatedMeme.prompt}
                  memeId={generatedMeme.id}
                />
                <SocialShareButton
                  variant="facebook"
                  imageUrl={generatedMeme.imageUrl}
                  prompt={generatedMeme.prompt}
                  memeId={generatedMeme.id}
                />
                <SocialShareButton
                  variant="reddit"
                  imageUrl={generatedMeme.imageUrl}
                  prompt={generatedMeme.prompt}
                  memeId={generatedMeme.id}
                />
                <SocialShareButton
                  variant="whatsapp"
                  imageUrl={generatedMeme.imageUrl}
                  prompt={generatedMeme.prompt}
                  memeId={generatedMeme.id}
                />
                <SocialShareButton
                  variant="copyLink"
                  imageUrl={generatedMeme.imageUrl}
                  memeId={generatedMeme.id}
                />
                <SocialShareButton
                  variant="download"
                  imageUrl={generatedMeme.imageUrl}
                  memeId={generatedMeme.id}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Example Prompts */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Need inspiration? Try these:</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSuggestions}
            className="text-white/60 hover:text-white"
          >
            🔄 Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all text-sm"
            >
              "{example}"
            </button>
          ))}
        </div>
        {suggestions.length === 0 && (
          <div className="text-center text-white/60 py-4">
            Loading suggestions...
          </div>
        )}
      </Card>
    </div>
  );
}

export default MemeGenerator;
