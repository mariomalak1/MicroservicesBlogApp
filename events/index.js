const express = require('express');
const dotenv = require('dotenv');
dotenv.config({quiet: true});

const PORT = process.env.PORT || 4005;

const app = express();
app.use(express.json());

const events = {}

app.post('/', async (req, res) => {
    const { type, data } = req.body;

    const event = {type, data};
    events[type] = event;

    return res.status(201).json({message: 'Event created successfully', event: events[type]});
})

app.get('/', async (req, res) => {
    return res.status(200).json({message: 'Events retrieved successfully', events});
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
