import React from 'react';
import styles from './RecruiterConsoleNavbar.module.css';
import Link from 'next/link';

const RecruiterConsoleNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/recruiters/console/query-terminal" className={styles.link}>Query Terminal</Link>
      <Link href="/recruiters/console/recent-queries" className={styles.link}>Recent Queries</Link>
      <Link href="/recruiters/console/saved-queries" className={styles.link}>Saved Queries</Link>
    </nav>
  );
};

export default RecruiterConsoleNavbar;
