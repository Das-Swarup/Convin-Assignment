import React, { useState } from 'react';

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
            <form onSubmit={handleUpdate} className="card">
                <div  className="card-content">
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <label>Media:</label>
                <input value={media} onChange={(e) => setMedia(e.target.value)} />
                <br />
                <label>Bucket:</label>
                <input value={bucket} onChange={(e) => setBucket(e.target.value)} />
                <br />
                </div>
                <button type="submit">Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        );
    } else {
        return (
            <div className='card'>
                <div onClick={handleCardClick} className="card-content">
                <h3 onClick={handleCardClick}>Name: {card.name}</h3>
                <p onClick={handleCardClick}>Media: {card.media}</p>
                <p onClick={handleCardClick}>Bucket: {card.bucket}</p>
                </div>
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

export default Card;
