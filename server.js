const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser')
const cors = require('cors')

app.use(bodyparser.json());
app.use(cors());

app.post('/addLocation', (req, res) => {
    const newLocations = req.body;
    console.log(req.body)

    fs.readFile('data.json', (err, data) => {
        if (err) throw err;

        let locations;
        try {
            locations = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing data file:', parseErr);
            return res.status(500).send('Internal Server Error');
        }

        if (!locations || typeof locations !== 'object') {
            locations = { live: [], inProgress: [], demo: [] };
        }

        if (!Array.isArray(locations.live)) {
            locations.live = [];
        }
        if (!Array.isArray(locations.inProgress)) {
            locations.inProgress = [];
        }
        if (!Array.isArray(locations.demo)) {
            locations.demo = [];
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
    })

})
app.get('/locations', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        res.status(200).json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});