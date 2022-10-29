const Task = require('../model/Task');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { json } = require('express');

let currentUser;

const getLoggedInUserInfo = (req , res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            currentUser = decoded.username ;
        }
    );
}

const handleAllTasks = async (req , res) => {
    getLoggedInUserInfo(req,res);

    const foundUser = await User.findOne({ username : currentUser }).exec();
    if(!foundUser) return res.sendStatus(401)
    const tasks = await Task.find({created_by: foundUser._id}).exec();

    res.json(tasks);
    
}



const createNewTask = async (req , res) => {
    getLoggedInUserInfo(req,res);
    const { description } = req.body;
    if(!description ) return res.sendStatus(400);

    const foundUser = await User.findOne({ username : currentUser }).exec();
    if(!foundUser) return res.sendStatus(401);

    try {
        const result = await Task.create({
            created_by : foundUser._id,
            description : description
        })
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({"message":"something went wrong"});
    }

}

const updateTask = async (req , res) => {
    getLoggedInUserInfo(req,res);
    const foundUser = await User.findOne({ username : currentUser }).exec();
    if(!foundUser) return res.sendStatus(401);

    const { id , compileted} = req.body ;

    if(!id || !compileted) return res.sendStatus(400);

    const foundTask = await Task.findOne({ _id : id , created_by : foundUser._id}).exec();
    if(!foundTask) return res.sendStatus(401);

    foundTask.compileted = compileted ;
    const result = await foundTask.save();

    res.json(result);
}

const deleteTask = async (req , res) => {
    getLoggedInUserInfo(req,res);
    const foundUser = await User.findOne({ username : currentUser }).exec();
    if(!foundUser) return res.status(401).json({"message" : "user Not Found"});

//     const { id } = req.params ;

    if(!req?.params?.id) return res.sendStatus(400);

    const foundTask = await Task.findOne({ _id : req.params.id , created_by : foundUser._id}).exec();
    if(!foundTask) return res.sendStatus(400);
    const result = await foundTask.deleteOne({ _id : req.params.id , created_by : foundUser._id}) ;
    res.json(result);
}

const clearTasks = async (req , res) => {
    getLoggedInUserInfo(req,res);
    const foundUser = await User.findOne({ username : currentUser }).exec();
    if(!foundUser) return res.status(401).json({"message" : "user Not Found"});

    const tasks = await Task.find({created_by: foundUser._id}).exec();
    if(!tasks) return res.sendStatus(400);
    
    for(let i = 0 ; i < tasks.length ; i++){
        const foundTask = await Task.deleteOne({ compileted : true , created_by : foundUser._id}).exec();
    }

    const finalTasks = await Task.find({created_by: foundUser._id}).exec();
    

    res.json(finalTasks);

}

module.exports = { handleAllTasks , createNewTask , updateTask , deleteTask , clearTasks} ;
