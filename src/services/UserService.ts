import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/IUser";

export default class UserService {
    static async fetchUsers(): Promise<AxiosResponse<IUser[]>> { // <AxiosResponse<IUser[]> потому чо ожидаем список пользователей массив
        return $api.get<IUser[]>('/users')
    }
}