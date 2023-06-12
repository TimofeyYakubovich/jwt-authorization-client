// настроим axios
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

// export const API_URL = 'http://localhost:5000/api'
export const API_URL = 'https://jwt-authorization-server.vercel.app/api'

const $api = axios.create({ // создадим instance axios назавем его $api в начале переменных будем ставить $
    withCredentials: true, // для того что бы к каждому запросу куки цеплялись автоматически
    baseURL: API_URL // базовый URL по каторому этот instance axios будет слать запрос
})


// интерцепторы как будем перезаписывать accessToken
// что такое интерцептор?
// с поммощью axios можн сделать запрос и получить какй то ответ от сервера
// на отправку запроса и на получение ответа омжно повесить интерцептор (перехватчик) это самая обычная фнкция каторая будет отрабатывать 
// на каждый запроса и на каждый ответ

// интерцептор каорый вешается на запрос
// все что он будет делать это перед каждым запросом будет устанавливать Headers: {Authorization: "Bearer ${ACCESS_TOKEN}"}
// для того что бы этот хедер не цепляли кждый раз вручную

// интерцептор каорый вешается на ответ от сервера
// при получении ответа от сервера если там статус код 200 просто ничего не делается запрос прошел успешно

// если при получении ответа от сервера там статус код 401 (пользователь не авторизован) тоесть если у него умер токен доступа accessToken
// он умирае каждые 15 мин но на такой случай есть refreshToken каторый живет 30 дней 
// и так же есть эндпоинт катрый по наличию refreshToken перезаписывает accessToken и возвращает нам новую пару
// так если получилт ответ от сервера 401 статус кодом то отправляем refreshToken на этот эндпоинт
// если refreshToken есть он валидный срок годности не истек сервер вернет новую пару accessToken и refreshToken
// accessToken опять сохроняется на клиенте пользователь опять считается авторизованным и опять повторяется исходный запрос
// уже с обнавленным accessToken


// интерцептор на запрос
// параметром передаем колбек и он параметром прнимает config (instance axios) у этого config есть все те же поля
$api.interceptors.request.use((config) => {  
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    // в headers.Authorization присваиваем accessToken достаем его из localStorage по ключу token
    return config;
}) // теперь на каждый запрос будет цепляться токен

// интерцептор на ответ будет токен перезаписывать в случае если пришел 401 статус
$api.interceptors.response.use((config) => { // 1 колбек выполняется если запрос прошел успешно
    return config;
}, async (error) => { // 2 колбек выполняется если произошла ошибка
    const originalReguest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) { // если сатус 401
        originalReguest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            // ${API_URL}/refresh по этом уадресу возвращается аксес и рефреш токены
            localStorage.setItem('token', response.data.accessToken) // accessToken поновой сохроняем в localStorage
            // далее надо повторить исходный запрос 
            // тоесть мы отправили запрос на получение пользователей получили сатус 401 перезаписали токен и опять повторили 
            // запрос на получение пользователей что бы пользователь ничег не заметил
            // вызываем у (instance axios) $api функцию request и туда передаем originalReguest
            // originalReguest хронит в себе все данные для запроса 
            return $api.request(originalReguest); 
            // но если этот повторный request опять вернет 401 статус то интерцептор опять отработает и зациклится
            // поэтому к config самого запроса добавим поле _isRetry каорое будет сообщать что запрос мы уже делали
            // и в условии будем проверять что этот конфиг существует && error.config и _isRetry не равняется true && !error.config._isRetry
        } catch (e) {
            console.log('Пользователь не авторизован')
        } 
    }
    throw error; // если условие if не отработало то ошибку пробрасывае наверхний уровень если пришел не 401 статус
})

export default $api;