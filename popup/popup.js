// var path = window.location.search,
//     userName = path.split('?user=').pop() || 'Alex';
//
// $(function () {
//     Chat.init({
//         userName: userName,
//         limit: 20
//     });
// });


(function () {

    /**
     * @ipRoute = Address of the router;
     * */
    /**
     * Dcodeit - 192.168.1.199
     * My Route - 192.168.1.101
     * */

    var ipRoute = 'http://192.168.1.101:8080';

    // New connections
    var socket = io(ipRoute);

    socket.on('new messages', function (data) {
        if(!data) return;
        for(var i = 0; i < data.length; i++) {
            $('#messagesBlock').append("<p>" + data[i] + "</p>");
        }
    });

    socket.on('new message', function (data) {
        var messagesBlock = $('#messagesBlock');
        messagesBlock.append("<p>" + data.msg + "</p>");
    });

    document.addEventListener('DOMContentLoaded', function() {
        var sendBtn = document.getElementById('smbBtn');
        var messageForm = $('#message');

        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            socket.emit('send message', messageForm.val());
        });

    });

})();