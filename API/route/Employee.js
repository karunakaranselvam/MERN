const Employee = require("../model/EmployeeModel");
const express = require('express');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const multer = require("multer");
const bcrypt = require('bcrypt');
const fs = require('fs')
const path = require('path')
const route = express.Router();

var EmployeeProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/Profile/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => { })
        }
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var ProfileUpload = multer({ storage: EmployeeProfile })

// get all employee
route.get('/employee', async (req, res) => {
    try {
        let employee = await Employee.find();
        res.status(200).json({
            status: true,
            statuscode: 200,
            message: 'List All Employees',
            token: jwt.sign({ employee }, 'interviewnodejs')
        })
    } catch (error) {
        res.status(400).json(error)
    }
})

// get employee by id
route.get('/employee/:id', async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);
        res.status(200).json({
            status: true,
            statuscode: 200,
            message: 'List Employee',
            token: jwt.sign({employee}, 'interviewnodejs')
        })
    } catch (error) {
        res.status(400).json(error.message)
    }
})

// insert employee
route.post('/employee', ProfileUpload.single('photo'), async (req, res) => {
    try {
        let empid = await Employee.findOne().sort({ created_on: -1 }).limit(1);
    
        let employeeDetail = req.body;
        if (req.file) {
            employeeDetail.photo = req.file.originalname;
        }
        employeeDetail.employee_id = (empid !== null) ? incrementString(empid.employee_id) : 'EMP_0001';
        employeeDetail.status = 1;
        employeeDetail.created_on = new Date();
        
        let employeeData = new Employee(employeeDetail)
        await employeeData.save(function (err, data) {
            if (err) {
                res.status(409).json({
                    statuscode: 409,
                    status: false,
                    message: err.message
                })
            } else {
                var id = data._id
                res.status(200).json({
                    statuscode: 200,
                    status: true,
                    message: "Employee Added Successfully",
                    token: jwt.sign({ id }, 'interviewnodejs'),
                })
            }
        });
    } catch (e) {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: e.message
        })
    }
})

// update employee
route.put('/employee/:id', ProfileUpload.single('photo'), async (req, res) => {
    try {
        let employee = req.body;
        if (req.file) {
            employee.photo = req.file.originalname;
        }

        const employeeData = await Employee.updateOne({ _id: req.params.id }, {
            $set: employee
        });

        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Employee Updated Successfully",
            token: jwt.sign({ employeeData }, 'interviewnodejs'),
        })
    } catch (error) {
        res.status(400).json(error.message)
    }
})

// delete employee
route.delete('/employee/:id', async (req, res) => {
    try {
        let employeeData = await Employee.deleteOne({ _id: req.params.id })
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Employee Deleted Successfully",
            token: jwt.sign({ employeeData }, 'interviewnodejs'),
        })
    } catch (error) {
        res.status(400).json(error)
    }
})

// employee login
route.post('/login', async (req, res) => {
    try {
        var employeeData = await Employee.findOne({ employeename: req.body.employeename });
        if (!employeeData) {
            return res.status(400).json("Employee not Exist")
        }
        var vaildPsw = await bcrypt.compare(req.body.password, employeeData.password);
        if (!vaildPsw) {
            return res.status(400).json("Password not valid")
        }
        var employeeToken = await jwt.sign({ employeeData }, 'interviewnodejs')
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Login Successfully",
            token: employeeToken
        })

    } catch (err) {
        res.status(400).json(err)
    }
})

function incrementString(string) {
    var number = string.match(/\d+/) === null ? 0 : string.match(/\d+/)[0];
    var numberLength = number.length
    number = (parseInt(number) + 1).toString();

    while (number.length < numberLength) {
        number = "0" + number;
    }
    return string.replace(/[0-9]/g, '').concat(number);
}

module.exports = route;