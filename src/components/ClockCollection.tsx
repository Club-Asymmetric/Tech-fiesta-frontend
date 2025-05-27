"use client";

import React, { useEffect, useState } from 'react';
import AnalogClock from './AnalogClock';

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
  onReady?: () => void;
}

const ClockCollection = ({ 
  mainClockSize = 400, 
  smallClockCount = 60,
  onReady
}: ClockCollectionProps) => {
  const [viewportSize, setViewportSize] = useState<{ width: number, height: number } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized && viewportSize && onReady) {
      const timer = setTimeout(() => {
        onReady();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, viewportSize, onReady]);

  const getResponsiveSizes = () => {
    if (!viewportSize) return { mainSize: mainClockSize, smallCount: smallClockCount };
    
    const { width, height } = viewportSize;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    let responsiveMainSize = mainClockSize;
    let responsiveSmallCount = smallClockCount;    if (isMobile) {
      responsiveMainSize = Math.min(mainClockSize * 0.6, width * 0.6, height * 0.4);
      responsiveSmallCount = Math.min(Math.max(70, Math.floor(smallClockCount * 1.3)), 90);
    } else if (isTablet) {
      responsiveMainSize = Math.min(mainClockSize * 0.8, width * 0.5, height * 0.5);
      responsiveSmallCount = Math.min(Math.max(80, Math.floor(smallClockCount * 1.5)), 110);
    } else {
      responsiveMainSize = Math.min(mainClockSize, width * 0.4, height * 0.6);
      responsiveSmallCount = Math.min(Math.max(90, Math.floor(smallClockCount * 1.8)), 130);
    }
    
    return {
      mainSize: Math.max(200, responsiveMainSize),
      smallCount: responsiveSmallCount 
    };
  };

  const generateClocks = () => {
    const clocks: Array<{
      x: number;
      y: number;
      size: number;
      hourHandThickness: number;
      minuteHandThickness: number;
      secondHandThickness: number;
      zone: string;
      variant: number; // Add variant property
    }> = [];
    
    const { mainSize, smallCount } = getResponsiveSizes();
    
    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;
    
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;    let sizes;
    if (isMobile) {
      sizes = [
        { min: 25, max: 55, weight: 0.55 },
        { min: 55, max: 80, weight: 0.25 },
        { min: 80, max: 110, weight: 0.15 },
        { min: 110, max: 140, weight: 0.05 }
      ];
    } else if (isTablet) {
      sizes = [
        { min: 35, max: 70, weight: 0.5 },
        { min: 70, max: 105, weight: 0.3 },
        { min: 105, max: 140, weight: 0.15 },
        { min: 140, max: 180, weight: 0.05 }
      ];
    } else {
      sizes = [
        { min: 40, max: 85, weight: 0.45 },
        { min: 85, max: 130, weight: 0.3 },
        { min: 130, max: 175, weight: 0.2 },
        { min: 175, max: 220, weight: 0.05 }
      ];
    }
    
    const mainClockRadius = mainSize / 2;
    const avoidZoneRadius = mainClockRadius + 40;
    
    const getRandomSize = () => {
      const rand = Math.random();
      let cumulativeWeight = 0;
      
      for (const sizeRange of sizes) {
        cumulativeWeight += sizeRange.weight;
        if (rand <= cumulativeWeight) {
          return Math.floor(sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min));
        }
      }
      return sizes[0].min;
    };
      // Function to get random variant (0-7 for 8 different clock designs)
    const getRandomVariant = () => {
      return Math.floor(Math.random() * 8);
    };
    
    const isTooCloseToMainClock = (x: number, y: number, radius: number) => {
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      return distanceFromCenter < (avoidZoneRadius + radius);
    };
      const gridSize = isMobile ? 40 : isTablet ? 50 : 60; // Smaller grid for more clocks
    const extendedWidth = width * 1.4; // Increase coverage area
    const extendedHeight = height * 1.4;
    
    const cols = Math.ceil(extendedWidth / gridSize);
    const rows = Math.ceil(extendedHeight / gridSize);
    
    const allPositions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col * gridSize) - (extendedWidth / 2) + (gridSize / 2);
        const y = (row * gridSize) - (extendedHeight / 2) + (gridSize / 2);
        
        const randomX = x + (Math.random() - 0.5) * gridSize * 0.7;
        const randomY = y + (Math.random() - 0.5) * gridSize * 0.7;
        
        allPositions.push({ x: randomX, y: randomY, row, col });
      }
    }
    
    // Shuffle positions for random placement
    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }    let placed = 0;
    const targetCount = Math.min(smallCount, 130); // Increase cap to 130 clocks maximum
    
    for (const pos of allPositions) {
      if (placed >= targetCount) break;
      
      const size = getRandomSize();
      const radius = size / 2;
      
      if (isTooCloseToMainClock(pos.x, pos.y, radius)) {
        continue;
      }
      
      let completeOverlap = false;
      for (const existingClock of clocks) {
        const distance = Math.sqrt((pos.x - existingClock.x) ** 2 + (pos.y - existingClock.y) ** 2);
        const minDistance = Math.max(2, Math.min(radius, existingClock.size / 2) * 0.02); // Allow more overlap for coverage
        if (distance < minDistance) {
          completeOverlap = true;
          break;
        }
      }
      
      if (!completeOverlap) {
        const hourHandThickness = Math.max(0.8, size / 80);  
        const minuteHandThickness = Math.max(0.6, size / 120);
        const secondHandThickness = Math.max(0.4, size / 160);
        
        clocks.push({
          x: pos.x, 
          y: pos.y, 
          size, 
          hourHandThickness, 
          minuteHandThickness, 
          secondHandThickness,
          zone: `grid-${pos.row}-${pos.col}`,
          variant: getRandomVariant() // Assign random variant
        });
        placed++;
      }
    }    // Add additional random clocks
    let extraAttempts = 0;
    const extraTarget = Math.min(placed + 25, targetCount, 130); // Increase extra clocks and ensure we don't exceed 130 total
    
    while (clocks.length < extraTarget && extraAttempts < 100) {
      extraAttempts++;
      
      const x = (Math.random() - 0.5) * extendedWidth;
      const y = (Math.random() - 0.5) * extendedHeight;
      const size = getRandomSize();
      const radius = size / 2;
      
      if (isTooCloseToMainClock(x, y, radius)) {
        continue;
      }
      
      let tooClose = false;
      for (const existingClock of clocks) {
        const distance = Math.sqrt((x - existingClock.x) ** 2 + (y - existingClock.y) ** 2);
        if (distance < 1.5) { // Allow even closer placement for better coverage
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        const hourHandThickness = Math.max(0.8, size / 80);  
        const minuteHandThickness = Math.max(0.6, size / 120);
        const secondHandThickness = Math.max(0.4, size / 160);
        
        clocks.push({
          x, 
          y, 
          size, 
          hourHandThickness, 
          minuteHandThickness, 
          secondHandThickness,
          zone: 'random-fill',
          variant: getRandomVariant() // Assign random variant
        });
      }
    }
    
    return clocks;
  };

  const { smallClocks, mainSize } = React.useMemo(() => {
    if (isInitialized && viewportSize) {
      const { mainSize } = getResponsiveSizes();
      return {
        smallClocks: generateClocks(),
        mainSize
      };
    }
    return { smallClocks: [], mainSize: mainClockSize };
  }, [isInitialized, viewportSize !== null]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">      {/* Main clock in center - using vintage variant for a classic look */}
      <div 
        className="absolute z-20"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <AnalogClock 
          size={mainSize} 
          hourHandThickness={mainSize / 100}
          minuteHandThickness={mainSize / 150}
          secondHandThickness={mainSize / 200}
          variant={0} // Main clock uses vintage pocket watch style
        />
      </div>
      
      {/* Smaller clocks with variations */}
      {viewportSize && smallClocks.map((clock, i) => (
        <div 
          key={`clock-${i}-${clock.x}-${clock.y}`}
          className="absolute z-10"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${clock.x}px), calc(-50% + ${clock.y}px))`,
          }}
        >
          <AnalogClock 
            size={clock.size}
            hourHandThickness={clock.hourHandThickness}
            minuteHandThickness={clock.minuteHandThickness}
            secondHandThickness={clock.secondHandThickness}
            variant={clock.variant} // Use the assigned variant
          />
        </div>
      ))}
    </div>
  );
};

export default ClockCollection;