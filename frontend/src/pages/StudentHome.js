import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudentHome.css';
import MaterialCard from '../components/MaterialCard';

export default function StudentHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Course');
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState(null);

  //states for apply form
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  //fetch all materials on first load
  useEffect(() => {
    fetch('http://88.200.63.148:9333/api/studymaterials')
      .then(res => res.json())
      .then(data => {
        setAllMaterials(data);
        setResults(data); //initially display all
      })
      .catch(err => console.error('Error fetching all materials:', err));
  }, []);

  //fetch filtered results when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setResults(allMaterials);
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
        .then(data => setResults(data))
        .catch(err => console.error('Error fetching:', err));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedFilter, allMaterials]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const fetchProviders = () => {
    setLoadingProviders(true);
    setProvidersError(null);
    fetch('http://88.200.63.148:9333/api/allProviders')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch providers');
        return res.json();
      })
      .then(data => {
        setProviders(data);
        setLoadingProviders(false);
      })
      .catch(err => {
        setProvidersError(err.message);
        setLoadingProviders(false);
      });
  };

  const handleOpenProvidersModal = () => {
    fetchProviders();
    setShowProvidersModal(true);
  };

  const handleCloseProvidersModal = () => {
    setShowProvidersModal(false);
    setProviders([]);
    setProvidersError(null);
  };

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setSearchTerm('');
    setResults(allMaterials);
    setShowDropdown(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload your academic records file before submitting.');
      return;
    }
    setSubmitted(true);
    setFile(null);
  };


  return (
    <div className="student-home">
      <div className="button-group">
        <button
          onClick={() => {
            setShowApplyForm(true);
            setSubmitted(false);
            setFile(null);
          }}
          className="my-profile-btn"
          id="apply"
        >
          Apply for Provider
        </button>

        <Link to="/profile" className="my-profile-btn"><strong>My Profile</strong></Link>

        <button onClick={handleOpenProvidersModal} className="my-profile-btn">
          Show All Providers
        </button>

        <button
          onClick={() => {
            window.location.href = 'http://88.200.63.148:3990/login';

          }}
          className="my-profile-btn logout-btn"
        >
          Logout
        </button>
      </div>

      {showApplyForm ? (
        <div className="apply-form-container">
          <button
            className="close-btn"
            onClick={() => setShowApplyForm(false)}
            aria-label="Close apply form"
          >
            &times;
          </button>
          {!submitted ? (
            <>
              <p>
                Thank you for your interest for becoming a student provider! For quality reasons of
                our system, we would kindly ask you to upload your current academic records.
              </p>
              <form onSubmit={handleSubmit}>
                <label htmlFor="file-upload" className="custom-file-upload">
                  {file ? file.name : "Choose file"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  required
                  style={{ display: 'none' }} //hide the default input
                />
                <br />
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </form>

            </>
          ) : (
            <p>
              Submission has been sent to our administrators. They will review the submission and
              contact you. Thank you for your patience.
            </p>
          )}
        </div>
      ) : (
        <>
          <h1>Student Home Page</h1>

          <div className="search-container">
            <input
              type="text"
              placeholder={`Search materials by ${selectedFilter.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <div className="dropdown-container">
              <button onClick={toggleDropdown} className="dropdown-btn">
                Search By ...
              </button>

              {showDropdown && (
                <ul className="dropdown-menu">
                  {['University', 'Provider', 'Academic Year', 'Study Program', 'Course'].map(
                    (option) => (
                      <li
                        key={option}
                        onClick={() => handleFilterSelect(option)}
                        className="dropdown-item"
                      >
                        {option}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Providers Modal */}
          {showProvidersModal && (
            <div className="modal-overlay" onClick={handleCloseProvidersModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleCloseProvidersModal} aria-label="Close providers list">&times;</button>
                <h2>All Providers</h2>

                {loadingProviders && <p>Loading providers...</p>}
                {providersError && <p className="error-text">{providersError}</p>}

                {!loadingProviders && !providersError && providers.length === 0 && (
                  <p>No providers found.</p>
                )}

                <div className="providers-list">
                  {providers.map((provider) => (
                    <div key={provider.enrolment_id} className="provider-card">
                      <img
                        src={`http://88.200.63.148:9333${provider.picture_url}`}
                        alt={`${provider.name} ${provider.surname}`}
                        className="provider-picture"
                      />
                      <div className="provider-info">
                        <p className="provider-name">{provider.name} {provider.surname}</p>
                        <a href={`mailto:${provider.email}`} className="provider-email">
                          {provider.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="search-results">
            {results.map((item, idx) => (
              <MaterialCard
                key={idx}
                material={item}
                onClick={(mat) => console.log('Clicked:', mat)} 
              />
            ))}
          </div>

        </>
      )}
    </div>
  );
}