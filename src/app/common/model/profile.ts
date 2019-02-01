/**
 * @module Authentication
 */

export class Profile {

    id: number;

    username: string;

    display_name: string;

    title: string;

    telephone: string;

    email: string;

    start_date: Date;

    end_date: Date;

    roles: string[];

    flatten() {
        var str_roles = "[" + this.roles.join() + "]"

        return {
            id: this.id,
            username: this.username,
            display_name: this.display_name,
            title: this.title,
            telephone: this.telephone,
            email: this.email,
            start_date: this.start_date,
            end_date: this.end_date,
            roller: str_roles
        }
    }
}