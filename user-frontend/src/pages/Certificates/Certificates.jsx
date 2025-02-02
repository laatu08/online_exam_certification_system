import { useEffect, useState } from 'react';
import axios from 'axios';
import './Certificates.css'

function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/certificate', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => setCertificates(response.data))
    .catch(error => console.error('Error fetching certificates', error));
  }, []);

  const downloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/certificate/${certificateId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Ensure binary data is handled properly
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Error downloading certificate', error);
    }
  };

  return (
    <div className='certificates-container'>
      <h2>Your Certificates</h2>
      <ul className='certificates-list'>
        {certificates.map(cert => (
          <li key={cert.certificate_id} className='certificate-item'>
            {cert.exam_title} - 
            <button className='download-button' onClick={() => downloadCertificate(cert.certificate_id)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Certificates;
