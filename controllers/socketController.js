const roomManagement = require('../utils/roomManagement');

function handleConnection(socket, io) {
  console.log("4", socket.id);

  socket.on('joinRoom', (data) => {
    console.log(data);

    const room = roomManagement.joinRoom(data, socket.id);
    console.log("room7", room);

    if (room.users.includes(data.user)) {
      socket.join(room.id);
      socket.emit('roomId', room.id);
    }

    io.to(room.id).emit('roomStatus', room);

    if (room.users.length === 2 && room.users.includes(data.user)) {
      io.to(room.id).emit('startTwoPlayerGame', room);
      io.to(room.sockets[0]).emit('getTurn', true);
      io.to(room.sockets[1]).emit('getTurn', false);
      startTurnTimer(room.sockets[0], room.sockets[1]); // Start timer for the first player
    }

    socket.on('updateGameState', (gameState) => {
      io.to(room.id).emit('broadcastGameState', { gameState: gameState });
    });

    socket.on('changeTurn', (data) => {
      const { currentPlayer, nextPlayer, dicenumber, extrachance, bonusCount } = data;
      io.to(currentPlayer).emit('getTurn', false);
      io.to(nextPlayer).emit('getTurn', true);
      startTurnTimer(nextPlayer, currentPlayer); // Start timer for the next player
    });

 
  });

  socket.on('disconnectUser', (data) => {
    roomManagement.leaveRoom(data.user);
  });

  socket.on('disconnectSocket', (data) => {
    roomManagement.leaveRoomSocket(data.socket);
  });

  function startTurnTimer(currentPlayer, previousPlayer) {
    const timerDuration = 15000; // 15 seconds
    io.to(currentPlayer).emit('getTimer', true);

    const timerId = setTimeout(() => {
      io.to(currentPlayer).emit('getTimer', false);
      io.to(currentPlayer).emit('getTurn',false);
      io.to(previousPlayer).emit('getTimer',true)
      io.to(previousPlayer).emit('getTurn', true);
    }, timerDuration);



    // Save the timerId for potential cleanup on player move or disconnection
    // roomManagement.setPlayerTimer(currentPlayer, timerId);
  }
}

module.exports = { handleConnection };
