import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type:String,
        trim:true,
        require:true,
    },
    email: {
        type:String,
        trim:true,
        require:true,
        unique:true,
    },
    age: {
        type:Number,
        trim:true,
        require:true,
    },
    psw: {
        type:String,
        require:true,
        min:6,
        max:64,
    },
    secret: {
        type:String,
        require:true,
    },
    username:{
        type:String,
        unique:true,
        require:true,
    },
    about:{},
    image: {
        url: String,
        public_id: String,
    },
    following:[{type: Schema.ObjectId, ref:"User"}],
    followers:[{type: Schema.ObjectId, ref:"User"}],
},{timestamps:true});


export default mongoose.model('User',userSchema);
