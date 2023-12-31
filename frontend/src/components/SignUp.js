import React,{useEffect, useState} from "react";
import logo from "../img/logo.png";
import "../css/SignUp.css";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate();
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  //Toastify Functions

  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  const postData = () => {

    // email validation
    if(!emailRegex.test(email)){
      notifyA("Invalid Email");
      return
    }
    else if(!passRegex.test(password)){
      notifyA("Please choose a Strong Password")
      return
    }

    // Sending data to server
    fetch("/signup", {
      method: "post",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name : name,
        userName : userName,
        email : email,
        password : password
      })
    }).then(res => res.json())                      // convert to json
    .then(data => {
      if(data.error){
        notifyA(data.error);
      }
      else{
        notifyB(data.message);
        navigate("/signin")
      }
      console.log(data)                           // show in console
    })             

  }

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="logo" />
          <p className="loginPara">
            Sign Up to see photos and videos <br />
            from your friends
          </p>
          <div>
            <input type="email" name="email" value={email} id="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
          </div>
          <div>
            <input type="text" name="name" value={name} id="name" placeholder="Full Name" onChange={(e) => {setName(e.target.value)}} />
          </div>
          <div>
            <input
              type="text"
              name="username"
              value={userName}
              id="username"
              placeholder="Username"
              onChange={(e) => {setUserName(e.target.value)}}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => {setPassword(e.target.value)}}
            />
          </div>
          <p className="loginPara" style={{fontSize: "12px", margin: "3px 0px"}}>
            By Signing up, you agree to our Terms, <br /> Privacy Policy and
            Cookies Policy.
          </p>
          <input type="submit" id="submit-btn" value="Sign Up" onClick={() =>{postData()}}/>
        </div>
        <div className="form2">
            Already have an account? 
            <Link to="/signin">
                <span style={{color: "blue",cursor: "pointer"}}>Sign In</span>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
