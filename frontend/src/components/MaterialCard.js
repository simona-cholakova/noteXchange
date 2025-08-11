import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MaterialCard.css';

export default function MaterialCard({ material, onDelete, showDelete = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/material/${material.material_id}`);
  };

  return (
    <div className="material-card" onClick={handleClick}>
      <p><strong>ID:</strong> {material.material_id}</p>
      <h3 className="material-title">{material.title}</h3>
      <p className="material-meta"><strong>Provider:</strong> {material.provider_name}</p>
      <p className="material-meta"><strong>Course:</strong> {material.course}</p>

      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(material.id || material.material_id);
          }}
          style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}
        >
          Delete
        </button>
      )}
    </div>
  );
}