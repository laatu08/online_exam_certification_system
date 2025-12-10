const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const pool=require('../db.js');

const router=express.Router();


// Register Route
router.post('/register',async (req,res)=>{
    const {name,email,password,role}=req.body;

    const userCheck=await pool.query('select * from users where email=$1',[email]);
    if(userCheck.rows.length>0){
        return res.status(400).json({message:'User already exist'});
    }

    const hashPassword=await bcrypt.hash(password,10);

    // const result={};
    role.toLowerCase();
    if(role!=='admin'){
        const result=await pool.query('insert into users (name,email,password) values ($1,$2,$3) returning id',[name,email,hashPassword]);
        res.status(201).json({userId:result.rows[0].id});
    }
    else{
        const result=await pool.query('insert into users (name,email,password,role) values ($1,$2,$3,$4) returning id',[name,email,hashPassword,role]);
        res.status(201).json({userId:result.rows[0].id});
    }
    
});


// Login route
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;

    const result=await pool.query('select * from users where email=$1',[email]);
    const user=result.rows[0];

    if(user && await bcrypt.compare(password,user.password)){
        const token=jwt.sign({id:user.id,name:user.name,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    }
    else{
        res.status(401).json({message:"Invalid Credentials"});
    }
})


module.exports=router;