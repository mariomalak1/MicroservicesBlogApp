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

const handleEvent = (type, data) => {
    
    if(type === 'PostCreated') {
        const { title, content, date } = data;
        console.log(title, content);
        
        posts[title] = { title, content, date, comments: [] };
    }

    else if (type === 'CommentCreated') {
        const { postTitle, comment } = data;
        const post = posts[postTitle];
        if(post) {
            post.comments.push(comment);
        }
    }
}

app.get('/', async (req, res) => {
    return res.status(200).json({message: 'Posts retrieved successfully', posts});
})

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    
    handleEvent(type, data);

    console.log('Event received successfully with type:', type);
    
    return res.status(200).json({ message: 'Event received successfully' });
})

app.use((req, res) => {
    return res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
    })
})


app.listen(PORT, async () => {
    console.log(`Posts service is running on port ${PORT}`);
    try{
        const { data } = await axios.get('http://localhost:4005/')
        
        for (let event of data.data) {
            handleEvent(event.type, event.data)
        }
    }catch(err) {
        console.error('Error fetching events:', err.message);
    }

});
