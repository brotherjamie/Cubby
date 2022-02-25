const express = require('express')
const router = express.Router()
const Blog = require('./../models/blogmodel')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//create new blog page
router.get('/create', (req, res) => {
    res.render('blogpages/create', { title: 'Create a New Blog', blog: new Blog() })
})

//edit page
router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogpages/edit', { title: 'Edit Blog', blog: blog })
})

//delete blog
router.delete('/edit/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/blog-admin')
  } catch (e) {
    console.log(e)
  }
})

// Create Blog
// router.post('/create', async (req, res) => {
//  const blog = new Blog({
//    title: req.body.title,
//    author: req.body.author,
//    summary: req.body.summary,
//    body: req.body.body,
//    body2: req.body.body,
//    body3: req.body.body
//  })
// saveCover(blog, req.body.cover) //this deals with image/s
//  try {
//     const newBlog = await blog.save()
//     res.redirect('/blog-admin')
//  } catch {
//   renderNewPage(res, blog, true)
//  }
// }) 

//post new blog
router.post('/create', async (req, res, next) => {
  req.blog = new Blog()
  next()
}, saveBlogAndRedirect('blog-admin'))

// post edited Blog
// router.put('/edit/:id', async (req, res) => {
//  let blog
//  try {
//     blog = await Blog.findById(req.params.id)
//     blog.title = req.body.title,
//     blog.author = req.body.author,
//     blog.summary = req.body.summary,
//     blog.body = req.body.body,
//     blog.body2 = req.body.body2,
//     blog.body3 = req.body.body3
//     if (req.body.cover != null && req.body.cover !== '') {
//     saveCover(blog, req.body.cover)
//     }
//     await blog.save()
//     res.redirect('/blog-admin')
//  } catch {
//    if (blog != null) {
//      renderEditPage(res, blog, true)
//    } else {
//     redirect('/blog-admin')
//    }
//  }
// }) 

// post edited blog
router.put('/edit/:id', async (req, res, next) => {
  req.blog = await Blog.findById(req.params.id)
  next()
}, saveBlogAndRedirect('/blog-admin'))


// save function
function saveBlogAndRedirect(path) {
  return async (req, res) => {
      let blog = req.blog
      blog.title = req.body.title
      blog.author = req.body.author
      blog.summary = req.body.summary
      blog.body = req.body.body
      blog.body2 = req.body.body2
      blog.body3 = req.body.body3
      try {
        if (req.body.cover != null && req.body.cover !== '') {
          saveCover(blog, req.body.cover)
          }
        blog = await blog.save()
        res.redirect('/blog-admin')
      } catch (e) {
        const blogs = await Blog.find().sort({ createdAt: 'desc' })
        res.render(`blogpages/${path}`, { blog: blog, blogs: blogs })
        console.log(e)
      }
    }
}

async function renderNewPage(res, blog, hasError = false) {
  try {
    const blogs = await Blog.find({})
    const params = {
      blog: blog
    }
    if (hasError) params.errorMessage = 'Error Creating Blog'
    res.render('blog-admin/create', params)
  } catch {
     res.redirect('blog-admin')
   }
}

async function renderEditPage(res, blog, hasError = false) {
  try {
    const blogs = await Blog.find({})
    const params = {
      blog: blog
    }
    if (hasError) params.errorMessage = 'Error Editing Blog'
    res.render('blog-admin/edit', params)
  } catch {
     res.redirect('blog-admin')
   }
}

function saveCover(blog, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    blog.coverImage = new Buffer.from(cover.data, 'base64')
    blog.coverImageType = cover.type
  }
}

module.exports = router