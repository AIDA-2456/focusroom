import { motion } from 'framer-motion';

export default function BrainBackground() {
  return (
    <motion.div 
      className="spline-background"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0B13' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <motion.img 
        src="/brain3d.png" 
        alt="3D Brain Model"
        style={{ width: '100%', maxWidth: '1000px', opacity: 0.4, filter: 'blur(2px) drop-shadow(0 0 20px rgba(0, 240, 255, 0.2))' }}
        animate={{ 
          y: [0, -15, 0],
          rotateZ: [0, 1, 0, -1, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <div className="spline-overlay" style={{ background: 'rgba(11, 11, 19, 0.6)' }}></div>
    </motion.div>
  );
}
