"use client";

import { useState } from "react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          .glassmorphism {
            background: rgba(255, 255, 255, 0.45);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
          }
          .mobile-glassmorphism {
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.7);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
            animation: slideInFromTop 0.3s ease-out forwards;
          }
          .nav-button {
            position: relative;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.35);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
          }

          .nav-button:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.45);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2),
              0 2px 6px rgba(255, 255, 255, 0.25) inset;
            cursor: pointer;
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

          .register-button {
            position: relative;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.25),
              rgba(255, 255, 255, 0.2)
            );
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.25);
          }

          .register-button:hover {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.35),
              rgba(255, 255, 255, 0.25)
            );
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.22),
              0 2px 8px rgba(255, 255, 255, 0.3) inset;
            cursor: pointer;
          }

          .mobile-register-button {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.3),
              rgba(255, 255, 255, 0.25)
            );
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          }

          .mobile-register-button:active {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.4),
              rgba(255, 255, 255, 0.3)
            );
            transform: scale(0.98);
          } /* Mobile overlay */
          .mobile-overlay {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>{" "}
        {/* Main navbar container */}
        <div className="glassmorphism rounded-full px-3 sm:px-4 lg:px-5 py-3 sm:py-3.5 lg:py-4 relative overflow-hidden pointer-events-auto max-w-2xl w-full mx-3 sm:mx-4 flex justify-center">
          <div className="flex items-center justify-between px-2 sm:px-3 lg:px-3 w-full">
            {/* Asymmetric Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-wider cursor-pointer bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Asymmetric
              </h1>
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="hidden lg:flex items-center space-x-1">
              <button className="nav-button text-white px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:text-gray-100">
                About
              </button>
              <button className="nav-button text-white px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:text-gray-100">
                Events
              </button>
              <button className="nav-button text-white px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:text-gray-100">
                Workshops
              </button>
              <button className="register-button text-white px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:text-gray-100">
                Register
              </button>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="lg:hidden flex items-center justify-center">
              <button
                onClick={toggleMenu}
                className="p-2 relative z-10 rounded-md hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {!isMenuOpen ? (
                  // Hamburger Icon
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
                  // Close Icon
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
          <div className="lg:hidden fixed top-14 left-3 right-3 z-50 pointer-events-auto">
            <div className="mobile-glassmorphism rounded-xl px-4 py-4">
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </button>
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </button>
                <button
                  className="mobile-nav-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Workshops
                </button>
                <button
                  className="mobile-register-button text-white px-4 py-3.5 rounded-lg text-sm font-medium text-center w-full mt-1"
                  onClick={() => setIsMenuOpen(false)}
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
