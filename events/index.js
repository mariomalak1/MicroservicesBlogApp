const express = require('express');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
dotenv.config({quiet: true});

const PORT = process.env.PORT || 4005;

const app = express();
app.use(express.json());

const events = []

app.post('/', async (req, res) => {
    const { type, data } = req.body;
    
    const event = {type, data};
    events.push(event);
    
    await Promise.all([
        axios.post('http://localhost:4001/events', event),
        axios.post('http://localhost:4002/events', event),
        axios.post('http://localhost:4003/events', event),
        // axios.post('http://localhost:4004/events', event)
    ])

    console.log('Event created and broadcasted:', event);

    return res.status(201).json({message: 'Event created successfully', event});
})

app.get('/', async (req, res) => {
    return res.status(200).json({message: 'Events retrieved successfully', data: events });
})

app.use((req, res) => {
    return res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
    })
})


app.listen(PORT, () => {
  console.log(`Events service is running on port ${PORT}`);
});
