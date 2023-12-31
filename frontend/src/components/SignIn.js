import { React,useState,useContext } from "react";
import "../css/SignIn.css";
import logo from "../img/logo.png";
import { Link,useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { LoginContext } from "../context/LoginContext";


function SignIn() {
  const {setUserLogin} = useContext(LoginContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {

    // email validation
    if(!emailRegex.test(email)){
      notifyA("Invalid Email");
      return
    }

    // Sending data to server
    fetch("/signin", {
      method: "post",
      headers:{
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        email : email,
        password : password
      })
    }).then(res => res.json())                      // convert to json
    .then(data => {
      if(data.error){
        notifyA(data.error);
      }
      else{
        notifyB("Signed In Successfully");
        console.log(data)
        localStorage.setItem("jwt", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUserLogin(true)
        navigate("/")
      }
      console.log(data)                           // show in console
    })             

  }

  return (
    <div className="signIn"> 
    <div style={{width:"25%"}}>               
      <div className="loginForm">
        <img className="signInlogo" src={logo} alt="" />
        <div>
          <input type="email" name="email" value={email} id="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
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
        <input type="submit" id="login-btn" onClick={() => {postData()}} value="Sign In" />
      </div>
      <div className="loginForm2">
        Don't have an account?
        <Link to="/signup">
          <span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
        </Link>
      </div>
      </div>
    </div>
  );
}

export default SignIn;
