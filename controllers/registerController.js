const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req , res) => {
    const {user ,email , pwd , rPwd} = req.body ;
    if (!user || !email || !pwd || !rPwd) return res.status(400).json({
        'message' : 'All Fileds Are Required.',
    })
    const duplicatedUser = await User.findOne({username : user}).exec();
    const duplicatedemail = await User.findOne({email : email}).exec();

    if(duplicatedUser) return res.status(409).json({'message' : 'Username is Already Taken'});
    if(duplicatedemail) return res.status(409).json({'message' : 'Email is Already Registerd'});
    if(pwd !== rPwd) return res.status(409).json({
        'message' : 'Password Must Be same As Repeated Password'
    })
    try{
        const hashPassword = await bcrypt.hash(pwd , 10);
        const result = await User.create({
            'username' : user,
            'email' : email,
            password : hashPassword
        });
        res.status(201).json({'success' : `New User ${user} Created`})
    }catch (err) {
        res.status(500).json({'message' : `${err}`})
    }
}

module.exports = {handleNewUser}