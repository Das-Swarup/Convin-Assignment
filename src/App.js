import "./App.css";
import React, { useState, useEffect } from "react";
import CreateCard from "./Components/CreateCard";
import CardList from "./Components/CardList";
import History from "./Components/History";

function App() {
  const [cards, setCards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);



  useEffect(() => {
    fetch("http://localhost:3000/cards")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  const handleCreateCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  const handleDeleteCard = (id) => {
    fetch(`http://localhost:3000/cards/${id}`, { method: "DELETE" }).then(() =>
      setCards(cards.filter((card) => card.id !== id))
    );
  };

  const handleUpdateCard = (id, updatedCard) => {
    fetch(`http://localhost:3000/cards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCard),
    })
      .then((res) => res.json())
      .then((data) =>
        setCards(cards.map((card) => (card.id === id ? data : card)))
      );
  };

  const handleEditCard = (id) => {
    setCards(
      cards.map((card) => {
        if (card.id === id) {
          return { ...card, isEditing: true };
        } else {
          return card;
        }
      })
    );
  };


  return (
    <div className="app-container">
      <div className="app">
        <h1>My Cards</h1>
        <button className="home-btn" onClick={()=>setIsCreating(true)}>Add Card</button>
        {isCreating ?<>
          <CreateCard onCreate={handleCreateCard} />
        <button className="home-btn" onClick={()=>setIsCreating(false)}>Cancel</button>
        </>  : <></>}
        <CardList
          cards={cards}
          onDelete={handleDeleteCard}
          onUpdate={handleUpdateCard}
          onEdit={handleEditCard}

        />
      </div>

      <History cards={cards} />
    </div>
  );
}

export default App;
