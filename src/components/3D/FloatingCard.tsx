import React, { useRef } from 'react';
import { Card } from '@mui/material';
import type { CardProps } from '@mui/material';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface FloatingCardProps extends CardProps {
  children: React.ReactNode;
  intensity?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  intensity = 20, 
  sx, 
  ...props 
}) => {


  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-intensity, intensity], [intensity, -intensity]);
  const rotateY = useTransform(x, [-intensity, intensity], [-intensity, intensity]);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      x.set(event.clientX - centerX);
      y.set(event.clientY - centerY);
    }
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <Card
          {...props}
          sx={{
            ...sx,
            transform: 'translateZ(0)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateZ(20px)',
            },
          }}
        >
          {children}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FloatingCard; 