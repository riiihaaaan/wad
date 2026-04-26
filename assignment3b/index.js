const express = require('express');
const dbConnect = require('./mongo')
const app=express();
app.use(express.json())

//GET API
app.get('/', async (req, res) => {
    let result = await dbConnect();
    result = await result.find().toArray();
    res.send(result);
})

//POST API
app.post('/', async (req, res) => {
    let result = await dbConnect();
    result = await result.insertOne(req.body);
    res.send("Data succesfully inserted");
})

//UPDATE API
app.put('/', async (req, res) => {
    let result = await dbConnect();
    result = await result.updateOne({name: req.body.name}, {$set: {name:req.body.newval}});
    res.send("Database succesfully inserted");
})


//DELETE API
app.delete('/', async (req, res) => {
    let result = await dbConnect();
    result = await result.deleteOne(req.body);
    res.send("Data succesfully deleted");
})


const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})