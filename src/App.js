import "./App.css";
import React, { useState, useEffect } from "react";
import CreateCard from "./Components/CreateCard";
import CardList from "./Components/CardList";
import History from "./Components/History";

function App() {
  const [cards, setCards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [modalContent, setModalContent] = useState(null);

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

  const handleDeleteBucket = (bucket) => {
    setSelectedBucket(bucket);
    setSelectedCards(cards.filter((card) => card.bucket === bucket));
    setIsDeleting(true);
  };

  const handleConfirmDelete = () => {
    selectedCards.forEach((card) => handleDeleteCard(card.id));
    setIsDeleting(false);
    setSelectedBucket(null);
    setSelectedCards([]);
    setModalContent(null);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setSelectedBucket(null);
    setSelectedCards([]);
    setModalContent(null);
  };

  const createCardButton = <CreateCard onCreate={handleCreateCard} />;
  console.log(isCreating);

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
          onDeleteBucket={handleDeleteBucket}
        />
      </div>

      <History cards={cards} />
    </div>
  );
}

export default App;
