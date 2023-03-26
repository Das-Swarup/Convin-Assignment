import React, { useState } from 'react';

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
        <button className='home-btn' type="submit">Create</button>
      </form>
    );
  }

  export default CreateCard;