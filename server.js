const http = require('http');
const os = require('os');
const cluster = require('cluster');


async function* generateData() {
  for (let i = 0; i < 1000; i++) {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Yield data chunk
      yield `data chunk ${i}\n`;
  }
}

const numCPUs = os.cpus().length;

if(cluster.isMaster){
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork(); // Replace the dead worker
  });
} else{
  const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    });
    // Asynchronous iterate over the data chunks
    for await (const chunk of generateData()) {
        res.write(chunk);
        console.log(`Sent: ${chunk}`);
    }
    res.end();
});

const PORT = 3000;
server.listen(PORT, () => 
    console.log(`Server running at http://localhost:${PORT}/`) );
}