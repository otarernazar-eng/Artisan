import { motion } from 'framer-motion';
import { Code, Target, ArrowRight, Zap, Users, Map, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onLoginTeacher: () => void;
  onLoginStudent: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage({ onLoginTeacher, onLoginStudent }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo-star.png" alt="Logo" className="w-10 h-10 invert mix-blend-screen opacity-90" />
          </div>
          <span className="text-xl font-bold tracking-tight">ARTISAN</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={onLoginStudent}
            className="hidden md:block px-5 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Вход для ученика
          </button>
          <button 
            onClick={onLoginTeacher}
            className="px-5 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Вход для учителя
          </button>
        </div>
      </nav>

      <main className="pt-32">
        {/* 1. Hero Section */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-12 pb-20">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center relative z-10"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono mb-8 uppercase tracking-widest text-gray-400">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Artisan Education
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              ВЗРАЩИВАЕМ НОВАТОРОВ, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">ОТКРЫТЫХ К НОВОМУ</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
              Практическая робототехника, электроника, программирование и IoT для школьников Казахстана.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={onLoginStudent} className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
                Начать обучение <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={onLoginTeacher} className="w-full sm:w-auto px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors duration-300">
                Смотреть демо
              </button>
            </motion.div>
          </motion.div>

          {/* Abstract PCB Lines Background */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 1000 1000" className="w-full h-full min-w-[800px] stroke-white stroke-[0.5]" fill="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                d="M100,500 L300,500 L350,450 L600,450 L650,500 L900,500" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
                d="M200,800 L250,750 L400,750 L450,600 L600,600" 
              />
              <circle cx="350" cy="450" r="4" fill="white" />
              <circle cx="650" cy="500" r="4" fill="white" />
              <circle cx="450" cy="600" r="4" fill="white" />
            </svg>
          </div>
        </section>

        {/* 2. Mission */}
        <section className="py-24 px-6 md:px-12 border-t border-white/10 bg-[#0f0f0f]">
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-4xl">
              Artisan Education пробуждает природную любознательность каждого ребёнка, раскрывает творческий потенциал и делает инженерное образование доступным — особенно в сельских школах.
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                { icon: Target, title: 'Индивидуальные программы', desc: 'Адаптивное обучение под темп ученика.' },
                { icon: Zap, title: 'Реальные навыки', desc: 'Фокус на практическом применении.' },
                { icon: Users, title: 'Учитель как наставник', desc: 'Современные инструменты для педагогов.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="p-6 border border-white/10 hover:border-white/30 transition-colors group">
                  <item.icon className="w-8 h-8 text-gray-500 mb-6 group-hover:text-white transition-colors" />
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 3. Platform */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="mb-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Программное обеспечение</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight mb-6">ОБРАЗОВАТЕЛЬНАЯ ПЛАТФОРМА, КОТОРАЯ УЧИТ ДУМАТЬ</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-gray-400 mb-8 font-light">
                Адаптивное обучение, встроенный симулятор, текстовое и блочное программирование, автоматическая проверка кода и индивидуальные траектории для каждого ученика.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-4">
                {['Мгновенная обратная связь', 'Встроенный симулятор IoT', 'Инструменты аналитики для школ'].map((li, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 text-gray-300">
                    <Code className="w-5 h-5 text-gray-500" /> {li}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            
            {/* Mock IDE */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl overflow-hidden bg-[#050505] shadow-2xl relative group"
            >
              <div className="flex border-b border-white/10 bg-[#0a0a0a] px-4 py-3 items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="ml-4 text-xs font-mono text-gray-500">main.py</div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed text-gray-300">
                <span className="text-gray-500">import</span> artisan<br/>
                <span className="text-gray-500">from</span> machine <span className="text-gray-500">import</span> Pin<br/><br/>
                led = Pin(2, Pin.OUT)<br/>
                sensor = artisan.Temperature()<br/><br/>
                <span className="text-gray-500">while</span> True:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;temp = sensor.read()<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">if</span> temp &gt; 25:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;led.value(1) <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-white ml-2 shadow-[0_0_10px_white]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* 4. Hardware */}
        <section className="py-32 px-6 md:px-12 border-t border-white/10 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Mock Hardware Configurator */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] border border-white/10 flex items-center justify-center overflow-hidden group bg-[#0a0a0a]"
            >
              {/* Central Pi Pico Wireframe */}
              <div className="w-32 h-48 border-2 border-white relative z-10 flex flex-col justify-between p-2 bg-black">
                <div className="text-[10px] font-mono text-center mb-1">Pi Pico W</div>
                <div className="w-full flex-1 border border-white/30 grid grid-cols-2 gap-1 p-1">
                  <div className="bg-white/20" /><div className="bg-white/20" />
                  <div className="bg-white/20" /><div className="bg-white/20" />
                </div>
                {/* Connecting dots */}
                <div className="absolute -left-1 top-1/4 w-2 h-2 bg-white" />
                <div className="absolute -right-1 top-3/4 w-2 h-2 bg-white" />
              </div>

              {/* Module 1 */}
              <motion.div 
                animate={{ x: [-20, 0, -20] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-8 top-1/4 flex items-center"
              >
                <div className="w-16 h-16 border border-white/50 flex items-center justify-center text-xs font-mono bg-[#0a0a0a] z-10">LED</div>
                <div className="w-24 h-[1px] bg-white/50" />
              </motion.div>

              {/* Module 2 */}
              <motion.div 
                animate={{ x: [20, 0, 20] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-8 top-3/4 flex items-center"
              >
                <div className="w-24 h-[1px] bg-white/50" />
                <div className="w-16 h-16 border border-white/50 flex items-center justify-center text-xs font-mono bg-[#0a0a0a] z-10">TEMP</div>
              </motion.div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-first lg:order-last">
              <motion.div variants={fadeUp} className="mb-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Аппаратное обеспечение</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight mb-6">НАБОРЫ БЕЗ ПАЙКИ И ПРОВОДОВ</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-gray-400 mb-8 font-light">
                Построены на базе Raspberry Pi Pico W. Магнитные plug-and-play соединения позволяют моментально прототипировать IoT и AI-проекты, концентрируясь на сути инженерии.
              </motion.p>
              <motion.button variants={fadeUp} className="px-6 py-3 border border-white/20 hover:border-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                Изучить модули PiBody <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* 5. Numbers */}
        <section className="py-32 px-6 md:px-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-5 gap-8 border-y border-white/10 py-16"
            >
              {[
                { val: '3252', label: 'Ученика' },
                { val: '235', label: 'Школ' },
                { val: '68%', label: 'Сельских школ' },
                { val: '250+', label: 'Учителей' },
                { val: '+30%', label: 'Рост интереса' },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{stat.val}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-8 text-gray-500 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              <Map className="w-4 h-4" /> Работаем в 10 регионах Казахстана
            </div>
          </div>
        </section>

        {/* 6. Target & Team & Testimonials Grid */}
        <section className="py-24 px-6 md:px-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* For Whom */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h3 variants={fadeUp} className="text-2xl font-bold mb-6">ДЛЯ КОГО ЭТО СОЗДАНО</motion.h3>
              <motion.p variants={fadeUp} className="text-gray-400 font-light text-lg mb-8">
                Разработано для учеников средних и старших классов, учителей информатики и школ. Мы делаем особенно сильный акцент на обеспечение качественным STEM-образованием сельские и малые школы.
              </motion.p>
              
              <motion.h3 variants={fadeUp} className="text-2xl font-bold mb-6 mt-16">НАША КОМАНДА</motion.h3>
              <motion.p variants={fadeUp} className="text-gray-400 font-light text-lg">
                Создано выпускниками Назарбаев Университета. Мы — команда инженеров и педагогов, которые сами прошли путь от увлеченных студентов до создателей масштабной образовательной платформы.
              </motion.p>
            </motion.div>

            {/* Testimonials */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              {[
                { quote: "В начале казалось, что это сложно, но проекты на Artisan всё объяснили. Я сам собираю то, что реально работает.", author: "Амирали Бектурганов", role: "Ученик 10 класса" },
                { quote: "Магнитные соединения избавляют от путаницы в проводах. Потенциал у платформы просто огромный.", author: "Адильбек Бердиходжаев", role: "Тренер по робототехнике" },
                { quote: "Ученики быстро вовлекаются, платформа поощряет самостоятельное мышление, а учителям стало легче готовить уроки.", author: "Шерхан Сауыртаев", role: "Заместитель директора" }
              ].map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="p-6 border border-white/10 hover:border-white/30 transition-colors">
                  <MessageSquare className="w-5 h-5 text-gray-600 mb-4" />
                  <p className="text-gray-300 italic mb-4">«{t.quote}»</p>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wider">{t.author}</div>
                    <div className="text-xs text-gray-500 font-mono">{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* 9. Final CTA */}
        <section className="py-40 px-6 md:px-12 text-center border-t border-white/10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter mb-12">
              ПРИСОЕДИНЯЙТЕСЬ К ШКОЛАМ, МЕНЯЮЩИМ ПОДХОД К STEM
            </motion.h2>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={onLoginTeacher} className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold hover:scale-105 transition-transform duration-300 text-lg">
                Стать школой-партнёром
              </button>
              <button className="w-full sm:w-auto px-10 py-5 border border-white/20 font-bold hover:bg-white/5 transition-colors duration-300 text-lg">
                Связаться с нами
              </button>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs font-mono text-gray-600 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Artisan Education. Строгая инженерия.
      </footer>
    </div>
  );
}
