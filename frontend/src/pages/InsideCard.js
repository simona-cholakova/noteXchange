import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/InsideCard.css';

const InsideCard = () => {
  const { id } = useParams(); //material_id from URL
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await fetch(`http://88.200.63.148:9333/api/material/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch material');
        const data = await res.json();

        if (data.downloadUrl && !data.downloadUrl.startsWith('http')) {
          data.downloadUrl = `http://88.200.63.148:9333${data.downloadUrl}`;
        }

        setMaterial(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  const downloadPdf = async () => {
    try {
      const response = await fetch(material.downloadUrl, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleRatingClick = async (value) => {
    setRating(value);

    const loggedInUserId = localStorage.getItem('provider_enrolment_id'); // or from your auth state/context

    try {
      const res = await fetch('http://88.200.63.148:9333/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: loggedInUserId,
          material_id: id, // from useParams
          rating_value: value,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit rating');

      const data = await res.json();
      console.log('Rating saved:', data);
      alert('Thanks for your rating!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to save rating.');
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!material) return <p>Material not found.</p>;

  return (
    <div className="inside-card-container">
      <h1>{material.title}</h1>
      <p>
        <strong>Provider:</strong>{' '}
        {material.provider_role === 'provider' && material.provider_enrolment_id ? (
          <Link to={`/providers/${material.provider_enrolment_id}`}>
            {material.provider_name} {material.provider_surname}
          </Link>
        ) : (
          `${material.provider_name || ''} ${material.provider_surname || ''}`
        )}
      </p>

      <p><strong>Type:</strong> {material.type}</p>
      <p><strong>Academic Year:</strong> {material.academic_year}</p>
      <p><strong>Study Program:</strong> {material.study_program}</p>
      <p><strong>University:</strong> {material.university}</p>
      <p><strong>Course:</strong> {material.course}</p>
      <p><strong>Created At:</strong> {new Date(material.created_at).toLocaleString()}</p>
      <p><strong>Description:</strong> {material.description}</p>

      {material.hasFile && (
        <button className="download-btn" onClick={downloadPdf}>
          📄 Download PDF
        </button>
      )}

      <div className="rating-container">
        <strong>Rate this material:</strong>
        <div className="rating-buttons">
          {[...Array(10)].map((_, i) => {
            const val = i + 1;
            return (
              <button
                key={val}
                onClick={() => handleRatingClick(val)}
                className={rating === val ? 'rating-btn selected' : 'rating-btn'}
              >
                {val}
              </button>
            );
          })}
        </div>
        {rating && <p>You rated: {rating} / 10</p>}
      </div>

    </div>
  );
};

export default InsideCard;
