import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { Link, useNavigate } from "react-router-dom";

function MyFollowingPost() {
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }

    // Fetching all posts
    fetch("/myfollowingpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setdata(result);
      })
      .catch((err) => console.log(err));
  }, []);

  // to show and hide comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
      // console.log("hide")
    } else {
      setShow(true);
      setItem(posts);
      // console.log(item)
      // console.log("show")
    }
  };

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setdata(newData);
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setdata(newData);
      })
      .catch((error) => console.error("Error unliking post:", error));
  };

  // function to make comment
  const makeComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setdata(newData);
        setComment("");
        console.log(result);
      })
    .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card-header */}
            <div className="card-header">
              {/* card-pic */}
              <div className="card-pic">
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>{posts.postedBy.name}</Link>
              </h5>
            </div>
            {/* card-image */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>
            {/* card-content */}
            <div className="card-content">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bolder", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all Comments
              </p>
              {/* add-comment */}
            </div>
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Add a comment"
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, item._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* Show Comments */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* card-header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {/* card-pic */}
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>
              {/* comment Section */}

              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder " }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>

              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add-comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  placeholder="Add a comment"
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFollowingPost;
