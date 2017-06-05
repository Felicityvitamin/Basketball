var host;
var port;
var socket;
// 문서 로딩 후 실행됨
$(function() {
$("#connectButton").bind('click', function(event) {

  host = location.hostname;
  port = location.port;
  connectToServer(join);
});
$("#sendButton").bind('click', function(event) {
			var data = $('#dataInput').val();
			var roomId = location.pathname.replace(/\/chat\//gi,'');
		  var roomId = decodeURI(roomId);
			var output = {roomId:roomId,command:'chat', type:'text', data:data};
			console.log('서버로 보낼 데이터 : ' + JSON.stringify(output));
			if (socket == undefined) {
					alert('서버에 연결되어 있지 않습니다. 먼저 서버에 연결하세요.');
					return;
			}
			socket.emit('message', output);
			});
$('#clearButton').bind('click',function(event){
console.log(111)
 $('.clear').empty();
})
});
			// 서버에 연결하는 함수 정의
function connectToServer(callback) {
    var options = {'forceNew':true};
    var url = 'http://' + host + ':' + port;
    socket = io.connect(url, options);
		console.log(url);
		console.dir(socket);
    socket.on('connect', function() {
		socket.on('message',function(message){
						println('<p>수신 메시지 : ' + message.data + '</p>');
			});
    });
    socket.on('disconnect', function() {
        println('웹소켓 연결이 종료되었습니다.');
    });
		callback();

}
function join() {
println('방 참가하기 버튼이 클릭되었습니다.');
 var roomId = location.pathname.replace(/\/chat\//gi,'');
 var roomId = decodeURI(roomId);
 var output = {command:'join', roomId:roomId};
 console.dir(output);
 socket.emit('room',output);

}
function println(data) {
console.log(data);
$('#result').append('<p>' + data + '</p>');
}
