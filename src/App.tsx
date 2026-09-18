import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, ArrowLeft, Sun, Moon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProjectBuilder from './components/ProjectBuilder';
import StudentView from './components/StudentView';
import type { SavedProject } from './types';

type Role = 'none' | 'teacher' | 'student';
type View = 'dashboard' | 'builder';

function App() {
  const [role, setRole] = useState<Role>('none');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDark, setIsDark] = useState(true);

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem('artisan_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingProject, setViewingProject] = useState<SavedProject | null>(() => {
    const active = localStorage.getItem('artisan_active_project');
    return active ? JSON.parse(active) : null;
  });

  React.useEffect(() => {
    localStorage.setItem('artisan_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  React.useEffect(() => {
    if (viewingProject) {
      localStorage.setItem('artisan_active_project', JSON.stringify(viewingProject));
    } else {
      localStorage.removeItem('artisan_active_project');
    }
  }, [viewingProject]);

  const handleSaveProject = (project: SavedProject) => {
    setSavedProjects(prev => [project, ...prev]);
    setCurrentView('dashboard');
  };

  const handleSendToStudent = (project: SavedProject) => {
    setViewingProject(project);
    alert('Задание успешно отправлено ученикам!');
  };

  const handleSendToStudentFromBuilder = (project: SavedProject) => {
    // Optionally save it to library if not there
    setSavedProjects(prev => {
      if (!prev.find(p => p.id === project.id)) return [project, ...prev];
      return prev;
    });
    setViewingProject(project);
    alert('Задание успешно отправлено ученикам!');
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (role === 'none') {
    return (
      <div className={`flex flex-col min-h-screen font-sans ${isDark ? 'bg-black text-white' : 'bg-[#FAFAFA] text-black'}`}>
        
        {/* Top Navbar */}
        <nav className={`flex items-center justify-between px-6 py-4 border-b z-50 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 overflow-hidden flex items-start justify-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className={`w-8 max-w-none h-auto object-cover object-top -mt-0.5 ${isDark ? 'invert mix-blend-screen' : 'mix-blend-multiply'}`} 
              />
            </div>
            <div className={`hidden md:flex items-center gap-6 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Products</a>
              <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Resources</a>
              <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Enterprise</a>
              <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Pricing</a>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden lg:flex items-center gap-2 text-sm font-medium">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Artisan Studio is now in beta</span>
            <button onClick={() => setRole('teacher')} className={`flex items-center gap-1 transition-colors ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}`}>
              Try it out <span className="text-lg leading-none">›</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-black/5'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setRole('student')}
              className={`text-sm font-medium px-4 py-2 rounded-md transition-colors border ${
                isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-black/20 text-black hover:bg-black/5'
              }`}
            >
              Student Login
            </button>
            <button 
              onClick={() => setRole('teacher')}
              className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Teacher Login
            </button>
          </div>
        </nav>

        {/* Main Hero Section */}
        <main className="flex-1 relative flex flex-col items-center justify-center p-8 z-10 overflow-hidden">
          
          {/* Center Glowing Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
             {/* Background Glow */}
             <div className={`absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] blur-[100px] rounded-full transition-opacity duration-1000 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
             
             {/* Logo cropped (Symbol only) */}
             <div className="w-48 h-36 md:w-64 md:h-48 relative overflow-hidden flex justify-center z-10">
                <img 
                  src="/logo.png" 
                  className={`w-full absolute top-0 left-0 h-[140%] object-cover object-top drop-shadow-2xl ${isDark ? 'invert mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]' : 'mix-blend-multiply drop-shadow-[0_0_30px_rgba(0,0,0,0.3)]'}`} 
                  alt="Artisan Symbol" 
                />
             </div>
          </div>

          {/* Content Grid */}
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center z-10 h-full min-h-[60vh]">
            
            {/* Left Column */}
            <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] z-10">
                Educational<br/>Infrastructure
              </h1>
              <div className="flex items-center gap-4 z-10">
                <button 
                  onClick={() => setRole('teacher')} 
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Deploy now
                </button>
                <button 
                  onClick={() => setRole('student')} 
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors border ${
                    isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-black/20 text-black hover:bg-black/5'
                  }`}
                >
                  Talk to sales
                </button>
              </div>
            </div>

            {/* Center Column (Empty space for Logo) */}
            <div className="hidden lg:block h-full pointer-events-none"></div>

            {/* Right Column */}
            <div className="flex flex-col justify-center items-center lg:items-start lg:pl-16 gap-3 font-medium z-10 text-lg md:text-xl">
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>For STEM educators</p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>To ship interactive lessons</p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Powered by AI agents</p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  if (role === 'student') {
    return <StudentView onExit={() => setRole('none')} isDark={isDark} project={viewingProject} />;
  }

  // Teacher Layout
  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-20 lg:w-64 flex flex-col py-8 z-10 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}
      >
        <div className="px-6 mb-12 flex justify-center lg:justify-start">
          <div className="overflow-hidden" style={{ width: '130px' }}>
            <img 
              src="/logo-teacher.png" 
              alt="ARTISAN" 
              className={`h-12 w-auto max-w-none ${isDark ? 'invert mix-blend-screen' : 'mix-blend-multiply'}`} 
            />
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-3 flex-1">
          <NavItem 
            icon={<Folder />} 
            label="Library" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            isDark={isDark}
          />
          <NavItem 
            icon={<Plus />} 
            label="New Project" 
            active={currentView === 'builder'} 
            onClick={() => setCurrentView('builder')} 
            isDark={isDark}
          />
        </nav>

        <div className="px-3 mt-auto">
          <button 
            onClick={() => setRole('none')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 w-full ${
              isDark ? 'text-gray-400 hover:bg-[#1C1C1E] hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Exit</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <header className={`h-16 flex items-center justify-between px-8 z-10 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}>
           <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#222]' : 'hover:bg-gray-200'}`}
           >
             {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
           <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Teacher Workspace</div>
        </header>

        <div className={`flex-1 overflow-y-auto p-8 relative ${isDark ? 'bg-black' : 'bg-white'}`}>
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <Dashboard 
                key="dashboard" 
                onNewProject={() => setCurrentView('builder')} 
                isDark={isDark} 
                savedProjects={savedProjects}
                onViewProject={handleSendToStudent}
              />
            )}
            {currentView === 'builder' && (
              <ProjectBuilder 
                key="builder" 
                onBack={() => setCurrentView('dashboard')} 
                isDark={isDark} 
                onSave={handleSaveProject}
                onSendToStudent={handleSendToStudentFromBuilder}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, isDark: boolean }) {
  const activeClass = isDark ? 'bg-[#1C1C1E] text-white' : 'bg-gray-200 text-black';
  const inactiveClass = isDark ? 'text-gray-400 hover:bg-[#111] hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black';
  
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full group ${active ? activeClass : inactiveClass}`}
    >
      <div>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      </div>
      <span className="hidden lg:block font-medium">{label}</span>
    </button>
  );
}

export default App;
