import React from 'react';
import './Day.css';

const Day = ({ date, holidays, tasks }) => {
    const holiday = holidays.find(
      (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
    );

    const isHoliday = holidays.some(
        (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
      );
  
      return (
        <div className={`day ${holiday ? 'holiday' : ''}`}>
          <div className="date">{date.getDate()}</div>
          {isHoliday && <span className="holiday-name">{holidays.find(
      (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
    ).localName}</span>}
            {tasks.map((task) => (
            <div key={task.id} className="task">
              {task.title}
            </div>
          ))}
        </div>
      );
  };

export default Day;
