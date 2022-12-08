import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI } from './config/keys.js'
import { milestones } from './routes/milestones.js';

const app = express();
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.json());

mongoose    
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected!"))
        .catch(err => console.log(err));

app.use('/api/milestones', milestones);

// app.get('/', (req, res) => {
//     res.send('Hello World');
// }); //working

