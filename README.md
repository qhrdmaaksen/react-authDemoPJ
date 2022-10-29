# react-authDemoPJ
## 회원 가입/로그인/비밀번호 변경/유효성 검사/라우터

```js

0. 네비게이션 구현
1. 로그인 기능 구현
2. 로그아웃 기능 구현
3. 비밀번호 변경 구현
4. 회원 가입 기능 구현

React CSS Html Router js

Components
  Auth 폴더 : 인증 폼 관련
    AuthForm.js : 로그인or회원가입에 필요한 양식입력 폼 컴포넌트
  Layout 폴더
    Layout.js : 네비게이션 컴포넌트를 담아 레이아웃 컴포넌트로 
                  랩핑된 자식요소들보여주는 컴포넌트
    MainNavigation.js : 네비게이션 컴포넌트/로그인 유무에따라 프로필 보여줌
  Profile 폴더 : 프로필 페이지 관련 폴더
    ProfileForm.js : 사용자 비밀번호 변경 입력 폼 컴포넌트
    UserProfile.js : 사용자 정보를 보여줄 컴포넌트
  StartingPage 폴더 : 메인 홈 관련 폴더
    StartingPageContent.js : 메인 홈 컴포넌트
  pages 폴더
    AuthPage.js : AuthForm.js 컴포넌트를 보여줄 페이지
    HomePage.js : 메인 홈 컴포넌트를 보여줄 페이지
    ProfilePage.js : 프로필 컴포넌트를 보여줄 페이지
  store 폴더 : context store
    auth-context.js : 컨텍스트를 활용하여 데이터 초기값/함수가 
                        필요한 각 컴포넌트에서 사용할수있는 저장소\
  App.js : router 로 사용자가 원하는 페이지로 이동시켜줄 컴포넌트

Function
  AuthForm.js
    switchAuthModeHandler : 로그인 상태 관리 함수/로그인상태이면 로그아웃,로그아웃상태이면 로그인 변환
    submitHandler : form 에서 입력 받은 데이터를 담아 fetch 메소드로 데이터 서버에 post 요청 및
                      로그인 되어있다면 겟요청/요청 실패시 에러 처리/세션 만료시간 설정
  MainNavigation.js
    logoutHandler : useContext 로 context store 에 logout 함수 호출해줄 함수    
  ProfileForm.js
    submitHandler : 변경할 비밀번호를 입력받아 서버데이터에 전송/응답 에러 처리 함수
  auth-context.js
    calculateRemainingTime : 로그인 핸들러가 호출되는 시간 헬퍼 함수
    retrieveStoredToken : 저장된 토큰을 받으며 저장된 만료 시간도 받을 함수
    AuthContextProvider : 인증 관련 상태를 관리하는 컴포넌트
    logoutHandler : 로컬저장소에서토큰 삭제 및 로컬저장소에서 만료기간 삭제해줄 로그아웃 함수 
    loginHandler : 로컬에서 토큰 및 만료기간을 받아 로그인해줄 함수
  
```

메인 홈

![20221029_224732](https://user-images.githubusercontent.com/75942405/198845100-3f41e371-e459-4fde-b5fe-885cd1dce4fa.png)

로그인 화면

![20221029_224739](https://user-images.githubusercontent.com/75942405/198845118-fa610924-8012-459f-9b7f-6a488bb83023.png)

로그인 후 화면

![20221029_224751](https://user-images.githubusercontent.com/75942405/198845141-172f3063-17a7-4996-8f01-565d960226d9.png)

비밀번호 변경 화면

![20221029_224756](https://user-images.githubusercontent.com/75942405/198845162-2b6e3859-48e5-4eb3-bee2-a96dc980df0a.png)


이메일 회원 가입 

![reactAuthSignUp](https://user-images.githubusercontent.com/75942405/198842870-ed75a60c-f0c4-4083-8112-cb1f69d97b3a.png)

firebase user info

![reactAuthFBuserInfo](https://user-images.githubusercontent.com/75942405/198842943-a28a53dd-8818-424d-8b55-fae1bbbae3e7.png)

가입시 토큰과 로그인 토큰, 유효한 자격 증명 제공

![reactAuthIdToken](https://user-images.githubusercontent.com/75942405/198842975-4501b29d-90b7-4a39-b445-fe8962a88c21.png)
