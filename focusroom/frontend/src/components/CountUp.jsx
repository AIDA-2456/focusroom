import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function CountUp({ end, duration = 1.5 }) {
  const [hasStarted, setHasStarted] = useState(false);
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
    duration: duration * 1000
  });

  const displayValue = useTransform(springValue, (current) => Math.round(current));

  useEffect(() => {
    // Small delay to ensure the component is mounted before animating
    const timer = setTimeout(() => {
      setHasStarted(true);
      springValue.set(end);
    }, 100);
    return () => clearTimeout(timer);
  }, [end, springValue]);

  return <motion.span>{displayValue}</motion.span>;
}

export default CountUp;
