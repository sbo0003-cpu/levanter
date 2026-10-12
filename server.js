
const http = require("http");

const port = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Render repository test successful");
}).listen(port, "0.0.0.0", () => {
  console.log(`Test server listening on port ${port}`);
});
