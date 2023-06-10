import Room from "./models/room.model.js";
import User from "./models/user.model.js";
import Assistant from "./models/assistant.model.js";
import Game from "./models/game.model.js";

class Model {
  constructor() {
    this.rooms = {};
    this.users = {};
    this.assistants = {};
    this.games = {};

    this.io = undefined;
  }

  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  init(io) {
    this.io = io;
  }

  /**
   * Create a room with the given name.
   * @param {String} name - The name of the room.
   * @returns {void}
   */
  createRoom(name) {
    this.rooms[name] = new Room(name);
    console.log(`created room ${name}`);
  }

  createGame(name) {
    this.games[name] = new Game(name);
  }

  removeAssistant(id) {
    delete this.assistants[id];
  }

  /**
   * Return the room object with the matching name.
   * @param {String} name - The name of the room.
   * @returns {Room}
   */
  findRoomByName(name) {
    return this.rooms[name];
  }

  findGameByName(name) {
    return this.games[name];
  }

  /**
   * Return all the rooms.
   * @returns {Room[]}
   */
  getRooms() {
    return Object.values(this.rooms);
  }

  /**
   * Create a user with the given name.
   * @param {String} id - An unique identifier for the user session.
   * @param {String} name - The name of the user.
   * @returns {void}
   */
  createUser(id, name) {
    this.users[id] = new User(name);
  }

  createAssistant(id, name) {
    this.assistants[id] = new Assistant(name, id);
  }

  /**
   * Return the user object with the matching id.
   * @param {String} id - An unique identifier for the user session.
   * @returns {User}
   */
  findUserById(id) {
    return this.users[id];
  }

  findAssistantById(id) {
    return this.assistants[id];
  }

  /**
   * Push out a message to all connected clients in the given room.
   * @param {Room} room - The room to add the message to.
   * @param {String} message - The message to add.
   * @returns {void}
   */
  broadcast(room, message, members) {
    this.io.in(room.name).emit("msg", { messages: message, members });
    console.log(`MEMBERS: ${members}`);
  }

  broadcast2(lobbys) {
    this.io.emit("msg", lobbys);
  }

  broadCast3(lobbys) {
    this.io.in("my-room").emit("msg", lobbys);
  }

  // eslint-disable-next-line class-methods-use-this
  checkPawn(oldPosition, newPosition, board, color) {
    // Convert coordinates to numbers
    const oldX = Number(oldPosition[0]);
    const oldY = Number(oldPosition[1]);
    const newX = Number(newPosition[0]);
    const newY = Number(newPosition[1]);

    // Determine direction based on the color of the pawn
    const direction = color === "UPPER" ? 1 : -1;

    // Check for forward movement of one square
    if (newX === oldX + direction && newY === oldY) {
      return !board[newX][newY]; // Return true if the destination square is unoccupied
    }

    // Check for forward movement of two squares from initial position
    if (
      (color === "UPPER" && oldX === 1) ||
      (color === "LOWER" && oldX === 6)
    ) {
      if (newX === oldX + 2 * direction && newY === oldY) {
        return !board[oldX + direction][newY] && !board[newX][newY]; // Return true if both squares in front are unoccupied
      }
    }

    // Check for diagonal movement when capturing
    if (newX === oldX + direction && Math.abs(newY - oldY) === 1) {
      // We assume that board[newX][newY] exists
      const destination = board[newX][newY];
      // Determine the color of the piece in the destination square
      const destinationColor =
        destination === destination.toUpperCase() ? "UPPER" : "LOWER";
      // Return true if an opponent's piece is on the destination square
      return destination && destinationColor !== color;
    }

    // If none of the above conditions are met, the move is not valid
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  checkKnight(oldPosition, newPosition, board, color) {
    // Convert coordinates to numbers
    const oldX = Number(oldPosition[0]);
    const oldY = Number(oldPosition[1]);
    const newX = Number(newPosition[0]);
    const newY = Number(newPosition[1]);

    // Knights move in an L-shape: two squares in one direction and one square in the orthogonal direction

    // Check if the new position is two squares horizontally and one square vertically from the old position
    const horizontalTwoVerticalOne =
      Math.abs(newX - oldX) === 2 && Math.abs(newY - oldY) === 1;

    // Check if the new position is two squares vertically and one square horizontally from the old position
    const verticalTwoHorizontalOne =
      Math.abs(newY - oldY) === 2 && Math.abs(newX - oldX) === 1;

    if (horizontalTwoVerticalOne || verticalTwoHorizontalOne) {
      // If the move is valid, we check the destination square. If it's empty or occupied by an opponent's piece, it's a valid move
      const destination = board[newX][newY];
      // If the destination square is empty, return true
      if (!destination) return true;

      // Determine the color of the piece in the destination square
      const destinationColor =
        destination === destination.toUpperCase() ? "UPPER" : "LOWER";
      // Return true if an opponent's piece is on the destination square
      return destinationColor !== color;
    }

    // If none of the above conditions are met, the move is not valid
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  checkPiece(oldPosition, gameID) {
    const game = this.games[gameID];

    // Check if game exists
    if (!game) {
      console.log(`Game with ID ${gameID} not found`);
      return "";
    }

    // Get the board from the game
    const board = game.getGameBoard();

    // Check if board exists
    if (!board) {
      console.log(`Board not found for game with ID ${gameID}`);
      return "";
    }

    // Check if indices are valid
    if (!board[oldPosition[0]] || !board[oldPosition[0]][oldPosition[1]]) {
      console.log(`Invalid position: [${oldPosition[0]}, ${oldPosition[1]}]`);
      return "";
    }

    const piece = board[oldPosition[0]][oldPosition[1]];

    if (piece === piece.toUpperCase()) {
      return "UPPER";
    }
    return "LOWER";
  }

  // eslint-disable-next-line class-methods-use-this
  checkRook(oldPosition, newPosition, board, color) {
    // Convert coordinates to numbers
    const oldX = Number(oldPosition[0]);
    const oldY = Number(oldPosition[1]);
    const newX = Number(newPosition[0]);
    const newY = Number(newPosition[1]);

    // Rooks move either vertically or horizontally

    // Check if the rook is moving vertically (the y-coordinate changes, the x-coordinate remains the same)
    if (oldX === newX) {
      // Determine the direction of movement (up or down)
      const direction = newY > oldY ? 1 : -1;
      // Start from the old position and check every square on the path until the new position
      for (let y = oldY + direction; y !== newY; y += direction) {
        if (board[newX][y]) {
          // If a square is occupied, the rook can't move there
          return false;
        }
      }
    }
    // Check if the rook is moving horizontally (the x-coordinate changes, the y-coordinate remains the same)
    else if (oldY === newY) {
      // Determine the direction of movement (right or left)
      const direction = newX > oldX ? 1 : -1;
      // Start from the old position and check every square on the path until the new position
      for (let x = oldX + direction; x !== newX; x += direction) {
        if (board[x][newY]) {
          // If a square is occupied, the rook can't move there
          return false;
        }
      }
    } else {
      // If the rook is neither moving vertically nor horizontally, the move is not valid
      return false;
    }

    // Now we've verified that the path is clear. Finally, we need to check the destination square.

    const destination = board[newX][newY];
    // If the destination square is empty, return true
    if (!destination) return true;

    // Determine the color of the piece in the destination square
    const destinationColor =
      destination === destination.toUpperCase() ? "UPPER" : "LOWER";
    // Return true if an opponent's piece is on the destination square
    return destinationColor !== color;
  }

  // eslint-disable-next-line class-methods-use-this
  checkBishop(oldPosition, newPosition, board, color) {
    const oldX = Number(oldPosition[0]);
    const oldY = Number(oldPosition[1]);
    const newX = Number(newPosition[0]);
    const newY = Number(newPosition[1]);

    // Bishops move diagonally. The absolute value of the change in x should equal the absolute value of the change in y.
    if (Math.abs(newX - oldX) !== Math.abs(newY - oldY)) return false;

    const xDirection = newX > oldX ? 1 : -1;
    const yDirection = newY > oldY ? 1 : -1;

    // Check each square along the diagonal path for a piece. If a piece is encountered, return false.
    for (
      let x = oldX + xDirection, y = oldY + yDirection;
      x !== newX;
      x += xDirection, y += yDirection
    ) {
      if (board[x][y]) return false;
    }

    // If the destination square is unoccupied or occupied by an opposing piece, the move is valid.
    const destination = board[newX][newY];
    const destinationColor =
      destination === destination.toUpperCase() ? "UPPER" : "LOWER";
    return !destination || destinationColor !== color;
  }

  movePiece(oldPosition, newPosition, board, color, piece) {
    const piece1 = piece.toUpperCase();

    switch (piece1) {
      case "P":
        return this.checkPawn(oldPosition, newPosition, board, color);

      case "N":
        return this.checkKnight(oldPosition, newPosition, board, color);

      case "R":
        return this.checkRook(oldPosition, newPosition, board, color);

      case "B":
        return this.checkBishop(oldPosition, newPosition, board, color);

      case "Q":
        return this.checkQueen(oldPosition, newPosition, board, color);

      case "K":
        return this.checkKing(oldPosition, newPosition, board, color);

      // other cases for other piece types

      default:
        throw new Error(`Unknown piece type: ${piece}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  checkKing(oldPosition, newPosition, board, color) {
    const oldX = Number(oldPosition[0]);
    const oldY = Number(oldPosition[1]);
    const newX = Number(newPosition[0]);
    const newY = Number(newPosition[1]);

    // The king can move one square in any direction.
    if (Math.abs(newX - oldX) > 1 || Math.abs(newY - oldY) > 1) return false;

    // If the destination square is unoccupied or occupied by an opposing piece, the move is valid.
    const destination = board[newX][newY];
    const destinationColor =
      destination === destination.toUpperCase() ? "UPPER" : "LOWER";
    return !destination || destinationColor !== color;
  }

  // eslint-disable-next-line class-methods-use-this
  checkQueen(oldPosition, newPosition, board, color) {
    // The queen's movement can be validated by the movements of a rook or a bishop.
    return (
      this.checkRook(oldPosition, newPosition, board, color) ||
      this.checkBishop(oldPosition, newPosition, board, color)
    );
  }

  /**
   * Join a specified room.
   * @param {String} socketID - An unique identifier for the user socket.io session.
   * @param {Room} room - The room to join.
   * @returns {void}
   */
  join(socketId, room) {
    this.io.in(socketId).socketsJoin(room.name);
  }
}

export default new Model();
