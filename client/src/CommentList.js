import React from "react"; //{ useState, useEffect }
//import axios from "axios";

//accepts an array (not an object "{}"), as "GET" route at "comments/index.js" returns comments as an array
//export default ({ postId }) => {
export default ({ comments }) => {
  // const [comments, setComments] = useState([]); // comments are received as args hence no necessary to maintain in

  // "fetchData" func is no longer needed as comments are received as props/arguments, hence no need to call
  /*const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );

    // Expected response :: as an array,
    //setComments(res.data);
  };*/

  /*
  -- "fetchData" func is no longer needed as comments are received as props/arguments, hence no need to call
  useEffect(() => {
    fetchData();
  }, []);
  */

  const renderedComments = comments.map((comment) => {
    let content;

    if(comment.status === "approved"){
      content = comment.content;
    }

    if(comment.status === "pending"){
      content = "This comment is awaiting moderation";
    }

    if(comment.status === "rejected"){
      content = "This comment has been rejected";
    }    

    //return <li key={comment.id}>{comment.content}</li>;
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
