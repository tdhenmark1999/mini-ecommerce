import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';


const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    cart: [{
        product: Object,
        quantity: Number
    }]
});

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});


const User = mongoose.model('User', UserSchema);
export default User;
