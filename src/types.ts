export interface ApiRes<T> {
    data: T;
    code: number;
    message: string;
}
export interface PasswordRes {
    username: string;
    _id: string;
    token: string;
}
