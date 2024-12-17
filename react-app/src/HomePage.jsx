import React from 'react';
import './HomePage.css';
import KanbanBoard from './KanbanBoard';

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Hero sekcija */}
      <header className="hero-section">
        <h1 className="hero-title">Task Management Aplikacija</h1>
        <p className="hero-subtitle">
          Organizujte svoje zadatke, timski rad i rokove na jednom mestu.
        </p>
        <button className="hero-button">Prijavi se</button>
      </header>

      {/* Sekcija sa objašnjenjem funkcionalnosti */}
      <section className="features-section">
        <h2 className="section-title">Ključne Karakteristike</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Kanban Board</h3>
            <p>Vizuelizacija zadataka, slično Trello platformi, za bolju organizaciju.</p>
          </div>
          <div className="feature-card">
            <h3>Različiti Tipovi Korisnika</h3>
            <p>Administratori, menadžeri i članovi tima sa različitim privilegijama.</p>
          </div>
          <div className="feature-card">
            <h3>Postavljanje Rokova</h3>
            <p>Definišite rokove i pratite napredak u realnom vremenu.</p>
          </div>
          <div className="feature-card">
            <h3>Kalendar Aktivnosti</h3>
            <p>Pregled aktivnosti na jednom kalendaru, sve ključne informacije na dlanu.</p>
          </div>
          <div className="feature-card">
            <h3>Povezivanje sa E-mailom</h3>
            <p>Primajte notifikacije i novosti direktno u svoj inbox.</p>
          </div>
          <div className="feature-card">
            <h3>Notifikacije</h3>
            <p>Budite u toku sa svim promenama u zadacima i rokovima.</p>
          </div>
        </div>
      </section>

      {/* Sekcija sa prikazom Kanban boarda
      <section className="kanban-section">
        <h2 className="section-title">Primerni Kanban Board</h2>
        <div className="kanban-board">
          <div className="kanban-column">
            <h3 className="column-title">To Do</h3>
            <div className="kanban-item">Napravi projektni plan</div>
            <div className="kanban-item">Pripremi dokumentaciju</div>
          </div>
          <div className="kanban-column">
            <h3 className="column-title">In Progress</h3>
            <div className="kanban-item">Razvoj korisničkog interfejsa</div>
          </div>
          <div className="kanban-column">
            <h3 className="column-title">Done</h3>
            <div className="kanban-item">Istraživanje tržišta</div>
          </div>
        </div>
      </section> */}
      <KanbanBoard />

      {/* Footer sekcija */}
      <footer className="footer">
        <p>© 2024 Task Management Aplikacija</p>
      </footer>
    </div>
  );
};

export default HomePage;
