const Room = require('../models/Room');

const rooms = [];

function createRoom(data) {
  const room = new Room(data);
  rooms.push(room);
  return room;
}

function joinRoom(data,socketId) {
  let roomToJoin = rooms.find((room) => !room.isFull());
  if (!roomToJoin) {
    roomToJoin = createRoom({ id: rooms.length + 1 }); // Generate room ID as needed
  }
  roomToJoin.addUser(data.user,socketId);
  return roomToJoin;
}

function leaveRoom(userId) {
  const room = rooms.find((room) => room.users.includes(userId));
  if (room) {
    room.removeUser(userId);
    if (room.isEmpty()) {
      // Logic to handle when the room becomes empty
      const index = rooms.indexOf(room);
      rooms.splice(index, 1);
    }
  }
}


module.exports = { createRoom, joinRoom, leaveRoom };