import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-blue-600">
      {/* Navigation */}
      <nav className="border-b border-gray-800 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight">JAYLEN SINEGAL</div>
        <div className="space-x-8 text-sm text-gray-300 hidden md:flex font-medium">
          <Link href="#advisory" className="hover:text-white transition">Advisory</Link>
          <Link href="#clinics" className="hover:text-white transition">IP Clinics</Link>
          <Link href="#ventures" className="hover:text-white transition">Ventures</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
        </div>
        <button className="bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 transition rounded-sm">
          Book Consultation
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 max-w-5xl mx-auto text-center">
        <p className="text-blue-500 font-bold text-xs tracking-widest uppercase mb-6">
          Executive Strategist • Louisiana Storyteller
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
          Initiate Your Athletic or <br /> Brand Evolution.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Architecting modern athlete IP, Louisiana Act 810 compliance, and elite physical development ecosystems across the Gulf Coast.
        </p>
        
        {/* Authority Bar */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 font-semibold tracking-wide mb-16 uppercase">
          <span className="border border-gray-800 px-3 py-1 rounded-full">Louisiana Storyteller (LED)</span>
          <span className="border border-gray-800 px-3 py-1 rounded-full">M.S. Entertainment Business Candidate</span>
          <span className="border border-gray-800 px-3 py-1 rounded-full">NSCS Member</span>
          <span className="border border-gray-800 px-3 py-1 rounded-full">CBO, FlightTime Athletics</span>
        </div>
      </section>

      {/* 3-Track Conversion Matrix */}
      <section className="px-6 py-12 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        
        {/* Path A */}
        <div id="advisory" className="bg-gray-900 border border-gray-800 p-10 hover:border-blue-500 transition flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Executive Advisory</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">For elite prep athletes and families seeking independent media architecture.</p>
            <ul className="text-sm text-gray-300 space-y-4 mb-8">
              <li className="flex gap-2"><span>✓</span> Digital profile & IP audits</li>
              <li className="flex gap-2"><span>✓</span> Highlight media strategy</li>
              <li className="flex gap-2"><span>✓</span> Escaping platform lock-in (Hudl)</li>
            </ul>
          </div>
          <button className="w-full border border-white py-3.5 text-sm font-semibold hover:bg-white hover:text-black transition">
            Schedule Strategy Call
          </button>
        </div>

        {/* Path B */}
        <div id="clinics" className="bg-gray-900 border border-gray-800 p-10 hover:border-yellow-500 transition flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg">B2B Priority</div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Sports IP Clinics</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">For High Schools, Athletic Directors, and Travel Clubs.</p>
            <ul className="text-sm text-gray-300 space-y-4 mb-8">
              <li className="flex gap-2"><span>✓</span> Louisiana Act 810 Compliance</li>
              <li className="flex gap-2"><span>✓</span> LHSAA amateur status protection</li>
              <li className="flex gap-2"><span>✓</span> Sports music licensing & DMCA audits</li>
            </ul>
          </div>
          <button className="w-full bg-[#F59E0B] text-black py-3.5 text-sm font-semibold hover:bg-yellow-400 transition">
            Host a Clinic
          </button>
        </div>

        {/* Path C */}
        <div id="ventures" className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-10 hover:border-blue-500 transition flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Ventures</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Flagship Case Study: FlightTime Athletics LLC.</p>
            <ul className="text-sm text-gray-300 space-y-4 mb-8">
              <li className="flex gap-2"><span>✓</span> Standardized Combine Testing (40-yd dash, 5-10-5 agility, vertical jump)</li>
              <li className="flex gap-2"><span>✓</span> AI-driven athlete metric tracking</li>
              <li className="flex gap-2"><span>✓</span> Invitational "Flight Night" showcases</li>
            </ul>
          </div>
          <Link href="https://www.flighttimeathleticsllc.com" target="_blank" className="block text-center w-full bg-blue-600 text-white py-3.5 text-sm font-semibold hover:bg-blue-500 transition">
            Explore FlightTime Academy →
          </Link>
        </div>

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
