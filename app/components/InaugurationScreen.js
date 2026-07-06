"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InaugurationScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasSeen = sessionStorage.getItem('hasSeenInauguration');
    if (hasSeen) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible || !isClient) return null;

  const handleOpen = () => {
    setIsOpen(true);
    sessionStorage.setItem('hasSeenInauguration', 'true');
    
    const audio = new Audio('/orchestral-fanfare.mp3');
    audio.play().catch(e => console.log("Audio play prevented:", e));

    setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Wait for transition
  };

  return (
    <div className={`inauguration-overlay ${isOpen ? 'opening' : ''}`}>
      {/* Curtains with frontcurtain.jpg */}
      <div className={`curtain curtain-left ${isOpen ? 'open' : ''}`}>
        <img src="/frontcurtain.jpg" alt="" className="curtain-image" />
      </div>
      <div className={`curtain curtain-right ${isOpen ? 'open' : ''}`}>
        <img src="/frontcurtain.jpg" alt="" className="curtain-image mirrored" />
      </div>

      {/* Rope */}
      <button 
        className={`inauguration-rope ${isOpen ? 'hidden' : ''}`} 
        onClick={handleOpen}
        aria-label="Pull to open"
      >
        <img src="/rope.png" alt="Pull Rope" />
      </button>

      {/* Content behind rope, on top of curtains */}
      <div className={`inauguration-content ${isOpen ? 'fade-out' : ''}`}>
        <div className="inauguration-card glass-card">
          <div className="inauguration-badge">Official Launch</div>
          <h1 className="inauguration-title">NEST Cluster Octavate Grand Inauguration</h1>
          <p className="inauguration-date">06 July 2026</p>
          
          <div className="inauguration-poster-container">
            <Image src="/inauguration-poster.jpg" alt="Inauguration Poster" width={250} height={350} className="inauguration-poster" priority />
          </div>

          <button className="btn btn-accent btn-lg inauguration-btn" onClick={handleOpen}>
            Open Website
          </button>
        </div>
      </div>
    </div>
  );
}
