import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from './ui/Button';

function Header({ credits, onAddCredits }) {
  return (
    <header className="w-full bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-white text-xl font-bold">MemeSynth</h1>
          </div>

          {/* Credits and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Credits Display */}
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <span className="text-yellow-400 text-lg">⚡</span>
              <span className="text-white font-semibold">{credits}</span>
              <span className="text-white/70 text-sm">credits</span>
            </div>

            {/* Add Credits Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddCredits(10)}
              className="hidden sm:flex"
            >
              Buy Credits
            </Button>

            {/* Wallet Connection */}
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Credits Display */}
        <div className="sm:hidden flex items-center justify-center pb-3">
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
            <span className="text-yellow-400 text-lg">⚡</span>
            <span className="text-white font-semibold">{credits}</span>
            <span className="text-white/70 text-sm">credits</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddCredits(10)}
              className="ml-2"
            >
              Buy More
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;