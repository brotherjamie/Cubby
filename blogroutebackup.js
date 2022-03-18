const express = require('express')
const router = express.Router()
const Blog = require('./../models/blogmodel')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//create new blog page
router.get('/create', (req, res) => {
    res.render('blogpages/create', { title: 'Create a New Blog', blog: new Blog() })
})

router.get('/create', async (req, res) => {
  renderNewPage(res, new Blog())
})

async function renderNewPage(res, blog, hasError = false) {
  renderFormPage(res, blog, 'new', hasError)
}

//edit page
router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogpages/edit', { title: 'Edit Blog', blog: blog })
})

// Edit
router.get('/:id/edit', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    renderEditPage(res, blog)
  } catch {
    res.redirect('/')
  }
})

async function renderEditPage(res, blog, hasError = false) {
  renderFormPage(res, blog, 'edit', hasError)
}

//delete blog
router.delete('/edit/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/blog-admin')
  } catch (e) {
    console.log(e)
  }
})

//post new blog
router.post('/create', async (req, res, next) => {
  req.blog = new Blog()
  next()
}, saveBlogAndRedirect('blog-admin'))

// Create 
router.post('/', async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
  })
  saveCover(blog, req.body.cover)

  try {
    const newBlog = await blog.save()
    res.redirect(`blogs/${newBlog.id}`)
  } catch {
    renderNewPage(res, blog, true)
  }
})

// post edited blog
router.put('/edit/:id', async (req, res, next) => {
  req.blog = await Blog.findById(req.params.id)
  next()
}, saveBlogAndRedirect('/blog-admin'))


// Update Book Route
router.put('/:id', async (req, res) => {
  let blog

  try {
    blog = await Book.findById(req.params.id)
    blog.title = req.body.title
    blog.author = req.body.author
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(blog, req.body.cover)
    }
    await blog.save()
    res.redirect(`/blogs/${blog.id}`)
  } catch {
    if (blog != null) {
      renderEditPage(res, blog, true)
    } else {
      redirect('/')
    }
  }
})

async function renderFormPage(res, blog, form, hasError = false) {
  try {
    const params = {
      blog: blog
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Blog'
      } else {
        params.errorMessage = 'Error Creating Blog'
      }
    }
    res.render(`blogs/${form}`, params)
  } catch {
    res.redirect('/blogs')
  }
}

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
        if (req.body.main != null && req.body.main !== '') {
          saveMain(blog, req.body.main)
          }  
        if (req.body.pic2 != null && req.body.pic2 !== '') {
          savePic2(blog, req.body.pic2)
          }  
        if (req.body.pic3 != null && req.body.pic3 !== '') {
          savePic3(blog, req.body.pic3)
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

function saveCover(blog, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    blog.coverImage = new Buffer.from(cover.data, 'base64')
    blog.coverImageType = cover.type
  }
}

function saveMain(blog, mainEncoded) {
  if (mainEncoded == null) return
  const main = JSON.parse(mainEncoded)
  if (main != null && imageMimeTypes.includes(main.type)) {
    blog.mainImage = new Buffer.from(main.data, 'base64')
    blog.mainImageType = main.type
  }
}

function savePic2(blog, pic2Encoded) {
  if (pic2Encoded == null) return
  const pic2 = JSON.parse(pic2Encoded)
  if (pic2 != null && imageMimeTypes.includes(pic2.type)) {
    blog.pic2Image = new Buffer.from(pic2.data, 'base64')
    blog.pic2ImageType = pic2.type
  }
}

function savePic3(blog, pic3Encoded) {
  if (pic3Encoded == null) return
  const pic3 = JSON.parse(pic3Encoded)
  if (pic3 != null && imageMimeTypes.includes(pic3.type)) {
    blog.pic3Image = new Buffer.from(pic3.data, 'base64')
    blog.pic3ImageType = pic3.type
  }
}

module.exports = router