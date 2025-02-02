const jwt=require('jsonwebtoken');
const pool=require('../db.js');

const userAuth=async(req,res,next)=>{
    const token=req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({message:'No Token Provided'});
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await pool.query('select * from users where id=$1',[decoded.id]);

        if(user.rows.length===0 || user.rows[0].role!=='student'){
            return res.status(401).json({message:'User not found'});
        }

        req.user=decoded;

        next();
    } catch (error) {
        return res.status(401).json({message:'Invalid token'});
    }
}

module.exports=userAuth;