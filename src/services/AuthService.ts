// статик функции с запросами на сервер
import $api from "../http"; // импортируем инстанс аксиоса
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> { // <AxiosResponse<AuthResponse> теперь точно значем что эта функция будет возвращать
        // так как функция асинхронная она всегда будет возвращать промис
        // так как мы используем ts надо указать какие данные будет возврощать эта функция
        // axios всегда возврощает объект а данные каторые получаем в теле ответа хроняться в поле data
        // и для того что бы указать тип этих данных нужен тип каторый мы импорруем из аксиоса AxiosResponse
        // тоесть сделали $api.post() от туда прилетел объект response и данные каорые вернул нам сервер хроняться в поле data
        // надо явно указать какие данные оттуда придут иначе нет смысла использовать ts
        // для этих типов данных создадим папку models/response файлик AuthResponse.ts
        return $api.post<AuthResponse>('/login', {email, password}) // 1 адрес эндпоинта 2 тело запроса
        // если как джинерик укажем post<AuthResponse> data точно будет знат ьчто в ней ддолжно лежать
            // .then(response => response.data)
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password})
    }

    static async logout(): Promise<void> { // тут не важно что эта функция возвращает
        return $api.post('/logout') // тела запроса тут тоже нет
    }
}