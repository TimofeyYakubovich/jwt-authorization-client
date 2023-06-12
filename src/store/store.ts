// глобальный стор обычный класс оживим с помощью mobx

import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store {
    user = {} as IUser; // в сторе будет храниться поле user м данными о пользователе
    isAuth = false;     // и переменная автороизован или нет
    isLoading = false;

    constructor() {
        makeAutoObservable(this); // что бы mobx мог с этим классом работать вызываем в constructor функцию makeAutoObservable передаем туда this
    }

    // сделаем пару мутаций каторые будут изменять поля стора
    setAuth(bool: boolean) {
        this.isAuth = bool; // изменяем текущее значение на то значение каторое получаем в параметрах
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    // асинхронные екшены функции для логина и регистрации
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password); // вызываем AuthService.login переаем email и password
            // если запрос прошел успешно то pв ответе response будут находится токены 
            console.log(response);
            localStorage.setItem('token', response.data.accessToken) // токен доступа сохроняем в localStorage что бы добовлять его к каждому запросу
            this.setAuth(true); // если запрос прошел успешно ставим isAuth в true
            this.setUser(response.data.user); // данные о пользователе сохроняем внутри стора
        } catch (e: any) {
            // Optional chaining (?.) Если объект, к которому осуществляется доступ, или функция, вызываемая с помощью этого оператора, 
            //представляет собой undefinedили null, выражение замыкается и оценивается undefinedвместо того, чтобы выдавать ошибку.
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token') // удаляем токен из localStorage
            this.setAuth(false);
            this.setUser({} as IUser); // user делаем пустым объектом и указываем что это объект типа IUser
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    // каждый раз когда открывается приложение надо получать информацию о пользвателе
    // убедиться в том что пользователь авторизован для этого сдлеам экшен
    async checkAuth() {
        this.setLoading(true); // перед запрос ставим в true пошла загрузка
        try {
            // сдесь для отправки запроса не будем использовать не тот instance axios каторый создавали с интерцепторами используем 
            // дефолтный instance axios axios.get() так как сдесь может вернуться код 401 и будет понятно что пользователь не авторизован
            // и интерцептор будет выполнять лишнюю работу
            // ${API_URL}/refresh по этом уадресу возвращается аксес и рефреш токены
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            // если запрос прошел успешно значит пользователь авторизован его рефреш токен еще валиден
            console.log(response);
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false); // после того как запрос прошел неважно с ошибкой или без ставим в false
        }
    }
}