const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    created_by : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    compileted : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Task' , taskSchema);