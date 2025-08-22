import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long',
      hour12: false,
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };

  return (
    <div className="text-blue-500 text-sm mt-2 font-mono">
      {formatDate()}
    </div>
  );
};

export default Clock;
