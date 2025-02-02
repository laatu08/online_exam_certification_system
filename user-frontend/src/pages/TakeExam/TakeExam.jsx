import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TakeExam.css'

function TakeExam() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/${examId}/questions`, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => setQuestions(response.data))
    .catch(error => console.error('Error fetching questions', error));
  }, [examId]);

  const handleSubmit = () => {
    axios.post(`http://localhost:5000/api/user/${examId}/submit`, { answer }, {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      setResult(response.data);
      console.log(result);
      setSubmitted(true);
    })
    .catch(error => console.error('Error submitting exam', error));
  };

  return (
    <div className='take-exam-container'>
      <h2>Take Exam</h2>
      {questions.map(q => (
        <div key={q.id} className='question'>
          <p>{q.question_text}</p>
          {q.option && (
            <select onChange={e => setAnswer({ ...answer, [q.id]: e.target.value })}>
              <option value="">Select an answer</option>
              {q.option.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Exam</button>

      {submitted && result.certificateId!=='Not Qualified' && (
        <div className='result'>
          <h3>Exam Results</h3>
          <p>Score: {result.score} / {result.total}</p>
          <p>Percentage: {result.percentage}%</p>
          {result.certificateId && <p className='celebration'>🎉 You earned a certificate!</p>}
        </div>
      )}
      {submitted && result.certificateId==='Not Qualified' && (
        <div className="fail">
          <h3>Exam Results</h3>
          <p>Score: {result.score} / {result.total}</p>
          <p>Percentage: {result.percentage}%</p>
          {result.certificateId && <p className='celebration'>You did not Qualify</p>}
        </div>
      )}
    </div>
  );
}

export default TakeExam;
