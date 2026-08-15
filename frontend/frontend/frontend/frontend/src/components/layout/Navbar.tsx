import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  ShieldCheck, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Navigation bar component with responsive sidebar.
 */
export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar - hidden by default on desktop, shown on mobile when open */}
      <aside 
        className={`fixed inset-0 z-20 flex flex-col 
          ${isSidebarOpen ? 'transform translate-x-0' : '-translate-x-full'}
          w-64 bg-white border-r border-gray-200 
          transition-transform duration-300
        `}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">AIShield</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600"
            aria-label="Close sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <nav className="mt-6 space-y-2 px-4">
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            to="/analyze"
            className="block px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:bg-gray-50"
          >
            Analyze Prompt
          </Link>
          <Link
            to="/assessments"
            className="block px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:bg-gray-50"
          >
            Assessment History
          </Link>
        </nav>
      </aside>

      {/* Main header with navbar */}
      <header className={`bg-white border-b border-gray-200 
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}
        transition-margin-left duration-300
      `}>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleSidebar}
              className={`
                p-2 rounded-md text-gray-400 hover:text-gray-600
                md:hidden
              `}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900">
                AIShield
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link 
              to="/analyze" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Analyze Prompt
            </Link>
            <Link 
              to="/assessments" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Assessment History
            </Link>
            {/* Theme toggle */}
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
