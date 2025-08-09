import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const InsideCard = () => {
    const { id } = useParams(); // material_id from URL
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const res = await fetch(`http://88.200.63.148:9333/api/materials/${id}`, {
                    credentials: 'include', // if you need cookies/session
                }); if (!res.ok) throw new Error('Failed to fetch material');
                const data = await res.json();
                setMaterial(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterial();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!material) return <p>Material not found.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{material.title}</h1>
            <p><strong>Provider:</strong> {material.provider_name}</p>
            <p><strong>Type:</strong> {material.type}</p>
            <p><strong>Academic Year:</strong> {material.academic_year}</p>
            <p><strong>Study Program:</strong> {material.study_program}</p>
            <p><strong>University:</strong> {material.university}</p>
            <p><strong>Course:</strong> {material.course}</p>
            <p><strong>Created At:</strong> {new Date(material.created_at).toLocaleString()}</p>
            <p><strong>Description:</strong> {material.description}</p>

            {material.hasFile && (
                <a
                    href={material.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        padding: '10px 15px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '5px',
                        textDecoration: 'none'
                    }}
                >
                    📄 Download PDF
                </a>
            )}
        </div>
    );
};

export default InsideCard;
