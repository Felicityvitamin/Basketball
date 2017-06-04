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

app.get('/chat/:userid', function(req, res) {
    res.render('chat', {
        id: req.session.user.id
    })
})

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app)
    .listen(app.get('port'), function() {
        console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    });
var io = socketio.listen(server);
console.log('socket.io 요청을 받아들일 준비가 되었습니다.');

io.sockets.on('connection', function(socket) {
    console.log('connection info :', socket.request.connection._peername);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    socket.on('message', function(message) {
        console.log('message 이벤트를 받았습니다.');
        console.dir(message);
        console.dir('나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다.')
        io.sockets.in(message.roomId)
            .emit('message', message);
    });

    socket.on('room', function(room) {
        console.log('room 이벤트를 받았습니다.');
        console.dir(room);

        if (room.command === 'create') {
            if (io.sockets.adapter.rooms[room.roomId]) { // 방이 이미 만들어져 있는 경우
                console.log('방이 이미 만들어져 있습니다.');
            } else {
                console.log('방을 새로 만듭니다.');
                socket.join(room.roomId);
                var curRoom = io.sockets.adapter.rooms[room.roomId];
                curRoom.id = room.roomId;
                curRoom.name = room.roomName;
                curRoom.owner = room.roomOwner;
            }
        } else if (room.command === 'join') {
            console.log('룸 참여')
            socket.join(room.roomId);
            socket.emit('response')
        }
    });
});
