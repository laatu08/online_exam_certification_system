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
router.post('/:id/submit',userAuth,async(req,res)=>{
    const {id}=req.params;
    const {answer}=req.body;

    try {
        const result=await pool.query('select id,correct_answer from questions where exam_id=$1',[id]);

        if(result.rows.length===0){
            return res.status(401).json({message:'No question  found for this exam'});
        }

        let score=0;
        const total=result.rows.length;

        result.rows.forEach(q=>{
            if(answer[q.id] && answer[q.id]===q.correct_answer){
                score+=1;
            }
        });

        const percentage=(score/total)*100;
        let certificateId=null;

        if(percentage>=60){
            certificateId=`CERT-${Date.now()}-${req.user.id}`;

            await pool.query('insert into certificates (user_id,exam_id,certificate_id) values ($1,$2,$3)',[req.user.id,id,certificateId]);
        }
        

        await pool.query('insert into user_exams (user_id,exam_id,score,total_questions) values ($1,$2,$3,$4)',[req.user.id,id,score,total]);

        res.json({message:'Exam submitted successfully',score,total,percentage,certificateId:certificateId||'Not Qualified'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Fail to submit exam'});
    }
})

module.exports=router;