const express=require('express');
const pool=require('../db.js');
const adminAuth=require('../middleware/adminAuth.js');

const router=express.Router();

// create a new exam
router.post('/', adminAuth, async (req, res) => {
  const {
    title,
    duration,
    description,
    number_of_questions,
    difficulty,
    exam_authority,
    passing_percentage,
    max_attempts,
    category
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO exams 
      (title, duration, description, number_of_questions, difficulty, exam_authority, passing_percentage, max_attempts, category)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        title,
        duration,
        description,
        number_of_questions,
        difficulty,
        exam_authority,
        passing_percentage,
        max_attempts,
        category
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create exam" });
  }
});



// route to get all exam
router.get('/',adminAuth,async(req,res)=>{
    try {
        const result=await pool.query('select * from exams');
        res.status(201).json(result.rows);
    } catch (error) {
        res.status(500).json({message:'Fail to fetch exams'});
    }
})

// get a specific exam by ID
router.get('/:id', adminAuth, async (req, res) => {
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


// update exam info
router.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    duration,
    description,
    number_of_questions,
    difficulty,
    exam_authority,
    passing_percentage,
    max_attempts,
    category
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE exams SET
        title=$1,
        duration=$2,
        description=$3,
        number_of_questions=$4,
        difficulty=$5,
        exam_authority=$6,
        passing_percentage=$7,
        max_attempts=$8,
        category=$9,
        updated_at=NOW()
      WHERE id=$10
      RETURNING *`,
      [
        title,
        duration,
        description,
        number_of_questions,
        difficulty,
        exam_authority,
        passing_percentage,
        max_attempts,
        category,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update exam" });
  }
});


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