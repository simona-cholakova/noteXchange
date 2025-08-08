import React, { useEffect, useState } from 'react';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [aboutMe, setAboutMe] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const backendBaseURL = 'http://88.200.63.148:9333';

  useEffect(() => {
    fetch(`${backendBaseURL}/api/userData`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await fetch(`${backendBaseURL}/api/uploads`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.substring(0, 100)}...`);
      }

      if (res.ok) {
        setUploadStatus('Upload successful!');
        setProfile(prev => ({ ...prev, profile_picture: data.filename }));
      } else {
        setUploadStatus('Upload failed: ' + data.error);
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
        <label
          htmlFor="fileInput"
          style={{
            cursor: 'pointer',
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e0e0e0',
            border: '2px solid #ccc',
            textAlign: 'center',
            fontSize: '14px',
            color: '#777',
          }}
        >
          {profile.profile_picture ? (
            <img
              src={`${backendBaseURL}/uploads/${profile.profile_picture}`}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            'Upload Picture'
          )}
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      {uploadStatus && <p style={{ textAlign: 'center', color: 'green' }}>{uploadStatus}</p>}

      <h2 style={{ textAlign: 'center' }}>
        {profile.name} {profile.surname}
      </h2>

      <div style={{ marginTop: '30px' }}>
        <label htmlFor="aboutMe" style={{ fontWeight: 'bold' }}>About Me</label>
        <textarea
          id="aboutMe"
          value={aboutMe}
          onChange={e => setAboutMe(e.target.value)}
          placeholder="Write something about yourself..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>University:</strong> {profile.university}</p>
        <p><strong>Academic Year:</strong> {profile.academic_year}</p>
        <p><strong>Study Program:</strong> {profile.study_program}</p>
      </div>
    </div>
  );
}
