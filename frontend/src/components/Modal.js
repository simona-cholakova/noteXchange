import React from 'react';
import '../styles/Modal.css'; 

export default function Modal({ title, onClose, children }) {
    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {title && <h2>{title}</h2>}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
