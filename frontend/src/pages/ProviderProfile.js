import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const backendBaseURL = 'http://88.200.63.148:9333';

export default function ProviderProfile() {
  const { enrolment_id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await fetch(`${backendBaseURL}/api/users/${enrolment_id}`, {
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
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{provider.name} {provider.surname}</h1>
      {provider.picture_url && (
        <img
          src={`${backendBaseURL}${provider.picture_url}`}
          alt={`${provider.name} profile`}
          style={{ width: '120px', height: '120px', borderRadius: '50%' }}
        />
      )}
      <p><strong>Enrolment ID:</strong> {provider.enrolment_id}</p>
      <p><strong>Email:</strong> {provider.email}</p>
      <p><strong>Role:</strong> {provider.role}</p>
      {/* add more provider info here */}
    </div>
  );
}
