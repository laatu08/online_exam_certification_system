import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile/me', { headers:{ Authorization: `Bearer ${localStorage.getItem('token')}` }});
      setUser(res.data);
      setForm({
        name: res.data.name || '',
        phone_number: res.data.phone_number || '',
        bio: res.data.bio || '',
        date_of_birth: res.data.date_of_birth ? res.data.date_of_birth.slice(0,10) : '',
        address: res.data.address || '',
        gender: res.data.gender || '',
        social_links: res.data.social_links || []
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      await axios.put('http://localhost:5000/api/profile/me', form, { headers:{ Authorization: `Bearer ${localStorage.getItem('token')}` }});
      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        await axios.post('http://localhost:5000/api/profile/me/avatar', fd, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }});
      }
      setMsg('Profile updated');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || 'Update failed');
    }
  };

  const changePassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/profile/me/change-password', pwd, { headers:{ Authorization: `Bearer ${localStorage.getItem('token')}` }});
      setMsg('Password changed');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Password change failed');
    }
  };

  if (!user) return <div className="profile-page">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar-wrap">
            <img
              src={avatarPreview || user.profile_picture || '/default-avatar.png'}
              alt="avatar"
              className="avatar-img"
            />
            {editing && (
              <input type="file" accept="image/*" onChange={handleFile} className="avatar-input" />
            )}
          </div>

          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <p className="muted">Role: {user.role}</p>

          <div className="stats">
            <div><strong>{user.passed_exams || 0}</strong><span>Passed</span></div>
            <div><strong>{user.total_attempts || 0}</strong><span>Attempts</span></div>
          </div>

          <div className="actions">
            <button onClick={() => { setEditing(!editing); setMsg(null); }}> {editing ? 'Cancel' : 'Edit Profile'} </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
          </div>
        </div>

        <div className="profile-right">
          {msg && <div className="info-msg">{msg}</div>}

          {!editing ? (
            <>
              <h3>About</h3>
              <p>{user.bio || 'No bio set.'}</p>

              <div className="info-grid">
                <div><strong>Phone</strong><div>{user.phone_number || '-'}</div></div>
                <div><strong>DOB</strong><div>{user.date_of_birth ? user.date_of_birth.slice(0,10) : '-'}</div></div>
                <div><strong>Address</strong><div>{user.address || '-'}</div></div>
                <div><strong>Gender</strong><div>{user.gender.charAt(0).toUpperCase()+user.gender.slice(1) || '-'}</div></div>
              </div>

              {/* <h4>Social Links</h4>
              <pre className="muted">{JSON.stringify(user.social_links || [], null, 2)}</pre> */}

              <hr/>
              <h4>Change Password</h4>
              <div className="pwd-row">
                <input type="password" placeholder="Current password" value={pwd.currentPassword} onChange={e => setPwd({...pwd, currentPassword: e.target.value})} />
                <input type="password" placeholder="New password" value={pwd.newPassword} onChange={e => setPwd({...pwd, newPassword: e.target.value})} />
                <button onClick={changePassword}>Change</button>
              </div>
            </>
          ) : (
            <>
              <h3>Edit Profile</h3>
              <div className="form-grid">
                <label>
                  Full name
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </label>

                <label>
                  Phone
                  <input value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
                </label>

                <label>
                  DOB
                  <input type="date" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} />
                </label>

                <label>
                  Gender
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="">--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="full">
                  Address
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </label>

                <label className="full">
                  Bio
                  <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows="4"/>
                </label>


              </div>

              <div className="form-actions">
                <button onClick={saveProfile} className="save">Save</button>
                <button onClick={() => { setEditing(false); setAvatarFile(null); setAvatarPreview(null); }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
