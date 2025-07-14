const socketIo = require("socket.io");
module.exports = function setupVideoChart(serverInstance) {
  const ioServer = socketIo(serverInstance, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

 
  const callPairs = {};

  ioServer.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
   
      if (callPairs[socket.id]) {
        const partnerId = callPairs[socket.id];
        ioServer.to(partnerId).emit("callEnded");
        delete callPairs[partnerId];
        delete callPairs[socket.id];
      }

      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      console.log(`Call from ${data.from} to ${data.userToCall}`);

      callPairs[data.from] = data.userToCall;
      callPairs[data.userToCall] = data.from;
      
      ioServer.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name
      });
    });

    socket.on("answerCall", (data) => {
      console.log(`Call answered by ${socket.id} to ${data.to}`);
      ioServer.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on("iceCandidate", (data) => {
      console.log(`ICE candidate from ${socket.id} to ${data.to}`);
      if (ioServer.sockets.sockets.has(data.to)) {
        ioServer.to(data.to).emit("iceCandidate", {
          candidate: data.candidate,
          from: socket.id
        });
      }
    });

    socket.on("callEnded", () => {
      console.log(`Call ended by ${socket.id}`);

      if (callPairs[socket.id]) {
        const partnerId = callPairs[socket.id];
        ioServer.to(partnerId).emit("callEnded");
        delete callPairs[partnerId];
        delete callPairs[socket.id];
      }
    });
  });
};