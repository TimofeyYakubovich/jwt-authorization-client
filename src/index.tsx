import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store/store';
// import { createContext } from 'vm';

interface State { // интерфейс для полей контекста
    store: Store,
}

const store = new Store() // создаем экземпляр класса Store у store есть все функции мутации и екшены

// что бы использовать этот store внутри компанентов используем Context данные из этого контекста будем получать с пмощью хука useContext
export const Context = createContext<State>({ // функция createContext создает Context
    store, // подефолту указываем чо в эом контексте находится объект с 1 полем store
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // что бы можно было получать с пмощью хука useContext доступ к эотму контексту все приложение зааричиваем в Context.Provider
  <Context.Provider value={{
    store
  }}>
    <App />
  </Context.Provider>
);

