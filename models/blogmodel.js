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

  next()
})

blogSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Blog', blogSchema)