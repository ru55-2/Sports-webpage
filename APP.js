import express from 'express'
const app = express();
app.use(express.json());
//a change
//retarted cors problems
const cors = require('cors');

const corsOptions = {
  origin: 'https://example.com',
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) may not handle 204
};

app.use(cors(corsOptions));








import { creategame, updateset, getdatabase, singlegameinfo, deletegame } from './API.js'

//delete a game
app.delete("/API/delete", async (req,res) => {
  const gameid = req.query.id;
  const ask = await deletegame(gameid);
  res.send(ask)
})




//gets all of the games in the data base
app.get("/API/games", async (req,res) => {
    const games = await getdatabase();
    res.send(games)
})
app.post("/API/checkadmin",async (req,res) => {
  const pass = req.body.pass;
  const usr = req.body.usr;
  if (usr === "lciadmin" && pass === "rams2023"){
    res.send(true)
  }else{
    res.send(false)
  }
})

//create a game
app.post("/API/creategame",async (req,res) =>{
    const time = req.body.time;
    const team1 = req.body.team1;
    const team2 = req.body.team2;
    const location = req.body.location;
    const setcount = req.body.sets;
    const ask = await creategame(time,team1,team2,location,setcount)
    res.send(ask)
});
//get stats for a game
app.post("/API/getgame",async (req,res) => {
  const matchid = req.body.id;
  const ask = await singlegameinfo(matchid)
  res.send(ask)
})


//updates the selected set
app.put("/API/updategame", async (req,res)=>{
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

