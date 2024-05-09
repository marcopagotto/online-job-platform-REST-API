export interface User {
    user_id: number,
    forename: string,
    lastname: string,
    birthdate: string,
    sex: string,
    email: string,
    psw: string,
    salt: string,
    session_token: string
}
