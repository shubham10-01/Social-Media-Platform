// import logo from './logo.svg';
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePost from "./components/CreatePost";
import { createContext, useState } from "react";
import { LoginContext } from "./context/LoginContext";
import Modal from "./components/Modal";
import UserProfile from "./components/UserProfile";
import MyFollowingPost from "./components/MyFollowingPost";

function App() {
  const [UserLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
          <Navbar login={ UserLogin }/>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
            <Route path="/createPost" element={<CreatePost />}></Route>
            <Route path="/profile/:userid" element={<UserProfile />}></Route>
            <Route path="/followingpost" element={<MyFollowingPost />}></Route>
          </Routes>
          <ToastContainer theme="dark" />
          {modalOpen && <Modal setModalOpen={setModalOpen}/>}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
