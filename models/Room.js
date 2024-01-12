class Room {
    constructor(data) {
      this.id = data.id;
      this.users = [];
      this.sockets=[];
      this.timerData = {
        BLUE: null,
        YELLOW: null,
        // Add timer data for other colors as needed
      };
 
      // Other properties as needed
    }
  
    isFull() {
      return this.users.length == 2 ;
    }

  
    addUser(user,socketId) {
      if (!this.isFull()) {
    
        this.users.push(user);
        this.sockets.push(socketId);

            // Set timer data when a user joins

            if(this.users.length == 1){
              this.timerData[BLUE] = {
                timerId: null,
                remainingTime: 15000, // Initial time in milliseconds
              };
            }
            else{
              this.timerData[YELLOW] = {
                timerId: null,
                remainingTime: 15000, // Initial time in milliseconds
              };
            }


      // Handle logic when adding users to the room
    }
    
        // Handle logic when adding users to the room
      }
      

  
    removeUser(user) {
      const index = this.users.indexOf(user);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.sockets.splice(index, 1); 

              // Remove timer data when a user leaves
      delete this.timerData[user.color];
        // Handle logic when removing users from the room
      }
    }

  
  
    isEmpty() {
      return this.users.length === 0 ;
    }
  }
  
  module.exports = Room;
  