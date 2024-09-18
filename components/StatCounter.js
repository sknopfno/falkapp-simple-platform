import { useState, useEffect } from 'react';
import styles from './StatCounter.module.css';

export default function StatCounter({ label, value, increment }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate dynamic changes by incrementing the count over time
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + increment);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [increment]);

  return (
    <div className={styles.counter}>
      <h2>{label}</h2>
      <div className={styles.number}>{count}</div>
    </div>
  );
}
