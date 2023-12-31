const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model('USER');
const jwt = require("jsonwebtoken");
const { Jwt_secret } = require('../keys');
const requireLogin = require('../middlewares/requireLogin');




router.post('/signup', async (req, res) => {
    const { name, userName, email, password } = req.body;

    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: 'Please fill all the fields' });
    }

    try {
        const existingUser = await USER.findOne({ $or: [{ email: email }, { userName: userName }] });

        if (existingUser) {
            return res.status(422).json({ error: 'User already exists with that email or userName' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new USER({
            name,
            email,
            userName,
            password: hashedPassword // Make sure to use the hashed password
        });

        await user.save();
        res.json({ message: 'Registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving user' });
    }
});

router.post('/signin', (req,res) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "Please add email and password"})
    }
    USER.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
        
            if(match){
                // return res.status(200).json({message: "Signed in Successfully"})
                const token = jwt.sign({_id:savedUser.id},Jwt_secret)
                const {_id,name,email,userName} = savedUser
                res.json({token, user:{_id,name,userName,email}})
                console.log({token, user:{_id,name,userName,email}})
            }
            else{
                return res.status(422).json({error:"Invalid Password"})
            }
        })
        .catch(err => console.log(err))
        console.log(savedUser);
    })
})

module.exports = router
