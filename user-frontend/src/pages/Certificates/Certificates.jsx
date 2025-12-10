import { useEffect, useState } from 'react';
import axios from 'axios';
import './Certificates.css';
import { FaDownload, FaAward } from "react-icons/fa";

function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/certificate', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setCertificates(res.data))
      .catch((err) => console.error('Error fetching certificates', err));
  }, []);

  const downloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/certificate/${certificateId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading certificate', err);
    }
  };

  return (
    <div className="cert-page">
      <h1 className="cert-title">Your Certificates</h1>
      <p className="cert-subtitle">View and download your earned achievements.</p>

      {certificates.length === 0 ? (
        <p className="empty-state">No certificates yet. Complete an exam to earn one!</p>
      ) : (
        <div className="cert-grid">
          {certificates.map((cert) => (
            <div className="cert-card" key={cert.certificate_id}>
              <FaAward className="cert-icon" />
              <h3>{cert.exam_title}</h3>

              <div className="cert-info">
                <p><strong>Score:</strong> {cert.score}%</p>
                <p><strong>Issued:</strong> {new Date(cert.issued_at).toLocaleString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
}) || "N/A"}</p>
              </div>

              <button
                className="cert-download"
                onClick={() => downloadCertificate(cert.certificate_id)}
              >
                <FaDownload /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certificates;
