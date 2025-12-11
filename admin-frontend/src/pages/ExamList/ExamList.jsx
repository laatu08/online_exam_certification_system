import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ExamList.css";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exam", {
        headers: { authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Error loading exams:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="exam-list-wrapper">
      <h1 className="page-heading">All Exams</h1>

      {loading ? (
        <p className="loading">Loading exams...</p>
      ) : exams.length === 0 ? (
        <p className="no-exams">No exams available.</p>
      ) : (
        <div className="exam-grid">
          {exams.map((exam) => (
            <div className="exam-card" key={exam.id}>
              <h2 className="exam-title">{exam.title}</h2>

              <p className="small-text">{exam.description.slice(0, 120)}...</p>

              <div className="meta-info">
                <p><strong>Category:</strong> {exam.category}</p>
                <p><strong>Difficulty:</strong> {exam.difficulty}</p>
                <p><strong>Duration:</strong> {exam.duration} mins</p>
                <p><strong>Questions:</strong> {exam.number_of_questions}</p>
              </div>

              <Link className="manage-btn" to={`/exams/${exam.id}/questions`}>
                Manage Questions →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamList;
