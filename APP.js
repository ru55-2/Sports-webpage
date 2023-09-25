import express from 'express'
const app = express();
app.use(express.json());

//fixing cors problems
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500, http://10.0.0.177:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});








import { creategame, updateset, getdatabase } from './API.js'




//gets all of the games in the data base
app.get("/games", async (req,res) => {
    const games = await getdatabase();
    res.send(games)
})


//create a game
app.post("/creategame",async (req,res) =>{
    const time = req.body.time;
    const team1 = req.body.team1;
    const team2 = req.body.team2;
    const location = req.body.location;
    const ask = await creategame(time,team1,team2,location)
    res.send(ask)
});



//updates the selected set
app.put("/updategame", async (req,res)=>{
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

