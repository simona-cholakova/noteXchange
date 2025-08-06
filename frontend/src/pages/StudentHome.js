import React, { useState } from 'react';

export default function StudentHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    console.log('Searching for:', e.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleFilterSelect = (filter) => {
    console.log('Selected filter:', filter);
    setShowDropdown(false);
    // TODO: Add logic to apply the selected filter
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Home Page</h1>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search materials by course name..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '8px',
            fontSize: '16px',
            flex: '1',
          }}
        />
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleDropdown}
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Search By ...
          </button>

          {showDropdown && (
            <ul 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                padding: '0',
                margin: '4px 0 0 0',
                listStyle: 'none',
                width: '150px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                zIndex: 1000,
              }}
            >
              {['University', 'Provider', 'Academic Year', 'Study Program'].map(option => (
                <li
                  key={option}
                  onClick={() => handleFilterSelect(option)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
