import React, { useEffect, useState } from "react";
import "../css/Profile.css";
import PostDetail from "./PostDetail";
import ProfilePic from "./ProfilePic";

function Profile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/847/847969.png"
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [changePic, setChangepic] = useState(false)
  const [user, setUser] = useState("")

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const changeProfile = () => {
    if(changePic){
      setChangepic(false);
    }
    else{
      setChangepic(true);
    }
  }

  useEffect(() => {
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.post );
        setUser(result.user) 
        console.log(pic);
      });
  }, []);

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* Profile-pic */}
        <div className="profile-pic">
          <img 
            onClick={() => {changeProfile()}}
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
        </div>
        {/* Profile-data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic ? pic.length : "0"} Posts</p>
            <p>{user.followers? user.followers.length: "0"} Followers</p>
            <p>{user.following? user.following.length: "0"} Following</p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pic) => {
          return (
            <img
              key={pic._id}
              src={pic.photo}
              alt=""
              onClick={() => {
                toggleDetails(pic);
              }}
              className="item"
            ></img>
          );
        })}
      </div>
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
      {
        changePic &&
        <ProfilePic changeProfile={changeProfile}/>
      }
    </div>
  );
}

export default Profile;
