let ioInstance = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return ioInstance;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};

module.exports = { initSocket, getIO };
