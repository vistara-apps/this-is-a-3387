import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MemeGenerator from './components/MemeGenerator';
import Templates from './components/Templates';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import { useUserContext } from './hooks/useUserContext';
import { useMemeContext } from './hooks/useMemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('create');
  const { credits, useCredit, addCredits, isConnected } = useUserContext();
  const { userMemes, addMeme } = useMemeContext();

  return (
    <div className="min-h-screen gradient-bg">
      <Header credits={credits} onAddCredits={addCredits} />
      
      <main className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {activeTab === 'home' && (
          <div className="space-y-16">
            <Hero onGetStarted={() => setActiveTab('create')} />
            <Gallery memes={userMemes} />
          </div>
        )}
        
        {activeTab === 'create' && (
          <div className="pt-8">
            <MemeGenerator 
              credits={credits}
              onUseCredit={useCredit}
              onAddMeme={addMeme}
              onAddCredits={addCredits}
            />
          </div>
        )}
        
        {activeTab === 'templates' && (
          <div className="pt-8">
            <Templates 
              credits={credits}
              onUseCredit={useCredit}
              onAddMeme={addMeme}
              onAddCredits={addCredits}
            />
          </div>
        )}
        
        {activeTab === 'gallery' && (
          <div className="pt-8">
            <Gallery memes={userMemes} />
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 lg:hidden">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'create', label: 'Create', icon: '✨' },
            { id: 'templates', label: 'Templates', icon: '🎭' },
            { id: 'gallery', label: 'Gallery', icon: '🖼️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'text-white bg-white/20' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-24 left-8 z-10">
        <div className="glass-effect rounded-lg p-4 space-y-2">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'create', label: 'Create', icon: '✨' },
            { id: 'templates', label: 'Templates', icon: '🎭' },
            { id: 'gallery', label: 'Gallery', icon: '🖼️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'text-white bg-white/20' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl mr-3">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <Footer />
    </div>
  );
}

export default App;
