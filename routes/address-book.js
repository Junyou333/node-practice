const express = require('express');
const db = require('./../modules/connect-mysql');

const router = express.Router();

router.get('/', (req, res) => {


    res.render('address-book/main');
});
router.get('/list', async (req, res) => {
    res.locals.pageName = 'ab-list';
    const perPage = 5;
    let page = parseInt(req.query.page) || 1;
    const output = {

    };

    const t_sql = "SELECT COUNT(1) totalRows FROM address_book ";
    const [[{ totalRows }]] = await db.query(t_sql);
    output.totalRows = totalRows;
    output.totalPages = Math.ceil(totalRows / perPage);
    output.perPage = perPage;
    output.rows = [];
    output.page = page;

    //如果有資料才去取得分頁的資料
    if (totalRows > 0) {
        if (page < 1) {
            return res.redirect('?page=1');
        }
        if (page > output.totalPages) {
            return res.redirect('?page=' + output.totalPages);
        }

        const sql = `SELECT * FROM \`address_book\` ORDER BY sid DESC LIMIT ${(page - 1) * perPage}, ${perPage}`;
        const [rows] = await db.query(sql);
        output.rows = rows;
    }

    // res.json(output);
    res.render('address-book/list', output);
});

router.delete('/delete/:sid([0-9]+)', async (req, res) => {
    const sql = "DELETE FROM address_book WHERE sid=?";

    const [r] = await db.query(sql, [req.params.sid]);
    console.log({ r });
    res.json(r);
});

router.route('/add')
    .get(async (req, res) => {
        res.locals.pageName = 'ab-add';
        res.render('address-book/add');
    })
    .post(async (req, res) => {
        res.json({});
    });



module.exports = router;