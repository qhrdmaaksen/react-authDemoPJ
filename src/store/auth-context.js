import React, {useCallback, useEffect, useState} from 'react';

let logoutTimer;

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

/*저장된 토큰을 받으며 저장된 만료 시간도 받음*/
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token'); /*저장된 토큰 받기*/
  const storedExpirationDate = localStorage.getItem('expirationTime'); /*저장된 만료시간 받기*/
  /*만료 남은 시간 받기*/
  const remainingTime = calculateRemainingTime(storedExpirationDate);
  /*남은 시간 1분미만 상태에서 사용자가 로그인하지 않으면 null 리턴, 토큰, 만료기간 삭제*/
  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }
  /*남은 시간이있어서 유효한 토큰이있다면 저장된 토큰 리턴*/
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

/*인증 관련 상태를 관리하는 컴포넌트*/
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken(); /*저장된 토큰 검색*/
  /*사용자가 로그인하면 로컬 저장소에서 토큰을 받고 그걸 최초의 토큰으로 사용*/
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] =
    useState(initialToken); /*토큰을 보고 사용자의 로그인 여부를 유추할 state*/

  const userIsLoggedIn = !!token; /*!! 은 참 또는 거짓 값을 boolean 으로 바꿔줌*/

  const logoutHandler = useCallback(() => {/*useEffect 에서 logoutHandler ref 하고있기에 무한루프 방지 useCallback*/
    setToken(null); /*logout 하면 token 없앰*/
    localStorage.removeItem('token'); /*로컬 저장소에서 토큰 삭제*/
    localStorage.removeItem('expirationTime') /*로컬저장소에서 만료기간 삭제*/
    /*로그아웃했을때 만료기간 클리어*/
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  },[]);

  const loginHandler = (token, expirationTime) => {
    /*만료 시간 설정*/
    setToken(token);
    localStorage.setItem('token', token); /*token 로컬 저장소에 저장(key,value 같아야함)*/
    localStorage.setItem('expirationTime', expirationTime); /*만료 시간 받기*/

    /*remainingTime 남은 시간*/
    const remainingTime = calculateRemainingTime(expirationTime);
    /*만료 시간되면 자동으로 사용자 로그아웃 시키도록할것임*/
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  /*만료 시간이 지날때마다 확인할수있는 timer & setTimeout 으로 clear*/
  useEffect(()=>{
    if (tokenData){
      console.log(tokenData.duration)
      logoutTimer = setTimeout(logoutHandler, tokenData.duration)
    }
  },[tokenData, logoutHandler])

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
