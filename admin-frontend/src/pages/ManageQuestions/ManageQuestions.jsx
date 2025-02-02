import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ManageQuestions.css'

function ManageQuestions() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: '',
    option: [],
    correct_answer: ''
  });
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/question/${id}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(response => setQuestions(response.data))
    .catch(error => console.error('Error fetching questions', error));
  }, [id]);

  const handleCreateQuestion = () => {
    axios.post(`http://localhost:5000/api/question/${id}`, newQuestion, {
      headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(response => setQuestions([...questions, response.data]))
    .catch(error => console.error('Error creating question', error));
  };

  const handleDeleteQuestion = (questionId) => {
    axios.delete(`http://localhost:5000/api/question/${questionId}`, {
      headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(() => setQuestions(questions.filter(q => q.id !== questionId)))
    .catch(error => console.error('Error deleting question', error));
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
  };

  const handleUpdateQuestion = () => {
    axios.put(`http://localhost:5000/api/question/${editingQuestion.id}`, editingQuestion, {
      headers: { authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(response => {
      setQuestions(questions.map(q => (q.id === response.data.id ? response.data : q)));
      setEditingQuestion(null);
    })
    .catch(error => console.error('Error updating question', error));
  };

  return (
    <div className="manage-questions-container">
      <h2>Manage Questions</h2>
      <div className="question-form">
        <input type="text" placeholder="Question Text" onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} />
        <input type="text" placeholder="Type" onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value })} />
        <input type="text" placeholder='Options (e.g. ["A", "B", "C", "D"])' onChange={(e) => {
          try {
            const parsedOptions = JSON.parse(e.target.value);
            if (Array.isArray(parsedOptions)) {
              setNewQuestion({ ...newQuestion, option: parsedOptions });
            } else {
              console.error("Options must be an array.");
            }
          } catch (error) {
            console.error("Invalid JSON format for options.");
          }
        }} />
        <input type="text" placeholder="Correct Answer" onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} />
        <button onClick={handleCreateQuestion}>Add Question</button>
      </div>
      <ul className="question-list">
        {questions.map(question => (
          <li key={question.id}>
            {question.question_text}
            <div className="btn">
              <button onClick={() => handleEditQuestion(question)}>Edit</button>
              <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {editingQuestion && (
        <div className="edit-form">
          <h3>Edit Question</h3>
          <input type="text" value={editingQuestion.question_text} onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })} />
          <input type="text" value={editingQuestion.question_type} onChange={(e) => setEditingQuestion({ ...editingQuestion, question_type: e.target.value })} />
          <input type="text" value={JSON.stringify(editingQuestion.option)} onChange={(e) => {
            try {
              const parsedOptions = JSON.parse(e.target.value);
              if (Array.isArray(parsedOptions)) {
                setEditingQuestion({ ...editingQuestion, option: parsedOptions });
              } else {
                console.error("Options must be an array.");
              }
            } catch (error) {
              console.error("Invalid JSON format for options.");
            }
          }} />
          <input type="text" value={editingQuestion.correct_answer} onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })} />
          <button onClick={handleUpdateQuestion}>Update</button>
        </div>
      )}
    </div>
  );
}

export default ManageQuestions;
