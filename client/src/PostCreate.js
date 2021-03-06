import React, { useState } from "react";
import axios from "axios";

export default () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    /**
         * Expected format of "req.body" ::
         *  {
                "title": "First Post"
            }
         */
    //await axios.post("http://localhost:4000/posts", { (#1)
    //await axios.post("http://posts.com/posts", { // redirected to kube-cluster "posts-service" (#2)
    await axios.post("http://posts.com/posts/create", {
      // since ingress-controller cannot differ on action, making the call unique (#3)
      title, // refers to the "title" variable and matches to "title" property of post request
    });

    setTitle("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
