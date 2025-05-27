"use client";

import { useEffect, useState } from 'react';

interface AnalogClockProps {
  size?: number;
  hourHandThickness?: number;
  minuteHandThickness?: number;
  secondHandThickness?: number;
  variant?: number; // Add variant prop to determine clock style
}

function AnalogClock({ 
  size = 256,
  hourHandThickness = 1.5,
  minuteHandThickness = 1,
  secondHandThickness = 0.5,
  variant = 0
}: AnalogClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);  // Define diverse dark-themed clock design variations with distinctive aesthetics
  const clockVariants = [
    // Variant 0: Dark Vintage Pocket Watch
    {
      faceColor: 'bg-gradient-to-br from-amber-900 to-amber-950',
      borderColor: 'border-amber-600',
      borderWidth: 6,
      numberStyle: 'roman',
      hourHandColor: 'bg-amber-400',
      minuteHandColor: 'bg-amber-300',
      secondHandColor: 'bg-red-500',
      centerDotColor: 'bg-amber-500',
      markerColor: 'rgb(251, 191, 36)',
      shadowColor: 'shadow-amber-600/60',
      textColor: 'text-amber-200',
      design: 'vintage',
      hasInnerRing: true,
      handStyle: 'ornate'
    },
    // Variant 1: Industrial Steampunk
    {
      faceColor: 'bg-gradient-to-br from-stone-800 to-stone-950',
      borderColor: 'border-orange-600',
      borderWidth: 8,
      numberStyle: 'arabic',
      hourHandColor: 'bg-orange-400',
      minuteHandColor: 'bg-orange-300',
      secondHandColor: 'bg-red-500',
      centerDotColor: 'bg-orange-500',
      markerColor: 'rgb(251, 146, 60)',
      shadowColor: 'shadow-orange-600/60',
      textColor: 'text-orange-200',
      design: 'steampunk',
      hasGears: true,
      handStyle: 'industrial'
    },
    // Variant 2: Ultra Modern Minimalist
    {
      faceColor: 'bg-black',
      borderColor: 'border-white',
      borderWidth: 1,
      numberStyle: 'modern',
      hourHandColor: 'bg-white',
      minuteHandColor: 'bg-white',
      secondHandColor: 'bg-cyan-400',
      centerDotColor: 'bg-white',
      markerColor: 'white',
      shadowColor: 'shadow-cyan-400/30',
      textColor: 'text-white',
      design: 'modern',
      hasNeonGlow: true,
      handStyle: 'sleek'
    },
    // Variant 3: Dark Art Deco Luxury
    {
      faceColor: 'bg-gradient-to-br from-slate-900 to-black',
      borderColor: 'border-yellow-500',
      borderWidth: 4,
      numberStyle: 'roman',
      hourHandColor: 'bg-yellow-400',
      minuteHandColor: 'bg-yellow-300',
      secondHandColor: 'bg-red-500',
      centerDotColor: 'bg-yellow-500',
      markerColor: 'rgb(234, 179, 8)',
      shadowColor: 'shadow-yellow-500/40',
      textColor: 'text-yellow-300',
      design: 'artdeco',
      hasGeometricPattern: true,
      handStyle: 'geometric'
    },
    // Variant 4: Digital-Analog Hybrid
    {
      faceColor: 'bg-gradient-to-br from-slate-900 to-slate-950',
      borderColor: 'border-blue-500',
      borderWidth: 2,
      numberStyle: 'digital',
      hourHandColor: 'bg-blue-400',
      minuteHandColor: 'bg-blue-300',
      secondHandColor: 'bg-green-400',
      centerDotColor: 'bg-blue-500',
      markerColor: 'rgb(96, 165, 250)',
      shadowColor: 'shadow-blue-500/50',
      textColor: 'text-blue-300',
      design: 'digital',
      hasDigitalElements: true,
      handStyle: 'tech'
    },
    // Variant 5: Dark Cosmic/Space Theme
    {
      faceColor: 'bg-gradient-to-br from-purple-900 to-black',
      borderColor: 'border-purple-400',
      borderWidth: 3,
      numberStyle: 'constellation',
      hourHandColor: 'bg-purple-300',
      minuteHandColor: 'bg-purple-200',
      secondHandColor: 'bg-pink-400',
      centerDotColor: 'bg-purple-400',
      markerColor: 'rgb(196, 181, 253)',
      shadowColor: 'shadow-purple-500/60',
      textColor: 'text-purple-200',
      design: 'cosmic',
      hasStars: true,
      handStyle: 'cosmic'
    },
    // Variant 6: Dark Retro 70s
    {
      faceColor: 'bg-gradient-to-br from-orange-900 to-red-950',
      borderColor: 'border-yellow-600',
      borderWidth: 5,
      numberStyle: 'retro',
      hourHandColor: 'bg-yellow-400',
      minuteHandColor: 'bg-orange-300',
      secondHandColor: 'bg-red-400',
      centerDotColor: 'bg-yellow-500',
      markerColor: 'rgb(251, 191, 36)',
      shadowColor: 'shadow-orange-600/50',
      textColor: 'text-yellow-300',
      design: 'retro',
      hasRetroPattern: true,
      handStyle: 'retro'
    },
    // Variant 7: Dark Military/Tactical
    {
      faceColor: 'bg-gradient-to-br from-green-900 to-green-950',
      borderColor: 'border-green-600',
      borderWidth: 6,
      numberStyle: 'military',
      hourHandColor: 'bg-green-300',
      minuteHandColor: 'bg-green-200',
      secondHandColor: 'bg-red-500',
      centerDotColor: 'bg-green-400',
      markerColor: 'rgb(134, 239, 172)',
      shadowColor: 'shadow-green-600/40',
      textColor: 'text-green-200',
      design: 'military',
      hasCrosshairs: true,
      handStyle: 'tactical'
    }
  ];

  const currentVariant = clockVariants[variant % clockVariants.length];
  const scale = size / 256;
  
  // Calculate dimensions
  const hourHandHeight = 60 * scale;
  const minuteHandHeight = 80 * scale;
  const secondHandHeight = 90 * scale;
  const markerHeight = 15 * scale;
  const markerDistance = (size / 2) - (20 * scale);
  const centerDotSize = 12 * scale;
  const borderWidth = Math.max(1, currentVariant.borderWidth * scale);
  
  const scaledHourHandThickness = Math.max(1, hourHandThickness * scale);
  const scaledMinuteHandThickness = Math.max(0.8, minuteHandThickness * scale);
  const scaledSecondHandThickness = Math.max(0.5, secondHandThickness * scale);
  // Roman numerals
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const arabicNumbers = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  const modernNumbers = ['12', '', '', '3', '', '', '6', '', '', '9', '', ''];
  const digitalNumbers = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  const constellationSymbols = ['✦', '★', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '✱'];
  const retroNumbers = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  const militaryNumbers = ['1200', '0100', '0200', '0300', '0400', '0500', '0600', '0700', '0800', '0900', '1000', '1100'];

  let secondDegrees = 0;
  let minuteDegrees = 0;
  let hourDegrees = 0;
  
  if (time) {
    secondDegrees = time.getSeconds() * 6;
    minuteDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    hourDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  }
  if (!mounted) {
    return (
      <div 
        className={`rounded-full ${currentVariant.borderColor} ${currentVariant.faceColor} mx-auto flex items-center justify-center`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${borderWidth}px`,
        }}
      />
    );
  }

  // Function to render special design elements
  const renderDesignElements = () => {
    const elements = [];
    
    switch (currentVariant.design) {
      case 'vintage':
        // Inner ring for vintage look
        if (currentVariant.hasInnerRing) {
          elements.push(
            <div
              key="inner-ring"
              className="absolute rounded-full border-2"
              style={{
                width: `${size * 0.85}px`,
                height: `${size * 0.85}px`,
                borderColor: currentVariant.markerColor,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3
              }}
            />
          );
        }
        break;
          case 'steampunk':
        // Gear elements
        if (currentVariant.hasGears) {
          elements.push(
            <div
              key="gear-1"
              className="absolute"
              style={{
                width: `${size * 0.15}px`,
                height: `${size * 0.15}px`,
                background: `conic-gradient(from 0deg, ${currentVariant.markerColor} 0deg, transparent 45deg, ${currentVariant.markerColor} 90deg, transparent 135deg, ${currentVariant.markerColor} 180deg, transparent 225deg, ${currentVariant.markerColor} 270deg, transparent 315deg)`,
                borderRadius: '50%',
                top: '20%',
                right: '20%',
                opacity: 0.4
              }}
            />,
            <div
              key="gear-2"
              className="absolute"
              style={{
                width: `${size * 0.12}px`,
                height: `${size * 0.12}px`,
                background: `conic-gradient(from 45deg, ${currentVariant.markerColor} 0deg, transparent 60deg, ${currentVariant.markerColor} 120deg, transparent 180deg, ${currentVariant.markerColor} 240deg, transparent 300deg)`,
                borderRadius: '50%',
                bottom: '25%',
                left: '15%',
                opacity: 0.3
              }}
            />
          );
        }
        break;
        
      case 'cosmic':
        // Star elements
        if (currentVariant.hasStars) {
          for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const radius = size * 0.35;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            elements.push(
              <div
                key={`star-${i}`}
                className="absolute text-purple-300"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  fontSize: `${Math.max(8, 12 * scale)}px`,
                  opacity: 0.6
                }}
              >
                ✦
              </div>
            );
          }
        }
        break;
        
      case 'military':
        // Crosshairs
        if (currentVariant.hasCrosshairs) {
          elements.push(
            <div
              key="crosshair-h"
              className="absolute"
              style={{
                width: `${size * 0.7}px`,
                height: '1px',
                backgroundColor: currentVariant.markerColor,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3
              }}
            />,
            <div
              key="crosshair-v"
              className="absolute"
              style={{
                width: '1px',
                height: `${size * 0.7}px`,
                backgroundColor: currentVariant.markerColor,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3
              }}
            />
          );
        }
        break;
          case 'artdeco':
        // Geometric pattern
        if (currentVariant.hasGeometricPattern) {
          elements.push(
            <div
              key="deco-pattern"
              className="absolute rounded-full"
              style={{
                width: `${size * 0.9}px`,
                height: `${size * 0.9}px`,
                background: `conic-gradient(from 0deg, transparent 0deg, ${currentVariant.markerColor}20 15deg, transparent 30deg, ${currentVariant.markerColor}20 45deg, transparent 60deg, ${currentVariant.markerColor}20 75deg, transparent 90deg, ${currentVariant.markerColor}20 105deg, transparent 120deg, ${currentVariant.markerColor}20 135deg, transparent 150deg, ${currentVariant.markerColor}20 165deg, transparent 180deg, ${currentVariant.markerColor}20 195deg, transparent 210deg, ${currentVariant.markerColor}20 225deg, transparent 240deg, ${currentVariant.markerColor}20 255deg, transparent 270deg, ${currentVariant.markerColor}20 285deg, transparent 300deg, ${currentVariant.markerColor}20 315deg, transparent 330deg, ${currentVariant.markerColor}20 345deg, transparent 360deg)`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.2
              }}
            />
          );
        }
        break;
        
      case 'retro':
        // Retro pattern elements
        if (currentVariant.hasRetroPattern) {
          elements.push(
            <div
              key="retro-pattern"
              className="absolute rounded-full"
              style={{
                width: `${size * 0.8}px`,
                height: `${size * 0.8}px`,
                background: `radial-gradient(circle at 30% 30%, ${currentVariant.markerColor}15 0%, transparent 40%), radial-gradient(circle at 70% 70%, ${currentVariant.markerColor}10 0%, transparent 40%)`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3
              }}
            />
          );
        }
        break;
        
      case 'digital':
        // Digital grid elements
        if (currentVariant.hasDigitalElements) {
          elements.push(
            <div
              key="digital-grid"
              className="absolute"
              style={{
                width: `${size * 0.9}px`,
                height: `${size * 0.9}px`,
                backgroundImage: `linear-gradient(${currentVariant.markerColor}20 1px, transparent 1px), linear-gradient(90deg, ${currentVariant.markerColor}20 1px, transparent 1px)`,
                backgroundSize: `${size * 0.1}px ${size * 0.1}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.15,
                borderRadius: '50%'
              }}
            />
          );
        }
        break;
    }
      return elements;
  };

  const renderNumbers = () => {
    
    let numbers;
    switch (currentVariant.numberStyle) {
      case 'roman':
        numbers = romanNumerals;
        break;
      case 'digital':
        numbers = digitalNumbers;
        break;
      case 'constellation':
        numbers = constellationSymbols;
        break;
      case 'retro':
        numbers = retroNumbers;
        break;
      case 'military':
        numbers = militaryNumbers;
        break;
      case 'modern':
        numbers = modernNumbers;
        break;
      default:
        numbers = arabicNumbers;
    }
    
    return numbers.map((num, i) => {
      if (!num) return null;
      
      const angle = (i * 30) - 90; // Start from 12 o'clock
      const radian = (angle * Math.PI) / 180;
      let numberDistance = markerDistance - (currentVariant.numberStyle === 'roman' ? 25 * scale : 20 * scale);
      
      // Adjust distance for different number styles
      if (currentVariant.numberStyle === 'military') {
        numberDistance = markerDistance - (35 * scale);
      } else if (currentVariant.numberStyle === 'constellation') {
        numberDistance = markerDistance - (15 * scale);
      }
      
      const x = Math.cos(radian) * numberDistance;
      const y = Math.sin(radian) * numberDistance;
      
      let fontSize = Math.max(8, 14 * scale);
      let fontFamily = 'sans-serif';
      let fontWeight = 'font-bold';
      
      // Style adjustments based on design
      switch (currentVariant.numberStyle) {
        case 'roman':
          fontFamily = 'serif';
          fontWeight = 'font-extrabold';
          break;
        case 'digital':
          fontFamily = 'monospace';
          fontWeight = 'font-black';
          fontSize = Math.max(10, 16 * scale);
          break;
        case 'constellation':
          fontSize = Math.max(12, 18 * scale);
          fontWeight = 'font-normal';
          break;
        case 'military':
          fontFamily = 'monospace';
          fontSize = Math.max(6, 8 * scale);
          fontWeight = 'font-bold';
          break;
        case 'retro':
          fontFamily = 'serif';
          fontWeight = 'font-black';
          fontSize = Math.max(10, 16 * scale);
          break;
      }
      
      return (
        <div
          key={i}
          className={`absolute ${currentVariant.textColor} ${fontWeight} select-none`}
          style={{
            fontSize: `${fontSize}px`,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            fontFamily: fontFamily,
            textShadow: currentVariant.design === 'modern' && currentVariant.hasNeonGlow ? 
              `0 0 10px ${currentVariant.markerColor}` : 'none'
          }}
        >
          {num}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative rounded-full ${currentVariant.borderColor} ${currentVariant.faceColor} mx-auto flex items-center justify-center ${currentVariant.shadowColor} shadow-lg`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${borderWidth}px`,
        }}
      >
        <div className="absolute inset-0 rounded-full">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            if (currentVariant.numberStyle === 'dots') {
              // For minimalist style, use dots instead of lines
              return (
                <div 
                  key={i} 
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.max(3, 6 * scale)}px`,
                    height: `${Math.max(3, 6 * scale)}px`,
                    backgroundColor: currentVariant.markerColor,
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${markerDistance}px)`,
                    transformOrigin: '50% 50%',
                  }}
                />
              );
            }
            
            // Traditional line markers
            const isSpecial = [0, 3, 6, 9].includes(i);
            return (
              <div 
                key={i} 
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  width: `${Math.max(1, isSpecial ? 3 * scale : 1.5 * scale)}px`,
                  height: `${Math.max(8, isSpecial ? markerHeight * 1.5 : markerHeight)}px`,
                  backgroundColor: currentVariant.markerColor,
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${markerDistance}px)`,
                  transformOrigin: '50% 50%',
                }}
              />
            );
          })}          {/* Numbers */}
          {renderNumbers()}

          {/* Design Elements */}
          {renderDesignElements()}

          {/* Clock hands with enhanced styling */}
          <div 
            className={`absolute ${currentVariant.hourHandColor} transition-transform duration-1000 ease-in-out`}
            style={{ 
              width: `${scaledHourHandThickness}px`,
              height: `${hourHandHeight}px`,
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
              transformOrigin: '50% 100%',
              borderRadius: currentVariant.handStyle === 'sleek' ? `${scaledHourHandThickness / 2}px` : 
                           currentVariant.handStyle === 'geometric' ? '0px' : 
                           `${scaledHourHandThickness / 4}px`,
              clipPath: currentVariant.handStyle === 'ornate' ? 'polygon(40% 0%, 60% 0%, 70% 20%, 60% 100%, 40% 100%, 30% 20%)' :
                       currentVariant.handStyle === 'geometric' ? 'polygon(45% 0%, 55% 0%, 60% 30%, 55% 100%, 45% 100%, 40% 30%)' :
                       currentVariant.handStyle === 'cosmic' ? 'polygon(47% 0%, 53% 0%, 55% 15%, 53% 100%, 47% 100%, 45% 15%)' :
                       'none',
              boxShadow: currentVariant.design === 'modern' && currentVariant.hasNeonGlow ? 
                `0 0 8px ${currentVariant.hourHandColor.replace('bg-', '').replace('white', '#ffffff').replace('blue-400', '#60a5fa')}` : 'none'
            }}
          />
          
          <div 
            className={`absolute ${currentVariant.minuteHandColor} transition-transform duration-1000 ease-in-out`}
            style={{ 
              width: `${scaledMinuteHandThickness}px`,
              height: `${minuteHandHeight}px`,
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
              transformOrigin: '50% 100%',
              borderRadius: currentVariant.handStyle === 'sleek' ? `${scaledMinuteHandThickness / 2}px` : 
                           currentVariant.handStyle === 'geometric' ? '0px' : 
                           `${scaledMinuteHandThickness / 4}px`,
              clipPath: currentVariant.handStyle === 'ornate' ? 'polygon(42% 0%, 58% 0%, 65% 25%, 58% 100%, 42% 100%, 35% 25%)' :
                       currentVariant.handStyle === 'geometric' ? 'polygon(46% 0%, 54% 0%, 58% 35%, 54% 100%, 46% 100%, 42% 35%)' :
                       currentVariant.handStyle === 'cosmic' ? 'polygon(48% 0%, 52% 0%, 54% 20%, 52% 100%, 48% 100%, 46% 20%)' :
                       'none',
              boxShadow: currentVariant.design === 'modern' && currentVariant.hasNeonGlow ? 
                `0 0 6px ${currentVariant.minuteHandColor.replace('bg-', '').replace('white', '#ffffff').replace('blue-300', '#93c5fd')}` : 'none'
            }}
          />
          
          <div 
            className={`absolute ${currentVariant.secondHandColor}`}
            style={{ 
              width: `${scaledSecondHandThickness}px`,
              height: `${secondHandHeight}px`,
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
              transformOrigin: '50% 100%',
              borderRadius: currentVariant.handStyle === 'sleek' ? `${scaledSecondHandThickness / 2}px` : 
                           currentVariant.handStyle === 'geometric' ? '0px' : 
                           `${scaledSecondHandThickness / 4}px`,
              clipPath: currentVariant.handStyle === 'tactical' ? 'polygon(48% 0%, 52% 0%, 50% 10%, 52% 100%, 48% 100%, 50% 10%)' :
                       currentVariant.handStyle === 'cosmic' ? 'polygon(49% 0%, 51% 0%, 50% 5%, 51% 100%, 49% 100%, 50% 5%)' :
                       'none',
              boxShadow: currentVariant.design === 'modern' && currentVariant.hasNeonGlow ? 
                `0 0 4px ${currentVariant.secondHandColor.replace('bg-', '').replace('cyan-400', '#22d3ee')}` : 'none'
            }}
          />

          {/* Center dot */}
          <div 
            className={`absolute ${currentVariant.centerDotColor} rounded-full z-10`} 
            style={{
              width: `${Math.max(8, centerDotSize)}px`,
              height: `${Math.max(8, centerDotSize)}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalogClock;