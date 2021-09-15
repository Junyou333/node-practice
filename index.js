require('dotenv').config(); //載入 .env的設定
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const session = require('express-session');
const upload = multer({ dest: 'tmp_uploads/' });
const uploadImg = require('./modules/upload-image');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    name: 'mySessionId',
    saveUninitialized: false,
    resave: false,
    secret: 'gfddfhnjtrktykt75742hklug',
    cookie: {
        maxAge: 1200000,
    }
}));

//middleware 中介函式 解析urlencoded格式

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static('public'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));


app.use((req, res, next) => {
    res.locals.title = '小新的網站';


    next();
});

// *** 路由定義開始
app.get('/', function (req, res) {
    res.locals.title = '首頁 - ' + res.locals.title;
    res.render('home', { name: 'JYO' });
    //res.send('Hello World')
});
app.get('/json-sales', function (req, res) {
    const sales = require('./data/sales');

    // console.log(sales);
    // res.send(sales);
    //res.json(sales);
    res.render('json-sales', { sales });
});

//測試querystring
app.get('/try-qs', function (req, res) {
    res.json(req.query);
});


app.post('/try-post', function (req, res) {
    res.json(req.body);
});
app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});
app.get('/pending', (req, res) => {
});

app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    if (req.file && req.file.mimetype === 'image/jpeg') {
        try {
            await fs.rename(req.file.path, __dirname + '/public/img/' + req.file.originalname);
            res.json({ success: true, filename: req.file.originalname });
        } catch (ex) {
            return res.json({ success: false, error: '無法存檔', ex });
        }
    } else {
        await fs.unlink(req.file.path); //刪除暫存檔
        res.json({ success: false, error: '格式錯誤' });
    }
});

app.post('/try-upload2', uploadImg.single('avatar'), async (req, res) => {
    res.json(req.file);
});
app.post('/try-upload3', uploadImg.array('photo', 10), async (req, res) => {
    res.json(req.files);
});
app.get('/my-params1/:action?/:id(\\d+)?', (req, res) => {
    res.json(req.params);
});
//phone num
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.split('?')[0];
    u = u.slice(3);
    u = u.split('-').join('');

    res.json(req.url);
});

app.use(require('./routes/admin2'));
app.use('/admin3', require('./routes/admin3'));

app.get('/try-sess', (req, res) => {
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;

    res.json(req.session);
});

// *** 路由定義結束

//需放在所有路由之後
app.use((req, res) => {
    res.status(404).send(`<h1>找不到頁面</h1>`)
});

let port = process.env.PORT || 3000;

app.listen(port, () => {

    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`啟動: ${port}`, Date());
});
