import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, ScanSearch, RefreshCcw, Download, Folder } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import type { SavedProject, GeneratedProject } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function ProjectBuilder({ 
  onBack, 
  isDark,
  onSave,
  onSendToStudent,
  initialProject
}: { 
  onBack: () => void, 
  isDark: boolean,
  onSave?: (p: SavedProject) => void,
  onSendToStudent?: (p: SavedProject) => void,
  initialProject?: SavedProject | null
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(initialProject ? 3 : 1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialProject ? initialProject.image : null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  
  const [targetAge, setTargetAge] = useState('10-12 years');
  const [difficulty, setDifficulty] = useState('Beginner');
  
  const [projectData, setProjectData] = useState<GeneratedProject | null>(initialProject ? initialProject.data : null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string;
        const base64String = resultString.split(',')[1];
        setBase64Data(base64String);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const sendToTelegram = async (project: GeneratedProject, age: string) => {
    let token = '';
    // Telegram needs a chat_id. It can be a channel username (like '@my_channel') or a numeric ID (like '-100123456789').
    let chatId = '';

    if (age.includes('10-12')) {
      token = '8555465193:AAFc0XoEmaUCumDcyCvDplwY29B87FxuCek';
      chatId = '-1004326695006';
    } else if (age.includes('13-15')) {
      token = '8361683075:AAEBNAeZRwyfvShVY6jSddm6p8P87BsVtZI';
      chatId = '-1003971229591';
    } else {
      token = '8909776060:AAGwUWsr3zsKp58IHYlBk-Bcwl3O7QZQKzE';
      chatId = '-1004380478869';
    }

    const text = `🚀 Новый проект сгенерирован ИИ! (Возраст: ${age})\n\nНазвание: ${project.projectName}\nТочность распознавания: ${project.confidence}\n\nОписание:\n${project.projectDescription}`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      });
    } catch (e) {
      console.error("Failed to send to TG", e);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !base64Data || !mimeType) return;
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "ВСТАВЬТЕ_СЮДА_ВАШ_КЛЮЧ";
    if (apiKey === "ВСТАВЬТЕ_СЮДА_ВАШ_КЛЮЧ") {
      setError("API Key is missing in .env file");
      return;
    }
    
    setError(null);
    setStep(2);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert engineering AI. The user uploaded an image of hardware components. 
Identify the main hardware modules and provide bounding boxes for them in the format [ymin, xmin, ymax, xmax] (integers 0 to 1000).
Suggest a detailed project that can be built using these exact modules. Provide step-by-step assembly instructions and the complete C++ Arduino code.
Target students: ${targetAge}. Difficulty: ${difficulty}. 
IMPORTANT: Generate the ENTIRE response (project name, description, instructions, code comments, and labels) in Russian language.
Return the output EXACTLY as a raw JSON object with this schema (no markdown, no backticks, just JSON):
{
  "projectName": "Название проекта",
  "projectDescription": "Подробное описание...",
  "confidence": "98%",
  "boundingBoxes": [ { "label": "Датчик движения", "box": [ymin, xmin, ymax, xmax] } ],
  "instructions": ["Шаг 1: ...", "Шаг 2: ..."],
  "arduinoCode": "void setup() {\\n...\\n}"
}`;

      const interaction = await ai.interactions.create({
        model: 'gemini-3.5-flash-lite',
        input: [
          { type: 'image', data: base64Data, mime_type: mimeType },
          { type: 'text', text: prompt }
        ]
      });

      let text = interaction.output_text || "{}";
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(text) as GeneratedProject;
        setProjectData(parsed);
        sendToTelegram(parsed, targetAge);
        setStep(3);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate curriculum.");
      setStep(1);
    }
  };

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const element = printRef.current;
    
    // Temporarily hide action buttons during PDF generation
    const actionButtons = element.querySelector('.action-buttons');
    if (actionButtons) (actionButtons as HTMLElement).style.display = 'none';
    
    const opt = {
      margin:       10,
      filename:     `${projectData?.projectName || 'Project'}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      if (actionButtons) (actionButtons as HTMLElement).style.display = 'grid';
    });
  };

  const handleReset = () => {
    setStep(1);
    setUploadedImage(null);
    setBase64Data(null);
    setMimeType(null);
    setProjectData(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`max-w-5xl mx-auto h-full flex flex-col pb-10 ${isDark ? 'text-white' : 'text-black'}`}
    >
      {step === 1 && (
        <header className="mb-10 flex items-center gap-4">
          <button onClick={onBack} className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#222]' : 'hover:bg-gray-200'}`}>
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
          </button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">New Project</h1>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 pb-12"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-3">
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Settings Form */}
              <div className={`rounded-3xl p-8 space-y-6 border flex flex-col ${isDark ? 'bg-[#111] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="text-lg font-semibold">Parameters</h3>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Target Age</label>
                    <select 
                      value={targetAge}
                      onChange={(e) => setTargetAge(e.target.value)}
                      className={`w-full rounded-xl px-4 py-3 outline-none transition-colors appearance-none cursor-pointer border ${
                        isDark ? 'bg-[#1A1A1C] border-[#333] text-white focus:border-white' : 'bg-white border-gray-300 text-black focus:border-black'
                      }`}
                    >
                      <option>10-12 years</option>
                      <option>13-15 years</option>
                      <option>16+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Difficulty Level</label>
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className={`w-full rounded-xl px-4 py-3 outline-none transition-colors appearance-none cursor-pointer border ${
                        isDark ? 'bg-[#1A1A1C] border-[#333] text-white focus:border-white' : 'bg-white border-gray-300 text-black focus:border-black'
                      }`}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hardware Upload */}
              <div className={`rounded-3xl p-8 flex flex-col border ${isDark ? 'bg-[#111] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-2">Hardware Scanning</h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Upload a photo of your available modules.</p>
                
                <label className={`flex-1 min-h-[200px] border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group ${
                  isDark ? 'border-[#444] hover:border-[#666] bg-[#1A1A1C]' : 'border-gray-300 hover:border-gray-500 bg-white'
                }`}>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Hardware" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="text-center p-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`}>
                        <Upload className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      </div>
                      <p className="text-sm font-medium">Select photo</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleGenerate} 
                disabled={!uploadedImage}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  !uploadedImage 
                    ? (isDark ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                    : (isDark ? 'bg-white text-black active:scale-95 hover:bg-gray-200' : 'bg-black text-white active:scale-95 hover:bg-gray-800')
                }`}
              >
                Generate Curriculum
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
             <ScanSearch className={`w-12 h-12 animate-pulse mb-6 ${isDark ? 'text-white' : 'text-black'}`} />
             <h2 className="text-2xl font-semibold mb-2 tracking-tight">Анализируем детали...</h2>
             <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Искусственный интеллект определяет компоненты и придумывает проект.</p>
          </motion.div>
        )}

        {step === 3 && projectData && (
           <motion.div 
             key="step3"
             ref={printRef}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`max-w-4xl mx-auto w-full space-y-6 pb-20 ${isDark ? 'text-white' : 'text-black'}`}
           >
             {/* Image with bounding boxes */}
             <div className="relative rounded-3xl overflow-hidden shadow-xl bg-black flex justify-center w-full max-h-[500px] border border-[#333]">
               {/* This inner div scales exactly to the image's rendered dimensions */}
               <div className="relative inline-block h-full">
                 <img src={uploadedImage!} alt="Analyzed Hardware" className="h-full w-auto object-contain opacity-90" />
                 
                 {/* Draw Bounding Boxes */}
                 {projectData.boundingBoxes.map((bbox, idx) => {
                   const [ymin, xmin, ymax, xmax] = bbox.box;
                   const top = `${(ymin / 1000) * 100}%`;
                   const left = `${(xmin / 1000) * 100}%`;
                   const height = `${((ymax - ymin) / 1000) * 100}%`;
                   const width = `${((xmax - xmin) / 1000) * 100}%`;
                   
                   return (
                     <div 
                       key={idx}
                       className="absolute border-2 border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                       style={{ top, left, width, height }}
                     >
                       <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 whitespace-nowrap rounded-t">
                         {bbox.label} ({projectData.confidence})
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>

             {/* Results Card */}
             <div className={`rounded-3xl p-8 border shadow-sm ${isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-gray-200'}`}>
                
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#1A1A1C] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-xs font-bold tracking-wider mb-2 uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Уровень проекта</p>
                    <p className="text-xl font-bold">{difficulty}</p>
                  </div>
                  
                  <div className={`md:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-[#1A1A1C] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-xs font-bold tracking-wider mb-2 uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Вердикт нейросети: {projectData.projectName}</p>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {projectData.projectDescription}
                    </p>
                  </div>
                </div>

                {/* Instructions & Code */}
                <div className="space-y-6 mb-10">
                  <div className={`p-8 rounded-3xl border ${isDark ? 'bg-[#1A1A1C] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                    <h3 className={`text-sm font-bold tracking-wider mb-6 uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Инструкция по сборке</h3>
                    <ul className="space-y-4">
                      {projectData.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border ${
                            isDark ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'
                          }`}>
                            {idx + 1}
                          </div>
                          <p className={`text-sm pt-1.5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-8 rounded-3xl border overflow-hidden ${isDark ? 'bg-[#1A1A1C] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                    <h3 className={`text-sm font-bold tracking-wider mb-6 uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Код для Arduino</h3>
                    <div className={`rounded-xl p-6 overflow-x-auto text-sm font-mono border whitespace-pre-wrap ${isDark ? 'bg-black border-[#333] text-green-400' : 'bg-white border-gray-200 text-green-700'}`}>
                      {projectData.arduinoCode}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 action-buttons">
                  <button 
                    onClick={handleDownloadPDF}
                    className={`py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border ${
                      isDark ? 'bg-[#1C1C1E] border-[#333] hover:bg-[#2C2C2E]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    Скачать PDF
                  </button>
                  <button 
                    onClick={() => {
                      if (onSave && projectData && uploadedImage) {
                        onSave({
                          id: Math.random().toString(36).substr(2, 9),
                          date: new Date().toISOString(),
                          image: uploadedImage,
                          data: projectData
                        });
                      }
                    }}
                    className={`py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border ${
                      isDark ? 'bg-[#1C1C1E] border-[#333] hover:bg-[#2C2C2E]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Folder className="w-5 h-5" />
                    В Библиотеку
                  </button>
                  <button 
                    onClick={() => {
                      if (onSendToStudent && projectData && uploadedImage) {
                        onSendToStudent({
                          id: Math.random().toString(36).substr(2, 9),
                          date: new Date().toISOString(),
                          image: uploadedImage,
                          data: projectData
                        });
                      }
                    }}
                    className={`py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border ${
                      isDark ? 'bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                    Отправить ученикам
                  </button>
                  <button 
                    onClick={handleReset}
                    className={`py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border ${
                      isDark ? 'bg-[#1C1C1E] border-[#333] hover:bg-[#2C2C2E]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Новое фото
                  </button>
                </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
