"use client";

export default function NavBar() {
  return (
    <nav className="fixed top-6 left-0 z-50 w-full flex justify-center pointer-events-none animate-[slideDown_0.4s_ease-out_forwards]">
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
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px); /* For Safari */
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .nav-button {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(255, 255, 255, 0.1) inset;
          cursor: pointer;
        }
        .register-button {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .register-button:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.18),
            rgba(255, 255, 255, 0.08)
          );
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12),
            0 2px 6px rgba(255, 255, 255, 0.15) inset;
          cursor: pointer;
        }
      `}</style>
      {/* Main oval container */}
      <div className="glassmorphism rounded-full px-8 py-4 relative overflow-hidden pointer-events-auto max-w-3xl w-full flex justify-center">
        <div className="flex items-center justify-between px-5 w-full">
          {/* Asymmetric Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold tracking-wider cursor-pointer bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Asymmetric
            </h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <button className="nav-button text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:text-gray-100">
              About
            </button>
            <button className="nav-button text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:text-gray-100">
              Events
            </button>
            <button className="nav-button text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:text-gray-100">
              Workshops
            </button>
            <button className="register-button text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:text-gray-100">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
