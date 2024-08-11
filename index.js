const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const {Worker} = require('worker_threads');
const app = express();

const port = process.env.PORT || 3001;

app.get('/nonblocking', (req, res) =>{
    res.status(200).send("Non blocking Page");
});

app.get('/blocking', async(req, res) =>{

    const worker = new Worker('./worker.js');
    worker.on("message", (data) =>{
        res.status(200).send(`the count is now : ${data}`);
    });
    worker.on("error", (err) =>{
        res.status(404).send(err.message);
    });
});
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});