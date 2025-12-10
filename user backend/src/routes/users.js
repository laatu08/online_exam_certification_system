const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userAuth  = require('../middleware/userAuth.js'); // assume this sets req.user = { id }

const router = express.Router();
const cloudinary = require("../config/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(), // store file in memory buffer
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ok =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Only JPG/PNG allowed"), ok);
  },
});

/* ---------- Get current user's profile ---------- */
router.get('/me', userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT id, name, email, role, profile_picture, phone_number, bio, date_of_birth,
              total_attempts, passed_exams, last_login, address, gender, preferences, social_links, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

/* ---------- Update profile (basic fields) ---------- */
router.put('/me', userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name, phone_number, bio, date_of_birth, address, gender, preferences, social_links
    } = req.body;
    const dob = date_of_birth === "" ? null : date_of_birth;

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        phone_number = COALESCE($2, phone_number),
        bio = COALESCE($3, bio),
        date_of_birth = COALESCE($4, date_of_birth),
        address = COALESCE($5, address),
        gender = COALESCE($6, gender),
        preferences = COALESCE($7::jsonb, preferences),
        social_links = COALESCE($8::jsonb, social_links),
        updated_at = NOW()
       WHERE id = $9
       RETURNING id, name, email, role, profile_picture, phone_number, bio, date_of_birth, address, gender, preferences, social_links, updated_at`,
      [name, phone_number, bio, date_of_birth, address, gender, JSON.stringify(preferences || {}), JSON.stringify(social_links || []), userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

/* ---------- Upload avatar ---------- */
router.post("/me/avatar", userAuth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const userId = req.user.id;

    // 1. Fetch old avatar to delete if necessary
    const user = await pool.query(
      `SELECT profile_picture FROM users WHERE id=$1`,
      [userId]
    );

    const oldAvatar = user.rows[0]?.profile_picture;

    // 2. Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: "exam_app/avatars",
        public_id: `avatar_${userId}`,
        overwrite: true,
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed" });
        }

        // 3. Save URL in DB
        const { rows } = await pool.query(
          `UPDATE users 
            SET profile_picture=$1, updated_at=NOW() 
            WHERE id=$2 
            RETURNING profile_picture`,
          [result.secure_url, userId]
        );

        return res.json({
          message: "Avatar updated successfully",
          profile_picture: rows[0].profile_picture,
        });
      }
    );

    // Pipe buffer to Cloudinary
    uploadResult.end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
});

/* ---------- Change password ---------- */
router.post('/me/change-password', userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });

    const { rows } = await pool.query('SELECT password FROM users WHERE id=$1', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(401).json({ message: 'Current password incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, userId]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

module.exports = router;
