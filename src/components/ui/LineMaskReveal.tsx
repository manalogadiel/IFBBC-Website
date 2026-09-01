import React from 'react';
import { motion, Variants } from 'framer-motion';

interface LineMaskRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
}

export const LineMaskReveal: React.FC<LineMaskRevealProps> = ({
  lines,
  className = '',
  lineClassName = '',
  delay = 0.1,
  stagger = 0.12,
  as: Component = 'div',
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: {
      y: '110%',
      opacity: 0,
      rotateX: 20,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // expo out curve
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        className="block"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {lines.map((line, index) => (
          <span key={index} className="line-mask-container relative overflow-hidden block">
            <motion.span
              className={`line-mask-inner block will-change-transform ${lineClassName}`}
              variants={lineVariants}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};
