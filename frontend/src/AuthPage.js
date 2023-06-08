
import { Component } from 'react';
import axios from 'axios';
import PasswordStrengthBar from 'react-password-strength-bar';
import zxcvbn from 'zxcvbn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      showPassword: false,
    };
  }

  handleChange = event => {
    const { onPasswordChange } = this.props;
    const password = event.target.value;
    onPasswordChange(password);
    console.log(password);
  };

  toggleShowPassword = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const { password, showPassword } = this.props;
    return (
      <div className="password-input">
        <span className="password-input-icon">
          <i className="fa fa-lock icon"></i>
        </span>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Password"
          value={password}
          onChange={this.handleChange}
          required
        />
        <button
          type="button"
          onClick={this.toggleShowPassword}
          className="password-visibility-icon"
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    );
  }
}

class AuthPage extends Component {
  constructor(props){
    super(props)
    this.state = {
	username: '',
	email: '',
	password: '',
	login: false,
	currentView: props.currentView,
	errorMessage: '',
      ip: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  // Fetch IP address of the user
  componentDidMount() {
    fetch("https://api.ipify.org/?format=json")
      .then(response => response.json())
      .then(data => this.setState({ IP: data.ip }));
    console.log(this.state.ip);
  }

  handlePasswordChange = (password) => {
    this.setState({ password });
  };

  handleChange = (e) => {
      this.setState({ [e.target.id]: e.target.value })
  }
    
  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Sumbit")
    const { username, email, password } = this.state;
    if (this.state.currentView === "signUp") {
	// Check if password is strong enough
	if(zxcvbn(password).score < 3) {
	    this.setState({ errorMessage: "Password is not strong enough" })
	    return
	}
	    
      axios.post('http://46.101.210.155:8000/api/register', {
	    user:{
          username: username,
          email: email,
          password: password,
          ip: this.state.ip
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://46.101.210.155:3000',
        }

      }).then(response => {
		console.log(response)
	    })
	    .catch(error => {
	      console.log(error.response.data.error)
	      this.setState({ errorMessage: error.response.data.error })
	  });
    }
    else if (this.state.currentView === "logIn") {
      axios.post('http://46.101.210.155:8000/api/login', {
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
		console.log(response)
		if(response.status === 200) {
		    this.setState({ login: true })
		    localStorage.setItem('token', response.data.token)
		    console.log(localStorage.getItem('token'))
		    console.log(this.state.login)
		}
	    })
.catch(error => {
		console.log(error.response.data.error)
		this.setState({ errorMessage: error.response.data.error })
	    })

    }
    else if (this.state.currentView === "PWReset") {
      axios.post('http://localhost:8000/auth/reset', {
	    email: email, 
	    })
	    .then(response => {
		console.log(response)
	    })
	    .catch(error => {
		console.log(error.response.data.error)
		this.setState({ errorMessage: error.response.data.error })
	    })
    }
  }

  changeView = (view) => {
      this.setState({
      password: '',
        currentView: view,
    })
  }

  currentView = () => {
    const { password } = this.state;
    switch(this.state.currentView) {
      case "signUp":
        return (
          <form onSubmit={this.handleSubmit}>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label for="username">Username:</label>
                  <input type="text" id="username" onChange={this.handleChange} required/>
                </li>
                <li>
                  <label for="email">Email:</label>
                  <input type="email" id="email" onChange={this.handleChange} required/>
                </li>
                <li>
		    <label for="password">Password:</label>
		    <input type="password" id="password" onChange={this.handleChange} required/>              
		    <PasswordStrengthBar password={this.state.password} />
		</li>
              </ul>
            </fieldset>
		<button className="signup-button">Sign Up</button>
		<button type="button" onClick={() => this.changeView("logIn")}>Have an Account?</button>
		{this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
          </form>
        )
      case "logIn":
        return (
          <form onSubmit={this.handleSubmit}>
            <h2>Online-Chess ♟️</h2>
            <fieldset>
              <ul>
                <li>
		  <div className="login-input"> 
		    <span className="login-input-icon"><i class="fa fa-user icon"></i></span>
		    <input type="text" id="username" placeholder= "Username or Email" onChange={this.handleChange} required/>
		  </div>
                </li>
                <li>
		    <PasswordInput
			password={password}
			onPasswordChange={this.handlePasswordChange}
		    />
		</li>
                <li>
                  <a onClick={() => this.changeView("PWReset")} href="#">Forgot Password?</a>
                </li>
              </ul>
            </fieldset>
            <button className="login-button" onClick={this.handleSubmit}>Log In</button>
            <button type="button" className="account-button" onClick={() => this.changeView("signUp")}>Create an Account</button>
	    {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
          </form>
        )
      case "PWReset":
        return (
          <form onSubmit={this.handleSubmit}>
          <h2>Reset Password</h2>
          <fieldset>
            <legend>Password Reset</legend>
            <ul>
              <li>
                <em>A reset link will be sent to your inbox!</em>
              </li>
              <li>
                <label for="email">Email:</label>
                <input type="email" id="email" onChange={this.handleChange}/>
              </li>
            </ul>
          </fieldset>
          <button onClick={() => this.handleSubmit} >Send Reset Link</button>
          <button type="button" onClick={() => this.changeView("logIn")}>Go Back</button>
        </form>
        )
      default:
        break
    }
  }


  render() {
    return this.state.login ? <Navigate to="/home"/> : (
	  <section id="entry-page">
        {this.currentView()}
      </section>
    )
  }
}

export default AuthPage


