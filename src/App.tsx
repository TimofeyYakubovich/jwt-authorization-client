import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from './components/LoginForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';
// npm i mobx mobx-react-lite axios @types/axios
// mobx для управления состоянием, mobx-react-lite для функциональных компанентов
// axios для асинхронных запросов к серверу @types/axios типы для axios

const App: FC = () => {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if(localStorage.getItem('token')) { // если в localStorage по ключу token что то есть то вызываем екшен checkAuth
      // если пользователь нажмет выйти то там этого токена не будет и эта функция не отработает
      store.checkAuth()
    }
  }, []) // при первом запуске приложения будет вызываться useEffect потому что []

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if(store.isLoading) {
    return <div>Загрузка...</div>
  }

  if(!store.isAuth) { // если пользователь не авторизован то возвращаем другой шаблон
    return (
      <div>
        <LoginForm/>
        <button onClick={getUsers}>Получить пользователей</button> {/* эта функция не буде доступна для неавтроризованных пользователей */}
      </div>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : `АВТОРИЗУЙТЕСЬ`}</h1>
      {/* <LoginForm/> */}
      <h1>{store.user.isActivated ? 'Аккаунт подтвержден по почте' : 'ПОДТВЕРДИТЕ АККАУНТ!!!'}</h1>
      <button onClick={() => store.logout()}>Выйти</button> {/* если пользователь авторизован появится кнопка выхода из аккаунта */}
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users.map(user => 
        <div key={user.email}>{user.email}</div>)}
    </div>
    
  );
}

export default observer(App); // оборочиваем копанент в функию observer что бы mobx мог отслеживать изменения в данных
