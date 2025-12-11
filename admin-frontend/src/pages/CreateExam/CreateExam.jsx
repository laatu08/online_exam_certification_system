import { useState } from "react";
import axios from "axios";
import "./CreateExam.css";

function CreateExam() {
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    duration: "",
    number_of_questions: "",
    difficulty: "",
    exam_authority: "",
    passing_percentage: "",
    max_attempts: "",
    category: "",
  });

  const [message, setMessage] = useState(null);

  const handleCreateExam = () => {
    for (let key in newExam) {
      if (!newExam[key]) {
        setMessage({ type: "error", text: `Field "${key.replaceAll("_", " ")}" is required.` });
        return;
      }
    }

    axios
      .post("http://localhost:5000/api/exam", newExam, {
        headers: { authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then(() => {
        setMessage({ type: "success", text: "Exam created successfully!" });
        setNewExam({
          title: "",
          description: "",
          duration: "",
          number_of_questions: "",
          difficulty: "",
          exam_authority: "",
          passing_percentage: "",
          max_attempts: "",
          category: "",
        });
      })
      .catch(() => setMessage({ type: "error", text: "Failed to create exam." }));
  };

  // cleaner form fields definition
  const fields = [
    { label: "Title", key: "title", type: "text" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Duration (minutes)", key: "duration", type: "number" },
    { label: "Number of Questions", key: "number_of_questions", type: "number" },
    { label: "Difficulty", key: "difficulty", type: "text" },
    { label: "Exam Authority", key: "exam_authority", type: "text" },
    { label: "Passing Percentage", key: "passing_percentage", type: "number" },
    { label: "Max Attempts", key: "max_attempts", type: "number" },
    { label: "Category", key: "category", type: "text" },
  ];

  return (
    <div className="create-exam-wrapper">
      <h1 className="page-heading">Create New Exam</h1>

      {message && <div className={`msg ${message.type}`}>{message.text}</div>}

      <div className="create-exam-card">
        {fields.map((field) => (
          <div key={field.key} className="form-group">
            <label>{field.label}</label>

            {field.type === "textarea" ? (
              <textarea
                value={newExam[field.key]}
                onChange={(e) => setNewExam({ ...newExam, [field.key]: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            ) : (
              <input
                type={field.type}
                value={newExam[field.key]}
                onChange={(e) => setNewExam({ ...newExam, [field.key]: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}

        <button onClick={handleCreateExam} className="create-btn">
          Create Exam
        </button>
      </div>
    </div>
  );
}

export default CreateExam;
