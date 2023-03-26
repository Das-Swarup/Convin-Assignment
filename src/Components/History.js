import React, { useState, useEffect } from 'react';

function History({ cards }) {
    const [history, setHistory] = useState([]);
  
    useEffect(() => {
      const playedCards = cards.filter((card) => card.played || card.clicked);
      setHistory(playedCards);
    }, [cards]);
  
    return (
      <div>
        <h2>History</h2>
        <ul>
          {history.map((card) => (
            <li key={card.id}>{card.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  export default History