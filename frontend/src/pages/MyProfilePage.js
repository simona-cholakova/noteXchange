import React, { useEffect, useState } from 'react';
import '../styles/MyProfilePage.css';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [aboutMe, setAboutMe] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false); // start in view mode by default
  const backendBaseURL = 'http://88.200.63.148:9333';

  useEffect(() => {
    fetch(`${backendBaseURL}/api/userData`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user profile');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setAboutMe(data.about_me || '');
        // auto-switch to edit mode if no about_me text
        if (!data.about_me) {
          setIsEditingAboutMe(true);
        }
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  const handleSaveAboutMe = async () => {
    try {
      const res = await fetch(`${backendBaseURL}/api/updateAboutMe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ about_me: aboutMe })
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(prev => ({ ...prev, about_me: aboutMe })); // keep profile in sync
        setIsEditingAboutMe(false); // back to view mode
      } else {
        console.error(data.error || 'Failed to update');
      }
    } catch (err) {
      console.error('Error saving about me:', err);
    }
  };

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
        setProfile(prev => ({ ...prev, picture_url: data.url }));
      } else {
        setUploadStatus('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    }
  };

  if (!profile) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-picture-wrapper">
        <label htmlFor="fileInput" className="profile-picture-label">
          {profile.picture_url ? (
            <img
              src={`${backendBaseURL}${profile.picture_url}`}
              alt="Profile"
              className="profile-picture"
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

      {uploadStatus && (
        <p className={`upload-status ${uploadStatus.includes('failed') ? 'error' : 'success'}`}>
          {uploadStatus}
        </p>
      )}

      <h2 className="profile-name">
        {profile.name} {profile.surname}
      </h2>

      <div className="about-me-section">
        <label>About Me</label>
        {isEditingAboutMe ? (
          <>
            <textarea
              id="about_me"
              value={aboutMe}
              onChange={e => setAboutMe(e.target.value)}
              placeholder="Write something about yourself..."
              rows={4}
            />
            <button onClick={handleSaveAboutMe}>Save</button>
          </>
        ) : (
          <>
            <p>{aboutMe || 'No information provided.'}</p>
            <button onClick={() => setIsEditingAboutMe(true)}>Edit</button>
          </>
        )}
      </div>

      <div className="profile-info">
        <p><strong>University:</strong> UP FAMNIT</p>
        <p><strong>Year of Study:</strong> 2nd</p>
        <p><strong>Study Program:</strong> Computer Science</p>
      </div>
    </div>
  );
}
