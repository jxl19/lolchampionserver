const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
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

const Champions = mongoose.model('ChampionSchema', championSchema);

module.exports = { Champions };