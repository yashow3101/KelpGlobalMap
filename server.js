const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser')
const cors = require('cors')

app.use(bodyparser.json());
app.use(cors());

const newData1 = {"type": "live",
    "id": "place.29403243",
    "name": "Mumbai",
    "address": "Mumbai, Maharashtra, India",
    "longitude": 72.878723,
    "latitude": 19.077793}

const newData2 = {"type": "live",
    "id": "place.29403243",
    "name": "New Delhi",
    "address": "Mumbai, Maharashtra, India",
    "longitude": 72.878723,
    "latitude": 19.077793}

const newData3 = {"type": "live",
    "id": "place.29403243",
    "name": "Pune",
    "address": "Mumbai, Maharashtra, India",
    "longitude": 72.878723,
    "latitude": 19.077793}

    const initializeData = () => {
        fs.readFile('data.json', (err, data) => {
            let locations = { live: [], inProgress: [], demo: [] };
    
            if (!err) {
                try {
                    locations = JSON.parse(data);
                } catch (parseErr) {
                    console.error('Error parsing data file:', parseErr);
                }
            }
    
            locations.live = locations.live || [];
            locations.inProgress = locations.inProgress || [];
            locations.demo = locations.demo || [];
    
            locations.live.push(newData1);
            locations.inProgress.push(newData2);
            locations.demo.push(newData3);
    
            const updatedData = JSON.stringify(locations, null, 2);
            fs.writeFile('data.json', updatedData, err => {
                if (err) throw err;
                console.log('Initial data added successfully');
            });
        });
    };

initializeData();

app.post('/addLocation', (req, res) => {
    const newLocation = req.body;

    fs.readFile('data.json', (err, data) => {
        if (err) throw err;

        // locations = { live: [], inProgress: [], demo: [] };
        let locations;
        try {
            locations = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing data file:', parseErr);
            return res.status(500).send('Internal Server Error');
        }

        switch (newLocation.type) {
            case 'live':
                locations.live.push(newLocation);
                break;
            case 'inProgress':
                locations.inProgress.push(newLocation);
                break;
            case 'demo':
                locations.demo.push(newLocation);
                break;
            default:
                return res.status(400).send('Invalid location type');
        }

        fs.writeFile('data.json', JSON.stringify(locations, null, 2), (err) => {
            if (err) throw err;
            res.status(200).send('Location added successfully');
        });
    });
});

app.get('/locations', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        res.status(200).json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});