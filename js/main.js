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
    createItem: function (message) {
        var tpl = $('#messageTpl').html().trim();
        message.type = (message.user === Chat.settings.userName) ? 'you' : '';
        return this._tpl(tpl, message);
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

        if(!messages) return;

        var item,
            messagesBlock = $('#messagesBlock'),
            _this = this;

        $.each(messages, function (n, message) {
            item = _this.createItem(message);
            messagesBlock.append(item);
        });

        messagesBlock.scrollTop(messagesBlock[0].scrollHeight);
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
    }
};

var Chat = (function () {

    var settings = {
            userName: '',
            limit: 15
        },
        socket;

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
            if (data.user === settings.userName && data.type === 'input') {
                return false;
            }

            $('#player')[0].play();
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

        if(!data) return;

        if (data.type === 'input') {
            pencil.show(data);
            return false;
        }

        /** Draw message */
        if (data.type === 'message' && data.user !== null) {
            Render.messagesAdd(data);
        }

        pencil.hide();
    };

    var loadMore = function () {
        var params = {
            offset: $('#messagesBlock').find('.message').length,
            limit: settings.limit
        };

        socket.emit('getPage', params);
    };

    var send = function () {

        var data = {
            message: $.trim($('#message').val()),
            user: settings.userName,
            type: 'message'
        };

        socket.emit('send message', data);
        Render.reset();
    };


    /** Socket initialization and logic */
    var init = function (_settings) {

        $.extend(settings, _settings);

        /** Setup new WS connection */
        socket = io(settings.ipRoute);

        socket.emit('getAll', settings.limit );

        /** Get all messages on present session -> and render it */
        socket.on('_getAll', Render.getFirstMessages.bind(Render));

        /** If new message -> render it */
        socket.on('new message', messagesAdd);

        /** When user typing*/
        socket.on('input', pencil.show);

        socket.on('_getPage', function (_data) {

            if (_data.length === 0) {
                return false;
            }

            Render.loadMore(_data);
        });


        $("#messagesBlock").on("scroll", function () {
            if ($(this).scrollTop() <= 1) {
                Chat.loadMore();
            }
        });

        $('#message').on('keyup', function (event) {

            if (event.keyCode == 13 && this.value.trim().length) {
                Chat.send();
                return false;
            }

            Chat.socket().emit('typing', {
                user: settings.userName,
                message: this.value,
                type: 'input'
            });

        });

        Render.init();

    };

    return {
        settings: settings,
        socket: function () {
            return socket;
        },
        input: input,
        loadMore: loadMore,
        send: send,
        init: init
    }
})();