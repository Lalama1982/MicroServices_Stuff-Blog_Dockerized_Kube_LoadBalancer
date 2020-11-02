const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

/*app.get("/posts", (req, res) => {
  res.send(posts);
});*/

//app.post("/posts", async (req, res) => {
  app.post("/posts/create", async (req, res) => { // since ingress-controller cannot differ on action, making the call unique (#3)
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // Emitting the event to the "Event-Bus"
  /*
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });
  */
  
  // Emitting to "event-bus" service running in docker under Kube service
  // "event-bus-srv" is the service defined in Kube. (get the list by "kubectl get services")
  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });  

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("[posts-index] :: Received Event: ", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Version: 3.0");
  console.log('[posts - index] :: Listening on 4000!');
});
