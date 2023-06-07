import React, { useEffect, useState } from 'react';

const Counter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      if (counter >= value) {
        clearInterval(interval);
      } else {
        counter++;
        setCount(counter);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return <span>{count}</span>;
};

export default Counter;
