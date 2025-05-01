import React from 'react';
import './DateSelector.css';

const DateSelector = ({ currentMonth, currentYear, onChangeMonth, onChangeYear }) => {
  const months = [
    'Januar',
    'Februar',
    'Mart',
    'April',
    'Maj',
    'Jun',
    'Jul',
    'Avgust',
    'Septembar',
    'Oktobar',
    'Novembar',
    'Decembar',
  ];

  const handleMonthChange = (e) => {
    onChangeMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    onChangeYear(parseInt(e.target.value));
  };

  return (
    <div className="date-selector">
      <select value={currentMonth} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={currentYear}
        onChange={handleYearChange}
        min="2000"
        max="2100"
      />
    </div>
  );
};

export default DateSelector;
