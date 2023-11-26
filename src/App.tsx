import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom";
import { RootStateInterface } from "./interfaces/state/RootStateInterface";
import { useSelector } from "react-redux";
import { RequireAnonymity, RequireAuth } from "./ProtectedRoute";
import useDocumentTitle from "./hooks/useDocumentTitle";
import useCheckToken from "./hooks/useCheckToken";
import Daily from "./routes/schedule/daily/Daily";
import LogIn from "./routes/login/LogIn";
import MainView from "./routes/main/MainView";
import MemberUpdate from "./routes/member/MemberUpdate";
import Navbar from "./components/navbar/Navbar";
import PassWordCheck from "./routes/passwordcheck/PasswordCheck";
import SignUp from "./routes/signup/SignUp";
import Footer from "./components/footer/Footer";
import styles from "./App.module.scss";
import { getUsername } from "./cookie/Cookie";

/**
 * 메인페이지 Route
 * @returns 메인페이지
 */
const App: React.FC = () => {

  const accessToken = useSelector((state: RootStateInterface) => state.authToken.accessToken);
  const username = getUsername();
  const [authenticating, setAuthenticating] = useState<boolean>(!!(username && !accessToken));
  const { setTitle } = useDocumentTitle();
  const { checkAuth } = useCheckToken();
  
  useEffect(() => {
    !(username && !accessToken) && setAuthenticating(false);
  }, [accessToken, checkAuth])

  useEffect(() => {
    setTitle('');
    checkAuth();
  }, [])
  
 
  return (
    <>
      {!authenticating && (
        <div className={styles.app_container}>
          <div className={styles.navbar_wrapper}>
            <Navbar />
          </div>
          <div className={styles.content_wrapper}>
            <Routes>
              {/* 메인 페이지 */}
              <Route path="/" element={<MainView />} />

              {/* 로그인 페이지 */}
              <Route path="/login" element={
                <RequireAnonymity errorMessage='이미 로그인되어 있습니다.'>
                  <LogIn />
                </RequireAnonymity>
              } />

              {/* 회원 가입 */}
              <Route path="/signup" element={
                <RequireAnonymity errorMessage='로그인된 상태에서는 회원가입 할 수 없습니다.'>
                  <SignUp />
                </RequireAnonymity>
              } />

              {/* 회원 정보 수정 */}
              <Route path="/member/me" element={
                <RequireAuth returnTo='/member/me' errorMessage='로그인이 필요한 서비스입니다.'>
                  <MemberUpdate />
                </RequireAuth>
              } />

              {/* 비밀번호 확인 */}
              <Route path="/password/check" element={
                <RequireAuth returnTo='/password/check' errorMessage='로그인이 필요한 서비스입니다.'>
                  <PassWordCheck />
                </RequireAuth>
              } />

              {/* 일별 스케줄 */}
              <Route path="/schedule/daily" element={
                <RequireAuth returnTo='/schedule/daily' errorMessage='로그인이 필요한 서비스입니다.'>
                  <Daily />
                </RequireAuth>} />
            </Routes>
          </div>
          <div className={styles.footer_wrapper}>
            <Footer />
          </div>
        </div>
      )}
    </>
  )
}

export default App;