import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* 3D Electricity Video Background (Insert your sourced .webm here) */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none mix-blend-multiply flex justify-center items-center">
        {/* <video autoPlay loop muted playsInline className="object-cover w-full h-full">
              <source src="/3d-electricity-loop.webm" type="video/webm" />
            </video> */}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-200 p-6 flex justify-between items-center max-w-7xl mx-auto bg-white/80 backdrop-blur-md">
        <div className="text-xl font-extrabold tracking-tight">JAYLEN SINEGAL</div>
        <button className="bg-white text-black px-6 py-2.5 text-sm font-bold border border-gray-300 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300 rounded-sm">
          Book Consultation
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto text-center">
        <p className="text-blue-600 font-extrabold text-xs tracking-widest uppercase mb-6 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]">
          Executive Strategist • Louisiana Storyteller
        </p>
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
          Initiate Your Athletic or <br /> Brand Evolution.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Architecting modern athlete IP, Louisiana Act 810 compliance, and elite physical development ecosystems across the Gulf Coast.
        </p>
        
        {/* Neon Interactive Authority Bar */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-16">
          <div className="px-4 py-2 border border-gray-200 rounded-full bg-white hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-default">
            <span className="text-xs font-bold text-gray-800 tracking-wide">Official Louisiana Storyteller (LED)</span>
          </div>
          <div className="px-4 py-2 border border-gray-200 rounded-full bg-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 cursor-default">
            <span className="text-xs font-bold text-gray-800 tracking-wide">CBO, FlightTime Athletics LLC</span>
          </div>
          <div className="px-4 py-2 border border-gray-200 rounded-full bg-white hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-default">
            <span className="text-xs font-bold text-gray-800 tracking-wide">M.S. Ent. Business Candidate</span>
          </div>
        </div>
      </section>

      {/* B2B Conversion Block (The Trump NIL Article Route) */}
      <section className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        <div className="bg-white border-2 border-gray-100 p-10 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 group relative overflow-hidden">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <h3 className="text-3xl font-black mb-4 tracking-tight">Is Your Athletic Department Act 810 Compliant?</h3>
          <p className="text-gray-600 text-base mb-8 leading-relaxed font-medium">
            Federal NIL shifts and Louisiana's new Act 810 mandate strict compliance regarding minor consent and LHSAA amateur status. Don't leave your program's eligibility to chance.
          </p>
          <button className="w-full bg-black text-white py-4 text-sm font-black tracking-wide uppercase border border-black hover:bg-transparent hover:text-red-600 hover:border-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all duration-300">
            ▶ Host a Sports IP & NIL Compliance Clinic
          </button>
        </div>
      </section>
    </main>
  );
}
      </section>

      {/* Mandatory Legal Footer */}
      <footer className="border-t border-gray-900 mt-24 py-12 text-center px-6">
        <p className="text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed">
          Jaylen Sinegal provides brand strategy, media education, and IP consulting. He is not a licensed sports agent and does not solicit, negotiate, or procure athletic contracts or employment.
        </p>
      </footer>
    </main>
  );
}
