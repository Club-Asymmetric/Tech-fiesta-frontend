"use client";

import React, { useEffect, useState } from "react";
import AnalogClock from "./AnalogClock";

interface MinimalClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
  onReady?: () => void;
}

const MinimalClockCollection = ({
  mainClockSize = 400,
  smallClockCount = 20, // Reduced from 60 to 20
  onReady,
}: MinimalClockCollectionProps) => {
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && typeof window !== "undefined") {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
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
    if (!viewportSize)
      return { mainSize: mainClockSize, smallCount: smallClockCount };

    const { width, height } = viewportSize;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    let responsiveMainSize = mainClockSize;
    let responsiveSmallCount = smallClockCount;
    if (isMobile) {
      responsiveMainSize = Math.min(
        mainClockSize * 0.6,
        width * 0.6,
        height * 0.4
      );
      responsiveSmallCount = Math.min(
        Math.max(15, Math.floor(smallClockCount * 0.8)), // Reduced multiplier
        25 // Reduced max
      );
    } else if (isTablet) {
      responsiveMainSize = Math.min(
        mainClockSize * 0.8,
        width * 0.5,
        height * 0.5
      );
      responsiveSmallCount = Math.min(
        Math.max(20, Math.floor(smallClockCount * 1.2)), // Reduced multiplier
        35 // Reduced max
      );
    } else {
      responsiveMainSize = Math.min(mainClockSize, width * 0.4, height * 0.6);
      responsiveSmallCount = Math.min(
        Math.max(25, Math.floor(smallClockCount * 1.5)), // Reduced multiplier
        45 // Reduced max
      );
    }

    return {
      mainSize: Math.max(200, responsiveMainSize),
      smallCount: responsiveSmallCount,
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
      variant: number;
    }> = [];

    const { mainSize, smallCount } = getResponsiveSizes();

    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    // Simplified size ranges for less variety
    let sizes;
    if (isMobile) {
      sizes = [
        { min: 60, max: 100, weight: 0.6 },
        { min: 100, max: 140, weight: 0.4 },
      ];
    } else if (isTablet) {
      sizes = [
        { min: 80, max: 120, weight: 0.6 },
        { min: 120, max: 160, weight: 0.4 },
      ];
    } else {
      sizes = [
        { min: 100, max: 140, weight: 0.6 },
        { min: 140, max: 180, weight: 0.4 },
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
          return Math.floor(
            sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min)
          );
        }
      }
      return sizes[0].min;
    };

    // Only use 3 variants instead of 7 for less variety
    const getRandomVariant = () => {
      const variants = [1, 2, 4]; // Use only variants 1, 2, and 4
      return variants[Math.floor(Math.random() * variants.length)];
    };

    const isTooCloseToMainClock = (x: number, y: number, radius: number) => {
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      return distanceFromCenter < avoidZoneRadius + radius;
    };

    const gridSize = isMobile ? 100 : isTablet ? 120 : 150; // Larger grid for less density
    const extendedWidth = width * 1.2; // Reduced coverage area
    const extendedHeight = height * 1.2;

    const cols = Math.ceil(extendedWidth / gridSize);
    const rows = Math.ceil(extendedHeight / gridSize);

    const allPositions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize - extendedWidth / 2 + gridSize / 2;
        const y = row * gridSize - extendedHeight / 2 + gridSize / 2;

        const randomX = x + (Math.random() - 0.5) * gridSize * 0.7;
        const randomY = y + (Math.random() - 0.5) * gridSize * 0.7;

        allPositions.push({ x: randomX, y: randomY, row, col });
      }
    }

    // Shuffle positions for random placement
    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }

    let placed = 0;
    const targetCount = Math.min(smallCount, 50); // Reduced maximum

    for (const pos of allPositions) {
      if (placed >= targetCount) break;

      const size = getRandomSize();
      const radius = size / 2;

      if (isTooCloseToMainClock(pos.x, pos.y, radius)) {
        continue;
      }

      let completeOverlap = false;
      for (const existingClock of clocks) {
        const distance = Math.sqrt(
          (pos.x - existingClock.x) ** 2 + (pos.y - existingClock.y) ** 2
        );
        const minDistance = Math.max(
          25, // Increased spacing
          (radius + existingClock.size / 2) * 1.2
        );
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
          variant: getRandomVariant(),
        });
        placed++;
      }
    }

    // Reduced additional random clocks
    let extraAttempts = 0;
    const extraTarget = Math.min(placed + 10, targetCount, 50); // Reduced extra clocks

    while (clocks.length < extraTarget && extraAttempts < 50) {
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
        const distance = Math.sqrt(
          (x - existingClock.x) ** 2 + (y - existingClock.y) ** 2
        );
        if (distance < (radius + existingClock.size / 2) * 1.3) {
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
          zone: "random-fill",
          variant: getRandomVariant(),
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
        mainSize,
      };
    }
    return { smallClocks: [], mainSize: mainClockSize };
  }, [isInitialized, viewportSize !== null]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black grayscale-100">
      {/* Main clock in center - uses variant 0 */}
      <div
        className="absolute z-20"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <AnalogClock
          size={mainSize}
          hourHandThickness={mainSize / 100}
          minuteHandThickness={mainSize / 150}
          secondHandThickness={mainSize / 200}
          variant={0}
        />
      </div>
      
      {/* Smaller clocks with reduced variations */}
      {viewportSize &&
        smallClocks.map((clock, i) => (
          <div
            key={`clock-${i}-${clock.x}-${clock.y}`}
            className="absolute z-10"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${clock.x}px), calc(-50% + ${clock.y}px))`,
            }}
          >
            <AnalogClock
              size={clock.size}
              hourHandThickness={clock.hourHandThickness}
              minuteHandThickness={clock.minuteHandThickness}
              secondHandThickness={clock.secondHandThickness}
              variant={clock.variant}
            />
          </div>
        ))}
    </div>
  );
};

export default MinimalClockCollection;
