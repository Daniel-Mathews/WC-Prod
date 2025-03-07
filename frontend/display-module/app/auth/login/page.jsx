"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    if(email === "" || password === "") {
      setError("Email and password are required");
      return false;
    }
    console.log("Form validated");
    return true;
  }

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
      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formDetails
      });

      if(response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Authentication failed");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <p style={{color: "red"}}>{error}</p>}
        </div>
      </form>
    </div>
  );
}

export default Page;