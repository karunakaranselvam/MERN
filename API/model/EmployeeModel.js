const mongoose = require('mongoose');

const Employee = mongoose.Schema({
    emplyeename : {
        type: String
    },
    employee_id : {
        type: String
    },
    designation : {
        type: String
    },
    qualification : {
        type: String
    },
    from_date : {
        type: Date
    },
    end_date : {
        type: Date
    },
    photo : {
        type: String
    },
    status: {
        type: Number
    },
    created_on: {
        type: Date
    },
    update_on: {
        type: Date
    }
})

module.exports = mongoose.model('employee', Employee)