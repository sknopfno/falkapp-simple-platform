import Link from 'next/link';
import styles from './ButtonWithImage.module.css';

export default function ButtonWithImage({ href, src, alt, text }) {
  return (
    <Link href={href}>
      <div className={styles.button}>
        <img src={src} alt={alt} className={styles.image} />
        <span className={styles.text}>{text}</span>
      </div>
    </Link>
  );
}
