import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  findByEmail(email: string): Promise<any | null> {
    return this.model.findOne({ email }).exec();
  }
  create(email: string, passwordHash: string, name: string): Promise<any> {
    return new this.model({ email, passwordHash, name }).save();
  }
}
