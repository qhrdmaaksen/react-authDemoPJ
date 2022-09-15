import React, { useState } from 'react';
const AuthContext = React.createContext({
  token: '' /*token 저장소 초기값*/,
  isLoggedIn: false /*로그인 됐을때 state(기본적으로 로그인 상태가 아니기때문에 false)*/,
  login: (token) => {},
  logout: () => {},
});

/*로그인 핸들러가 호출되는 시간 헬퍼 함수*/
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime(); /*현재 시간*/
  /*만료 시간을 새 데이터에 보냄 날짜 객체로 바꾸는것, getTime 으로 타임 스탬프를 밀리초로 받음*/
  const adjExpirationTime = new Date(expirationTime).getTime();
  /*남은 기간 계산, 현재 시간에서 빼기 현재시간+만료기간*/
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

/*인증 관련 상태를 관리하는 컴포넌트*/
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token'); /*토큰 상태 초기화*/
  const [token, setToken] =
    useState(initialToken); /*토큰을 보고 사용자의 로그인 여부를 유추할 state*/

  const userIsLoggedIn = !!token; /*!! 은 참 또는 거짓 값을 boolean 으로 바꿔줌*/

  const logoutHandler = () => {
    setToken(null); /*logout 하면 token 없앰*/
    localStorage.removeItem('token'); /*로컬 저장소에서 토큰 삭제*/
  };

  const loginHandler = (token, expirationTime) => {
    /*만료 시간 설정*/
    setToken(token);
    localStorage.setItem('token', token); /*token 로컬 저장소에 저장(key,value 같아야함)*/

    /*remainingTime 남은 시간*/
    const remainingTime = calculateRemainingTime(expirationTime);
    /*만료 시간되면 자동으로 사용자 로그아웃 시키도록할것임*/
    setTimeout(logoutHandler, remainingTime);
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
