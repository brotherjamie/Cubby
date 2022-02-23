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

// //save function
// function saveBlogAndRedirect(path) {
//   return async (req, res) => {
//       const fileName = req.file != null ? req.file.filename : null
//       let blog = req.blog
//       blog.title = req.body.title
//       blog.summary = req.body.summary
//       blog.body = req.body.body
//       coverImageName = fileName   //Captial N?
//       try {
//         blog = await blog.save()
//         res.redirect('/blog-admin')
//       } catch (e) {
//         res.render(`blogpages/${path}`, { blog: blog, blogs: blogs })
//         console.log(e)
//       }
//     }
// }

// Create Book - MYBRARY METHOD
router.post('/create', async (req, res) => {
 const blog = new Blog({
   title: req.body.title,
   summary: req.body.summary,
   body: req.body.body,
 })
saveCover(blog, req.body.cover) //this deals with image/s

 try {
    const newBlog = await blog.save()
    res.redirect('/blog-admin')
 } catch {
  renderNewPage(res, blog, true)
 }
}) 

// post editted NEW
router.put('/edit/:id', async (req, res) => {
  const filename = req.file != null ? req.file.filename : null
 const blog = new Blog({
   title: req.body.title,
   summary: req.body.summary,
   body: req.body.body,
   coverImageName: filename
 })
 try {
    const newBlog = await blog.save()
    res.redirect('/blog-admin')
 } catch {
   if (blog.coverImageName != null) {
   removeBlogCover(blog.coverImageName)
  }
  renderNewPage(res, blog, true)
 }
}) 

// post editted blog OLD
// router.put('/edit/:id', async (req, res, next) => {
//     req.blog = await Blog.findById(req.params.id)
//     next()
// }, saveBlogAndRedirect('/blog-admin'))

// post new blog OLD
// router.post('/create', upload.single('cover'), async (req, res, next) => {
//   const fileName = req.file != null ? req.file.filename : null
//     req.blog = new Blog()
//     next()
// }, saveBlogAndRedirect('blog-admin'))

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

function saveCover(blog, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    blog.coverImage = new Buffer.from(cover.data, 'base64')
    blog.coverImageType = cover.type
  }
}

module.exports = router