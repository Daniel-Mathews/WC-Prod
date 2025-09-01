"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import styles from '../../auth/AuthPage.module.css';

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //This function validates the form (Email and password)
  const validateForm = () => {
    if(email === "" || password === "") {
      setError("Email and password are required");
      return false;
    }
    console.log("Form validated");
    return true;
  }

  //This function handles the form submission (Sending back to auth server and getting the token)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(!validateForm()) {
      setLoading(false);
      return;
    }
    
    
    const formDetails = new URLSearchParams();
    formDetails.append("username", email);
    formDetails.append("password", password);

    console.log(formDetails);

    try {
      //Call the authentication service by the IP and Port of service
      const response = await fetch("http://127.0.0.1:8001/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formDetails
      });

      if(response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard/activeJobs");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Authentication failed");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred while trying to log in. Please try again later.");
      console.error("Login error:", error);
    }
  }

  return (
    <>
      <Head>
        <title>Login - Daniel Mathews</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.page}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>Welcome Back!</h1>
          <p className={styles.subtitle}>Log in to access your dashboard.</p>
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
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          <p className={styles.footerText}>
            Don't have an account? <a href="/auth/register" className={styles.link}>Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;