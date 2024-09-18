import React from 'react';
import Link from 'next/link';
import styles from './ButtonWithImage.module.css';  // Assuming you have some styles

const ButtonWithImage = ({ href, src, alt, text, onClick }) => {
  // If href is provided, render a <Link>, otherwise just a button
  if (href) {
    return (
      <Link href={href} className={styles.buttonWithImage}>
        <img src={src} alt={alt} className={styles.buttonImage} />
        <span>{text}</span>
      </Link>
    );
  } else {
    return (
      <button onClick={onClick} className={styles.buttonWithImage}>
        <img src={src} alt={alt} className={styles.buttonImage} />
        <span>{text}</span>
      </button>
    );
  }
};

export default ButtonWithImage;
