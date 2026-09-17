import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, ArrowLeft, GraduationCap, MonitorPlay, Sun, Moon } from 'lucide-react';
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
      <div className={`flex h-screen items-center justify-center font-sans ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
        {/* Theme Toggle on Home */}
        <button 
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-3 rounded-full transition-colors ${isDark ? 'hover:bg-[#111]' : 'hover:bg-gray-100'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full px-8 text-center"
        >
          <img 
            src="/logo.png" 
            alt="ARTISAN" 
            className={`h-32 mx-auto mb-4 ${isDark ? 'invert mix-blend-screen' : 'mix-blend-multiply'}`} 
          />
          <p className={`text-lg mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Choose your workspace to continue.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setRole('teacher')}
              className={`p-10 rounded-[32px] flex flex-col items-center gap-6 transition-colors group border ${
                isDark ? 'bg-[#111] border-[#333] hover:bg-[#1C1C1E]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                <MonitorPlay className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Teacher</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create lessons, generate projects, and manage modules.</p>
              </div>
            </button>

            <button 
              onClick={() => setRole('student')}
              className={`p-10 rounded-[32px] flex flex-col items-center gap-6 transition-colors group border ${
                isDark ? 'bg-[#111] border-[#333] hover:bg-[#1C1C1E]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border transition-colors ${
                isDark 
                  ? 'bg-[#1C1C1E] text-white border-[#333] group-hover:bg-white group-hover:text-black group-hover:border-white' 
                  : 'bg-white text-black border-gray-300 group-hover:bg-black group-hover:text-white group-hover:border-black'
              }`}>
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Student</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Access your assigned project and the Arduino simulator.</p>
              </div>
            </button>
          </div>
        </motion.div>
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
