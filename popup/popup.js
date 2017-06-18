var init = function (userName) {
    Chat.init({
        userName: userName,
        limit: 20,
        /**
         * Dcodeit - 192.168.1.199
         * My Route - 192.168.1.101
         * */
        ipRoute: 'http://192.168.1.101:8080'
    });
};

$(function () {

    if(localStorage['userName']) {
        init(localStorage['userName']);
        return false;
    }

    $('#loginForm').on('submit', function (e) {

        e.preventDefault();
        if(!this.name.value.length) {
            return false;
        }

        localStorage.setItem('userName', this.name.value);
        init(this.name.value);
    });
});
