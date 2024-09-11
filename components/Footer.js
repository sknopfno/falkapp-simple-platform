import styles from './Footer.module.css'

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <img src="/logo-falk.png" alt="falk Logo" className={styles.logo} />
      </footer>
    </>
  )
}
