import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ProviderHome.css';
import MaterialCard from '../components/MaterialCard';

export default function ProviderHome() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [allMaterials, setAllMaterials] = useState([]); // <-- added
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Course');

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        provider_enrolment_id: '',
        provider_name: '',
        provider_surname: '',
        file: null,
        type: 'digital',
        academic_year: '',
        study_program: '',
        university: '',
        course: ''
    });

    // Load provider info once on mount
    useEffect(() => {
        const enrolmentId = localStorage.getItem('provider_enrolment_id') || '';
        const fullName = localStorage.getItem('provider_name') || '';
        const surname = localStorage.getItem('provider_surname') || '';

        setFormData(prev => ({
            ...prev,
            provider_enrolment_id: enrolmentId,
            provider_name: fullName,
            provider_surname: surname
        }));
    }, []);

    // Fetch all materials on first load
    useEffect(() => {
        fetch('http://88.200.63.148:9333/api/studymaterials')
            .then(res => res.json())
            .then(data => {
                setAllMaterials(data);
                setResults(data); // initially show all materials
            })
            .catch(err => console.error('Error fetching all materials:', err));
    }, []);

    // Fetch filtered results when searchTerm or selectedFilter changes
    useEffect(() => {
        if (!searchTerm) {
            setResults(allMaterials); // show all if search is empty
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
    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setSearchTerm('');
        setResults(allMaterials); // reset to all materials on filter change
        setShowDropdown(false);
    };

    // rest of your code unchanged...

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'file' ? files[0] : value,
        }));
    };

    // New logout handler
    const handleLogout = async () => {
        try {
            const response = await fetch('http://88.200.63.148:9333/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                navigate('/login');
            } else {
                alert('Logout failed.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout error');
        }
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch('http://88.200.63.148:9333/api/publish', {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Failed to publish material');
            alert('Material published successfully!');
            setFormData(prev => ({
                ...prev,
                title: '',
                description: '',
                file: null,
                type: 'digital',
                academic_year: '',
                study_program: '',
                university: '',
                course: ''
            }));
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert('Error publishing material');
        }
    };

    return (
        <div className="container">
            <Link to="/profile" className="profile-link">
                My Profile
            </Link>

            {/* New My Materials button */}
            <button
                onClick={async () => {
                    try {
                        const name = localStorage.getItem('provider_name') || '';
                        const surname = localStorage.getItem('provider_surname') || '';

                        const url = `http://88.200.63.148:9333/api/filters/provider?provider_name=${encodeURIComponent(name)}&provider_surname=${encodeURIComponent(surname)}`;
                        console.log("Request URL:", url);

                        const res = await fetch(url);
                        if (!res.ok) throw new Error('Failed to fetch materials');

                        const data = await res.json();
                        console.log("My materials:", data);
                        setResults(data);
                    } catch (err) {
                        console.error(err);
                        alert('Error fetching your materials');
                    }
                }}
                className="my-materials-button"
                style={{ display: 'block', marginTop: '10px' }}
            >
                My Materials
            </button>


            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="logout-button"
                style={{ display: 'block', marginTop: '10px' }}
            >
                Logout
            </button>

            <h1>Provider Home Page</h1>

            <button onClick={() => setShowForm(true)} className="publish-button">
                Publish New Material
            </button>

            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder={`Search materials by ${selectedFilter.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <div className="dropdown-container">
                    <button onClick={toggleDropdown} className="dropdown-button">
                        Search By ...
                    </button>
                    {showDropdown && (
                        <ul className="dropdown-menu">
                            {['University', 'Provider', 'Academic Year', 'Study Program', 'Course'].map(option => (
                                <li
                                    key={option}
                                    onClick={() => handleFilterSelect(option)}
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
                    <MaterialCard
                        key={idx}
                        material={item}
                        onClick={(mat) => console.log('Clicked:', mat)}
                    />
                ))}
            </div>

            {showForm && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowForm(false)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Escape') setShowForm(false) }}
                >
                    <form
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside form
                        onSubmit={handleFormSubmit}
                        className="publish-form"
                    >
                        <button
                            type="button"
                            className="close-button"
                            onClick={() => setShowForm(false)}
                            aria-label="Close form"
                        >
                            &times;
                        </button>

                        <input
                            type="text"
                            name="provider_enrolment_id"
                            value={formData.provider_enrolment_id}
                            readOnly
                            hidden
                        />

                        <input
                            name="provider_name"
                            placeholder="Provider Name"
                            value={formData.provider_name}
                            onChange={handleFormChange}
                            required
                        />

                        <input
                            name="provider_surname"
                            placeholder="Provider Surname"
                            value={formData.provider_surname}
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

                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );

}
