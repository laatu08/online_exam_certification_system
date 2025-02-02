const express=require('express');
const pool=require('../db.js');
const userAuth=require('../middleware/userAuth.js');
const PDFDocument=require('pdfkit');
const fs=require('fs');
const path=require('path');

const router=express.Router();


// get all certificate
router.get('/',userAuth,async(req,res)=>{
    try {
        const result=await pool.query('select c.certificate_id,e.title as exam_title,u.name as user_name from certificates c join exams e on c.exam_id=e.id join users u on c.user_id=u.id where c.user_id=$1',[req.user.id]);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message:'Fail to fetch certificates'});
    }
})


// download certificate
router.get('/:id/download',userAuth,async(req,res)=>{
    const {id}=req.params;

    try {
        const result=await pool.query('select c.certificate_id,e.title as exam_title,u.name as user_name from certificates c join exams e on c.exam_id=e.id join users u on c.user_id=u.id where c.certificate_id=$1 and c.user_id=$2',[id,req.user.id]);

        if(result.rows.length===0){
            return res.status(401).json({message:'Certificate  not found'});
        }

        const {exam_title,user_name}=result.rows[0];

        // create pdf document
        const doc = new PDFDocument({size:'A4',layout:'landscape'});
        const filePath = path.join(__dirname,'../../certificates/${certificateId}.pdf');

        // Ensure the directory exists
        if(!fs.existsSync(path.dirname(filePath))){
            fs.mkdirSync(path.dirname(filePath),{recursive:true});
        }

        // Pipe the PDF to a file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Design the certificate
        doc.fontSize(30).text('Certificate of Achievement',{align:'center'}).moveDown(1);

        doc.fontSize(20).text('This is to certify that',{align:'center'}).moveDown(1);

        doc.fontSize(25).text(user_name,{align:'center',underline:true}).moveDown(1);

        doc.fontSize(20).text('has successfully completed the exam:',{align:'center'}).moveDown(1);

        doc.fontSize(25).text(exam_title,{align:'center',underline:true}).moveDown(2);

        doc.fontSize(15).text(`Certificate ID:${id}`,{align:'center'});

        doc.end();

        stream.on('finish',()=>{
            res.download(filePath,`${id}.pdf`);
        });
    } catch (error) {
        res.status(500).json({message:'Fail to generate certificate'});
    }
})

module.exports=router;