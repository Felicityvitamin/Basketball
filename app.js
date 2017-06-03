var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

var multer = require('multer');

var rt = require('./routes/users');

var socketio = require('socket.io');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'key',
    resave: true,
    saveUninitialized: true
}));

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

app.get(['/process/adduser', '/process/adduser/:name'], rt.adduser);
app.get('/', rt.index);
app.get('/board', rt.board);
app.get('/createRoom', rt.create);
app.get('/delete/:count', rt.remove)
app.get('/edit/:count', rt.edit);
app.get('/editor/:count', rt.editor);

app.post('/process/adduser', upload.array('photo', 1), rt.adduserPost);
app.post('/process', rt.indexPost);
app.post('/createRoom', rt.createPost);
app.post('/delete/:count', rt.removePost);
app.post('/edit/:count', rt.editPost);
app.post('/editor/:count', rt.editorPost);
app.post('/board', rt.boardPost);
