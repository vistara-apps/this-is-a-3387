import React, { useState } from 'react';
import Button from './Button';
import toast from 'react-hot-toast';

const SocialShareButton = ({ 
  variant, 
  imageUrl, 
  prompt,
  memeId,
  size = 'md',
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    
    try {
      switch (variant) {
        case 'twitter':
          const twitterText = `Check out this AI-generated meme: "${prompt}" 🤖✨\n\nMade with MemeSynth - the AI meme generator!\n\n#MemeSynth #AIMemes #Web3`;
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(imageUrl)}`;
          window.open(twitterUrl, '_blank', 'width=550,height=420');
          toast.success('Opening Twitter to share your meme!');
          break;
          
        case 'instagram':
          // For Instagram, we'll provide instructions and copy the image URL
          await navigator.clipboard.writeText(imageUrl);
          toast.success('Image URL copied! Open Instagram and paste the link in your story or post.');
          break;
          
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(`Check out this AI-generated meme: "${prompt}"`)}`;
          window.open(facebookUrl, '_blank', 'width=550,height=420');
          toast.success('Opening Facebook to share your meme!');
          break;
          
        case 'reddit':
          const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(imageUrl)}&title=${encodeURIComponent(`AI-generated meme: ${prompt}`)}`;
          window.open(redditUrl, '_blank');
          toast.success('Opening Reddit to share your meme!');
          break;
          
        case 'copyLink':
          await navigator.clipboard.writeText(imageUrl);
          setCopied(true);
          toast.success('Meme link copied to clipboard!');
          setTimeout(() => setCopied(false), 3000);
          break;
          
        case 'download':
          try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `meme-${memeId || Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Meme downloaded!');
          } catch (error) {
            console.error('Download failed:', error);
            toast.error('Download failed. Try right-clicking the image and saving it.');
          }
          break;
          
        case 'whatsapp':
          const whatsappText = `Check out this AI-generated meme: "${prompt}" 🤖✨\n\n${imageUrl}\n\nMade with MemeSynth!`;
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
          window.open(whatsappUrl, '_blank');
          toast.success('Opening WhatsApp to share your meme!');
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error('Sharing failed. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const getButtonContent = () => {
    if (sharing) {
      return size === 'sm' ? '⏳' : '⏳ Sharing...';
    }

    switch (variant) {
      case 'twitter':
        return size === 'sm' ? '🐦' : '🐦 Twitter';
      case 'instagram':
        return size === 'sm' ? '📸' : '📸 Instagram';
      case 'facebook':
        return size === 'sm' ? '📘' : '📘 Facebook';
      case 'reddit':
        return size === 'sm' ? '🤖' : '🤖 Reddit';
      case 'whatsapp':
        return size === 'sm' ? '💬' : '💬 WhatsApp';
      case 'copyLink':
        return copied 
          ? (size === 'sm' ? '✅' : '✅ Copied!')
          : (size === 'sm' ? '🔗' : '🔗 Copy Link');
      case 'download':
        return size === 'sm' ? '📥' : '📥 Download';
      default:
        return 'Share';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'twitter':
      case 'facebook':
      case 'instagram':
        return 'primary';
      default:
        return 'outline';
    }
  };

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handleShare}
      disabled={sharing}
      className={className}
    >
      {getButtonContent()}
    </Button>
  );
};

export default SocialShareButton;
