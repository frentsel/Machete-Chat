var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    id: {type: String, required: true},
    time: {type: String, required: true},
    user: {type: String, required: true},
    message: {type: String, required: true }
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;