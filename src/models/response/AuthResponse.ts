// после логина регистраци и рефреша нам возвращается объект у каторого есть accessToken и refreshToken и user: userDto
// user: это не примитив для него создадим отдельный интерфейс IUser.ts
import { IUser } from "../IUser";
   
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
    
