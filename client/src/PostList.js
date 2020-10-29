import React, { useState, useEffect } from "react";
import axios from "axios";

import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export default () => {
  const [posts, setPosts] = useState({});
  /**
   * accepts an object (not an array "[]"), as "GET" route at "posts/index.js" returns posts as an object
   */

  const fetchPosts = async () => {
    //const res = await axios.get("http://localhost:4000/posts");
    // Instead of referring to "posts" service fetching posts, redirected to "query"
    const res = await axios.get("http://localhost:4002/posts");
    setPosts(res.data);
    /**
     * Expected response :: as an object, 
     * {    id: "9d4e1a4d"
            title: "Post From Web - 01"
        }    
     */
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log(posts);
  const renderedPosts = Object.values(posts).map((post) => {
    /**
     * "posts" are objects with below format, 
     * {    id: "9d4e1a4d"
            title: "Post From Web - 01"
        }    
     */
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          {/* <CommentList postId={post.id} /> */}
          <CommentList comments={post.comments} /> {/*After redirecting to "query" service, received "posts" object has comments (included)*/}
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};
