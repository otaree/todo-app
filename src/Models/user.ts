import { Schema, Model, model, Document } from 'mongoose';
import { NextFunction } from 'express';
import * as bcrypt from "bcrypt";

interface IUser {
    username: string;
    email: string;
    password: string;    
}

export interface IUserModel extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    username: {
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre("save", async function(next: NextFunction) {
    const user = <IUserModel>this;

    if (!user.isModified("password")) return next();

    try {
        const hash: string = await bcrypt.hash(user.password, 12);
        user.password = hash;
        next();
    } catch (e) {
        next(e);
    }

});


UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    const user = this;

    const result: boolean = await bcrypt.compare(password, user.password);
    return result;
}

export const User: Model<IUserModel> = model("User", UserSchema);