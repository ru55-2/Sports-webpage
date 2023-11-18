import { checkToken, createToken, creategame, updateset, getdatabase, singlegameinfo, deletegame, checkadmin, creategameBB, updatescoreBB, getdatabaseBB, singlegameinfoBB, deletegameBB } from './API.js'
import express from 'express'
const app = express();
app.use(express.json());

/*cors BS
import cors from 'cors';

app.use(cors({
  allowedHeaders: ['Content-Type', 'x-access-token'],
}));
*/





//CHECKING ADMIN
//returns a true or false if the admin is in the database or not
app.post("/api/checkadmin",async (req,res) => {
  const pass = req.body.pass;
  const usr = req.body.usr;
  const ask = await checkadmin(usr,pass);
  res.send(ask);
});


//TOKEN SYSTEM

app.post('/api/maketoken', async (req,res) => {
  const pass = req.body.pass;
  const usr = req.body.usr;
  const ask = await createToken(pass,usr);
  res.send(ask);
});

app.post('/api/checkToken', async (req,res) => {
  const token = req.headers['x-access-token'];
  const ask = await checkToken(token);
  res.send(ask);
});







//THIS IS ALL FOR BASKETBALL

//delete a game
app.delete("/api/basketball/delete", async (req,res) => {
  const gameid = req.query.id;
  const ask = await deletegameBB(gameid);
  res.send(ask)
})




//gets all of the games in the data base
app.get("/api/basketball/games", async (req,res) => {
    const games = await getdatabaseBB();
    res.send(games)
})


//create a game
app.post("/api/basketball/creategame",async (req,res) =>{
    const time = req.body.time;
    const team1 = req.body.team1;
    const team2 = req.body.team2;
    const location = req.body.location;
    const ask = await creategameBB(time,team1,team2,location)
    res.send(ask)
});
//get stats for a game
app.post("/api/basketball/getgame",async (req,res) => {
  const matchid = req.body.id;
  const ask = await singlegameinfoBB(matchid)
  res.send(ask)
})


//updates the selected set
app.put("/api/basketball/updategame", async (req,res)=>{
    const id = req.body.id;
    const t1su = req.body.t1su;
    const t2su = req.body.t2su;
    const ask = await updatescoreBB(id,t1su,t2su);
    res.send(ask);

});
































//THIS IS ALL FOR VOLLEYBALL
//delete a game
app.delete("/api/volleyball/delete", async (req,res) => {
  const gameid = req.query.id;
  const ask = await deletegame(gameid);
  res.send(ask)
})




//gets all of the games in the data base
app.get("/api/volleyball/games", async (req,res) => {
    const games = await getdatabase();
    res.send(games)
})



//create a game
app.post("/api/volleyball/creategame",async (req,res) =>{
    const time = req.body.time;
    const team1 = req.body.team1;
    const team2 = req.body.team2;
    const location = req.body.location;
    const setcount = req.body.sets;
    const ask = await creategame(time,team1,team2,location,setcount)
    res.send(ask)
});
//get stats for a game
app.post("/api/volleyball/getgame",async (req,res) => {
  const matchid = req.body.id;
  const ask = await singlegameinfo(matchid)
  res.send(ask)
})


//updates the selected set
app.put("/api/volleyball/updategame", async (req,res)=>{
    const id = req.body.id;
    const setnum = req.body.setnum;
    const t1su = req.body.t1su;
    const t2su = req.body.t2su;
    const ask = await updateset(id,setnum,t1su,t2su);
    res.send(ask);

});

/*
{
  "id":11,
  "setnum":3,
  "t1su":20,
  "t2su":25
}
{
  "time":"2022-09-22 9:00",
  "team1":"LCI",
  "team2":"CCH",
  "location":"LCI large gym"
  
}
*/





app.use((err,req,res, next) => {
    console.error(err.stack);
    res.status(500).send('something broke!');
});


app.listen(8080, () => {
console.log('server is running on port 8080');
});

