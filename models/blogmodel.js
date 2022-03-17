const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  body: {
    type: String,
    required: true
  },
  body2: {
    type: String
  },
  body3: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  },
 coverImage: {
    type: Buffer,
    required: true
  },
 coverImageType: {
    type: String,
    required: true
  },
  pic1Image: {
    type: Buffer,
    required: true
  },
  pic1ImageType: {
    type: String,
    required: true
  },
  pic2Image: {
    type: Buffer
  },
 pic2ImageType: {
    type: String
  },
  pic3Image: {
    type: Buffer
  },
 pic3ImageType: {
    type: String
  }
})

blogSchema.pre('validate', function(next) {
  if (this.title) {
    let uniqueId = this.title + this.createdAt.toString().replace(/ /g, "")
    this.slug = slugify(uniqueId, { lower: true, strict: true })
  }

  if (this.body) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.body))
  }

  if (this.body2) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.body2))
  }

  if (this.body3) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.body3))
  }

  next()
})

blogSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

blogSchema.virtual('pic1ImagePath').get(function() {
  if (this.pic1Image != null && this.pic1ImageType != null) {
    return `data:${this.pic1ImageType};charset=utf-8;base64,${this.pic1Image.toString('base64')}`
  }
})

blogSchema.virtual('pic2ImagePath').get(function() {
  if (this.pic2Image != null && this.pic2ImageType != null) {
    return `data:${this.pic2ImageType};charset=utf-8;base64,${this.pic2Image.toString('base64')}`
  }
})

blogSchema.virtual('pic3ImagePath').get(function() {
  if (this.pic3Image != null && this.pic3ImageType != null) {
    return `data:${this.pic3ImageType};charset=utf-8;base64,${this.pic3Image.toString('base64')}`
  }
})

module.exports = mongoose.model('Blog', blogSchema)