import React from 'react';
import googleLogo from '../../assets/googleLogo.png';
import facebookLogo from '../../assets/facebookLogo.png';
import styles from './LoginPage.module.css';

export default function LoginPage() {

  const googleLogin = () => {
    window.open("http://localhost:4000/auth/google", "_self");
  };

  const facebookLogin = () => {
    window.location.href= "http://localhost:4000/auth/facebook";
  };

  return (
    <div className={styles.loginPage}>
      <h1> Log in </h1>
      <div className="styles.loginForm">
        <div className={styles.googleContainer} onClick={googleLogin}>
          <img src={googleLogo} alt="Google logo"/>
          <p> Log in with Google </p>
        </div>
        <div className={`${styles.googleContainer} ${styles.facebookContainer}`} onClick={facebookLogin}>
          <img src={facebookLogo} alt="Facebook logo"/>
          <p> Log in with Facebook </p>
        </div>
      </div>
    </div>
  )
}
