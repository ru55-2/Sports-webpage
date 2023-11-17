import mysql from 'mysql2';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

// Create a single connection pool when the module is loaded
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: {
    ca: fs.readFileSync('certificate.crt'),
  },
}).promise();

// Export the pool for use in other parts of your application
export { pool };

//Token Auth Sysytem


//create token
const secretKey = process.env.JWT_SECRET || 'your_default_secret';

export async function createToken(pass, usr){
  try {
    // Use Bcrypt for password hashing
    const hashedPassword = await bcrypt.hash(pass, 10);
    const sql = `SELECT COUNT(*) FROM admin_accounts.admin_users WHERE username = ? AND password = ?`;
    const result = await pool.query(sql, [usr, pass]);
    const count = result[0][0]['COUNT(*)'];

    if (count > 0) {
        // User authentication successful, generate JWT
        const isAdmin = true; // Assuming the user is an admin
        const token = jwt.sign({ username: usr, isAdmin }, secretKey);
        return res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
} catch (error) {
    console.error('Error in checkAdmin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}

//check if token is valid
export async function checkToken(token){
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    // Assuming your decoded payload includes information about the user's admin status
    const isAdmin = decoded.isAdmin;

    // Send isAdmin in the response
    res.json({ isAdmin });
  });
}





//function the check if an admin account exists on the server
export async function checkadmin(adminUsr, adminPwd){
  const name = adminUsr;
  const password = adminPwd;
  const sql = `SELECT COUNT(*) FROM admin_accounts.admin_users WHERE username = ? AND password = ?`;
  try {
    const result = await pool.query(sql,[name,password]);
    const count = result[0][0]['COUNT(*)'];
    return count > 0;
  } catch (error) {
    console.error("Error in checkAdmin:", error)
    return false
  }
};


//THIS IS FOR THE BASKETBALL WEBSITE VERSION

// Function to get all of the stuff in the database
export async function getdatabaseBB() {
  const sql = `SELECT * FROM basketball.Matches WHERE MatchTime >= DATE_SUB(NOW(), INTERVAL 7 DAY);`;
  const [res] = await pool.query(sql);
  return res;
}

// Function to get single game info
export async function singlegameinfoBB(id) {
  const sql = `SELECT * FROM basketball.Matches WHERE MatchID = ?`;
  const [res] = await pool.query(sql, [id]);
  return res[0];
}

// Function to create a game
export async function creategameBB(Time, Team1, Team2, Location) {
  const sql =
    'INSERT INTO basketball.Matches (MatchTime, Team1, Team2, Location) VALUES (?, ?, ?, ?)';
  const [res] = await pool.query(sql, [Time, Team1, Team2, Location]);
  return 'game added';
}

// Delete a game
export async function deletegameBB(gameid) {
  const sql = 'DELETE FROM basketball.Matches WHERE MatchID = ?';
  const [res] = await pool.query(sql, [gameid]);
  return 'game deleted';
}

// Function to update the score for a game
export async function updatescoreBB(id, T1_score, T2_score) {
  const sql = `UPDATE basketball.Matches SET T1S = ?, T2S = ? WHERE MatchID = ?`;
  await pool.query(sql, [T1_score, T2_score, id]);
  return 'updated';
}































//THIS IS ALL OF THE VOLLEYBALL SYSTEM

// Function to get all of the stuff in the database
export async function getdatabase() {
  const sql = `SELECT * FROM volleyball.Matches WHERE MatchTime >= DATE_SUB(NOW(), INTERVAL 7 DAY);`;
  const [res] = await pool.query(sql);
  return res;
}

// Function to get single game info
export async function singlegameinfo(id) {
  const sql = `SELECT * FROM volleyball.Matches WHERE MatchID = ?`;
  const [res] = await pool.query(sql, [id]);
  return res[0];
}

// Function to create a game
export async function creategame(Time, Team1, Team2, Location, setcount) {
  const sql =
    'INSERT INTO volleyball.Matches (MatchTime, Team1, Team2, Location, setcount) VALUES (?, ?, ?, ?, ?)';
  const [res] = await pool.query(sql, [Time, Team1, Team2, Location, setcount]);
  return 'game added';
}

// Delete a game
export async function deletegame(gameid) {
  const sql = 'DELETE FROM volleyball.Matches WHERE MatchID = ?';
  const [res] = await pool.query(sql, [gameid]);
  return 'game deleted';
}

// Function to update a set
export async function updateset(id, SET_NUM, T1S_update, T2S_update) {
  const ST1 = `S${SET_NUM}T1`;
  const ST2 = `S${SET_NUM}T2`;
  const sql = `UPDATE volleyball.Matches SET \`${ST1}\` = ?, \`${ST2}\` = ? WHERE MatchID = ?`;
  await pool.query(sql, [T1S_update, T2S_update, id]);
  return 'updated';
}


//syntax for creating a server query.

/*
const update = await updateset('3','3','5','12');
console.log(update)


const Create = await creategame('2023-09-22 9:00:00', 'LCI','CCH','LCI small gym')
console.log(Create)

*/
