import Head from 'next/head';
import Footer from '@components/Footer';
import ButtonWithImage from '../components/ButtonWithImage';  // Import the ButtonWithImage component
import StatCounter from '../components/StatCounter';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className="container">
      <Head>
      <title>falk.app</title>
        <meta name="description" content="falk.app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
      <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.grid}>
           {/* Four StatCounters for different topics */}
          <StatCounter label="Active" value={0} increment={1} />
          <StatCounter label="Leads" value={10} increment={2} />
          <StatCounter label="Projects" value={5} increment={3} />
          <StatCounter label="Errors" value={1} increment={1} />
        </div>

        {/* Add the buttons here */}
        <div className="button-container">
          <ButtonWithImage 
            href="/test" 
            src="/test-icon.png" 
            alt="Test me icon" 
            text="Test me" 
          />
          <ButtonWithImage 
            href="/rejectionRateReview" 
            src="/rr-review-icon.png" 
            alt="RR Review icon" 
            text="RR Review" 
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
