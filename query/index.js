const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type == "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type == "CommentUpdated") {
    const { id, content, postId, status } = data;

    //fetching "posts" record for "postId"
    const post = posts[postId];

    // traversing (of comments of the post) & finding the comment to update using comment id "id"
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log("[query-index] :: Received Event: ", req.body.type);
  const { type, data } = req.body;

  handleEvent(type, data);
  /*
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type == "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type == "CommentUpdated") {
    const { id, content, postId, status } = data;

    //fetching "posts" record for "postId"
    const post = posts[postId];

    // traversing (of comments of the post) & finding the comment to update using comment id "id"
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    
    comment.status = status;
    comment.content = content;
  }*/

  //console.log(posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log("[query service - index] ::  Listening on 4002!");

  // -> After the service is up, "query" service will call the "event-bus" service and get all events from its store
  // -> const res = await axios.get("http://localhost:4005/events");
  // Emitting to "event-bus" service running in docker under Kube service
  // "event-bus-srv" is the service defined in Kube. (get the list by "kubectl get services")
  const res = await axios.get("http://event-bus-srv:4005/events");

  console.log("[query service - index] :: res.length >> ", res.data.length);
  for (let event of res.data) {
    console.log("[query service - index] :: Processing Event: ", event.type);
    handleEvent(event.type, event.data);
  }
});
