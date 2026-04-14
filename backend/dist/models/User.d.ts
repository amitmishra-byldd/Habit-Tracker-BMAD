import { Document, Types } from "mongoose";
export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    isActive: boolean;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map