import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="shell">
      <nav><span className="brand">INTELSCOPE</span><span className="nav-state">PHASE 1 / FOUNDATION</span></nav>
      <section className="hero">
        <p className="eyebrow">AI MYSTERY INVESTIGATION PLATFORM</p>
        <h1>Every mystery<br /><em>leaves a trace.</em></h1>
        <p className="intro">Create a case from your own story, then follow the evidence until the truth reveals itself.</p>
        <div className="status"><span className="dot" />Foundation online<span className="divider" />Case creation is next</div>
      </section>
      <section className="cards">
        <article><span>01</span><h2>Create a case</h2><p>Describe an incident, choose a difficulty, and prepare it for investigation.</p></article>
        <article><span>02</span><h2>Examine evidence</h2><p>Review suspects, clues, conversations, documents, and the timeline.</p></article>
        <article><span>03</span><h2>Find the truth</h2><p>Connect contradictions, question the assistant, and submit your theory.</p></article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
