(function () {

    var socket = io('http://192.168.1.101:8080');

    var sendBtn = $('.smbBtn'),
        messageForm = $('.messageForm');


    console.log(chrome.runtime);
    console.log(messageForm);


    sendBtn.on('click', function (e) {
        e.preventDefault();
        socket.emmit('send message', messageForm.val());
    })

    socket.on('new message', function (data) {
        $('.messageBoard').append("<p>" + data.msg + "</p>");
    });
    
})();