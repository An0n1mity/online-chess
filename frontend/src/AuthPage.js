import { Component } from 'react';
import axios from 'axios';
import PasswordStrengthBar from 'react-password-strength-bar';
import zxcvbn from 'zxcvbn';

class AuthPage extends Component {
  constructor(props){
    super(props)
    this.state = {
	username: '',
	email: '',
	password: '',
	currentView: "logIn",
	errorMessage: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (e) => {
      this.setState({ [e.target.id]: e.target.value })
  }
    
  handleSubmit = (event) => {
    event.preventDefault();

    const { username, email, password } = this.state;
    if (this.state.currentView === "signUp") {
	// Check if password is strong enough
	if(zxcvbn(password).score < 3) {
	    this.setState({ errorMessage: "Password is not strong enough" })
	    return
	}
	    
	axios.post('http://localhost:8000/api/register', {
	    user:{
		username: username,
		email: email,
		password: password
	    }
	    })
	  .then(response => {
	      if (response.data.success) {
		  this.setState({ currentView: "logIn" })
	      }
	      else{
		  this.setState({errorMessage: response.data.error})
	      }
	  })
    }
    else if (this.state.currentView === "logIn") {
	axios.post('http://localhost:8000/auth/login', {
	    username: username,
	    password: password,
	    })
	    .then(response => {
	      if (response.data.success) {
		  console.log(response.data)
	      }
	      else{
		  this.setState({errorMessage: response.data.error})
	      }
	  })
    }
  }

  changeView = (view) => {
    this.setState({
      currentView: view
    })
  }

  currentView = () => {
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
            <button>Sign Up</button>
            <button type="button" onClick={ () => this.changeView("logIn")}>Have an Account?</button>
	    {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
          </form>
        )
      case "logIn":
        return (
          <form onSubmit={this.handleSubmit}>
            <h2>Online-Chess ♟️</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label for="username">Username:</label>
                  <input type="text" id="username" onChange={this.handleChange} required/>
                </li>
                <li>
                  <label for="password">Password:</label>
                  <input type="password" id="password" onChange={this.handleChange} required/>
                </li>
                <li>
                  <i/>
                  <a onClick={ () => this.changeView("PWReset")} href="#">Forgot Password?</a>
                </li>
              </ul>
            </fieldset>
            <button onClick={() => this.handleSubmit}>Submit</button>
            <button type="button" onClick={ () => this.changeView("signUp")}>Create an Account</button>
	    {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}

          </form>
        )
      case "PWReset":
        return (
          <form>
          <h2>Reset Password</h2>
          <fieldset>
            <legend>Password Reset</legend>
            <ul>
              <li>
                <em>A reset link will be sent to your inbox!</em>
              </li>
              <li>
                <label for="email">Email:</label>
                <input type="email" id="email" required/>
              </li>
            </ul>
          </fieldset>
          <button>Send Reset Link</button>
          <button type="button" onClick={ () => this.changeView("logIn")}>Go Back</button>
        </form>
        )
      default:
        break
    }
  }


  render() {
    return (
      <section id="entry-page">
        {this.currentView()}
      </section>
    )
  }
}

export default AuthPage
