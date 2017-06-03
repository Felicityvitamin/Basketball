var fs = require('fs');
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');
var ejs = require("ejs");
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

var multer = require('multer');
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'basketball'
});

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function(req, file, callback) {
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);

        callback(null, basename + extension);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 50,
        fileSize: 1024 * 1024 * 1024
    }
});

var index = function(req, res) { // /login로 url을 접근할
    if (!(req.session.user)) {
        res.render('index');
    } else {
        res.render('index');
    }
}

var adduser = function(req, res) {
    var name = req.params.name;
    var sql = 'select * from users where name = ?'
    console.log(name);
    if (name) {
        conn.query(sql, [name], function(err, result, fields) {
            if (result.length === 0) {
                res.render('adduser', {
                    status: '아이디 사용가능'

                })
            } else {
                res.render('adduser', {
                    status: '아이디 사용불가'

                })
            }
        });
    } else {
        res.render('adduser', {
            status: ''
        })
    }
}

var board = function(req, res) { // 게시판화면에 접근
    fs.readFile('./public/board.html', 'utf8', function(error, data) {
        conn.query('SELECT * FROM board', function(error, results) {
            res.send(ejs.render(data, {
                data: results
            }))
        });
    });
}

var create = function(req, res) { //방만들기 화면에 접근

    console.dir(req.session.user);
    res.render('createRoom', {
        id: req.session.user.id
    });
}

var remove = function(req, res) { //삭제
    fs.readFile('./public/delete.html', 'utf8', function(error, data) {
        conn.query('SELECT * FROM board WHERE count=?', [req.params.count], function(error, result) {
            res.send(ejs.render(data, {
                data: result
            }))
        })

    })
}
