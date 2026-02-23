const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config({quiet: true});

const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.json());
app.use(cors());

/**
 * Structure of posts:
 * { title: { content, title, date, comments: [ { "comment", date } ] }}
 */
const posts = {}

app.post('/posts-create', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
       return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = {content, title, date: new Date(), comments: []};
    posts[title] = post;

    await axios.post('http://localhost:4005/', { type: 'PostCreated', data: post})
        .catch(err => {console.error('Error sending event to event bus:', err.message);});

    return res.status(201).json({message: 'Post created successfully', post: posts[title]});
})

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const { postTitle, comment } = data;
        const post = posts[postTitle];
        post.comments.push(comment);
    }

    return res.status(200).json({message: 'Event received successfully', event: {type, data}});
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
