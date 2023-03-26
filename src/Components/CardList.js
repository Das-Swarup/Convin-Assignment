import React from "react";
import Card from "./Card";

function CardList({ cards, onDelete, onUpdate, onEdit }) {
  const buckets = [...new Set(cards.map((card) => card.bucket))];

  const handleDeleteCard = (id) => {
    onDelete(id);
  };

  return (
    <div>
      {buckets.map((bucket) => (
        <div key={bucket}>
          <h2>Bucket:{bucket}</h2>
          <div className="cardlist">
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
        </div>
      ))}
    </div>
  );
}

export default CardList;
