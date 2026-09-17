// React import removed

export default function SimulatorPreview() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#e0e0e0] flex items-center justify-center">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Fake Arduino Board */}
      <div className="relative w-80 h-56 bg-[#006468] rounded-xl shadow-xl flex items-center justify-center border-4 border-[#005a5e] rotate-[-2deg] hover:rotate-0 transition-transform duration-500 z-10">
        <div className="absolute top-2 left-2 text-white/50 text-xs font-bold">ARDUINO UNO</div>
        
        {/* USB Port */}
        <div className="absolute top-8 -left-4 w-12 h-16 bg-[#c0c0c0] rounded-sm border-2 border-gray-400" />
        {/* Power Jack */}
        <div className="absolute bottom-4 -left-3 w-8 h-12 bg-[#111] rounded-sm border-2 border-black" />
        
        {/* Digital Pins */}
        <div className="absolute top-2 right-4 flex gap-1">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="w-3 h-4 bg-black border border-gray-700" />
          ))}
        </div>
        {/* Analog Pins */}
        <div className="absolute bottom-2 right-12 flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-3 h-4 bg-black border border-gray-700" />
          ))}
        </div>
        {/* Microcontroller */}
        <div className="w-24 h-8 bg-black rounded-sm border border-gray-800" />
      </div>

      {/* Fake Breadboard */}
      <div className="relative w-96 h-32 bg-white rounded-lg shadow-lg ml-8 border-b-4 border-gray-300 z-10 flex flex-col justify-between p-2">
        <div className="flex justify-between px-4">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-300 rounded-full" />
          ))}
        </div>
        <div className="h-2 w-full bg-gray-100" />
        <div className="flex justify-between px-4">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-300 rounded-full" />
          ))}
        </div>
      </div>

      {/* Wire (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <path 
          d="M 350 250 C 350 150, 450 150, 480 200" 
          fill="none" 
          stroke="#FF0000" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        <path 
          d="M 320 250 C 320 350, 420 350, 460 280" 
          fill="none" 
          stroke="#000000" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
}
