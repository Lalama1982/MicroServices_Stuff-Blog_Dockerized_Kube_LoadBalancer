const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  /**
    Expected; "req.body" format;
    {
        "content" : "Comment content example2"
    }   
   */
  const { content } = req.body;

  // "req.params.id" : Fetching the "id" query(url) parameter
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  // Emitting the event to the "Event-Bus"
  //await axios.post("http://localhost:4005/events", {

  // Emitting to "event-bus" service running in docker under Kube service
  // "event-bus-srv" is the service defined in Kube. (get the list by "kubectl get services")
  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { id: commentId, content, postId: req.params.id, status: "pending" },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("[comments-index] :: Received Event: ", req.body.type);

  /**
   * "req.body" format
   *    {
            type:   "CommentCreated",
            data:   { 
                        id: <comment-id>, 
                        content, 
                        postId: <post-id>, 
                        status: "pending" 
                    },
        }
   */

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    // event is orginally emitted from "moderation" service
    // "status" is either ""rejected" or "approved"
    const { postId, id, status, content } = data;

    //fetching comments for "postId"
    const comments = commentsByPostId[postId];

    //traversing retrieved comments for the one match the "comment-id (id)"
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;

    // Emitting the event to the "Event-Bus" after comment is updated
    //await axios.post("http://localhost:4005/events", {
    // Emitting to "event-bus" service running in docker under Kube service
    // "event-bus-srv" is the service defined in Kube. (get the list by "kubectl get services")
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: { id, content, postId, status },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("[comments - index] :: Listening on 4001!");
});
