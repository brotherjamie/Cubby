const express = require('express')
const Blog = require('./../models/blogmodel')
const router = express.Router()


//create new blog page
router.get('/create', (req, res) => {
    res.render('blogpages/create', { title: 'Create a New Blog', blog: new Blog() })
})

//post new blog
router.post('/create', async (req, res, next) => {
    req.blog = new Blog()
    next()
}, saveBlogAndRedirect('blog-admin'))

//edit page
router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogpages/edit', { title: 'Edit Blog', blog: blog })
})

//post editted blog
router.put('/edit/:id', async (req, res, next) => {
    req.blog = await Blog.findById(req.params.id)
    next()
}, saveBlogAndRedirect('/blog-admin'))

//delete blog
router.delete('/edit/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/blog-admin')
  } catch (e) {
    console.log(e)
  }
})

//save function
function saveBlogAndRedirect(path) {
  return async (req, res) => {
      let blog = req.blog
      blog.title = req.body.title
      blog.summary = req.body.summary
      blog.body = req.body.body
      try {
        blog = await blog.save()
        res.redirect('/blog-admin')
      } catch (e) {
        res.render(`blogpages/${path}`, { blog: blog, blogs: blogs })
        console.log(e)
      }
    }
}

module.exports = router