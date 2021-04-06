import {UserModel} from './schema/user.model';

export class JwtResponseModel {
  token: string;
  type: string;
  user: UserModel;
}
