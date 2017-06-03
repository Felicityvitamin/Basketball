var host;
var port;
var socket;
// 문서 로딩 후 실행됨
$(function() {
    host = location.hostname;
    port = location.port;
    connectToServer();
    $("#one")
        .click(function(event) {
            console.log(1)
            var roomId = $('#roomIdInput')
                .val();
            var id = $('#id')
                .val();

            var output = {
                command: 'create',
                roomId: roomId,
                roomOwner: id
            };
            socket.emit('room', output);
        });
});
// 서버에 연결하는 함수 정의
function connectToServer() {
    var options = {
        'forceNew': true
    };
    var url = 'http://' + host + ':' + port;
    socket = io.connect(url, options);
    if (socket == undefined) {
        alert('서버에 먼저 연결하세요');
        return;
    } else {
    }
}
