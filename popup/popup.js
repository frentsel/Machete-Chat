$(function () {

    $('#loginForm').on('submit', function (e) {

        e.preventDefault();
        if(!this.name.value.length) {
            return false;
        }

        Chat.init({
            userName: this.name.value,
            limit: 20,
            /**
             * Dcodeit - 192.168.1.199
             * My Route - 192.168.1.101
             * */
            ipRoute: 'http://192.168.1.101:8080'
        });
    });
});
