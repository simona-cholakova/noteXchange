import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProviderProfile.css';  

const backendBaseURL = 'http://88.200.63.148:9333';

export default function ProviderProfile() {
    const { enrolment_id } = useParams();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const res = await fetch(`${backendBaseURL}/api/providers/${enrolment_id}`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch provider');
                const data = await res.json();
                setProvider(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProvider();
    }, [enrolment_id]);

    if (loading) return <p>Loading provider profile...</p>;
    if (!provider) return <p>Provider not found.</p>;

    return (
        <div className="provider-profile">
            {/* Profile Picture */}
            {provider.picture_url && (
                <img
                    src={`${backendBaseURL}${provider.picture_url}`} // full path
                    alt={`${provider.provider_name} ${provider.provider_surname}`}
                />
            )}

            <h1>{provider.provider_name} {provider.provider_surname}</h1>
            <p><strong>Enrolment ID:</strong> {provider.provider_enrolment_id}</p>
            <p><strong>About me: </strong>{provider.provider_about_me}</p>
            <p><strong>Email: </strong>
                <a href={`mailto:${provider.email}`} className="provider-email">
                    {provider.provider_email}
                </a>
            </p>
            <p><strong>Role:</strong> {provider.provider_role}</p>
        </div>
    );
}
