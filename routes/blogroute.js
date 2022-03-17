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

//post new blog
router.post('/create', async (req, res, next) => {
  req.blog = new Blog()
  next()
}, saveBlogAndRedirect('blog-admin'))

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
        if (req.body.pic1 != null && req.body.pic1 !== '') {
          savePic1(blog, req.body.pic1)
          }  
        if (req.body.pic2 != null && req.body.pic2 !== '') {
          savePic2(blog, req.body.pic2)
          }  
        if (req.body.pic3 != null && req.body.pic3 !== '') {
          savePic3(blog, req.body.pic3)
          }  
        blog = await blog.save()
        res.redirect('/blog-admin') 
   } catch  {
        res.render('blogpages/create', { 
        title: 'Create a New Blog', 
        blog: blog, 
        errorMessage: 'Blog failed to Save.'
        })
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

function savePic1(blog, pic1Encoded) {
  if (pic1Encoded == null) return
  const pic1 = JSON.parse(pic1Encoded)
  if (pic1 != null && imageMimeTypes.includes(pic1.type)) {
    blog.pic1Image = new Buffer.from(pic1.data, 'base64')
    blog.pic1ImageType = pic1.type
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