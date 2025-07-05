import React from "react";

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="bg-gradient-to-t from-black/50 to-black/30 backdrop-blur-md border-t border-white/20 py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 text-center md:text-left">
            <a
              href="https://asymmetric.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 hover:scale-105 transition-transform duration-200 mb-6"
            >
              <img 
                src="/assNo_00000.png" 
                alt="Asymmetric Logo" 
                className="w-12 h-12 object-contain"
              />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all duration-300">
                Asymmetric
              </h3>
            </a>
            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md">
              Empowering the next generation of tech innovators through cutting-edge events, immersive workshops, and a vibrant community ecosystem.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <span className="text-purple-400 font-semibold text-sm">Innovation</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <span className="text-blue-400 font-semibold text-sm">Learning</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <span className="text-green-400 font-semibold text-sm">Community</span>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-white mb-6 relative">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection("about")}
                className="group text-gray-300 hover:text-white transition-all duration-300 text-sm hover:bg-white/10 px-4 py-3 rounded-lg border border-transparent hover:border-white/20 flex items-center justify-center md:justify-start gap-2"
              >
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                About Us
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="group text-gray-300 hover:text-white transition-all duration-300 text-sm hover:bg-white/10 px-4 py-3 rounded-lg border border-transparent hover:border-white/20 flex items-center justify-center md:justify-start gap-2"
              >
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Events
              </button>
              <button
                onClick={() => scrollToSection("workshops")}
                className="group text-gray-300 hover:text-white transition-all duration-300 text-sm hover:bg-white/10 px-4 py-3 rounded-lg border border-transparent hover:border-white/20 flex items-center justify-center md:justify-start gap-2"
              >
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Workshops
              </button>
              <a
                href="mailto:Asymmetric@citchennai.net"
                className="group text-gray-300 hover:text-white transition-all duration-300 text-sm hover:bg-white/10 px-4 py-3 rounded-lg border border-transparent hover:border-white/20 flex items-center justify-center md:justify-start gap-2"
              >
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
          </div>
          {/* Social Links */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-white mb-6 relative">
              Connect With Us
            </h4>
            <div className="flex flex-col space-y-3">
              <a
                href="https://www.instagram.com/clubasymmetric/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-pink-400 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 px-4 py-3 rounded-lg border border-transparent hover:border-pink-400/30"
              >
                <div className="p-2 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="font-medium">Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/club-asymmetric/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-blue-400 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 px-4 py-3 rounded-lg border border-transparent hover:border-blue-400/30"
              >
                <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="font-medium">LinkedIn</span>
              </a>
              <a
                href="https://asymmetric-livid.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-green-400 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 px-4 py-3 rounded-lg border border-transparent hover:border-green-400/30"
              >
                <div className="p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9 9m0 0a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="font-medium">Website</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © 2025 Club Asymmetric. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span>Building the future through technology</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
