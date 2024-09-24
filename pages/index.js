import Head from 'next/head';
import Footer from '@components/Footer';
import ButtonWithImage from '../components/ButtonWithImage';  // Import the ButtonWithImage component
import StatCounter from '../components/StatCounter';
import styles from '../styles/Home.module.css';

export default function Home({ stats }) {
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
          <StatCounter label="Active" value={stats.active} increment={1} />
          <StatCounter label="Leads" value={stats.leads} increment={2} />
          <StatCounter label="Projects" value={stats.projects} increment={3} />
          <StatCounter label="Errors" value={stats.errors} increment={1} />
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
  );
}

// Fetch the data at build time (even if static data)
export async function getStaticProps() {
  // Simulated data (could be fetched from an API or database)
  const stats = {
    active: 0,
    leads: 10,
    projects: 5,
    errors: 1,
  };

  return {
    props: { stats },  // Pass the stats as props to the component
  };
}
