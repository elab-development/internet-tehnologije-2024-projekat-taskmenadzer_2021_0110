import React, { useEffect, useState } from 'react';
import './HomePage.css';
import KanbanBoard from './KanbanBoard';

const HomePage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'pending',
    category_id: '',
    assigned_to: '',
    deadline: '',
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Preuzimanje korisnika
    fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Greška prilikom učitavanja korisnika:', error));

    // Preuzimanje kategorija
    fetch('/api/categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Greška prilikom učitavanja kategorija:', error));
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // API poziv za kreiranje zadatka
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Dodaj autentifikaciju
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          alert('Greška prilikom kreiranja zadatka');
        } else {
          alert('Zadatak uspešno kreiran');
          setIsModalOpen(false); // Zatvaranje modala
        }
      })
      .catch((error) => console.error('Error:', error));
  };

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

      <div className="kanban-controls">
          <button onClick={() => setIsModalOpen(true)} className="add-task-button">
            + Novi zadatak
          </button>
        </div>
      <KanbanBoard />

      {/* Modal za kreiranje zadatka */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Kreiraj novi zadatak</h3>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="title">Naslov</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Naslov"
                value={taskData.title}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="description">Opis</label>
              <textarea
                id="description"
                name="description"
                placeholder="Opis"
                value={taskData.description}
                onChange={handleInputChange}
              ></textarea>

              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={taskData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">Na čekanju</option>
                <option value="in_progress">U toku</option>
                <option value="completed">Završeno</option>
              </select>

              <label htmlFor="category_id">Kategorija</label>
              <select
                id="category_id"
                name="category_id"
                value={taskData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Izaberite kategoriju</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label htmlFor="assigned_to">Korisnik</label>
              <select
                id="assigned_to"
                name="assigned_to"
                value={taskData.assigned_to}
                onChange={handleInputChange}
                required
              >
                <option value="">Izaberite korisnika</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <label htmlFor="deadline">Rok</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={taskData.deadline}
                onChange={handleInputChange}
              />

              <button type="submit" className="save-button">
                Sačuvaj
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Otkaži
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer sekcija */}
      <footer className="footer">
        <p>© 2024 Task Management Aplikacija</p>
      </footer>
    </div>
  );
};

export default HomePage;
