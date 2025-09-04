import React from 'react';
import Card from './ui/Card';
import SocialShareButton from './ui/SocialShareButton';

function Gallery({ memes }) {
  if (memes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="glass-effect rounded-lg p-12">
          <div className="text-6xl mb-6">🖼️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Gallery is Empty</h2>
          <p className="text-white/70 text-lg mb-6">
            Start creating memes to see them appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Your Meme Gallery</h2>
        <p className="text-white/70 text-lg">
          {memes.length} meme{memes.length !== 1 ? 's' : ''} created
        </p>
      </div>

      {/* Memes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <Card key={meme.id} className="overflow-hidden group">
            <div className="relative">
              {/* Meme Image */}
              <div className="relative">
                <img
                  src={meme.imageUrl}
                  alt={meme.prompt}
                  className="w-full h-64 object-cover"
                />
                
                {/* Text Overlay for Template Memes */}
                {meme.topText && meme.bottomText && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
                    <div className="meme-template text-white text-lg font-bold text-center">
                      {meme.topText}
                    </div>
                    <div className="meme-template text-white text-lg font-bold text-center">
                      {meme.bottomText}
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex space-x-2">
                  <SocialShareButton
                    variant="twitter"
                    imageUrl={meme.imageUrl}
                    prompt={meme.prompt}
                    size="sm"
                  />
                  <SocialShareButton
                    variant="copyLink"
                    imageUrl={meme.imageUrl}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Meme Info */}
            <div className="p-4">
              <p className="text-white/80 text-sm line-clamp-2 mb-2">
                {meme.prompt}
              </p>
              <div className="flex items-center justify-between text-white/60 text-xs">
                <span>
                  {meme.templateUsed ? `Template: ${meme.templateUsed}` : 'AI Generated'}
                </span>
                <span>
                  {new Date(meme.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="glass-effect rounded-lg p-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {memes.length}
            </div>
            <div className="text-white/70">Memes Created</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {memes.filter(m => m.templateUsed).length}
            </div>
            <div className="text-white/70">Template Memes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {memes.filter(m => !m.templateUsed).length}
            </div>
            <div className="text-white/70">AI Generated</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;