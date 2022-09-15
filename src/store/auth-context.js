import React, { useState } from 'react';
const AuthContext = React.createContext({
  token: '',/*token 저장소 초기값*/
  isLoggedIn: false,/*로그인 됐을때 state(기본적으로 로그인 상태가 아니기때문에 false)*/
  login: token => {},
  logout: () => {},
});

/*인증 관련 상태를 관리하는 컴포넌트*/
export const AuthContextProvider = props => {
  const initialToken = localStorage.getItem('token')/*토큰 상태 초기화*/
  const [token, setToken] = useState(initialToken); /*토큰을 보고 사용자의 로그인 여부를 유추할 state*/

  const userIsLoggedIn = !!token; /*!! 은 참 또는 거짓 값을 boolean 으로 바꿔줌*/

  const loginHandler = token => {
    setToken(token);
    localStorage.setItem('token', token)  /*token 로컬 저장소에 저장(key,value 같아야함)*/
  };
  const logoutHandler = () => {
    setToken(null); /*logout 하면 token 없앰*/
    localStorage.removeItem('token') /*로컬 저장소에서 토큰 삭제*/
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  /*이 컴포넌트를 다른 컴포넌트를 감싸는 래퍼로 활용하면 다른 컴포넌트가 이 컨텍스트에 접근할 수 있음*/
  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};
export default AuthContext;
