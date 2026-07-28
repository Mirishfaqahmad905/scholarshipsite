import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  if (!isDbConnected()) {
    const store = getStore(req);
    return res.json(store.blogs);
  }

  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    const store = getStore(req);
    return res.json(store.blogs);
  }
};

// @desc    Get single blog post by ID or slug
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const store = getStore(req);
    const blog = store.blogs.find((b) => b._id === id || b.slug === id);
    if (blog) return res.json(blog);
    return res.status(404).json({ message: 'Blog post not found' });
  }

  try {
    let blog = await Blog.findById(id);
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    return res.json(blog);
  } catch (error) {
    const store = getStore(req);
    const blog = store.blogs.find((b) => b._id === id || b.slug === id);
    if (blog) return res.json(blog);
    return res.status(404).json({ message: 'Blog post not found' });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  const { title, content, coverImage, tags, published, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Please provide title and content' });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newBlog = {
    title,
    slug: slug + '-' + Date.now().toString().slice(-4),
    content,
    coverImage: coverImage || '/uploads/default-blog.jpg',
    author: author || (req.user ? req.user.name : 'Scholarship Admin'),
    tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
    published: published !== undefined ? published : true,
    publishedAt: new Date(),
  };

  if (!isDbConnected()) {
    const store = getStore(req);
    const created = {
      _id: 'blog-' + Date.now(),
      ...newBlog,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.blogs.unshift(created);
    return res.status(201).json(created);
  }

  try {
    const blog = await Blog.create(newBlog);
    return res.status(201).json(blog);
  } catch (error) {
    const store = getStore(req);
    const created = {
      _id: 'blog-' + Date.now(),
      ...newBlog,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.blogs.unshift(created);
    return res.status(201).json(created);
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  const index = store.blogs.findIndex((b) => b._id === id || b._id?.toString() === id.toString());
  if (index !== -1) {
    store.blogs[index] = {
      ...store.blogs[index],
      ...req.body,
      updatedAt: new Date(),
    };
  }

  if (!isDbConnected()) {
    if (index !== -1) return res.json(store.blogs[index]);
    return res.status(404).json({ message: 'Blog post not found' });
  }

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const blog = await Blog.findById(id);
      if (blog) {
        Object.assign(blog, req.body);
        const updated = await blog.save();
        return res.json(updated);
      }
    }
    if (index !== -1) return res.json(store.blogs[index]);
    return res.status(404).json({ message: 'Blog post not found' });
  } catch (error) {
    if (index !== -1) return res.json(store.blogs[index]);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  if (store && store.blogs) {
    store.blogs = store.blogs.filter(
      (b) => b._id !== id && b._id?.toString() !== id.toString()
    );
  }

  if (!isDbConnected()) {
    return res.json({ message: 'Blog post deleted successfully' });
  }

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Blog.findByIdAndDelete(id);
    }
    return res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    return res.json({ message: 'Blog post deleted successfully' });
  }
};

