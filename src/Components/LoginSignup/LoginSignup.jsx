import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginSignup.css'
import { validateEmail } from '../../Firebase/functions'

import user_icon from '../../assets/person.png'
import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'
import { signUp, authenticate } from '../../Firebase/functions'
import { ToastContainer } from 'react-toastify'
import { successToast, errorToast } from '../../Firebase/functions'

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const sanitize = (input) => {
        // Check if input is null or undefined
        if (input == null) {
            return false;
        }

        // Check if input contains disallowed characters
        if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=.]+$/g.test(input)) {
            return false;
        }

        return true;
    };



    const signup = () => {
        // check inputs for XSS attacks, illegal characters, invalid input etc
        if (!sanitize(name) || !sanitize(email) || !sanitize(password) || !sanitize(confirmPassword)) {
            errorToast("Invalid inputs. Please check your inputs and try again.");
            return;
        }
        // check for valid email
        if (!validateEmail(email)) {
            errorToast("Invalid email. Please enter a valid email address.");
            return;
        }
        // check for password match
        if (password !== confirmPassword) {
            errorToast("Passwords do not match. Please re-enter your password.");
            return;
        }
        // sign up user
        signUp(name, email, password).then((user) => {
            console.log(user);
            if (user) {
                successToast("User signed up successfully.");
                navigate('/');
            }
        }).catch((error) => {
            errorToast(error.message);
        });

    };

    const login = () => {
        // check inputs for XSS attacks, illegal characters, invalid input etc
        if (!sanitize(email) || !sanitize(password)) {
            errorToast("Invalid inputs. Please check your inputs and try again.");
            return;
        }
        // check for valid email
        if (!validateEmail(email)) {
            errorToast("Invalid email. Please enter a valid email address.");
            return;
        }
        // authenticate user
        authenticate(email, password).then((user) => {
            if (user) {
                successToast("User logged in successfully.");
                navigate('/');
            }
        })
            .catch((error) => {
                errorToast(error.message);
            });
    };

    return (
        <div className='container-login-signup'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>

            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> : <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} />
                </div>}
                {/* <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder='Name'/>
            </div> */}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email ID' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                </div>
                {action === "Sign Up" ? <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} />
                </div> : <div></div>}
            </div>
            {action === "Sign Up" ? <div></div> : <div className="forgot-password">Forgot Password? <span>Click here</span></div>}
            {/* <div className="forgot-password">lost password? <span>click here</span></div> */}
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { if (action === "Sign Up") signup(); setAction("Sign Up"); }} >Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { if (action === "Login") login(); setAction("Login"); }} >Login</div>
            </div>
        </div>
    )
}

export default LoginSignup
