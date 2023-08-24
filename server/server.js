import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {readdirSync} from 'fs';


const morgan = require('morgan');
require('dotenv').config();

const app = express();

//DB-connection using .env authenticator
mongoose
    .connect(process.env.DATABASE)
    .then( () => console.log('DB connected'))
    .catch((err)=> console.log('err-->',err));

//middleware
// app.use(cors());
app.use(morgan("dev"));

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));
app.use(
    cors({
        origin:['http://localhost:3000'],
    })
);

//POST api's

//autoload routes
readdirSync('./routes').map((route)=>{
    app.use('/api',require(`./routes/${route}`));
});

app.listen(8080, () => console.log('server is running on port 8000'));
