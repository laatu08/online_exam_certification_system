import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageExams.css';

function ManageExams() {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: '', duration: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/exam', {
      headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(response => setExams(response.data))
    .catch(error => console.error('Error fetching exams', error));
  }, []);

  const handleCreateExam = () => {
    axios.post('http://localhost:5000/api/exam', newExam, {
      headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(response => setExams([...exams, response.data]))
    .catch(error => console.error('Error creating exam', error));
  };

  return (
    <div className="manage-exams-container">
      <h2>Manage Exams</h2>
      <div className="exam-form">
        <h2>Create New Exam</h2>
        <input type="text" placeholder="Title" onChange={(e) => setNewExam({ ...newExam, title: e.target.value })} />
        <input type="number" placeholder="Duration" onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })} />
        <textarea placeholder="Description" onChange={(e) => setNewExam({ ...newExam, description: e.target.value })} />
        <button onClick={handleCreateExam}>Create Exam</button>
      </div>
      <h2>Available Exam List</h2>
      <ul className="exam-list">
        {exams.map(exam => (
          <li key={exam.id}>
            <Link to={`/exams/${exam.id}/questions`}>{exam.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageExams;