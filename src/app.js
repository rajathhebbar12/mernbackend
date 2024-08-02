require('dotenv').config();
const express = require('express')
const app = express()
const hbs = require('hbs')
const bcrypt = require('bcryptjs')
const cookieParser=require('cookie-parser')
const port = process.env.PORT || 5000
const path = require('path')
const paths = path.join(__dirname, '../public')
const views_paths = path.join(__dirname, '../templates/views')
const partials_paths = path.join(__dirname, '../templates/partials')
const Register = require('./models/registers')
const auth=require('../middleware/auth');
const { register } = require('module');
require('./db/conn')
app.use(express.static(paths))
app.set('view engine', 'hbs')
app.set('views', views_paths)
hbs.registerPartials(partials_paths)
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/home",(req, res) => {
    res.render("index")
});

app.get("/pricing", auth,(req, res) => {
    res.render("pricing")
});

app.get("/logout", auth,async(req, res) => {
    try{
        console.log(req.user);
        // req.user.tokens=req.user.tokens.filter((currentUser)=>{
        //     console.log(currentUser)
        //       return currentUser.token!==req.cookies.jwt1;
        // })
        req.user.tokens=[];
        res.clearCookie('jwt1');
        console.log('logout success')
        await req.user.save()
        res.render('login')
    }catch(e){
        res.status(500).send(e)
    }
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const data = await Register.findOne({ email: email })
        if (!data) {
             res.status(401).send('Invalid Login credentials');
          }
        const isMatch = await bcrypt.compare(req.body.password, data.password)

        if (isMatch) {

            const getToken = await data.generateTokens()

            res.cookie('jwt1', getToken,
            {
                expires: new Date(Date.now() + 100000),
                httpOnly: true
            });
            await data.save();
            res.status(201).render('index');

        } else
            res.send('Invalid Login credentials');

    } catch (e) {
        res.status(400).send(e.message)
    }
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.get("/formm", (req, res) => {
    console.log("Get");
});

app.post("/formm", (req, res)=>{
    console.log("POST");
    res.send(req.body);
});

app.get("/Users", async(req, res) => {
    
    const allUsers = await Register.find({});
    if(allUsers.length == 0) {
        console.log("ulaga motto ")
        res.status(404);
    }
    res.json(allUsers);
});
app.get("/allUsers",(req,res)=>{
        res.render('allUsers');
});

app.post('/register', async (req, res) => {
    try {
        if (req.body.password === req.body.confirmpassword) {
            const employee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: req.body.age,
                dob: req.body.dob,
                gender: req.body.gender,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            const getToken = await employee.generateTokens()
            res.cookie('jwt1', getToken,
                {
                    expires: new Date(Date.now() + 3000),
                    httpOnly: true
                })
            const register = await employee.save()
            res.status(201).render('login')
        }
        else {
            res.status(401).send("Password and confirmpassword doesn't match")
        }

    } catch (e) {
        res.send(e)
        console.log(e);
    }
});

app.get("*", (req, res) => {
    res.send("404");
});
// const jwt=require('jsonwebtoken')

// const createToken=async()=>{
//     const token=await jwt.sign({id:"47wrdtfgjmvgt67654@56786ityfhg"},'thisismysectretkey');
//     console.log(token)

//     const userVer=await jwt.verify(token,'thisismysectretkey')
//     console.log(userVer)
// }
// createToken()

app.listen(port, () => {
    console.log("connection success");
    console.log("Server running on port:", port)

});
