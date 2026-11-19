"use client";

import { Inter, Playfair_Display } from "next/font/google";
import { useState } from "react";
import "./HeroStyle.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const TABS = ["All", "Venues", "Photographers", "Decorators"];

export default function WeddingHero() {
  const [activeTab, setActiveTab] = useState("All");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    console.log({
      category: activeTab,
      location,
      date,
    });
  };

  return (
    <main className={`weddingHero ${inter.variable} ${playfair.variable}`}>
      <section className="hero">
        <div className="glow" />

        {/* LEFT CONTENT */}
        <div className="heroContent">
          <div className="badge in" style={{ "--d": "0.1s" }}>
            <i />
            Your dream wedding starts here
          </div>

          <h1 className="title in" style={{ "--d": "0.2s" }}>
            Make Your Wedding
            <br />
            <em>Unforgettable.</em>
          </h1>

          <p className="sub in" style={{ "--d": "0.3s" }}>
            From the perfect venue to the smallest details, discover everything
            you need to create a beautiful wedding day that tells your love
            story.
          </p>

          {/* SEARCH BOX */}
          <div className="search in" style={{ "--d": "0.4s" }}>
            <div className="tabs">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form className="fields" onSubmit={handleSearch}>
              <label className="field">
                <span>Location</span>
                <input
                  type="text"
                  placeholder="Where?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              <label className="field">
                <span>Wedding Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <button className="go" type="submit">
                Search
              </button>
            </form>
          </div>

          {/* STATS */}
          <div className="stats in" style={{ "--d": "0.5s" }}>
            <div>
              <strong>2.5k+</strong>
              <span>Happy Couples</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Wedding Vendors</span>
            </div>

            <div>
              <strong>98%</strong>
              <span>Happy Reviews</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE VISUAL */}
        <div className="visual in" style={{ "--d": "0.3s" }}>
          {/* Main wedding photo */}
          <div className="arch archMain" />

          {/* Left wedding photo */}
          <div className="arch archLeft" />

          {/* Right wedding photo */}
          <div className="arch archRight" />

          {/* Floating checklist card */}
          <div className="card cardChecklist">
            <div className="cardHead">
              <span className="dot" />
              Wedding Checklist
              <b>72%</b>
            </div>

            <small>Your planning progress</small>

            <div className="bar">
              <span />
            </div>

            <small>12 of 17 tasks completed</small>
          </div>

          {/* Floating guest card */}
          <div className="card cardGuests">
            <div className="cardHead">
              Guest List
              <b>+24</b>
            </div>

            <div className="avatars">
              <i />
              <i />
              <i />
              <i />
              <em>+120</em>
            </div>

            <small>Happy guests are coming!</small>
          </div>

          {/* Floating budget card */}
          <div className="card cardBudget">
            <small>Wedding Budget</small>
            <strong>$12,500</strong>
            <span className="chip">On track</span>
          </div>

          {/* Sparkles */}
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">✧</span>
          <span className="sparkle s3">✦</span>
        </div>
      </section>
    </main>
  );
}
