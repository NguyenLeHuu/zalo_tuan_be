const express = require("express");
const cors = require("cors");
const connectDB = require("./src/configs/connectDB");

const authRouter = require("./src/routers/authRouter");
const userRoute = require("./src/routers/userRoute");
const messageRouter = require("./src/routers/messageRouter");
const groupRouter = require("./src/routers/groupRouter")

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRoute);
app.use("/messages", messageRouter);
app.use("/groups", groupRouter);

// Connect to MongoDB
connectDB();
// create a http.Server instance

const server = app.listen(PORT, () => { // Khởi tạo server và lắng nghe trên PORT được xác định
    console.log("Server Started in", PORT);
});

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  });


socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  socket.emit("getId", socket.id);

  socket.on("sendDataClient", function(data) {
    console.log(data)
    socketIo.emit("sendDataServer", { data });
  })
  socket.on("message_deletedClient", function(data) {
    console.log(data)
    socketIo.emit("message_deleted", { data });
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});