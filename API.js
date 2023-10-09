import mysql from 'mysql2';
import fs from 'fs';
import dotenv from 'dotenv';
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

// Function to get all of the stuff in the database
export async function getdatabase() {
  const sql = 'SELECT * FROM volleyball.Matches';
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
