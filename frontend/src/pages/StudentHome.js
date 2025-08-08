import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // import navigate
import '../styles/StudentHome.css';
import { Link } from 'react-router-dom';


export default function StudentHome() {
  const navigate = useNavigate();  // init navigate

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Course');

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const filterMap = {
        'Course': 'course',
        'University': 'university',
        'Provider': 'provider',
        'Academic Year': 'year',
        'Study Program': 'program',
      };

      const apiFilter = filterMap[selectedFilter] || 'course';
      const url = `http://88.200.63.148:9333/api/filters/${apiFilter}?name=${encodeURIComponent(searchTerm)}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          setResults(data);
        })
        .catch(err => console.error('Error fetching:', err));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setSearchTerm('');
    setResults([]);
    setShowDropdown(false);
  };

  // New handler to navigate to MyProfile page
  const goToMyProfile = () => {
    navigate('./profile');
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* My Profile button top right */}
      <Link to="/profile" style={{position: 'absolute', top: 20, right: 20, padding: '8px 16px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #007bff', backgroundColor: 'white', color: '#007bff', fontWeight: 'bold', textDecoration: 'none'}}>
  My Profile
</Link>


      <h1>Student Home Page</h1>

      <div style={{ display: 'flex', gap: '10px', marginTop: '60px', position: 'relative' }}>
        <input
          type="text"
          placeholder={`Search materials by ${selectedFilter.toLowerCase()}...`}
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
              {['University', 'Provider', 'Academic Year', 'Study Program', 'Course'].map(option => (
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

      <div className="search-results">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="material-card"
            onClick={() => console.log('Clicked:', item)} // Navigation later
          >
            <h3 className="material-title">{item.title}</h3>
            <p className="material-meta"><strong>Provider:</strong> {item.provider_name}</p>
            <p className="material-meta"><strong>Course:</strong> {item.course}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
