const express = require('express');
const router = express.Router();
const Blog = require('../../models/blog')
const User = require('../../models/users')
const bcrypt = require('bcrypt')
const {isAuthenticated } = require('../../middleware/auth')

router.get('/' , async (req, res) => {

    try {
        const authentiated = req.session && req.session.userId;
        const blogs = await Blog.find().sort({ createdAt: -1 })
        if (blogs) {
            res.render('index', { blogs });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }

});
router.get('/new', (req, res) => {
    res.render('authenticatedUser/new');
});

router.post('/blog', async (req, res) => {
    const { title, content } = req.body


    try {
        const newBlog = new Blog({ title, content, author:req.session.userId });
        await newBlog.save();
        res.redirect('/')
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})

router.get('/blog/:id', async (req, res) => {
    try {
        const id = req.params.id
        const singleBlog = await Blog.findById(id)
        if (!singleBlog) {
            return res.status(400).send('Blog post not found')
        }
        res.render('authenticatedUser/blog', { singleBlog })

    } catch (error) {
        console.log(error)
    }

})

router.delete('/blog/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.get('/edit/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        res.render('authenticatedUser/edit', { blog });
    } catch (error) {
        console.log(error)
    }

});
router.put('/edit/:id', async (req, res) => {
    const { title, content } = req.body
    try {
        await Blog.findByIdAndUpdate(req.params.id, { title, content })
        res.redirect('index');
    } catch (error) {
        console.log(error)
    }

});
router.get('/show', (req, res) => {
    res.render('authenticatedUser/edit');
});

router.get('/signup',(req,res)=>{
    res.render('auth/signUp')
})
router.post('/signup',async (req,res)=>{
    const {username,email,password} = req.body
   
    if(!username || !email || !password) {
        res.status(400).send('All feilds are required!')
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400).send('Email already in use')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)){
        res.status(400).send('invalid email format')
    }

    if(password.length < 6 ){
       res.status(400).send('password length must greater than 6')
    }

   
    try {
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser  = new User({username,email,password:hashedPassword})
        await newUser.save()
        res.redirect('/')
    } catch (error) {
        console.error('Error saving user',error)
        error.status(500).send('server error')
    }
   
   
    
     
})


router.get('/signin',(req,res)=>{
    res.render('auth/signIn')
})

router.post('/signin',async (req,res)=>{
    const {email, password}  = req.body;

    if(!email || !password){
        res.status(400).send('All fields are required.')
    }
    try {
        const user =  await User.findOne({email})
        if(!user) {
            res.status(400).send('invalid email or password')
        }

        const isMatch =  bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(400).send('invalid email or password')
        }
        req.session.userId = user._id;
        res.redirect('/')
    } catch (error) {
        console.log('signin error message ',error)
        res.status(500).send('server error')
    }
   
   
})

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
            res.redirect('/')
        }
        res.redirect('/')
    })
})

module.exports = router;
