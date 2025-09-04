import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import SocialShareButton from './ui/SocialShareButton';
import { usePaymentContext } from '../hooks/usePaymentContext';

function Templates({ credits, onUseCredit, onAddMeme, onAddCredits }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [generatedMeme, setGeneratedMeme] = useState(null);
  const [error, setError] = useState('');
  
  const { createSession } = usePaymentContext();

  // Popular meme templates
  const templates = [
    {
      id: 1,
      name: "Drake Pointing",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      topText: "REJECTING SOMETHING",
      bottomText: "APPROVING SOMETHING"
    },
    {
      id: 2,
      name: "Distracted Boyfriend",
      imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=300&fit=crop",
      topText: "CURRENT SITUATION",
      bottomText: "NEW OPPORTUNITY"
    },
    {
      id: 3,
      name: "This is Fine",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      topText: "EVERYTHING IS CHAOS",
      bottomText: "THIS IS FINE"
    },
    {
      id: 4,
      name: "Surprised Pikachu",
      imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop",
      topText: "WHEN YOU DO SOMETHING",
      bottomText: "AND FACE THE CONSEQUENCES"
    },
    {
      id: 5,
      name: "Change My Mind",
      imageUrl: "https://images.unsplash.com/photo-1529329156720-0282ba8f85b6?w=400&h=300&fit=crop",
      topText: "YOUR CONTROVERSIAL OPINION",
      bottomText: "CHANGE MY MIND"
    },
    {
      id: 6,
      name: "Woman Yelling at Cat",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
      topText: "ANGRY REACTION",
      bottomText: "CONFUSED RESPONSE"
    }
  ];

  const handleCreateMeme = async () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    if (!topText.trim() && !bottomText.trim()) {
      setError('Please add some text to your meme');
      return;
    }

    if (credits <= 0) {
      setError('No credits remaining. Please purchase more credits.');
      return;
    }

    try {
      // Use a credit
      onUseCredit();
      
      // Create meme data
      const memeData = {
        id: Date.now(),
        prompt: `${selectedTemplate.name} meme: "${topText}" / "${bottomText}"`,
        imageUrl: selectedTemplate.imageUrl,
        topText,
        bottomText,
        templateUsed: selectedTemplate.name,
        createdAt: new Date().toISOString()
      };
      
      setGeneratedMeme(memeData);
      onAddMeme(memeData);
      setError('');
    } catch (err) {
      setError('Failed to create meme. Please try again.');
      console.error('Template meme creation error:', err);
    }
  };

  const handlePayForCredits = async () => {
    try {
      await createSession();
      onAddCredits(10);
      setError('');
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Meme Templates</h2>
        <p className="text-white/70 text-lg">
          Choose from popular meme formats and add your own text
        </p>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-purple-400 bg-white/20'
                : 'hover:bg-white/10'
            }`}
            onClick={() => {
              setSelectedTemplate(template);
              setTopText(template.topText);
              setBottomText(template.bottomText);
            }}
          >
            <div className="relative">
              <img
                src={template.imageUrl}
                alt={template.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-between p-4">
                <div className="meme-template text-white text-lg font-bold text-center">
                  {template.topText}
                </div>
                <div className="meme-template text-white text-lg font-bold text-center">
                  {template.bottomText}
                </div>
              </div>
            </div>
            <h3 className="text-white font-semibold text-center">{template.name}</h3>
          </Card>
        ))}
      </div>

      {/* Text Input Section */}
      {selectedTemplate && (
        <Card className="p-6 lg:p-8 animate-scale-in">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white text-center">
              Customize "{selectedTemplate.name}"
            </h3>

            {/* Preview */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <img
                  src={selectedTemplate.imageUrl}
                  alt={selectedTemplate.name}
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-between p-4">
                  <div className="meme-template text-white text-xl font-bold text-center">
                    {topText || 'TOP TEXT'}
                  </div>
                  <div className="meme-template text-white text-xl font-bold text-center">
                    {bottomText || 'BOTTOM TEXT'}
                  </div>
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-white font-medium mb-2">Top Text</label>
                <Input
                  value={topText}
                  onChange={(e) => setTopText(e.target.value.toUpperCase())}
                  placeholder="TOP TEXT"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Bottom Text</label>
                <Input
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                  placeholder="BOTTOM TEXT"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={handleCreateMeme}
                disabled={credits <= 0}
                className="flex-1 max-w-xs"
              >
                🎭 Create Meme ({credits} credits)
              </Button>

              {credits <= 0 && (
                <Button
                  variant="accent"
                  onClick={handlePayForCredits}
                  className="flex-1 max-w-xs"
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
                'Purchase credits to continue creating memes'
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Generated Meme Display */}
      {generatedMeme && (
        <Card className="p-6 lg:p-8 animate-scale-in">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-semibold text-white">Your Meme is Ready!</h3>
            
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <img
                  src={generatedMeme.imageUrl}
                  alt="Generated meme"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-between p-4">
                  <div className="meme-template text-white text-xl font-bold text-center">
                    {generatedMeme.topText}
                  </div>
                  <div className="meme-template text-white text-xl font-bold text-center">
                    {generatedMeme.bottomText}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <SocialShareButton
                variant="twitter"
                imageUrl={generatedMeme.imageUrl}
                prompt={generatedMeme.prompt}
              />
              <SocialShareButton
                variant="copyLink"
                imageUrl={generatedMeme.imageUrl}
              />
              <Button
                variant="outline"
                onClick={() => {
                  // Create a canvas to combine image and text for download
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.crossOrigin = 'anonymous';
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Add text overlay
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.font = 'bold 40px Impact';
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    
                    // Top text
                    ctx.strokeText(generatedMeme.topText, canvas.width / 2, 50);
                    ctx.fillText(generatedMeme.topText, canvas.width / 2, 50);
                    
                    // Bottom text
                    ctx.strokeText(generatedMeme.bottomText, canvas.width / 2, canvas.height - 30);
                    ctx.fillText(generatedMeme.bottomText, canvas.width / 2, canvas.height - 30);
                    
                    // Download
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL();
                    link.download = `meme-${Date.now()}.png`;
                    link.click();
                  };
                  img.src = generatedMeme.imageUrl;
                }}
              >
                📥 Download
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setGeneratedMeme(null);
                setTopText(selectedTemplate.topText);
                setBottomText(selectedTemplate.bottomText);
              }}
            >
              🎭 Create Another
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Templates;