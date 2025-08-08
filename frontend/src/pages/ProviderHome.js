import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/StudentHome.css';

export default function ProviderHome() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Course');

    const [showForm, setShowForm] = useState(false);
    const [providerName, setProviderName] = useState('');  // store fetched provider name

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        provider_name: '', // now editable
        file: null,
        type: 'digital',
        academic_year: '',
        study_program: '',
        university: '',
        course: ''
    });

    // Fetch provider info after component mounts (or user logs in)
    useEffect(() => {
        const fullName = localStorage.getItem('provider_name') || '';
        setProviderName(fullName);
        setFormData(prev => ({
            ...prev,
            provider_name: fullName,  // prefill, but editable now
        }));
    }, []);

    // Search effect
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
                .then(data => setResults(data))
                .catch(err => console.error('Error fetching:', err));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedFilter]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setSearchTerm('');
        setResults([]);
        setShowDropdown(false);
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'file' ? files[0] : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch('http://88.200.63.148:9333/api/materials/publish', {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Failed to publish material');
            alert('Material published successfully!');
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                provider_name: providerName, // keep prefilled provider name after submit
                file: null,
                type: 'digital',
                academic_year: '',
                study_program: '',
                university: '',
                course: ''
            });
        } catch (error) {
            console.error(error);
            alert('Error publishing material');
        }
    };

    return (
        <div style={{ padding: '20px', position: 'relative' }}>
            <Link to="/profile" style={{
                position: 'absolute',
                top: 20,
                right: 20,
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid #007bff',
                backgroundColor: 'white',
                color: '#007bff',
                fontWeight: 'bold',
                textDecoration: 'none'
            }}>
                My Profile
            </Link>

            <h1>Provider Home Page</h1>

            <button onClick={() => setShowForm(true)} style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            }}>
                Publish New Material
            </button>

            <div style={{ display: 'flex', gap: '10px', marginTop: '40px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder={`Search materials by ${selectedFilter.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ padding: '8px', fontSize: '16px', flex: '1' }}
                />
                <div style={{ position: 'relative' }}>
                    <button onClick={toggleDropdown} style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}>
                        Search By ...
                    </button>
                    {showDropdown && (
                        <ul style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            padding: 0,
                            margin: '4px 0 0 0',
                            listStyle: 'none',
                            width: '150px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                        }}>
                            {['University', 'Provider', 'Academic Year', 'Study Program', 'Course'].map(option => (
                                <li
                                    key={option}
                                    onClick={() => handleFilterSelect(option)}
                                    style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
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
                    <div key={idx} className="material-card" onClick={() => console.log('Clicked:', item)}>
                        <h3 className="material-title">{item.title}</h3>
                        <p className="material-meta"><strong>Provider:</strong> {item.provider_name}</p>
                        <p className="material-meta"><strong>Course:</strong> {item.course}</p>
                    </div>
                ))}
            </div>

            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }}>
                    <form onSubmit={handleFormSubmit} style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <h2>Publish Material</h2>

                        <input
                            name="provider_name"
                            placeholder="Provider Name"
                            value={formData.provider_name}
                            onChange={handleFormChange}
                            required
                        />

                        {['title', 'description', 'academic_year', 'study_program', 'university', 'course'].map(field => (
                            <input
                                key={field}
                                name={field}
                                placeholder={field.replace('_', ' ')}
                                value={formData[field]}
                                onChange={handleFormChange}
                                required
                            />
                        ))}

                        <select name="type" value={formData.type} onChange={handleFormChange} required>
                            <option value="digital">Digital</option>
                            <option value="physical">Physical</option>
                            <option value="digital and physical">Digital and Physical</option>
                        </select>

                        <input
                            type="file"
                            name="file"
                            accept="application/pdf"
                            onChange={handleFormChange}
                            required
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
