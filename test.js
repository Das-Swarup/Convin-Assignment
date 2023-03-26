import './App.css';
import React, { useState, useEffect } from 'react';

function Card({ card, onDelete, onUpdate, onEdit, onDeleteBucket }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(card.name);
    const [media, setMedia] = useState(card.media);
    const [bucket, setBucket] = useState(card.bucket);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        onDelete(card.id);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate({ name, media, bucket });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDeleteBucket = () => {
        onDeleteBucket(card.bucket);
    };

    const handleCardClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleUpdate}>
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <label>Media:</label>
                <input value={media} onChange={(e) => setMedia(e.target.value)} />
                <br />
                <label>Bucket:</label>
                <input value={bucket} onChange={(e) => setBucket(e.target.value)} />
                <br />
                <button type="submit">Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        );
    } else {
        return (
            <div>
                <h3 onClick={handleCardClick}>Name: {card.name}</h3>
                <p onClick={handleCardClick}>Media: {card.media}</p>
                <p onClick={handleCardClick}>Bucket: {card.bucket}</p>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
                {/* <button onClick={handleDeleteBucket}>Delete Bucket</button> */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                            <iframe src={card.media}></iframe>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

function CreateCard({ onCreate }) {
    const [name, setName] = useState('');
    const [media, setMedia] = useState('');
    const [bucket, setBucket] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      fetch('http://localhost:3000/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, media, bucket }),
      })
        .then((res) => res.json())
        .then((newCard) => {
          onCreate(newCard);
          setName('');
          setMedia('');
          setBucket('');
        });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Media:</label>
        <input value={media} onChange={(e) => setMedia(e.target.value)} />
        <br />
        <label>Bucket:</label>
        <input value={bucket} onChange={(e) => setBucket(e.target.value)} />
        <br />
        <button type="submit">Create</button>
      </form>
    );
  }


function CardList({ cards, onDelete, onUpdate, onEdit, onDeleteBucket }) {
    const buckets = [...new Set(cards.map((card) => card.bucket))];

    const handleDeleteBucket = (bucket) => {
        onDeleteBucket(bucket);
    };

    const handleDeleteCard = (id) => {
        onDelete(id);
    };

    return (
        <div>
            {buckets.map((bucket) => (
                <div key={bucket}>
                    <h2>{bucket}</h2>
                    <button onClick={() => handleDeleteBucket(bucket)}>Delete Bucket</button>
                    {cards
                        .filter((card) => card.bucket === bucket)
                        .map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                onDelete={() => handleDeleteCard(card.id)}
                                onUpdate={(updatedCard) => onUpdate(card.id, updatedCard)}
                                onEdit={() => onEdit(card.id)}
                            />
                        ))}
                </div>
            ))}
        </div>
    );
}

function App() {
  const [cards, setCards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/cards')
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  const handleCreateCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  const handleDeleteCard = (id) => {
    fetch(`http://localhost:3000/cards/${id}`, { method: 'DELETE' }).then(() =>
      setCards(cards.filter((card) => card.id !== id))
    );
  };

  const handleUpdateCard = (id, updatedCard) => {
    fetch(`http://localhost:3000/cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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

  return (
    <div>
      {isCreating ? (
        <CreateCard onCreate={handleCreateCard} />
      ) : (
        <div>
          <h1>My Cards</h1>
          {createCardButton}
          <CardList
            cards={cards}
            onDelete={handleDeleteCard}
            onUpdate={handleUpdateCard}
            onEdit={handleEditCard}
            onDeleteBucket={handleDeleteBucket}
          />
        </div>
      )}
    </div>
  );
}

export default App;