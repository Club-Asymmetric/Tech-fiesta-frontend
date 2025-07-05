"use client";

import { useState } from "react";
import GooeyNav from "./ReactBits/GooeyNav/GooeyNav";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  // Define navigation items for GooeyNav
  const navItems = [
    { label: "About", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Workshops", href: "#workshops" },
    { label: "Register", href: "/registration" },
  ];

  // Handle navigation clicks
  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) {
      // External route - navigate to page
      window.location.href = href;
    } else {
      // Internal anchor - scroll to section
      const sectionId = href.replace("#", "");
      scrollToSection(sectionId);
    }
  };

  return (
    <>
      <nav className="fixed top-4 left-0 z-50 w-full flex justify-center pointer-events-none animate-[slideDown_0.4s_ease-out_forwards]">
        <style jsx>{`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .glassmorphism {
            background: rgba(10, 10, 10, 0.9);
          }
          @keyframes slideInFromTop {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .mobile-nav-button {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.2s ease;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
          }
          .mobile-nav-button:active {
            background: rgba(255, 255, 255, 0.35);
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          .mobile-overlay {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>

        {/* Main navbar container */}
        <div className="glassmorphism rounded-full px-4 py-3 relative overflow-hidden pointer-events-auto max-w-3xl w-full mx-3 sm:mx-4 flex justify-center">
          <div className="flex items-center justify-between w-full">
            {/* Asymmetric Logo */}
            <div className="flex-shrink-0 relative top-1 sm:top-0.5">
              <a
                href="https://asymmetric.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:scale-x-110 transition-transform duration-200"
              >
                <img 
                  src="/assNo_00000.png" 
                  alt="Asymmetric Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain flex-shrink-0"
                />
                <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-wider cursor-pointer bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-all duration-300 leading-none flex items-center">
                  Asymmetric
                </h1>
              </a>
            </div>

            {/* Desktop GooeyNav */}
            <div className="hidden lg:flex flex-1 justify-center pl-10">
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  const target = e.target as HTMLElement;
                  const anchor = target.closest('a');
                  if (anchor && anchor.getAttribute('href')) {
                    handleNavClick(anchor.getAttribute('href')!);
                  }
                }}
              >
                <GooeyNav 
                  items={navItems}
                  initialActiveIndex={0}
                />
              </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="lg:hidden flex items-center justify-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 relative z-10 rounded-md hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {!isMenuOpen ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay and Dropdown */}
      {isMenuOpen && (
        <>
          {/* Semi-transparent overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/25 backdrop-blur-sm z-40 mobile-overlay"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Mobile menu */}
          <div className="lg:hidden fixed top-20 left-3 right-3 z-50 pointer-events-auto">
            <div className="mobile-glassmorphism rounded-xl px-4 py-4">
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => scrollToSection("events")}
                >
                  Events
                </button>
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => scrollToSection("workshops")}
                >
                  Workshops
                </button>
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => window.location.href = "/registration"}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
