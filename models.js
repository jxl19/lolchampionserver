const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const championSchema = mongoose.Schema({
    type: {
        type: String
    },
    format: {
        type: String
    },
    version: {
        type: String
    },
    data: {
        type: Object
    }
})

championSchema.methods.allChamps = function () {
    return {
      data: this.data
    }
  }

var collectionName = 'champion'
const Champion = mongoose.model('Champion', championSchema, collectionName);

module.exports = { Champion };