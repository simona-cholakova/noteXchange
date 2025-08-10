import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MaterialCard.css';

export default function MaterialCard({ material }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/material/${material.material_id}`); 
    };


    return (
        <div className="material-card" onClick={handleClick}>
            <h3 className="material-title">{material.title}</h3>
            <p className="material-meta"><strong>Provider:</strong> {material.provider_name}</p>
            <p className="material-meta"><strong>Course:</strong> {material.course}</p>
        </div>
    );
}