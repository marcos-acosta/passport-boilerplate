import React, { useContext } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { myContext } from '../../Context';
import { IUser } from '../../types/maintypes';

export default function Navbar() {

  const userObject = useContext(myContext) as IUser;

  const logout = () => {
    axios.get("http://localhost:4000/auth/logout", {
      withCredentials: true
    }).then((res: AxiosResponse) => {
      if (res.data === 'success') {
        window.location.href = "/";
      }
    });
  };

  return (
    <div className={styles.navBarWrapper}>
      <ul className={styles.navBar}>
        <li><Link to="/">Home</Link></li>
        {
          userObject ? 
            (<li onClick={logout} >Log out</li>) : 
            (<li><Link to="/login">Login</Link></li>)
        }
      </ul>
    </div>
  )
}
