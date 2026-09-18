// React import removed
import { motion } from 'framer-motion';
import { Plus, BookOpen, Clock } from 'lucide-react';
import type { SavedProject } from '../types';

export default function Dashboard({ 
  onNewProject, 
  isDark, 
  savedProjects = [], 
  onViewProject,
  onOpenProject
}: { 
  onNewProject: () => void, 
  isDark: boolean,
  savedProjects?: SavedProject[],
  onViewProject?: (p: SavedProject) => void,
  onOpenProject?: (p: SavedProject) => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`max-w-4xl mx-auto space-y-12 ${isDark ? 'text-white' : 'text-black'}`}
    >
      <header className="pt-10">
        <h1 className="text-4xl font-semibold tracking-tight mb-3">Library</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Your generated engineering lessons.</p>
      </header>

      <section>
        <button 
          onClick={onNewProject}
          className={`w-full text-left group cursor-pointer rounded-3xl p-8 border transition-colors flex items-center justify-between ${
            isDark 
              ? 'bg-[#111] border-[#333] hover:border-[#666]' 
              : 'bg-gray-50 border-gray-200 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h3 className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Create New Project</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Scan hardware modules to generate a curriculum.</p>
            </div>
          </div>
        </button>
      </section>

      {savedProjects.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-500" /> 
            Saved Projects
          </h2>
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedProjects.map(project => (
              <motion.div variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }} transition={{ duration: 0.4, type: "spring", stiffness: 100 }} 
                key={project.id}
                className={`rounded-3xl border overflow-hidden group transition-all duration-300 hover:shadow-lg flex flex-col ${
                  isDark ? 'bg-[#111] border-[#333] hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="h-48 overflow-hidden bg-black relative shrink-0">
                  <img 
                    src={project.image} 
                    alt="Hardware" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.data.projectName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Clock className="w-4 h-4" />
                    {new Date(project.date).toLocaleDateString()}
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
                    <button 
                      onClick={() => onOpenProject?.(project)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-colors border text-sm ${
                        isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-black/20 text-black hover:bg-black/5'
                      }`}
                    >
                      Открыть
                    </button>
                    <button 
                      onClick={() => onViewProject?.(project)}
                      className="flex-1 py-3 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </motion.div>
  );
}
