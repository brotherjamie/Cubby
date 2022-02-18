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
  summary: {
    type: String
  },
  body: {
    type: String,
    required: true
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

module.exports = mongoose.model('Blog', blogSchema)