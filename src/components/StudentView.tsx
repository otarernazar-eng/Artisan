import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import type { SavedProject } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function StudentView({ 
  onExit, 
  isDark,
  project
}: { 
  onExit: () => void, 
  isDark: boolean,
  project?: SavedProject | null 
}) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'chat'>('instructions');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Привет! Я твой ИИ-помощник по Arduino. Задавай любые вопросы по коду, сборке или компонентам!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API ключ не найден в .env файле (VITE_GEMINI_API_KEY)');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const chatHistory = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      // Base instruction
      let sysInstruction = 'Ты дружелюбный ИИ-ассистент для помощи ученикам с Arduino. Отвечай на русском языке кратко, понятно и по делу. Помогай писать код, находить ошибки и объяснять принципы работы компонентов.';
      
      // Inject project context if available, but NOT the solution
      if (project) {
        sysInstruction += `\n\nУченик сейчас работает над проектом "${project.data.projectName}". Описание задачи: "${project.data.projectDescription}". Не давай ему готовый код сразу, помогай наводящими вопросами.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: sysInstruction,
        }
      });

      const reply = response.text || 'Извините, не смог сгенерировать ответ.';
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: `Ошибка: ${error.message || 'Не удалось получить ответ от ИИ.'}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Derive unique parts list from bounding boxes
  const uniqueParts = project 
    ? Array.from(new Set(project.data.boundingBoxes.map(b => b.label)))
    : ["Плата Arduino UNO", "Светодиоды", "Резисторы", "Соединительные провода"];

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Left Panel: Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`w-full lg:w-[400px] flex flex-col z-10 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}
      >
        <header className={`p-6 flex items-center gap-4 border-b ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
          <button onClick={onExit} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#222] text-white' : 'hover:bg-gray-200 text-black'}`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>

        <div className={`flex border-b ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
          <button 
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'instructions' 
                ? (isDark ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black') 
                : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            Задание
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'chat' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <Sparkles className="w-4 h-4" /> ИИ Помощник
          </button>
        </div>

        {activeTab === 'instructions' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <section>
               <h3 className="text-lg font-bold mb-2">Цель проекта</h3>
               <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#1A1A1C] border-[#333]' : 'bg-white border-gray-200 shadow-sm'}`}>
                 <h4 className="font-semibold mb-2">{project ? project.data.projectName : 'Интерактивный симулятор'}</h4>
                 <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                   {project 
                     ? project.data.projectDescription 
                     : 'Это полностью функциональный симулятор Arduino. Вы можете редактировать код на C++, запускать симуляцию и взаимодействовать с компонентами.'
                   }
                 </p>
               </div>
            </section>
            
            <section>
               <h3 className="text-lg font-bold mb-4">Необходимые детали</h3>
               <ul className="space-y-3">
                 {uniqueParts.map((part, idx) => (
                   <li key={idx} className="flex gap-3 items-center">
                     <div className={`w-2 h-2 rounded-full shrink-0 ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                     <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{part}</p>
                   </li>
                 ))}
               </ul>
            </section>

            {!project && (
              <div className={`p-4 rounded-xl text-sm border ${isDark ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                ⚠️ Учитель не назначил проект. Отображается режим свободной песочницы.
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : isDark ? 'bg-[#222] text-gray-200 rounded-tl-sm' : 'bg-gray-200 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl p-4 flex items-center gap-2 ${isDark ? 'bg-[#222]' : 'bg-gray-200'} rounded-tl-sm`}>
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-xs text-gray-500">ИИ печатает...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`p-4 border-t ${isDark ? 'border-[#333] bg-[#111]' : 'border-gray-200 bg-gray-50'}`}>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Спроси что-нибудь про код..."
                  className={`flex-1 rounded-xl px-4 py-2 text-sm outline-none border focus:border-blue-500 transition-colors ${
                    isDark ? 'bg-[#222] border-[#444] text-white placeholder-gray-500' : 'bg-white border-gray-300 text-black placeholder-gray-400'
                  }`}
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>

      {/* Right Panel: Working iframe constructor */}
      <div className={`flex-1 relative flex flex-col ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
        {/* Toolbar */}
        <div className={`h-16 flex items-center justify-between px-6 z-20 ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
             {/* Empty toolbar to keep layout spacing */}
          </div>
        </div>

        {/* Wokwi Embed with CSS Clipping to hide the header */}
        <div className={`flex-1 relative overflow-hidden w-full ${isDark ? 'bg-[#111]' : 'bg-gray-50'}`}>
          <div className="absolute inset-0" style={{ top: '-85px', height: 'calc(100% + 85px)' }}>
            <iframe 
               src="https://wokwi.com/projects/344891652101374548/embed" 
               width="100%" 
               height="100%" 
               style={{ border: 'none' }}
               title="Wokwi Simulator"
               allow="clipboard-write; fullscreen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
