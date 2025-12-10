import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TakeExam.css';

function TakeExam() {
  const { examId } = useParams();

  const [examInfo, setExamInfo] = useState(null);       
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [activeQ, setActiveQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const [showInstructions, setShowInstructions] = useState(true);

  /* ============================
       1️⃣ FETCH EXAM INFO 
  ============================== */
  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setExamInfo(res.data);
      setTimeLeft(res.data.duration * 60);   // Use real duration
    })
    .catch(err => console.error("Error fetching exam info", err));
  }, [examId]);


  const startExam = () => {
    setShowInstructions(false);

    axios
      .get(`http://localhost:5000/api/user/${examId}/questions`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setQuestions(res.data))
      .catch((error) => console.error('Error fetching questions', error));
  };


  useEffect(() => {
    if (showInstructions || submitted || timeLeft <= 0) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted, showInstructions]);


  const handleSubmit = () => {
    axios.post(
      `http://localhost:5000/api/user/${examId}/submit`,
      { answer },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    .then(res => {
      setResult(res.data);
      setSubmitted(true);
    })
    .catch(err => console.error("Submit error", err));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Show instructions modal BEFORE exam starts
  if (showInstructions && examInfo) {
    return (
      <div className="instruction-overlay">
        <div className="instruction-box">
          <h2>{examInfo.title}</h2>
          <p className="desc">{examInfo.description}</p>

          <div className="exam-details">
            <p><strong>Duration:</strong> {examInfo.duration} minutes</p>
            <p><strong>Questions:</strong> {examInfo.number_of_questions}</p>
            <p><strong>Difficulty:</strong> {examInfo.difficulty}</p>
            <p><strong>Passing Criteria:</strong> {examInfo.passing_percentage}%</p>
            <p><strong>Attempts Allowed:</strong> {examInfo.max_attempts}</p>
            <p><strong>Authority:</strong> {examInfo.exam_authority}</p>
          </div>

          <h3>📝 Instructions</h3>
          <ul className="inst-list">
            <li>Do not refresh or close the window during the exam.</li>
            <li>Once submitted, answers cannot be changed.</li>
            <li>Timer will start immediately after clicking START.</li>
            <li>Make sure you have a stable internet connection.</li>
          </ul>

          <button className="start-btn" onClick={startExam}>
            Start Exam
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="exam-wrapper">

      {/* SIDEBAR */}
      {!submitted && (
        <aside className="exam-sidebar">
          <h3>Questions</h3>
          <div className="question-numbers">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`q-num ${activeQ === i ? "active" : ""} ${
                  answer[questions[i]?.id] ? "answered" : ""
                }`}
                onClick={() => setActiveQ(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="timer-box">
            <p>⏳ Time Left</p>
            <h2>{formatTime(timeLeft)}</h2>
          </div>
        </aside>
      )}

      {/* QUESTIONS */}
      <main className="exam-main">
        {!submitted ? (
          <>
            {questions.length > 0 && (
              <>
                <h2 className="exam-title">Question {activeQ + 1}</h2>

<div className="question-card" key={questions[activeQ].id}>
                  <p className="question-text">
                    {questions[activeQ].question_text}
                  </p>

                  <div className="options-list">
                    {questions[activeQ].option.map((opt, idx) => (
                      <label
                        key={idx}
                        className={`option ${
                          answer[questions[activeQ].id] === opt ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${questions[activeQ].id}`}
                          value={opt}
                          onChange={() =>
                            setAnswer({ ...answer, [questions[activeQ].id]: opt })
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="nav-buttons">
                  <button
                    disabled={activeQ === 0}
                    onClick={() => setActiveQ(activeQ - 1)}
                  >
                    Previous
                  </button>

                  <button
                    disabled={activeQ === questions.length - 1}
                    onClick={() => setActiveQ(activeQ + 1)}
                  >
                    Next
                  </button>

                  <button className="submit-btn" onClick={handleSubmit}>
                    Submit Exam
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="result-box">
  <h2>Exam Result</h2>

  <p>Score: {result.score} / {result.total}</p>
  <p>Percentage: {result.percentage}%</p>
  <p>Status: {result.status.toUpperCase()}</p>
  <p>Attempt: {result.attemptNumber}</p>

  {result.verificationCode && (
    <p>Verification Code: <strong>{result.verificationCode}</strong></p>
  )}

  {result.status === "passed" ? (
    <p className="pass">🎉 You qualified and earned a certificate!</p>
  ) : (
    <div className="retake-box">
      <p className="fail">❌ You did not qualify.</p>
      <button className="retake-btn" onClick={() => window.location.reload()}>
        ↻ Re-take Exam
      </button>
    </div>
  )}
</div>

        )}
      </main>
    </div>
  );
}

export default TakeExam;
