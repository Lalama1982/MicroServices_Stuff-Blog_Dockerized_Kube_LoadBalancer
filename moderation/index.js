const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
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

  if (type === "CommentCreated") {
    // if the "comment.content" has the word "orange", it will be set as "rejected"
    const status = data.content.includes("orange") ? "rejected" : "approved";

    // -> Emitting the event to the "Event-Bus"
    // -> await axios.post("http://localhost:4005/events", {
    // Emitting to "event-bus" service running in docker under Kube service
    // "event-bus-srv" is the service defined in Kube. (get the list by "kubectl get services")
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        content: data.content,
        postId: data.postId,
        status,
      },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("[moderation - index] ::  Listening on 4003!");
});
