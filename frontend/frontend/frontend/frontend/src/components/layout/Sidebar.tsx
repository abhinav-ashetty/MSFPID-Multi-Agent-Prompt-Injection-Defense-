import { useState } from 'react';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Search, 
  ClipboardList, 
  BarChart3, 
  PieChart, 
  Settings 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

/**
 * Sidebar component.
 */
export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`fixed inset-0 z-20 flex ${isCollapsed ? '' : 'flex-col'} 
      bg-white border-r border-gray-200 
      ${isCollapsed ? 'w-16' : 'w-64'}
      transition-all duration-300
    `}>
      {/* Mobile sidebar toggle button */}
      {!isCollapsed && (
        <button 
          onClick={toggleSidebar}
          className="absolute -left-8 top-2 bg-white p-2 rounded-full shadow-lg border border-gray-200"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600 hover:text-gray-800" />
        </button>
      )}
      
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'} 
        ${isCollapsed ? 'text-center' : ''}
      `}>
        {/* Logo */}
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">AIShield</span>
            </div>
            {isCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                aria-label="Close sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Navigation menu */}
        <nav className="mt-4 space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2 mb-4 text-sm font-medium text-gray-500 uppercase">
              Main
            </div>
          )}
          
          {/* Dashboard link */}
          <Link
            to="/dashboard"
            className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              ${isCollapsed ? '' : 'text-gray-700 hover:bg-gray-50'}
              ${isCollapsed ? 'text-gray-500' : ''}
            `}
          >
            {isCollapsed ? (
              <Home className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
            ) : (
              <>
                <Home className="mr-3 h-5 w-5" />
                <span className="flex-1 whitespace-nowrap">Dashboard</span>
              </>
            )}
          </Link>
          
          {/* Analyze link */}
          <Link
            to="/analyze"
            className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              ${isCollapsed ? '' : 'text-gray-700 hover:bg-gray-50'}
              ${isCollapsed ? 'text-gray-500' : ''}
            `}
          >
            {isCollapsed ? (
              <Search className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
            ) : (
              <>
                <Search className="mr-3 h-5 w-5" />
                <span className="flex-1 whitespace-nowrap">Analyze</span>
              </>
            )}
          </Link>
          
          {/* Assessments link */}
          <Link
            to="/assessments"
            className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              ${isCollapsed ? '' : 'text-gray-700 hover:bg-gray-50'}
              ${isCollapsed ? 'text-gray-500' : ''}
            `}
          >
            {isCollapsed ? (
              <ClipboardList className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
            ) : (
              <>
                <ClipboardList className="mr-3 h-5 w-5" />
                <span className="flex-1 whitespace-nowrap">Assessments</span>
              </>
            )}
          </Link>
          
          {/* Charts link (placeholder) */}
          <Link
            to="/dashboard"
            className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              ${isCollapsed ? '' : 'text-gray-700 hover:bg-gray-50'}
              ${isCollapsed ? 'text-gray-500' : ''}
            `}
          >
            {isCollapsed ? (
              <BarChart3 className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
            ) : (
              <>
                <BarChart3 className="mr-3 h-5 w-5" />
                <span className="flex-1 whitespace-nowrap">Charts</span>
              </>
            )}
          </Link>
          
          {/* Settings link */}
          <Link
            to="/dashboard"
            className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              ${isCollapsed ? '' : 'text-gray-700 hover:bg-gray-50'}
              ${isCollapsed ? 'text-gray-500' : ''}
            `}
            onClick={toggleSidebar} // Close sidebar on mobile when clicking settings
          >
            {isCollapsed ? (
              <Settings className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
            ) : (
              <>
                <Settings className="mr-3 h-5 w-5" />
                <span className="flex-1 whitespace-nowrap">Settings</span>
              </>
            )}
          </Link>
        </nav>
      </div>
    </aside>
  );
};
