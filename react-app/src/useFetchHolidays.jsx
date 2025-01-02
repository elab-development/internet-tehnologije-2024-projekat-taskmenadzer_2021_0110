import { useState, useEffect } from 'react';

const useFetchHolidays = (year) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token'); 

      try {
        const response = await fetch(`http://localhost:8000/api/holidays?year=${year}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch holidays');
        }

        const data = await response.json();
        setHolidays(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching holidays:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year]);

  return { holidays, loading, error };
};

export default useFetchHolidays;
