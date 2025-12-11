const express=require('express');
const pool=require('../db.js');
const adminAuth=require('../middleware/adminAuth.js');

const router=express.Router();

// get all question
router.get('/:id',adminAuth,async(req,res)=>{
    const {id}=req.params

    try {
        const result=await pool.query('select * from questions where exam_id=$1',[id])

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message:'Fail to fetch all question'})
    }
})

// create question
router.post('/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { question_text, question_type, option, correct_answer } = req.body;

    try {
        await pool.query("BEGIN");

        /* 1️⃣ Insert Question */
        const newQ = await pool.query(
            `INSERT INTO questions (exam_id, question_text, question_type, option, correct_answer)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [id, question_text, question_type, JSON.stringify(option), correct_answer]
        );

        /* 2️⃣ Update number_of_questions in exam table */
        await pool.query(
            `UPDATE exams 
             SET number_of_questions = number_of_questions + 1,
                 updated_at = NOW()
             WHERE id = $1`,
            [id]
        );

        await pool.query("COMMIT");

        res.status(201).json(newQ.rows[0]);

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Failed to add question" });
    }
});


// update question
router.put('/:id',adminAuth,async(req,res)=>{
    const {id}=req.params;
    const {question_text,question_type,option,correct_answer}=req.body;

    try {
        const result=await pool.query('update questions set question_text=$1,question_type=$2,option=$3,correct_answer=$4 where id=$5 returning *',[question_text,question_type,JSON.stringify(option),correct_answer,id]);

        if(result.rows.length>0){
            res.status(201).json(result.rows[0]);
        }
        else{
            res.status(401).json({message:'Question Not Found'});
        }
    } catch (error) {
        res.status(500).json({message:'Fail to update question'});
    }
})


// delete question
router.delete('/:id', adminAuth, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("BEGIN");

        /* 1️⃣ First get the question to find exam_id */
        const qRes = await pool.query(
            `SELECT exam_id FROM questions WHERE id = $1`,
            [id]
        );

        if (qRes.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Question not found" });
        }

        const examId = qRes.rows[0].exam_id;

        /* 2️⃣ Delete the question */
        await pool.query(
            `DELETE FROM questions WHERE id = $1`,
            [id]
        );

        /* 3️⃣ Decrement number_of_questions in exam table */
        await pool.query(
            `UPDATE exams 
             SET number_of_questions = GREATEST(number_of_questions - 1, 0),
                 updated_at = NOW()
             WHERE id = $1`,
            [examId]
        );

        await pool.query("COMMIT");

        return res.json({ message: "Question deleted successfully" });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        return res.status(500).json({ message: "Failed to delete question" });
    }
});


module.exports=router