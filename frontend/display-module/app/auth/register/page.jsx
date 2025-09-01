"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import styles from '../../auth/AuthPage.module.css';

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Registration successful. Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(result.detail || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Register - Daniel Mathews</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.page}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>Registration!</h1>
          <p className={styles.subtitle}>Register to access your dashboard.</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Display error message if it exists */}
            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className={styles.footerText}>
            Already have an account? <a href="/auth/login" className={styles.link}>Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;