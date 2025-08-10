import React, { useEffect, useState } from 'react';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [aboutMe, setAboutMe] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [applyStep, setApplyStep] = useState('idle'); // idle, showUpload, uploading, done
  const [applyStatus, setApplyStatus] = useState('');
  const backendBaseURL = 'http://88.200.63.148:9333';

  // Fetch user profile data on mount
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

  // Initialize aboutMe textarea when profile loads
  useEffect(() => {
    if (profile) setAboutMe(profile.aboutMe || '');
  }, [profile]);

  // Handle profile picture upload
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
        // Update profile_picture with full URL path returned from backend
        setProfile(prev => ({ ...prev, picture_url: data.url }));
      } else {
        setUploadStatus('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    }
  };

  // Handle click on "Apply" text/button
  const handleApplyClick = () => {
    setApplyStep('showUpload');
  };

  // Handle academic record upload for applying as student provider
  const handleApplyFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setApplyStep('uploading');
    setApplyStatus('');

    const formData = new FormData();
    formData.append('academicRecord', file);

    try {
      const res = await fetch(`${backendBaseURL}/api/applyStudentProvider`, {
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
        setApplyStatus('success');
        setApplyStep('done');
      } else {
        setApplyStatus('error: ' + (data.error || 'Unknown error'));
        setApplyStep('showUpload');
      }
    } catch (error) {
      setApplyStatus('error: ' + error.message);
      setApplyStep('showUpload');
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
          {profile.picture_url ? (
            <img
              src={`${backendBaseURL}${profile.picture_url}`}
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

      {uploadStatus && <p style={{ textAlign: 'center', color: uploadStatus.includes('failed') ? 'red' : 'green' }}>{uploadStatus}</p>}

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

      {/* Apply section */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {applyStep === 'idle' && (
          <>
            <p>Do u want to become one of our student providers? <button onClick={handleApplyClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}>click here to apply</button></p>
          </>
        )}

        {applyStep === 'showUpload' && (
          <>
            <p style={{ marginBottom: '15px' }}>
              For quality reasons of this system we would kindly ask u to submit your current academic records.<br />
              Thank you in advance for your interest for becoming student provider!
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleApplyFileChange}
              style={{ marginBottom: '10px' }}
            />
            {applyStatus.startsWith('error') && (
              <p style={{ color: 'red' }}>{applyStatus}</p>
            )}
            {applyStatus === '' && <p>Please upload your academic records file (PDF or image).</p>}
          </>
        )}

        {applyStep === 'uploading' && (
          <p>Uploading your file, please wait...</p>
        )}

        {applyStep === 'done' && (
          <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '8px',
            border: '1px solid #c3e6cb',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <p>
              A mail to the administrator has been sent.<br />
              He will review your application and reply within 5 days.<br />
              Thank you for your patience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
