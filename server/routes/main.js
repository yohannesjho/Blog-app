const express = require('express');
const router = express.Router();
const Blog = require('../../models/blog')

router.get('/', async (req, res) => {

    try {
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
    res.render('new');
});

router.post('/blog', async (req, res) => {
    const { title, content } = req.body


    try {
        const newBlog = new Blog({ title, content });
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
        res.render('blog', { singleBlog })

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
        res.render('edit', { blog });
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
    res.render('edit');
});

module.exports = router;
