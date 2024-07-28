const http = require('http');
const OpenAI = require("openai");
const dotenv = require("dotenv");
const cluster = require('cluster');
const os = require('os');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
});

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);


    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); 
    });
} else {
    const server = http.createServer(async (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Transfer-Encoding': 'chunked'
        });

        try {
            const stream = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: "Say this is a test" }],
                stream: true,
            });

            for await (const chunk of stream) {
                res.write(chunk.choices[0]?.delta?.content || "");
                console.log(`Sent: ${chunk}`);
            }

            res.end();
        } catch (error) {
            console.error('Error occurred:', error);
            res.end('Error occurred');
        }
    });

    const PORT = 3000;
    server.listen(PORT, () =>
        console.log(`Worker ${process.pid} running at http://localhost:${PORT}/`)
    );
}
