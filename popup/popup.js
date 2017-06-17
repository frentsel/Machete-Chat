(function () {

    /**
     * @ipRoute = Address of the router;
     * */

    var ipRoute = 'http://192.168.1.101:8080';

    // New connections
    var socket = io(ipRoute);

    socket.on('new messages', function (data) {
        if (!data) return;
        for (var i = 0; i < data.length; i++) {
            $('.messageBoard').append("<p>" + data[i] + "</p>");
        }
    });

    socket.on('new message', function (data) {
        $('.messageBoard').append("<p>" + data.msg + "</p>");
    });

    document.addEventListener('DOMContentLoaded', function () {
/*        var sendBtn = document.getElementById('smbBtn');
        var messageForm = $('#messageForm');

        sendBtn.addEventListener('click', function (e) {
            e.preventDefault();
            socket.emit('send message', messageForm.val());
        });*/

    });

    var path = window.location.search,
        userName = path.split('?user=').pop() || 'Alex';

    $(function () {
        Chat.init({
            userName: userName,
            limit: 20
        });
    });

})();