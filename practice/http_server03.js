require('dotenv').config(); //載入 .env的設定

const http = require('http');

const server = http.createServer((req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    res.end(`<h1>PORT: ${process.env.PORT}</h1>`)
});
console.log(`${process.env.PORT}`);
server.listen(process.env.PORT);