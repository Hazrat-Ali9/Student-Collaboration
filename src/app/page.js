"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/redux/auth-contex";
import UserGrowthChart from "./components/UserGrowthChart";
import getUsersApi from "./api/getUserApi";
import './styles/about.css';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, loading } = useContext(AuthContext);
   const [users, setUsers] = useState([]);

  const handleStart = () => {
     router.push("/login");
  }

    useEffect(() => {
      getUsersApi({ setUsers });
      // console.log(users,'Users..............')
    }, []);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/");
    }
    else {
      router.push("/dashboard");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) return null; // Wait for auth check

  return (
    <div style={{marginTop:'50px'}}>
      
       <div className="about-wrapper">
    <div className="about-hero">
      <h1>Welcome to StudentCollab</h1>
      <p>Your space to collaborate, share, and grow together.</p>
      
    </div>
    <div style={{ margin:'50px 0px 50px 50px', width: '90%' }}>
        <UserGrowthChart users={users} />
      </div>

    <div className="about-section">
      <h2>Who We Are</h2>
      <p>
        StudentCollab is a collaborative platform built for students by students. We aim to empower learners by
        providing a space to exchange ideas, share resources, and support one another in academic journeys.
      </p>
    </div>

    <div className="about-section">
      <h2>Our Mission</h2>
      <p>
        Our mission is to foster a connected learning environment. Whether you are revising for exams, organizing
        study groups, or just want to chat with peers — StudentHub is your go-to community.
      </p>
    </div>

    <div className="about-section">
      <h2>What Can You Do Here?</h2>
      <ul className="about-list">
        <li>📚 Share and download notes</li>
        <li>💬 Join subject-specific group chats</li>
        <li>🤝 Collaborate on academic projects</li>
        <li>📢 Stay informed with class updates and events</li>
      </ul>
    </div>

    <div className="about-section about-cta">
      <h2>Ready to Collaborate?</h2>
      <p>Join the StudentCollab community and unlock the power of shared knowledge.</p>
      <button className="about-btn" onClick={handleStart}>Get Started</button>
    </div>
  </div>
     
      
    </div>
  );
}
