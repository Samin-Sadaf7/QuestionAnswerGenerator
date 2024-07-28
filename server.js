const express = require('express');
const app = express();
const port = 3000;

// Endpoint to handle regular requests
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Endpoint to handle streaming responses
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  const messages = ["Hello", "this", "is", "a", "streaming", "response"];

  let index = 0;
  const interval = setInterval(() => {
    if (index < messages.length) {
      res.write(messages[index] + '\n');
      index++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 1000);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
