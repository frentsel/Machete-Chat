var path = window.location.search,
    userName = path.split('?user=').pop() || 'Alex';

$(function () {
    Chat.init({
        userName: userName,
        limit: 20
    });
});