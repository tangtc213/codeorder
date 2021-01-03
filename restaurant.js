
const express = require('express')
const multer = require('multer')
const path = require('path')


ioServer.on('connection', socket => {
    // console.log('SOCKET', socket)
    // socket.on('join restaurant', restaurant => {
    //     socket.join(restaurant)
    // })
    // socket.on('join desk', desk => {
    //     socket.join(desk)
    // })

    // socket.on('new food', info => {
    //     socket.emit('new food', info)

    // })
})

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
     },
    filename: function (req, file, cb) {
        cb(null , Date.now() + file.originalname);
    }
});
const uploader = multer({storage})
const dbPromise = require('./db');
const { Socket } = require('socket.io');

let db
(async function(){
    db = await require('./db')
  }())
const app = express.Router()

// 下单管理
app.post('/restaurant/:rid/desk/:did/order',async (req, res, next) => {
    var rid = req.params.rid
    var did = req.params.did
    var deskName = req.body.deskName
    var customCount = req.body.customCount
    var totalPrice = req.body.totalPrice
    var details = JSON.stringify(req.body.details)
    var status = 'pending' //confirmed/completed
    var timestamp = new Date().toISOString()
    await db.run(`
        INSERT INTO orders (rid, did, deskName, customCount, details, status, timestamp,totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [rid,did,deskName, customCount,details,status ,timestamp,totalPrice])
        var order = await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1 ')
        order.details = JSON.parse(order.details)
        res.json(order)
        ioServer.emit('new order', order)
    })

// 订单管理：
app.route('/restaurant/:rid/order')
    .get(async (req, res, next) => {
        var orders = await db.all('SELECT * FROM orders WHERE rid =? ORDER BY timestamp DESC', req.cookies.userid)
        orders.forEach(order => {
            order.details = JSON.parse(order.details)
        })
        res.json(orders)
    })
//
app.route('/restaurant/:rid/order/:oid')
    .delete(async (req, res, next) => {
        var order = await db.get('SELECT * FROM orders WHERE rid =? AND id = ?', [req.cookies.userid,req.params.oid])
        if(order) {
            await db.run('DELETE FROM orders WHERE rid =? AND id = ?', [req.cookies.userid,req.params.oid])
            delete order.id
            res.json(order)
        } else {
            res.status(401).json({
                code: -1,
                msg: '没有订单或您无权操作此订单'
            })
        }
    })


// 删除订单
app.route('/restaurant/:rid/order/:oid')
    .delete(async (req, res, next) => {
        await db.run('DELETE FROM orders WHERE id = ? AND rid = ?', req.params.oid, req.cookies.userid)
        res.end()
    })

// 更新状态
// {status: 'pending/confirmed/completed'}
app.route('/restaurant/:rid/order/:oid/status')
    .put(async (req, res, next) => {
        await db.run(`
            UPDATE orders SET status = ?
                WHERE id = ? AND rid = ?
        `, [req.body.status,req.params.oid,  req.cookies.userid])
        res.json(await db.get(`SELECT * FROM orders WHERE id = ?`, req.params.oid))
    })

// 获取桌面信息
// 将会在landing页面请求并展示
app.get('/deskinfo', async (req, res, next) => {
    var desk = await db.get('SELECT desks.id AS did, users.id AS uid, desks.name, users.title FROM desks  JOIN users ON desks.rid = users.id WHERE desks.id = ?;', req.query.did)
    if(desk) {
        res.json(desk)
    }
})

// 获取当前桌面名字
app.get('/deskinfo/r/:rid/d/:did', async(req, res, next) => {
    var desk = await db.get('SELECT id, name FROM desks WHERE id = ?', req.params.did)
    if(desk) {
        res.json(desk)
    }
})

//  返回某餐厅的菜单
app.get('/menu/restaurant/:rid',async (req, res, next) => {
    var menu = await db.all(`
        SELECT * FROM foods WHERE rid = ? AND status = 'on'
    `, req.params.rid)
    res.json(menu)
})

// 菜品管理
app.route('/restaurant/:rid/food')
    .get(async (req, res, next) => {
        // 获取所有的菜品列表用于在页面中展示
        var foodList = await db.all('SELECT * FROM foods WHERE rid=?',req.cookies.userid)
        res.json(foodList)
    })
    // 对应<input type="file" name="img" />
    // 或fd = new FormData()
    // fd.append('img', input.files[0])
    // fd.append('name', 'qingjiaoroushi')
    // axios.post('/food', fd, {contenttype:})
    .post(uploader.single('img'),async (req,res, next) => {
        // 增加一个菜品
        await db.run(`
            INSERT INTO foods (rid, name, desc, price,category, status, img) VALUES (?,?,?,?,?,?,?)
        `,[ req.cookies.userid,
            req.body.name,
            req.body.desc,
            req.body.price,
            req.body.category,
            req.body.status,
            req.file.filename
        ])
        var food = await db.get('SELECT * FROM foods ORDER BY id DESC LIMIT 1')
        res.json(food)
    })

app.route('/restaurant/:rid/food/:fid')
    .delete(async (req,res, next) => {
        // 删除一个菜品
        let fid = req.params.fid
        let userid = req.cookies.userid
        var food = db.get('SELECT * FROM foods WHERE id = ? AND rid = ?',fid,userid)
        if(food) {
            await db.run('DELETE FROM foods WHERE id = ? AND rid = ?',
            [fid, userid])
            res.json(food)
        } else {
            res.status(401).json({
                code: -1,
                msg: '不存在此菜品或你没有权限删除'
            })
        }
    })
    .put(uploader.single('img'), async (req,res, next) => {
        // 修改一个菜品
        let fid = req.params.fid
        let userid = req.cookies.userid
        var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?',fid,userid)
        var newFoodInfo = {
            name: req.body.name ? req.body.name: food.name,
            price: req.body.price ? req.body.price: food.price,
            status: req.body.status ? req.body.status: food.status,
            desc: req.body.desc ? req.body.desc: food.desc,
            category: req.body.category ? req.body.category: food.category,
            // img: req.file && req.file.filename ? req.file.filename: food.img,
        }
        if (req.file && req.file.filename) {
            newFoodInfo.img = req.file.filename
        } else {
            newFoodInfo.img = food.img
        }
        if(food) {
            await db.run('UPDATE foods SET name = ?,desc = ?,price = ? ,status = ?,category= ? , img = ? WHERE id = ? AND rid = ?',
            [newFoodInfo.name ,newFoodInfo.desc ,newFoodInfo.price, newFoodInfo.status,newFoodInfo.category,newFoodInfo.img, fid, userid])
            let currentFood = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?',fid,userid)
            res.json(currentFood)
        } else {
            res.status(401).json({
                code: -1,
                msg: '不存在此菜品或你没有权限修改'
            })
        }
    })

// 桌面管理api
app.route('/restaurant/:rid/desk')
    .get(async (req, res, next) => {
        // 获取所有的菜品列表用于在页面中展示
        var deskList = await db.all('SELECT * FROM desks WHERE rid=?',req.cookies.userid)
        res.json(deskList)
    })
    .post(async (req,res, next) => {
        // 增加一个桌子
        await db.run(`
            INSERT INTO desks (rid, name, capacity) VALUES (?,?,?)
        `,req.cookies.userid, req.body.name,req.body.capacity)
        var desk = await db.get('SELECT * FROM desks ORDER BY id DESC LIMIT 1')
        res.json(desk)
    })

app.route('/restaurant/:rid/desk/:did')
.delete(async (req,res, next) => {
    // 删除一个桌子
    let did = req.params.did
    let userid = req.cookies.userid
    var desk = db.get('SELECT * FROM desks WHERE id = ? AND rid = ?',did,userid)
    if(desk) {
        await db.run('DELETE FROM desks WHERE id = ? AND rid = ?',
        [did, userid])
        res.json(desk)
    } else {
        res.status(401).json({
            code: -1,
            msg: '不存在此桌子或你没有权限删除'
        })
    }
})
.put(async (req,res, next) => {
    // 修改一个菜品
    let did = req.params.did
    let userid = req.cookies.userid
    var desk = db.get('SELECT * FROM desks WHERE id = ? AND rid = ?',did,userid)
    if(desk) {
        await db.run('UPDATE desks SET name = ?,capacity = ? WHERE id = ? AND rid = ?',
        [req.body.name,req.body.capacity, did, userid])
        let currentDesk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?',did,userid)
        res.json(currentDesk)
    } else {
        res.status(401).json({
            code: -1,
            msg: '不存在此桌面或你没有权限修改'
        })
    }
})

module.exports = app
