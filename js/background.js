chrome.alarms.create({periodInMinutes: 0.1});
chrome.alarms.onAlarm.addListener(notifyMe);


function notifyMe() {
    var socket = io('http://192.168.1.101:8080');
    socket.emit('haveNewMessage');

    socket.on('_haveNewMessage', function(data) {

        var user = localStorage.getItem('userName');

        if(!data || data.user === user) return false;

        var options = {
            body: data.message,
            title: user,
            icon: "../img/avatar.jpg"
        };

        var notification = new Notification("New message: " + data.user, options);
        var notifSound = new Audio("../mp3/notify.mp3");

        notifSound.play();
        notification.show();
    } )
}


