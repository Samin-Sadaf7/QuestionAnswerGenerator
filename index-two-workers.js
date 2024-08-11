const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const {Worker} = require('worker_threads');
const app = express();

const port = process.env.PORT || 3000;
const THREAD_COUNT= 4

function createWorker(){
    return new Promise((resolve, reject) =>{
            const worker = new Worker("./two-workers.js",{
                workerData: {thread_count :THREAD_COUNT}
            });
            worker.on("message", (data) =>{
                resolve(data);
            });
            worker.on("error", (err) =>{
                reject(err.message);
            });
    });
}
app.get('/nonblocking', (req, res) =>{
    res.status(200).send("Non blocking Page");
});

app.get('/blocking', async(req, res) =>{
        const workerPromise = [];
        for (let i = 0; i < THREAD_COUNT; i++) {
            workerPromise.push(createWorker());
        }
        const thread_result = await Promise.all(workerPromise);
        const total = thread_result[0]+thread_result[1];
        res.status(200).send(`the count is ${total}`)
});
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});