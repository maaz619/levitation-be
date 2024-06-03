import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    isPasswordValid: (password: string) => Promise<Error | boolean>,
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        require: [true, "name is required"],
        minlength: [3, "Name must be atleast 3 character"],
        maxlength: [16, 'Name must be less than 16 character']
    },
    email: {
        type: String,
        require: [true, "email is required"],
        unique: true,
        validate: {
            validator: function (val: string) {
                return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/.test(val)
            },
            message: (props: any) => `${props.value} is not a valid email`

        }
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, "Password is require"]
    }
},
    {
        timestamps: true
    }
)

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
})

userSchema.methods.isPasswordValid = async function (password: IUser['password']): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password)
}

const User = model("User", userSchema)

export default User