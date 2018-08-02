const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mongo:27017/matches').then(()=>{
    console.log('mongodb connected');
}).catch((err)=>{
    console.error(err)
});