import React,{useEffect,useState} from 'react'
import '../css/Profile.css'
import PostDetail from './PostDetail'
import { useParams } from 'react-router-dom'

function UserProfile() {

const {userid} = useParams()
var picLink = "https://cdn-icons-png.flaticon.com/128/847/847969.png" 
  const [pic, setPic] = useState([])
  console.log(userid)
  const [user, setUser] = useState("")
  const [posts, setPosts] = useState([])
  const [isFollow, setisFollow] = useState(false)

  // to follow user
  const followUser = (userId) => {
    fetch("/follow",{
      method:"put",
      headers:{
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body:JSON.stringify({
        followId:userId,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setisFollow(true)
    })
  }

  // to unfollow user
  const unfollowUser = (userId) => {
    fetch("/unfollow",{
      method:"put",
      headers:{
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body:JSON.stringify({
        followId:userId
      })
    })
    .then((res) => res.json(res))
    .then((data) => {
      console.log(data)
      setisFollow(false)
    })
  }


  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers:{
       Authorization : "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res => res.json())
    .then((result) => {
        console.log(result)
      setUser(result.user)
      setPosts(result.post)
      if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
        setisFollow(true)
      }
    })
  }, [isFollow])
  

  return (
    <div className='profile'>
      {/* Profile frame */}
      <div className="profile-frame">
        {/* Profile-pic */}
        <div className="profile-pic">
          <img src={user.Photo ? user.Photo : picLink} alt="" />
        </div>
        {/* Profile-data */}
        <div className="profile-data">
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <h1>{user.name}</h1>
            <button className='followBtn' onClick={() => {
              if(isFollow){
                unfollowUser(user._id)
              }
              else{
                followUser(user._id)
              }
            }}>{isFollow ? "Unfollow" : "Follow"}</button>
          </div>
          <div className="profile-info" style={{display: "flex"}}>
            <p><b>{posts.length}</b> Posts</p>
            <p><b>{user.followers? user.followers.length : "0"}</b> Followers</p>
            <p><b>{user.following? user.following.length : "0"}</b> Following</p>
          </div>
        </div>
      </div>
      <hr style={{
        width: "90%", 
        opacity:"0.8",
        margin: "25px auto"
      }}/>
      {/* Gallery */}
      <div className="gallery">
        {posts.map((pic) => {
          return <img key={pic._id} src={pic.photo} alt='' className='item'></img>
        })}
      </div>
      {/* {show && 
        <PostDetail item={posts} toggleDetails = {toggleDetails}/>
      } */}
    </div>
  );
}

export default UserProfile