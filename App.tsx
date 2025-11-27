import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Resources from './pages/Resources';
import VeoAnimator from './pages/VeoAnimator';
import ChatBot from './pages/ChatBot';
import Forum from './pages/Forum';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'feed':
        return <Feed />;
      case 'forum':
        return <Forum />;
      case 'resources':
        return <Resources />;
      case 'veo':
        return <VeoAnimator />;
      case 'chat':
        return <ChatBot />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="animate-fade-in">
        {renderPage()}
      </main>
      
      {/* Simple Footer */}
      {currentPage !== 'chat' && (
        <footer className="bg-white border-t border-slate-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; 2024 数字媒体艺术1班. All rights reserved.</p>
            <p className="mt-2">Designed with ❤️ for Class 24</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;