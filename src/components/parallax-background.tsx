'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  children,
}) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollY * 0.3}px)`; // 背景以30%的速度滚动
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(124, 235, 198, 0.1) 0%, rgba(124, 235, 198, 0) 20%),
            radial-gradient(circle at 90% 50%, rgba(230, 215, 248, 0.1) 0%, rgba(230, 215, 248, 0) 25%),
            radial-gradient(circle at 40% 80%, rgba(255, 203, 196, 0.1) 0%, rgba(255, 203, 196, 0) 30%)
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
