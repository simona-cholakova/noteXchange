import React, { useState } from 'react';
import Modal from './Modal';

export default function MyRatingsButton() {
  const [showModal, setShowModal] = useState(false);
  const [myRatings, setMyRatings] = useState([]);

  const fetchMyRatings = async () => {
    // Replace this with your actual API call
    const response = await fetch('/my-ratings-endpoint');
    const data = await response.json();
    setMyRatings(data);
    setShowModal(true);
  };

  return (
    <div>
      <button onClick={fetchMyRatings}>My Ratings</button>

      {showModal && (
        <Modal title="My Ratings" onClose={() => setShowModal(false)}>
          {myRatings.length === 0 ? (
            <p>No ratings yet.</p>
          ) : (
            myRatings.map((material, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <strong>{material.title}</strong> ({material.course})<br />
                University: {material.university}<br />
                Ratings: {material.ratings.join(", ")}
              </div>
            ))
          )}
        </Modal>
      )}
    </div>
  );
}
