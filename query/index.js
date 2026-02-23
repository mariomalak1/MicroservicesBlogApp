const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({quiet: true});

const PORT = process.env.PORT || 4003;

const app = express();
app.use(express.json());

/**
 * Structure of posts:
 * { title: { content, title, date, comments: [ { "comment", date } ] }}
 */
const posts = {}

app.get('/posts', async (req, res) => {
    return res.status(200).json({message: 'Posts retrieved successfully', posts});
})

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if(type === 'PostCreated') {
        const { title, content, date } = data;
        posts[title] = { title, content, date, comments: [] };
    }

    else if (type === 'CommentCreated') {
        const { postTitle, comment } = data;
        const post = posts[postTitle];
        post.comments.push(comment);
    }
    
    console.log('Event received successfully with type:', type);
    
    return res.status(200).json({ message: 'Event received successfully' });
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
