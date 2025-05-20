
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-purple-500">
                  Read My Saju
                </span>
              </h1>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo transition-colors">
                홈
              </Link>
              <Link to="/fortune" className="text-gray-700 hover:text-indigo transition-colors">
                오늘의 운세
              </Link>
              <Link to="/saju-input" className="text-gray-700 hover:text-indigo transition-colors">
                사주 입력
              </Link>
              <Link to="/celebrities" className="text-gray-700 hover:text-indigo transition-colors">
                유명인 사주
              </Link>
              <button className="secondary-button py-2 px-5">
                로그인
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo hover:bg-lavender/50"
              onClick={() => setIsMenuOpen(false)}
            >
              홈
            </Link>
            <Link 
              to="/fortune" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo hover:bg-lavender/50"
              onClick={() => setIsMenuOpen(false)}
            >
              오늘의 운세
            </Link>
            <Link 
              to="/saju-input" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo hover:bg-lavender/50"
              onClick={() => setIsMenuOpen(false)}
            >
              사주 입력
            </Link>
            <Link 
              to="/celebrities" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo hover:bg-lavender/50"
              onClick={() => setIsMenuOpen(false)}
            >
              유명인 사주
            </Link>
            <button 
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo hover:bg-lavender/50"
              onClick={() => setIsMenuOpen(false)}
            >
              로그인
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
