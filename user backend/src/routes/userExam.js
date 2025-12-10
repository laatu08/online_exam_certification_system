const express=require('express');
const pool=require('../db.js');
const userAuth=require('../middleware/userAuth.js');

const router=express.Router();

// get available exam
router.get('/',userAuth,async(req,res)=>{
    try {
        const result=await pool.query('select * from exams');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message:'Fail to fetch exam'});
    }
})

// get a specific exam by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM exams WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(result.rows[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exam' });
  }
});


// Fetch question from specific exam
router.get('/:id/questions',userAuth,async(req,res)=>{
    const {id}=req.params;

    try {
        const result=await pool.query('select id,question_text,question_type,option from questions where exam_id=$1',[id]);

        if(result.rows.length===0){
            return res.status(401).json({message:'No question found for this exam'});
        }

        const questions=result.rows.map(q=>({
            id:q.id,
            question_text:q.question_text,
            question_type:q.question_type,
            option:q.option
        }));

        res.json(questions);
    } catch (error) {
        res.status(500).json({message:'Fail to fetch question'});
    }
})


// submit and get score
router.post('/:id/submit', userAuth, async (req, res) => {
  const { id: examId } = req.params;
  const { answer } = req.body;

  try {
    /* -----------------------------------------------------------
       1. Get exam details
    ----------------------------------------------------------- */
    const examRes = await pool.query(
      `SELECT id, passing_percentage, number_of_questions 
       FROM exams 
       WHERE id = $1`,
      [examId]
    );

    if (examRes.rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const exam = examRes.rows[0];
    const passingPercentage = exam.passing_percentage;

    /* -----------------------------------------------------------
       2. Get questions & evaluate
    ----------------------------------------------------------- */
    const qRes = await pool.query(
      `SELECT id, correct_answer 
       FROM questions 
       WHERE exam_id = $1`,
      [examId]
    );

    if (qRes.rows.length === 0) {
      return res.status(400).json({ message: 'No questions found for this exam' });
    }

    let score = 0;
    const total = qRes.rows.length;

    qRes.rows.forEach(q => {
      if (answer[q.id] && answer[q.id] === q.correct_answer) {
        score++;
      }
    });

    const percentage = Number(((score / total) * 100).toFixed(2));

    /* -----------------------------------------------------------
       3. Pass / Fail
    ----------------------------------------------------------- */
    const status = percentage >= passingPercentage ? 'passed' : 'failed';

    /* -----------------------------------------------------------
       4. Track attempt number
    ----------------------------------------------------------- */
    const attemptRes = await pool.query(
      `SELECT COUNT(*) AS attempts 
       FROM certificates 
       WHERE user_id=$1 AND exam_id=$2`,
      [req.user.id, examId]
    );

    const attemptNumber = Number(attemptRes.rows[0].attempts) + 1;

    /* -----------------------------------------------------------
       5. Create certificate row 
    ----------------------------------------------------------- */
    let certificateId = null;
    let verificationCode = null;

    if (status === 'passed') {
      certificateId = `CERT-${Date.now()}-${req.user.id}`;
      verificationCode = `VCODE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      await pool.query(
        `INSERT INTO certificates 
          (user_id, exam_id, certificate_id, verification_code, score, percentage, status, attempt_number, issued_at)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          req.user.id,
          examId,
          certificateId,
          verificationCode,
          score,
          percentage,
          status,
          attemptNumber
        ]
      );
    } else {
      // Log failed attempt as well
      await pool.query(
        `INSERT INTO certificates 
          (user_id, exam_id, score, percentage, status, attempt_number, issued_at)
         VALUES 
          ($1, $2, $3, $4, 'failed', $5, NOW())`,
        [
          req.user.id,
          examId,
          score,
          percentage,
          attemptNumber
        ]
      );
    }

    /* -----------------------------------------------------------
       6. Insert into user_exams (history)
    ----------------------------------------------------------- */
    await pool.query(
      `INSERT INTO user_exams (user_id, exam_id, score, total_questions)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, examId, score, total]
    );

    /* -----------------------------------------------------------
       7. UPDATE USER STATS
          - total_attempts += 1
          - passed_exams += 1 (if Passed)
    ----------------------------------------------------------- */
    await pool.query(
      `UPDATE users 
       SET 
         total_attempts = COALESCE(total_attempts, 0) + 1,
         passed_exams = COALESCE(passed_exams, 0) + CASE WHEN $1 = 'passed' THEN 1 ELSE 0 END,
         updated_at = NOW()
       WHERE id = $2`,
       [status, req.user.id]
    );


    /* -----------------------------------------------------------
       8. Response
    ----------------------------------------------------------- */
    return res.json({
      message: 'Exam submitted successfully',
      score,
      total,
      percentage,
      status,
      attemptNumber,
      certificateId: certificateId || 'Not Qualified',
      verificationCode: verificationCode || null
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Fail to submit exam' });
  }
});





module.exports=router;