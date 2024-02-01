import mongoose from 'mongoose';

const documentSchema = mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    data:{
        type:Object,
        required: true
    }
});

const documents = mongoose.model('documents',documentSchema);

export default documents;