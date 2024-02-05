const roomManagement = require('../utils/roomManagement');

function handleConnection(socket, io) {
  console.log("4", socket.id);
  let timerId;
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
      io.to(room.sockets[0]).emit('color', "blue");
      io.to(room.sockets[1]).emit('getTurn', false);
      io.to(room.sockets[1]).emit('color', "yellow");
      // startTurnTimer(room.sockets[0], room.sockets[1]); // Start timer for the first player
    }

    else if(room.users.includes(data.user)) {
    
      timerId = setTimeout(() => {
        if (room.users.length == 1) {
         
    
        var RoboNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
          roomManagement.joinRoom({ user: RoboNumber }, "ROBOT");
          io.to(room.id).emit('roomStatus', room, {});

          // Start the game with computer player
          io.to(room.id).emit('startTwoPlayerGame', room);
          for(let i=0;i<room.sockets.length;i++){
               if(room.sockets[i]!="ROBOT"){
                io.to(room.sockets[i]).emit('getTurn', true);
               }
               else{
                io.to(room.sockets[i]).emit('getTurn',false);
               }
          }
       
      
        }
        clearTimeout(timerId); // Clear the timer
      }, 20000); // 30 seconds
    }

    socket.on('updateGameState', (gameState) => {
      io.to(room.id).emit('broadcastGameState', { gameState: gameState });
    });

    socket.on('changeTurn', (data) => {
      const { currentPlayer, nextPlayer, dicenumber, extrachance, bonusCount } = data;
      console.log(dicenumber,extrachance, bonusCount, currentPlayer, nextPlayer)
      io.to(currentPlayer).emit('getTurn', false);
      io.to(nextPlayer).emit('getTurn', true);
      // startTurnTimer(nextPlayer, currentPlayer); // Start timer for the next player
    });


  
  
 
  });

  socket.on('endGame',(data)=>{
    const {loser,winner}= data;
    console.log(loser,winner)
    io.to(loser).emit('endGame', {value:true,lost:loser});
    io.to(winner).emit('endGame', {value:true,winner:winner});
  })


  socket.on('disconnectUser', (data) => {
    console.log(data.user,"leaves")
    roomManagement.leaveRoom(data.user);
  });

  socket.on('disconnectSocket', (data) => {
    console.log(data.socket,"leaves")
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



