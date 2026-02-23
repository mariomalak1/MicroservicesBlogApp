const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({quiet: true});

const PORT = process.env.PORT || 4002;

const app = express();
app.use(express.json());

/**
 * Structure of comments:
 * { postTitle: { title, date, comments: [ { "comment", date }] }}
 */
const comments = {}

app.post('/comment-create', async (req, res) => {
    const { postTitle, comment } = req.body;

    if (!postTitle || !comment) {
       return res.status(400).json({ message: 'Post title and comment are required' });
    }

    const commentObj = { comment, date: new Date() };
    if (!comments[postTitle]) {
        comments[postTitle] = { comments: [] };
    }
    comments[postTitle].comments.push(commentObj);

    await axios.post('http://localhost:4005/events', { type: 'CommentCreated', data: { postTitle, comment: commentObj }})
        .catch(err => {console.error('Error sending event to event bus:', err.message);});

    return res.status(201).json({message: 'Comment created successfully', comment: commentObj});
})

app.get('/comments', (req, res) => {
    return res.status(200).json({ comments });
});


app.post('/events', async (req, res) => {
    const { type, data } = req.body;
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
