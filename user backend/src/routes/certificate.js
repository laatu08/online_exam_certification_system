const express = require('express');
const pool = require('../db');
const userAuth = require('../middleware/userAuth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const QRCode = require('qrcode');

// Generate a random verification code (e.g., CERT-9F3A21B8)
function generateVerificationCode() {
    return 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

/* ============================================================
   1. GET ALL CERTIFICATES FOR LOGGED-IN USER
   ============================================================ */
router.get('/', userAuth, async (req, res) => {
    try {
        const q = `
      SELECT 
        c.id,
        c.certificate_id,
        c.verification_code,
        c.score,
        c.percentage,
        c.status,
        c.attempt_number,
        c.issued_at,
        c.certificate_url,
        e.title AS exam_title
      FROM certificates c
      JOIN exams e ON c.exam_id = e.id
      WHERE c.user_id = $1
      ORDER BY c.issued_at DESC
    `;

        const { rows } = await pool.query(q, [req.user.id]);
        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch certificates' });
    }
});


/* ============================================================
   2. DOWNLOAD CERTIFICATE (PDF GENERATION)
   ============================================================ */
router.get('/:certId/download', userAuth, async (req, res) => {
    const { certId } = req.params;

    try {
        const q = `
      SELECT 
        c.certificate_id,
        c.score,
        c.percentage,
        c.status,
        c.verification_code,
        c.issued_at,
        e.title AS exam_title,
        e.exam_authority,
        e.number_of_questions,
        u.name AS user_name
      FROM certificates c
      JOIN exams e ON c.exam_id = e.id
      JOIN users u ON c.user_id = u.id
      WHERE c.certificate_id = $1 AND c.user_id = $2
    `;

        const result = await pool.query(q, [certId, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        const cert = result.rows[0];

        // Ensure verification code exists
        if (!cert.verification_code) {
            cert.verification_code = generateVerificationCode();
            await pool.query(
                "UPDATE certificates SET verification_code = $1 WHERE certificate_id = $2",
                [cert.verification_code, certId]
            );
        }

        /* ---------------------- QR CODE GENERATION ---------------------- */
        const qrData = JSON.stringify({
            certificate_id: cert.certificate_id,
            user_name: cert.user_name,
            exam_title: cert.exam_title,
            percentage: cert.percentage,
            status: cert.status,
            issued_at: cert.issued_at,
            verification_code: cert.verification_code
        });

        const qrImage = await QRCode.toDataURL(qrData);


        /* ---------------------- PDF FILE PATH ---------------------- */
        const fileDir = path.join(__dirname, '../../generated_certificates');
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

        const filePath = path.join(fileDir, `${certId}.pdf`);

        /* ---------------------- CREATE PDF ---------------------- */
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: 40
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        /* ---------------------- Background & Border ---------------------- */
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
        doc.lineWidth(4).strokeColor('#004aad')
            .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .stroke();

        /* ---------------------- HEADER ---------------------- */
        doc.fillColor('#004aad')
            .fontSize(36)
            .font('Helvetica-Bold')
            .text('CERTIFICATE OF ACHIEVEMENT', { align: 'center' })
            .moveDown(0.5);

        doc.fillColor('#222')
            .fontSize(18)
            .font('Helvetica')
            .text(`Awarded by ${cert.exam_authority}`, { align: 'center' })
            .moveDown(1.5);

        /* ---------------------- STUDENT NAME ---------------------- */
        doc.fontSize(20).text('This is to certify that', { align: 'center' }).moveDown(0.8);

        doc.fillColor('#004aad')
            .fontSize(32)
            .font('Helvetica-Bold')
            .text(cert.user_name, { align: 'center', underline: true })
            .moveDown(1.5);

        /* ---------------------- EXAM NAME ---------------------- */
        doc.fillColor('#222')
            .fontSize(20)
            .font('Helvetica')
            .text('has successfully completed the exam', { align: 'center' })
            .moveDown(0.8);

        doc.fillColor('#004aad')
            .fontSize(28)
            .font('Helvetica-Bold')
            .text(cert.exam_title, { align: 'center', underline: true })
            .moveDown(1.2);

        /* ---------------------- SCORE BOX ---------------------- */
        const totalQuestions = cert.number_of_questions || 100;

        doc.fillColor('#000')
            .fontSize(16)
            .font('Helvetica')
            .text(`Score: ${cert.score} / ${totalQuestions}`, { align: 'center' });
        doc.text(`Percentage: ${cert.percentage}%`, { align: 'center' });
        doc.text(`Status: ${cert.status.toUpperCase()}`, { align: 'center' })
            .moveDown(1.5);

        /* ---------------------- FOOTER DETAILS ---------------------- */
        doc.fontSize(14)
            .fillColor('#444')
            .text(`Certificate ID: ${cert.certificate_id}`, { align: 'center' });
        doc.text(`Verification Code: ${cert.verification_code}`, { align: 'center' });
        doc.text(`Issued On: ${new Date(cert.issued_at).toDateString()}`, { align: 'center' });

        /* ---------------------- QR CODE ---------------------- */
        const qrSize = 120;
        const qrX = doc.page.width - qrSize - 60;
        const qrY = doc.page.height - qrSize - 60;

        // Insert QR image
        doc.image(Buffer.from(qrImage.split(',')[1], 'base64'), qrX, qrY, {
            width: qrSize,
            height: qrSize
        });

        doc.fontSize(10)
            .fillColor('#333')
            .text('Scan to verify', qrX, qrY + qrSize + 5, { width: qrSize, align: 'center' });

        /* Finish PDF */
        doc.end();

        stream.on('finish', () => {
            res.download(filePath, `${certId}.pdf`);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate certificate" });
    }
});


module.exports = router;
