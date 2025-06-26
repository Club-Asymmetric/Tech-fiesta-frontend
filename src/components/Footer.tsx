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
    <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {" "}
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <a
              href="https://asymmetric.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 hover:from-blue-200 hover:to-purple-200 transition-all duration-300">
                Asymmetric
              </h3>
            </a>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Empowering tech enthusiasts through innovative events, workshops,
              and community building. Join us in shaping the future of
              technology.
            </p>
            <div className="text-gray-400 text-xs">
              <p>Building Tomorrow's Tech Leaders</p>
              <p className="mt-1">Innovation • Learning • Community</p>
            </div>
          </div>
          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:bg-white/5 px-3 py-2 rounded-md"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:bg-white/5 px-3 py-2 rounded-md"
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection("workshops")}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:bg-white/5 px-3 py-2 rounded-md"
              >
                Workshops
              </button>{" "}
              <a
                href="mailto:Asymmetric@citchennai.net"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:bg-white/5 px-3 py-2 rounded-md"
              >
                Email Us
              </a>
            </div>
          </div>
          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-white mb-4">
              Connect With Us
            </h4>
            <div className="flex flex-col space-y-3">
              {" "}
              <a
                href="https://www.instagram.com/clubasymmetric/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center md:justify-end space-x-2 text-gray-300 hover:text-pink-400 transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/club-asymmetric/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center md:justify-end space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://asymmetric-livid.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center md:justify-end space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.429 2.571A8.571 8.571 0 0112 11.143 8.571 8.571 0 0120.571 2.571 8.571 8.571 0 0112 11.143 8.571 8.571 0 013.429 2.571zM12 24a12 12 0 100-24 12 12 0 000 24zm0-2.286A9.714 9.714 0 1112 2.286a9.714 9.714 0 010 19.428z" />
                </svg>
                <span className="text-sm">Website</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Club Asymmetric. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Building the future through technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
