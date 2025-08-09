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
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch material');
        const data = await res.json();

        // Fix: Make sure downloadUrl is full URL
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
        <button
          onClick={downloadPdf}
          style={{
            marginTop: '10px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📄 Download PDF
        </button>
      )}
    </div>
  );
};

export default InsideCard;
