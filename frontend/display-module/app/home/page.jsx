'use client'; // For state and event handlers

import { useState } from 'react';
import Head from 'next/head';
import styles from '../home//LandingPage.module.css'; 

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Welcome to Wols Logistics</title>
        <meta name="description" content="Efficient, Reliable, and Fast Logistics Solutions." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>Wols Logistics</div>
          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <a href="/auth/login">Login</a>
            <a href="/auth/register" className={styles.signUpButton}>Sign Up</a>
          </nav>
          {/* Hamburger Menu Button */}
          <button 
            className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </header>

        {/* Mobile Menu - Conditionally rendered */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="/auth/login" onClick={() => setIsMenuOpen(false)}>Login</a>
            <a href="/auth/register" className={styles.signUpButtonMobile} onClick={() => setIsMenuOpen(false)}>Sign Up</a>
          </div>
        )}

        <main className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>WC-Prod</h1>
            <p className={styles.heroSubtitle}>WC-Prod</p>
            
          </div>
        </main>
        <footer className={styles.footer}>
          <p>&copy; 2025 WC-Prod. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
