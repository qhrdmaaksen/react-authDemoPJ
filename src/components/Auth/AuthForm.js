import {useContext, useRef, useState} from 'react';
import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';
import {useHistory} from 'react-router-dom';

const AuthForm = () => {
	/*email, password input value 얻기 위해 사용될 useRef*/
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const authCtx = useContext(AuthContext);
	const [isLogin, setIsLogin] = useState(true); /*로딩 되어있는지 state*/
	const [isLoading, setIsLoading] = useState(false); /*로딩중인지 state*/
	const history = useHistory();

	const switchAuthModeHandler = () => {
		setIsLogin(prevState => !prevState);
	};

	/*입력 데이터를 적절한 API endPoint 로 보냄*/
	const submitHandler = event => {
		event.preventDefault(); /*브라우저 기본 값이 요청을 자동으로 보내지 않도록함*/

		/*email, password input 에서 입력된 값 얻기*/
		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passwordInputRef.current.value;

		setIsLoading(true);
		let url; /*가입과 로그인이 로직이 url 을 제외하고 같기때문에 변수 url 에 조건에따라 url 만 변경되도록함*/
		if (isLogin) {
			url =
					'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAbGL8iPtvZhg9a3RDzYIO--_VbQr9sy5s';
		} else {
			url =
					'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAbGL8iPtvZhg9a3RDzYIO--_VbQr9sy5s';
		}
		/*가입 요청*/
		/*firebase 에 project setting 에 있는 api key entered*/
		fetch(url, {
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
		})
				.then(res => {
					setIsLoading(false); /*요청에대한 응답 상관없이 로딩중 false*/
					if (res.ok) {
						/*요청 성공시*/
						return res.json();
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
							throw new Error(errorMessage); /*에러가 발생한다면 프로미스와 외부 프로미스는 거절됨*/
						});
					}
				})
				.then(data => {
					console.log(data);
					/*firebase 에서 받은 idToken setting
					* 현재 시간을 밀리초로 추가하고 두개를 더해서 새 날짜를 밀리초 타임을 만드는데 보냄*/
					const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
					authCtx.login(data.idToken, expirationTime.toISOString()); /*만료시간을 문자열로 응답받음 id 토큰이 만료될때까지의 초*/
					history.replace(
							'/',
					); /*시작페이지로보내며 사용자가 뒤로 가기를 눌러 이전 페이지에 못가게함*/
				})
				.catch(err => {
					alert(err.message);
				});
	};

	return (
			<section className={classes.auth}>
				<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
				<form onSubmit={submitHandler}>
					<div className={classes.control}>
						<label htmlFor="email">Your Email</label>
						<input type="email" id="email" ref={emailInputRef} required/>
					</div>
					<div className={classes.control}>
						<label htmlFor="password">Your Password</label>
						<input type="password" id="password" ref={passwordInputRef} required/>
					</div>
					<div className={classes.actions}>
						{!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}{' '}
						{/*로딩 중이 아닐때 Login or Create Account 표현*/}
						{isLoading && <p>요청 전송 중...</p>}
						{/*로딩 중일때 메시지 출력*/}
						<button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
							{isLogin ? 'Create new account' : 'Login with existing account'}
						</button>
					</div>
				</form>
			</section>
	);
};

export default AuthForm;
