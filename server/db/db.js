import mongoose from 'mongoose';


export function connect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to db');
    })
    .catch(error => {
        console.log(error);
    })
}