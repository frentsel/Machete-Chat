// http module
var http = {
    ajaxLoad: true,
    ajaxSpinner: function (status) {
        $('body').toggleClass('loadMore', status);
    },
    get: function (path, params) {

        if (!this.ajaxLoad) return false;

        var _this = this;

        return new Promise(function (resolve, reject) {

            $.ajax({
                url: path,
                type: 'get',
                dataType: 'json',
                data: params,
                beforeSend: function () {
                    _this.ajaxLoad = false;
                    _this.ajaxSpinner(true);
                },
                complete: function () {
                    setTimeout(function () {
                        _this.ajaxLoad = true;
                        _this.ajaxSpinner(false);
                    }, 100);
                },
                success: resolve,
                error: function (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
};

var Render = {
    scrollToElement: function (id) {

        var index = $('#' + id).index(),
            messages = $('.message:lt(' + index + ')'),
            offsetTop = 0;

        // Calculating total height of new messages
        messages.each(function (n, el) {
            offsetTop += $(this).outerHeight(true);
        });

        $('#messagesBlock').scrollTop(offsetTop);
    },
    _tpl: function (template, data) {

        $.each(data, function (key, val) {
            template = template.split('{' + key + '}').join(val || '');
        });

        return template.replace(/{[^}]+}/g, '');
    },
    createItem: function (el) {

        var tpl = $('#messageTpl').html().trim();
        el.type = (el.user === Chat.settings.userName) ? 'you' : '';
        return this._tpl(tpl, el);
    },
    loadMore: function (messages) {

        var html = '',
            firstElementId = $('.message:eq(0)').attr('id'),
            messagesBlock = $('#messagesBlock'),
            _this = this;

        $.each(messages, function (n, message) {
            html += _this.createItem(message);
        });

        messagesBlock.prepend(html);
        this.scrollToElement(firstElementId);
    },
    messagesAdd: function (el) {

        var messagesBlock = $('#messagesBlock'),
            html = this.createItem(el);

        messagesBlock.append(html);
        messagesBlock.scrollTop(messagesBlock[0].scrollHeight);
    },
    getFirstMessages: function (messages) {

        var item,
            messagesBlock = $('#messagesBlock'),
            _this = this;

        $.each(messages, function (n, message) {
            item = _this.createItem(message);
            messagesBlock.append(item);
        });

        setTimeout(function () {
            messagesBlock.scrollTop(messagesBlock[0].scrollHeight);
        }, 100);
    },
    reset: function () {
        $('#message').val('');
    },
    pencil: function (status, text) {
        $('#preview').toggle(status).text(text || '');
        $('.pencil').toggle(status);
    },
    init: function () {

        $('h1').text("User: " + Chat.settings.userName);

        document.addEventListener('keyup', function (event) {

            console.info("event: ", event);

            if (event.keyCode == 13 && $('#message').val().trim().length)
                Chat.send();
        }, true);

        $("#messagesBlock").on("scroll", function () {
            if ($(this).scrollTop() <= 1)
                Chat.loadMore();
        });
    }
};

var Chat = (function () {

    var settings = {
            userName: '',
            limit: 15
        },
        socket,
        Player = document.getElementById('player');

    var input = function (obj) {

        socket.emit(
            'new messages',
            JSON.stringify({
                message: obj.value.trim(),
                user: settings.userName,
                type: 'input'
            }));
    };

    var pencil = new function () {

        var activity = {};
        this.show = function (data) {

            if (data.user === settings.userName) {
                return false;
            }

            if (data.type !== 'input') {
                return false;
            }

            clearTimeout(activity);
            activity = setTimeout(function () {
                pencil.hide();
            }, 3000);

            Render.pencil(true, data.user + " : " + data.message);
        };

        this.hide = function () {
            clearTimeout(activity);
            activity = {};
            Render.pencil(false);
        }
    };

    var messagesAdd = function (data) {

        if (data.type === 'input') {
            pencil.show(data);
            return false;
        }

        if (data.type === 'message' && data.user !== null) {
            if (data.user !== settings.userName) {
                Player.play();
            }
            Render.messagesAdd(data);
        }

        pencil.hide();
    };

    var loadMore = function () {

        var params = {
            getLast: true,
            offset: $('#messagesBlock').find('.message').size(),
            limit: settings.limit,
            t: (new Date()).getTime()
        };

        http.get('http://dcodeit.net/alexander.frentsel/chat/data.php', params)
            .then(function (_data) {

                if (_data.length === 0)
                    Chat.loadMore = function () {
                    };

                Render.loadMore(_data);
            });
    };

    var send = function () {

        var data = {
            message: $.trim($('#message').val()),
            user: settings.userName,
            type: 'message'
        };

        socket.emit('send message', JSON.stringify(data));

        Render.reset();
    };

    var getFirstMessages = function () {

        var params = {
            getLast: true,
            offset: 0,
            limit: 20,
            t: (new Date()).getTime()
        };

        http.get('http://dcodeit.net/alexander.frentsel/chat/data.php', params)
            .then(Render.getFirstMessages.bind(Render));
    };

    var init = function (_settings) {

        /**
         * @ipRoute = Address of the router;
         * */
        /**
         * Dcodeit - 192.168.1.199
         * My Route - 192.168.1.101
         * */

        var ipRoute = 'http://192.168.1.101:8080';

        // New connections
        socket = io(ipRoute);

        socket.on('new messages', function (data) {

            if(!data) return;
            for(var i = 0; i < data.length; i++) {
                $('#messagesBlock').append("<p>" + data[i] + "</p>");
            }

            var messagesBlock = $('#messagesBlock');
            messagesBlock.append("<p>" + data.msg + "</p>");
        });

        $.extend(settings, _settings);

        Render.init();

        getFirstMessages();
    };

    return {
        settings: settings,
        input: input,
        loadMore: loadMore,
        send: send,
        init: init
    }
})();