import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    coverImage: {
      type: String,
      default: '/uploads/default-blog.jpg',
    },
    author: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Scholarship Admin',
    },
    tags: [
      {
        type: String,
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
