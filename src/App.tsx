import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, ArrowLeft, Sun, Moon } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProjectBuilder from './components/ProjectBuilder';
import StudentView from './components/StudentView';
import type { SavedProject } from './types';
import { db } from './lib/firebase';
import { ref, onValue, set } from 'firebase/database';

type Role = 'none' | 'teacher' | 'student';
type View = 'dashboard' | 'builder';

function App() {
  const [role, setRole] = useState<Role>('none');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDark, setIsDark] = useState(true);

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [viewingProject, setViewingProject] = useState<SavedProject | null>(null);
  const [builderInitialProject, setBuilderInitialProject] = useState<SavedProject | null>(null);

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsArray = Object.values(data) as SavedProject[];
        // Sort newest first by putting them in reverse order (assuming id is timestamp-based)
        setSavedProjects(projectsArray.sort((a, b) => b.id.localeCompare(a.id)));
      } else {
        setSavedProjects([]);
      }
    });

    const activeRef = ref(db, 'active_project');
    const unsubscribeActive = onValue(activeRef, (snapshot) => {
      setViewingProject(snapshot.val());
    });

    return () => {
      unsubscribeProjects();
      unsubscribeActive();
    };
  }, []);

  const handleSaveProject = (project: SavedProject) => {
    set(ref(db, 'projects/' + project.id), project);
    setCurrentView('dashboard');
  };

  const handleSendToStudent = (project: SavedProject) => {
    set(ref(db, 'active_project'), project);
    alert('Задание отправлено студентам!');
  };

  const handleSendToStudentFromBuilder = (project: SavedProject) => {
    set(ref(db, 'projects/' + project.id), project);
    set(ref(db, 'active_project'), project);
    alert('Задание отправлено студентам!');
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (role === 'none') {
    return <LandingPage onLoginTeacher={() => setRole('teacher')} onLoginStudent={() => setRole('student')} />;
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
            onClick={() => {
              setBuilderInitialProject(null);
              setCurrentView('builder');
            }} 
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
                onNewProject={() => {
                  setBuilderInitialProject(null);
                  setCurrentView('builder');
                }} 
                isDark={isDark} 
                savedProjects={savedProjects}
                onViewProject={handleSendToStudent}
                onOpenProject={(p) => {
                  setBuilderInitialProject(p);
                  setCurrentView('builder');
                }}
              />
            )}
            {currentView === 'builder' && (
              <ProjectBuilder 
                key="builder" 
                onBack={() => setCurrentView('dashboard')} 
                isDark={isDark} 
                onSave={handleSaveProject}
                onSendToStudent={handleSendToStudentFromBuilder}
                initialProject={builderInitialProject}
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
