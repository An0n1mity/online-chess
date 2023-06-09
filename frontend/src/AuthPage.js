
import axios from 'axios';
import PasswordStrengthBar from 'react-password-strength-bar';
import zxcvbn from 'zxcvbn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';
import { backend_url } from './Url';
import { useState, useEffect } from 'react';

const PasswordInput = ({ password, onPasswordChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = event => {
    const newPassword = event.target.value;
    onPasswordChange(newPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  return (
    <div className="password-input">
      <span className="password-input-icon">
        <i className="fa fa-lock icon"></i>
      </span>
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
        required
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="password-visibility-icon"
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};

const AuthPage = ({ current_view }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ip, setIp] = useState('');
  const [currentView, setCurrentView] = useState(current_view);


  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org/?format=json");
        setIp(response.data.ip);
        console.log(response.data.ip);
      } catch (error) {
        // Handle error
        console.log(error);
      }
    };

    fetchIp();
  }, []);

  const handlePasswordChange = newPassword => {
    setPassword(newPassword);
  };

  const handleChange = event => {
    const { id, value } = event.target;
    if (id === 'username') setUsername(value);
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (currentView === 'signup') {
      // Check if password is strong enough
      if (zxcvbn(password).score < 3) {
        setErrorMessage('Password is not strong enough');
        return;
      }

      axios.post(backend_url + '/api/register', {
        user: {
          username: username,
          email: email,
          password: password,
          ip: ip
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
        });
    }
    else if (currentView === 'login') {
      axios.post(backend_url + '/api/login', {
        user: {
          username: username,
          password: password
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            setLogin(true);
            localStorage.setItem('token', response.data.token);
            <Navigate to="/home" />
          }
        })
        .catch(error => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
        });
    }
    else if (currentView === 'reset') {
      axios.post(backend_url + '/auth/reset', {
        email: email,
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
        });
    }
  };

  const changeView = view => {
    setUsername('');
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setLogin(false);
    setCurrentView(view);
  };

  const currentView_ = () => {
    switch (currentView) {
      case 'signup':
        return (
          <form onSubmit={handleSubmit}>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" onChange={handleChange} required />
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" onChange={handleChange} required />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" onChange={handleChange} required />
                  <PasswordStrengthBar password={password} />
                </li>
              </ul>
            </fieldset>
            <button className="signup-button">Sign Up</button>
            <button type="button" onClick={() => changeView("login")}>Have an Account?</button>
            {errorMessage ? <p>{errorMessage}</p> : null}
          </form>
        );
      case 'login':
        return (
          <form onSubmit={handleSubmit}>
            <h2>Online-Chess ♟️</h2>
            <fieldset>
              <ul>
                <li>
                  <div className="login-input">
                    <span className="login-input-icon"><i className="fa fa-user icon"></i></span>
                    <input type="text" id="username" placeholder="Username or Email" onChange={handleChange} required />
                  </div>
                </li>
                <li>
                  <PasswordInput
                    password={password}
                    onPasswordChange={handlePasswordChange}
                  />
                </li>
                <li>
                  <a onClick={() => changeView("reset")} href="#">Forgot Password?</a>
                </li>
              </ul>
            </fieldset>
            <button className="login-button" onClick={handleSubmit}>Log In</button>
            <button type="button" className="account-button" onClick={() => changeView("signup")}>Create an Account</button>
            {errorMessage ? <p>{errorMessage}</p> : null}
          </form>
        );
      case 'reset':
        return (
          <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <fieldset>
              <legend>Password Reset</legend>
              <ul>
                <li>
                  <em>A reset link will be sent to your inbox!</em>
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" onChange={handleChange} />
                </li>
              </ul>
            </fieldset>
            <button onClick={() => handleSubmit}>Send Reset Link</button>
            <button type="button" onClick={() => changeView("login")}>Go Back</button>
          </form>
        );
      default:
        break;
    }
  };


  return login ? <Navigate to="/home" /> : (
    <section id="entry-page">
      {currentView_()}
    </section>
  );
}

export default AuthPage


