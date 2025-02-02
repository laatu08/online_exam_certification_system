const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const {pool}=require('./db.js');

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Exam Certification Center');
})

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`);
})


const authRoutes=require('./routes/auth.js');
const examRoutes=require('./routes/exam.js');
const questionRoutes=require('./routes/question.js');
const userExamRoutes=require('./routes/userExam.js');
const certificateRoute=require('./routes/certificate.js');

app.use('/api/auth',authRoutes);
app.use('/api/exam',examRoutes);
app.use('/api/question',questionRoutes);
app.use('/api/user',userExamRoutes);
app.use('/api/certificate',certificateRoute)