import React from 'react';
import Button from './ui/Button';

function Hero({ onGetStarted }) {
  return (
    <section className="pt-16 pb-24 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Craft hilarious memes from your{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            wildest ideas
          </span>
          , instantly
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Turn your thoughts into viral content with AI-powered meme generation. 
          No design skills required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            className="w-full sm:w-auto"
          >
            ✨ Start Creating
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            🎭 Browse Templates
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered',
              description: 'Describe your meme idea and watch AI bring it to life'
            },
            {
              icon: '⚡',
              title: 'Instant Generation',
              description: 'Get your memes in seconds, not hours of design work'
            },
            {
              icon: '📱',
              title: 'Share Everywhere',
              description: 'One-click sharing to all your favorite social platforms'
            }
          ].map((feature, index) => (
            <div key={index} className="glass-effect rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Info */}
        <div className="mt-16 glass-effect rounded-lg p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">$0.10</div>
            <div className="text-white/70 text-lg mb-4">per meme generation</div>
            <div className="text-white/60 text-sm">
              Start with 3 free credits • No subscription required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;