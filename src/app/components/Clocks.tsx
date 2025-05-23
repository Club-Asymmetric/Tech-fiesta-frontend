"use client";

import AnalogClock from "./AnalogClock";

export default function Clocks() {
  // Define clock sizes
  const centerClockSize = 500;
  const topLeftClockSize = 150;
  const topRightClockSize = 200;
  const bottomLeftClockSize = 180;
  const bottomRightClockSize = 220;
  
  // Additional small clocks
  const smallClockSize = 100;
  const tinyClockSize = 80;
  const microClockSize = 60;

  return (
    <div className="relative min-h-screen w-full">
      {/* Center big clock */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-8">Analog Clock</h1>
        <AnalogClock 
          size={centerClockSize} 
        />
      </div>

      {/* Top Left Clock */}
      <div className="absolute top-8 left-8">
        <AnalogClock 
          size={topLeftClockSize} 
        />
      </div>

      {/* Top Right Clock */}
      <div className="absolute top-8 right-8">
        <AnalogClock 
          size={topRightClockSize} 
        />
      </div>

      {/* Bottom Left Clock */}
      <div className="absolute bottom-8 left-8">
        <AnalogClock 
          size={bottomLeftClockSize} 
          hourHandThickness={bottomLeftClockSize / 120}
          minuteHandThickness={bottomLeftClockSize / 180}
          secondHandThickness={bottomLeftClockSize / 240}
        />
      </div>      {/* Bottom Right Clock */}
      <div className="absolute bottom-8 right-8">
        <AnalogClock 
          size={bottomRightClockSize} 
          hourHandThickness={bottomRightClockSize / 120}
          minuteHandThickness={bottomRightClockSize / 180}
          secondHandThickness={bottomRightClockSize / 240}
        />
      </div>

      {/* Middle Left Clock */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
        <AnalogClock 
          size={smallClockSize}
          hourHandThickness={smallClockSize / 100}
          minuteHandThickness={smallClockSize / 150}
          secondHandThickness={smallClockSize / 200}
        />
      </div>

      {/* Middle Right Clock */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <AnalogClock 
          size={smallClockSize}
          hourHandThickness={smallClockSize / 100}
          minuteHandThickness={smallClockSize / 150}
          secondHandThickness={smallClockSize / 200}
        />
      </div>

      {/* Top Middle Clock */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <AnalogClock 
          size={tinyClockSize}
          hourHandThickness={tinyClockSize / 100}
          minuteHandThickness={tinyClockSize / 150}
          secondHandThickness={tinyClockSize / 200}
        />
      </div>

      {/* Bottom Middle Clock */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <AnalogClock 
          size={tinyClockSize}
          hourHandThickness={tinyClockSize / 100}
          minuteHandThickness={tinyClockSize / 150}
          secondHandThickness={tinyClockSize / 200}
        />
      </div>

      {/* Corner Clocks - Top Left Corner */}
      <div className="absolute top-36 left-36">
        <AnalogClock 
          size={microClockSize}
          hourHandThickness={microClockSize / 100}
          minuteHandThickness={microClockSize / 150}
          secondHandThickness={microClockSize / 200}
        />
      </div>

      {/* Corner Clocks - Top Right Corner */}
      <div className="absolute top-36 right-36">
        <AnalogClock 
          size={microClockSize}
          hourHandThickness={microClockSize / 100}
          minuteHandThickness={microClockSize / 150}
          secondHandThickness={microClockSize / 200}
        />
      </div>

      {/* Corner Clocks - Bottom Left Corner */}
      <div className="absolute bottom-36 left-36">
        <AnalogClock 
          size={microClockSize}
          hourHandThickness={microClockSize / 100}
          minuteHandThickness={microClockSize / 150}
          secondHandThickness={microClockSize / 200}
        />
      </div>

      {/* Corner Clocks - Bottom Right Corner */}
      <div className="absolute bottom-36 right-36">
        <AnalogClock 
          size={microClockSize}
          hourHandThickness={microClockSize / 100}
          minuteHandThickness={microClockSize / 150}
          secondHandThickness={microClockSize / 200}
        />
      </div>
    </div>
  );
}
