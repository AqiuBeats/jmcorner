'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

interface HeartParticlesProps {
  show: boolean;
  onComplete?: () => void;
}

export const HeartParticles: React.FC<HeartParticlesProps> = ({
  show,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesCreated = useRef(false);

  useEffect(() => {
    if (show && containerRef.current && !particlesCreated.current) {
      particlesCreated.current = true;

      // 心形路径点
      const heartPoints = generateHeartShape(200, 200, 100);
      const container = containerRef.current;

      // 清除之前的粒子
      container.innerHTML = '';

      // 创建粒子
      heartPoints.forEach((point, index) => {
        setTimeout(() => {
          if (container) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${Math.random() * 10 + 5}px`;
            particle.style.height = particle.style.width;

            // 随机起始位置
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            container.appendChild(particle);

            // 移动到心形位置
            setTimeout(() => {
              particle.style.transition =
                'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
              particle.style.left = `${point.x + (window.innerWidth / 2 - 200)}px`;
              particle.style.top = `${point.y + (window.innerHeight / 2 - 200)}px`;
            }, 50);
          }
        }, index * 10); // 粒子逐个出现
      });

      // 动画完成后回调
      setTimeout(
        () => {
          if (onComplete) onComplete();
        },
        heartPoints.length * 10 + 2000,
      );
    }

    return () => {
      particlesCreated.current = false;
    };
  }, [show, onComplete]);

  if (!show) return null;

  return <div ref={containerRef} className="heart-particles-container" />;
};

// 生成心形路径点
function generateHeartShape(centerX: number, centerY: number, size: number) {
  const points = [];
  const numPoints = 100; // 点的数量

  for (let i = 0; i < numPoints; i++) {
    // 参数方程生成心形
    const t = (i / numPoints) * 2 * Math.PI;
    const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
    const y =
      centerY -
      size *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t));

    points.push({ x, y });
  }

  return points;
}
