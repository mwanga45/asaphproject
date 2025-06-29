const socketIo = require("socket.io");

module.exports = function setupVideoChart(serverInstance) {
  const ioServer = socketIo(serverInstance, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  ioServer.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      ioServer.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name
      });
    });

    socket.on("answerCall", (data) => {
      ioServer.to(data.to).emit("callAccepted", data.signal);
    });
  });
};