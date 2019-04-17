const port = parseInt(process.env.PORT, 10) || 4000;
const path = require("path");
const express = require("express");

const server = express();
server.use("/", express.static(path.join(__dirname, "build/")));
server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
});
