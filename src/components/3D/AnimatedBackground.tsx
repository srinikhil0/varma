import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      overflow: 'visible',
      pointerEvents: 'none',
      backgroundColor: 'transparent'
    }}>
      {/* Simple gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDarkMode 
          ? 'radial-gradient(circle at 20% 80%, rgba(100, 181, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(144, 202, 249, 0.2) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(66, 165, 245, 0.2) 0%, transparent 50%)'
      }} />

      {/* Graphene Structure - Hexagonal Lattice */}
      <motion.div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          left: '-5%',
          top: '5%',
          opacity: 0.4,
          zIndex: 1,
          filter: isDarkMode ? 'drop-shadow(0 0 10px rgba(100, 181, 246, 0.3))' : 'drop-shadow(0 0 10px rgba(25, 118, 210, 0.3))'
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <g stroke={isDarkMode ? '#64B5F6' : '#1976D2'} strokeWidth="0.8" fill="none">
            {/* Carbon atoms in hexagonal arrangement */}
            {Array.from({ length: 7 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => {
                const x = 15 + col * 12;
                const y = 15 + row * 10.4 + (col % 2) * 5.2;
                return (
                  <circle key={`${row}-${col}`} cx={x} cy={y} r="1.2" fill={isDarkMode ? '#64B5F6' : '#1976D2'} />
                );
              })
            )}
            {/* Carbon-carbon bonds */}
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => {
                const x1 = 15 + col * 12;
                const y1 = 15 + row * 10.4 + (col % 2) * 5.2;
                const x2 = 15 + (col + 1) * 12;
                const y2 = 15 + row * 10.4 + ((col + 1) % 2) * 5.2;
                const x3 = 15 + col * 12 + 6;
                const y3 = 15 + (row + 1) * 10.4 + (col % 2) * 5.2;
                return (
                  <g key={`bonds-${row}-${col}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} />
                    <line x1={x1} y1={y1} x2={x3} y2={y3} />
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </motion.div>

      {/* Silicene Structure - Buckled Hexagonal */}
      <motion.div
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          right: '10%',
          top: '20%',
          opacity: 0.6,
          zIndex: 3,
          filter: isDarkMode ? 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.4))' : 'drop-shadow(0 0 8px rgba(66, 165, 245, 0.4))'
        }}
        animate={{
          rotate: [0, -360],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <g stroke={isDarkMode ? '#90CAF9' : '#42A5F5'} strokeWidth="0.6" fill="none">
            {/* Silicon atoms with buckled structure */}
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => {
                const x = 15 + col * 14;
                const y = 15 + row * 12 + (col % 2) * 6;
                const offset = Math.sin((row + col) * 0.5) * 2;
                return (
                  <circle key={`si-${row}-${col}`} cx={x + offset} cy={y} r="1" fill={isDarkMode ? '#90CAF9' : '#42A5F5'} />
                );
              })
            )}
            {/* Silicon-silicon bonds */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => {
                const x1 = 15 + col * 14;
                const y1 = 15 + row * 12 + (col % 2) * 6;
                const x2 = 15 + (col + 1) * 14;
                const y2 = 15 + row * 12 + ((col + 1) % 2) * 6;
                const x3 = 15 + col * 14 + 7;
                const y3 = 15 + (row + 1) * 12 + (col % 2) * 6;
                return (
                  <g key={`si-bonds-${row}-${col}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} />
                    <line x1={x1} y1={y1} x2={x3} y2={y3} />
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </motion.div>

      {/* Boron Nitride (h-BN) Structure */}
      <motion.div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          left: '15%',
          bottom: '20%',
          opacity: 0.5,
          zIndex: 3,
          filter: isDarkMode ? 'drop-shadow(0 0 6px rgba(100, 181, 246, 0.3))' : 'drop-shadow(0 0 6px rgba(25, 118, 210, 0.3))'
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <g stroke={isDarkMode ? '#64B5F6' : '#1976D2'} strokeWidth="0.7" fill="none">
            {/* Boron atoms */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => {
                if ((row + col) % 2 === 0) {
                  const x = 20 + col * 15;
                  const y = 20 + row * 13;
                  return (
                    <circle key={`b-${row}-${col}`} cx={x} cy={y} r="1.5" fill="#4FC3F7" />
                  );
                }
                return null;
              })
            )}
            {/* Nitrogen atoms */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => {
                if ((row + col) % 2 === 1) {
                  const x = 20 + col * 15;
                  const y = 20 + row * 13;
                  return (
                    <circle key={`n-${row}-${col}`} cx={x} cy={y} r="1.5" fill="#FF7043" />
                  );
                }
                return null;
              })
            )}
            {/* B-N bonds */}
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => {
                const x1 = 20 + col * 15;
                const y1 = 20 + row * 13;
                const x2 = 20 + (col + 1) * 15;
                const y2 = 20 + row * 13;
                const x3 = 20 + col * 15 + 7.5;
                const y3 = 20 + (row + 1) * 13;
                return (
                  <g key={`bn-bonds-${row}-${col}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} />
                    <line x1={x1} y1={y1} x2={x3} y2={y3} />
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </motion.div>

      {/* MoS2 Structure - Transition Metal Dichalcogenide */}
      <motion.div
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          right: '20%',
          bottom: '15%',
          opacity: 0.6,
          zIndex: 3,
          filter: isDarkMode ? 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.4))' : 'drop-shadow(0 0 8px rgba(66, 165, 245, 0.4))'
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          delay: 7
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <g stroke={isDarkMode ? '#90CAF9' : '#42A5F5'} strokeWidth="0.5" fill="none">
            {/* Molybdenum atoms (center layer) */}
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => {
                const x = 25 + col * 16;
                const y = 25 + row * 14;
                return (
                  <circle key={`mo-${row}-${col}`} cx={x} cy={y} r="1.8" fill="#FF9800" />
                );
              })
            )}
            {/* Sulfur atoms (top and bottom layers) */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => {
                const x = 17 + col * 16;
                const y1 = 17 + row * 14;
                const y2 = 33 + row * 14;
                return (
                  <g key={`s-${row}-${col}`}>
                    <circle cx={x} cy={y1} r="1.2" fill="#4CAF50" />
                    <circle cx={x} cy={y2} r="1.2" fill="#4CAF50" />
                  </g>
                );
              })
            )}
            {/* Mo-S bonds */}
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => {
                const x = 25 + col * 16;
                const y = 25 + row * 14;
                const x1 = 17 + col * 16;
                const y1 = 17 + row * 14;
                const x2 = 17 + (col + 1) * 16;
                const y2 = 17 + row * 14;
                const y3 = 33 + row * 14;
                const y4 = 33 + row * 14;
                return (
                  <g key={`mos2-bonds-${row}-${col}`}>
                    <line x1={x} y1={y} x2={x1} y2={y1} />
                    <line x1={x} y1={y} x2={x2} y2={y2} />
                    <line x1={x} y1={y} x2={x1} y2={y3} />
                    <line x1={x} y1={y} x2={x2} y2={y4} />
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </motion.div>

      {/* Phosphorene Structure - Puckered */}
      <motion.div
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          left: '60%',
          top: '60%',
          opacity: 0.3,
          zIndex: 1,
          filter: isDarkMode ? 'drop-shadow(0 0 6px rgba(100, 181, 246, 0.2))' : 'drop-shadow(0 0 6px rgba(25, 118, 210, 0.2))'
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <g stroke={isDarkMode ? '#64B5F6' : '#1976D2'} strokeWidth="0.6" fill="none">
            {/* Phosphorus atoms in puckered structure */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => {
                const x = 20 + col * 15;
                const y = 20 + row * 12;
                const offset = Math.sin((row + col) * 0.8) * 3;
                return (
                  <circle key={`p-${row}-${col}`} cx={x + offset} cy={y} r="1.3" fill="#9C27B0" />
                );
              })
            )}
            {/* P-P bonds */}
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => {
                const x1 = 20 + col * 15;
                const y1 = 20 + row * 12;
                const x2 = 20 + (col + 1) * 15;
                const y2 = 20 + row * 12;
                const x3 = 20 + col * 15 + 7.5;
                const y3 = 20 + (row + 1) * 12;
                return (
                  <g key={`p-bonds-${row}-${col}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} />
                    <line x1={x1} y1={y1} x2={x3} y2={y3} />
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </motion.div>

      {/* Floating atoms/electrons */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: isDarkMode ? 'rgba(100, 181, 246, 0.6)' : 'rgba(25, 118, 210, 0.6)',
            borderRadius: '50%',
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            zIndex: 1,
            pointerEvents: 'none',
            boxShadow: isDarkMode ? '0 0 8px rgba(100, 181, 246, 0.4)' : '0 0 8px rgba(25, 118, 210, 0.4)'
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground; 