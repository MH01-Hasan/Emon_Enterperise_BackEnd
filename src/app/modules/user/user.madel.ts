import { Schema, model } from 'mongoose';
import { IUserMethods, Iuser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { object } from 'zod';
const userSchema = new Schema<Iuser, Record<string, never>, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
     
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
 
    role: {
      type: String,
      default: 'user', // Automatically sets role to 'user' by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);



//check user
userSchema.methods.isUserExist = async function (
  _id: string
): Promise<Partial<Iuser> | null> {
  const user = await User.findOne(
    { _id },
    { _id: 1, password: 1, email: 1, phoneNumber:1}
  ).lean();
  return user;
};

// match password
userSchema.methods.isPasswordMatch = async function (
  givenPassword: string,
  savePassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savePassword);
};

// password hashing
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  next();
});

export const User = model<Iuser, UserModel>('User', userSchema);
