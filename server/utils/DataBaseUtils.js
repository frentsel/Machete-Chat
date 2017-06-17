var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/myappdatabase');
var Messages = require('../models/Messages');


var db = {
    connect: function ()
    {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/myappdatabase');

    },
    addMessage: function (data)
    {
        var newMessage = Messages({
            user: data.user,
            message:  data.message
        });
        newMessage.save(function (err)
        {
            if(err) throw  err;
            console.log('New message')
        })
    }
    
};


module.exports = db;
