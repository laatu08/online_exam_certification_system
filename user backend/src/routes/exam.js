const express=require('express');
const pool=require('../db.js');
const adminAuth=require('../middleware/adminAuth.js');

const router=express.Router();

// create a new exam
router.post('/',adminAuth,async(req,res)=>{
    const {title,duration,description}=req.body;

    try {
        const result=await pool.query('insert into exams(title,duration,description) values ($1,$2,$3) returning *',[title,duration,description]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message:'Fail to create an exam'});
    }
})


// route to get all exam
router.get('/',adminAuth,async(req,res)=>{
    try {
        const result=await pool.query('select * from exams');
        res.status(201).json(result.rows);
    } catch (error) {
        res.status(500).json({message:'Fail to fetch exams'});
    }
})


// update exam info
router.put('/:id',adminAuth,async(req,res)=>{
    const {id}=req.params;
    const {title,duration,description}=req.body;

    try {
        const result=await pool.query('update exams set title=$1,duration=$2,description=$3 where id=$4 returning *',[title,duration,description,id]);

        if(result.rows.length>0){
            res.json(result.rows[0]);
        }
        else{
            res.status(401).json({message:'Exam not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Fail to update exam'});
    }
})

// delete exam
router.delete('/:id',adminAuth,async(req,res)=>{
    const {id}=req.params;

    try {
        const result=await pool.query('delete from exams where id=$1 returning *',[id]);

        if(result.rows.length>0){
            res.status(201).json('Exam deleted successfully');
        }
        else{
            res.status(401).json({message:'Exam not found'});
        }
    } catch (error) {
        res.status(500).json({message:'Fail to delete exam'});
    }
})


module.exports=router;