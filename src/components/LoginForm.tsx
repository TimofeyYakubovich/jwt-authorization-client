import { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const LoginForm: FC = () => { // FC тип функциональный компанент
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {store} = useContext(Context) // в хук useContext передаем Context и index файла и достаем из него store

    return (
        <div>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type='text'
                placeholder='Email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Пароль'
            />
            {/* при нажатии кнопки Логин вызываем екшен login из стора */}
            <button onClick={() => store.login(email, password)}>
                Логин
            </button> 
            <button onClick={() => store.registration(email, password)}>
                Регистрация
            </button>
        </div>
    );
};

export default observer(LoginForm);