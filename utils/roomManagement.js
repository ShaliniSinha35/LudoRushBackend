const { v4: uuidv4 } = require('uuid');

const Room = require('../models/Room');

const rooms = [];

function createRoom() {
  const room = new Room({ id: uuidv4() });
  rooms.push(room);
  return room;
}

function joinRoom(data,socketId) {
  let roomToJoin = rooms.find((room) => !room.isFull());
  if (!roomToJoin) {
    roomToJoin = createRoom(); // Generate room ID as needed
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

// roomManagement.js

// ... existing code ...

function deleteRoom(roomId) {
  const roomIndex = rooms.findIndex((room) => room.id === roomId);

  if (roomIndex !== -1) {
    const deletedRoom = rooms[roomIndex];
    rooms.splice(roomIndex, 1);
    
    return deletedRoom;
  }

  return null; 
}

module.exports = { createRoom, joinRoom, leaveRoom, deleteRoom };
