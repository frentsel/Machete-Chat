$(function () {
    Chat.init({
        userName: 'Nikolay',
        limit: 20,
        dataServer: 'http://dcodeit.net/alexander.frentsel/chat/data.php',
        /**
         * Dcodeit - 192.168.1.199
         * My Route - 192.168.1.101
         * */
        ipRoute: 'http://192.168.1.101:8080'
    });
});
