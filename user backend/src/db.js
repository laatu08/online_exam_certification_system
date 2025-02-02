const {Pool}=require('pg');
const dotenv=require('dotenv');

dotenv.config();

// Database Connection
const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
});
pool.connect()
    .then(()=>{console.log('Connected to Database');})
    .catch(err=>{console.log(`Connection Error: ${err.stack}`);});

module.exports=pool;