import { useRef, useState, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import {useHistory} from 'react-router-dom'

const ProfileForm = () => {
  const newPasswordInputRef = useRef(); /*새로운 비밀번호 입력을 위한 ref*/
  const authCtx = useContext(AuthContext); /*token 을 받기위해 context 접근*/
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory()

  const submitHandler = event => {
    event.preventDefault(); /*브라우저 기본값 요청 방지*/
    const enteredNewPassword = newPasswordInputRef.current.value; /*입력된 비밀번호 가져오기*/

    setIsLoading(true);
    /*추출한 비밀번호를 사용해서 요청을 보냄*/
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAbGL8iPtvZhg9a3RDzYIO--_VbQr9sy5s',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false /*false 로하면 응답데이터는 없음*/
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      },
    ).then(res => {
      setIsLoading(false);
      if (res.ok) {
        return res.json();
      } else {
        /*요청 실패*/
        return res.json().then(data => {
          console.log('요청 실패시 응답 data', data);
          let errorMessage = '비밀번호 변경 오류 발생';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage)
        });
      }
    }).then(data => {
      console.log(data)
      history.replace('/')
    }).catch(error => {
      alert(error.message)
    })
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        {isLoading && <p>비밀 번호 변경중 ...</p>}
        {!isLoading &&
        <button>Change Password</button>
        }
      </div>
    </form>
  );
};

export default ProfileForm;
