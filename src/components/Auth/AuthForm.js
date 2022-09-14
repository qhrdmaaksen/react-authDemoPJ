import { useRef, useState } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); /*로딩 되어있는지 state*/
  const [isLoading, setIsLoading] = useState(false); /*로딩중인지 state*/

  /*email, password input value 얻기 위해 사용될 useRef*/
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  /*입력 데이터를 적절한 API endPoint 로 보냄*/
  const submitHandler = event => {
    event.preventDefault(); /*브라우저 기본 값이 요청을 자동으로 보내지 않도록함*/

    /*email, password input 에서 입력된 값 얻기*/
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = emailInputRef.current.value;

    setIsLoading(true);
    if (isLogin) {
    } else {
      /*가입 요청*/
      /*firebase 에 project setting 에 있는 api key entered*/
      fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAbGL8iPtvZhg9a3RDzYIO--_VbQr9sy5s',
        {
          /*firebase auth rest api doc 보면서 작성하면됨*/
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then(res => {
        setIsLoading(false); /*요청에대한 응답 상관없이 로딩중 false*/
        if (res.ok) {
          /*요청 성공시*/
        } else {
          /*요청 실패시*/
          return res.json().then(data => {
            /*응답과 함께 온 데이터를 가져옴*/
            console.log('용청 실패시 응답 data ::: ', data);
            /*error message output*/
            let errorMessage = '인증 오류 발생';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          });
        }
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>} {/*로딩 중이 아닐때 Login or Create Account 표현*/}
          {isLoading && <p>요청 전송 중...</p>}{/*로딩 중일때 메시지 출력*/}
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
