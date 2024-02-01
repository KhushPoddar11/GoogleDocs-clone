import mongoose from 'mongoose';

const Connection = async (username='user1',password='user1')=>{
    const url = `mongodb+srv://${username}:${password}@google-docs-clone.wubmmzt.mongodb.net/?retryWrites=true&w=majority`
    try{
       await mongoose.connect(url,{});
       console.log('db connected');
    }catch(error){
        console.log(`error while connecting to db : ${error}`);
    }
}

export default Connection;