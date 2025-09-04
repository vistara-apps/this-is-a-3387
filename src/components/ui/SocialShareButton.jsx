import React, { useState } from 'react';
import Button from './Button';

const SocialShareButton = ({ 
  variant, 
  imageUrl, 
  prompt,
  size = 'md',
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (variant === 'twitter') {
      const text = encodeURIComponent(`Check out this meme I created with MemeSynth! "${prompt}"`);
      const url = encodeURIComponent(window.location.origin);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (variant === 'instagram') {
      // Instagram doesn't support direct sharing, so we'll copy the image URL
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'MemeSynth Meme',
            text: prompt,
            url: imageUrl,
          });
        } catch (err) {
          console.log('Error sharing:', err);
        }
      }
    } else if (variant === 'copyLink') {
      try {
        await navigator.clipboard.writeText(imageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.log('Failed to copy:', err);
      }
    }
  };

  const getButtonContent = () => {
    switch (variant) {
      case 'twitter':
        return size === 'sm' ? '🐦' : '🐦 Share on Twitter';
      case 'instagram':
        return size === 'sm' ? '📷' : '📷 Share';
      case 'copyLink':
        return copied 
          ? (size === 'sm' ? '✅' : '✅ Copied!')
          : (size === 'sm' ? '🔗' : '🔗 Copy Link');
      default:
        return 'Share';
    }
  };

  const buttonVariant = variant === 'twitter' ? 'primary' : 'outline';

  return (
    <Button
      variant={buttonVariant}
      size={size}
      onClick={handleShare}
      className={className}
    >
      {getButtonContent()}
    </Button>
  );
};

export default SocialShareButton;