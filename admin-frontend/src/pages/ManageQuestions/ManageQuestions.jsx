import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ManageQuestions.css";

function ManageQuestions() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "MCQ",
    option: [],
    correct_answer: "",
  });

  const [editingQuestion, setEditingQuestion] = useState(null);

  /* ---------------- Fetch Questions ---------------- */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/question/${id}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Fetch error", err));
  }, [id]);

  /* ---------------- Add Question ---------------- */
  const handleCreateQuestion = () => {
    if (!newQuestion.question_text || !newQuestion.correct_answer || newQuestion.option.length < 2) {
      alert("Please fill all fields & add at least 2 options.");
      return;
    }

    axios
      .post(`http://localhost:5000/api/question/${id}`, newQuestion, {
        headers: { authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then((res) => {
        setQuestions([...questions, res.data]);
        setNewQuestion({ question_text: "", question_type: "MCQ", option: [], correct_answer: "" });
      })
      .catch((err) => console.error("Create error", err));
  };

  /* ---------------- Delete Question ---------------- */
  const handleDeleteQuestion = (questionId) => {
    axios
      .delete(`http://localhost:5000/api/question/${questionId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then(() => setQuestions(questions.filter((q) => q.id !== questionId)))
      .catch((err) => console.error("Delete error", err));
  };

  /* ---------------- Update Question ---------------- */
  const handleUpdateQuestion = () => {
    axios
      .put(`http://localhost:5000/api/question/${editingQuestion.id}`, editingQuestion, {
        headers: { authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then((res) => {
        setQuestions(
          questions.map((q) => (q.id === res.data.id ? res.data : q))
        );
        setEditingQuestion(null);
      })
      .catch((err) => console.error("Update error", err));
  };

  return (
    <div className="questions-wrapper">
      <h1 className="page-title">Manage Questions</h1>

      {/* CREATE CARD */}
      <div className="create-card">
        <h2>Add New Question</h2>

        <label>Question Text</label>
        <input
          type="text"
          value={newQuestion.question_text}
          onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
          placeholder="Enter question..."
        />

        <label>Options (JSON Array)</label>
        <input
          type="text"
          placeholder='Example: ["A","B","C","D"]'
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (Array.isArray(parsed)) setNewQuestion({ ...newQuestion, option: parsed });
            } catch (error) {
              console.error("Invalid JSON");
            }
          }}
        />

        <label>Correct Answer</label>
        <input
          type="text"
          value={newQuestion.correct_answer}
          onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
          placeholder="Correct answer"
        />

        <button className="add-btn" onClick={handleCreateQuestion}>
          + Add Question
        </button>
      </div>

      {/* QUESTION LIST */}
      <h2 className="sub-title">Existing Questions</h2>

      <ul className="question-list">
        {questions.map((question) => (
          <li key={question.id} className="question-item">
            <p>{question.question_text}</p>

            <div className="actions">
              <button className="edit-btn" onClick={() => setEditingQuestion(question)}>
                ✏ Edit
              </button>
              <button className="delete-btn" onClick={() => handleDeleteQuestion(question.id)}>
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* EDIT MODAL */}
      {editingQuestion && (
  <div 
    className="modal-overlay"
    onClick={(e) => {
      if (e.target.className === "modal-overlay") setEditingQuestion(null);
    }}
  >
    <div className="modal">
      <h2 className="modal-title">Edit Question</h2>

      <div className="form-group">
        <label>Question Text</label>
        <textarea
          className="input-textarea"
          value={editingQuestion.question_text}
          onChange={(e) =>
            setEditingQuestion({ ...editingQuestion, question_text: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Options</label>
        <textarea
          className="input-textarea"
          value={editingQuestion.option.join("\n")}
          placeholder="Enter options (one per line)"
          onChange={(e) => {
            const opts = e.target.value.split("\n").map(o => o.trim()).filter(Boolean);
            setEditingQuestion({ ...editingQuestion, option: opts });
          }}
        />
        <small className="hint">One option per line. No need for JSON.</small>
      </div>

      <div className="form-group">
        <label>Correct Answer</label>
        <select
          className="input-select"
          value={editingQuestion.correct_answer}
          onChange={(e) =>
            setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })
          }
        >
          {editingQuestion.option.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-buttons">
        <button className="save-btn" onClick={handleUpdateQuestion}>Save Changes</button>
        <button className="cancel-btn" onClick={() => setEditingQuestion(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ManageQuestions;
