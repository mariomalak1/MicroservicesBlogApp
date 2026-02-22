const express = require('express');
const dotenv = require('dotenv');
dotenv.config({quiet: true});

const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.json());

const posts = {}

app.post('/posts-create', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
       return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = {content, title, date: new Date()};
    posts[title] = post;

    return res.status(201).json({message: 'Post created successfully', post: posts[title]});
})

app.use((req, res) => {
    return res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
    })
})


app.listen(PORT, () => {
  console.log(`Posts service is running on port ${PORT}`);
});
