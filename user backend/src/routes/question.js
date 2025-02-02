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
router.post('/:id',adminAuth,async(req,res)=>{
    const {id}=req.params;
    const {question_text,question_type,option,correct_answer}=req.body;

    try {
        const result=await pool.query('insert into questions(exam_id,question_text,question_type,option,correct_answer) values ($1,$2,$3,$4,$5) returning *',[id,question_text,question_type,JSON.stringify(option),correct_answer]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message:'Fail to add question'});
    }
})

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
router.delete('/:id',adminAuth,async(req,res)=>{
    const {id}=req.params;

    try {
        const result=await pool.query('delete from questions where id=$1 returning *',[id]);

        if(result.rows.length>0){
            res.status(201).json({message:'Question deleted successfully'});
        }
        else{
            res.status(401).json({message:'Question not found'});
        }
    } catch (error) {
        res.status(500).json({message:'Fail to delete question'})
    }
})

module.exports=router