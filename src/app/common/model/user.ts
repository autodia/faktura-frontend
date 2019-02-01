import { Type } from 'class-transformer';
import { Profile } from './profile';

/**
 * @module Authentication
 */
export class User {
    exp: number;

    @Type(() => Profile)
    profile: Profile;
}