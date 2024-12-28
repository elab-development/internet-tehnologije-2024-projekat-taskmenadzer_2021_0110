import React, { useState, useEffect } from 'react';
import Day from './Day';
import DateSelector from './DateSelector';
import './Calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token'); // Preuzimanje tokena iz localStorage
  
    // Fetch holidays
    fetch(`http://localhost:8000/api/holidays`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodavanje tokena za autentifikaciju
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch holidays');
        }
        return response.json();
      })
      .then((data) => setHolidays(data),
      console.log('Holidays:', holidays)

    )
      .catch((error) => console.error('Error fetching holidays:', error));
  
    // Fetch tasks
    fetch(`http://localhost:8000/api/tasks?per_page=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodavanje tokena za autentifikaciju
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return response.json();
      })
      .then((data) => setTasks(data.data || []))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [currentMonth, currentYear]);

  const generateDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // Prazne ćelije pre početka meseca
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    return days;
  };

  const days = generateDays();

  return (
    <div className="calendar">
      <DateSelector
        currentMonth={currentMonth}
        currentYear={currentYear}
        onChangeMonth={setCurrentMonth}
        onChangeYear={setCurrentYear}
      />
      <div className="calendar-grid">
        {['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        {days.map((date, index) =>
          date ? (
            <Day
              key={index}
              date={date}
              holidays={holidays}
              tasks={tasks.filter(
                (task) => new Date(task.deadline).toDateString() === date.toDateString()
              )}
            />
          ) : (
            <div key={index} className="empty-cell"></div>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;
