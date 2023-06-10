import { Router } from "express";
import model from "../model.js";
import { PAWN } from "chess.js";
import db, { checkAssistant, registerUser, incrementWin, getUserWins, incrementPlayed } from "../db.js";

const router = Router();

/**
 * API (see the route handlers below) should combine uniquely identifiable resources (paths)
 * with the appropriate HTTP request methods (GET, POST, PUT, DELETE and more) to manipulate them.
 *
 * GET     /rooms                       =>  get all rooms
 * GET     /rooms/{name}/messages       =>  get all messages in a room with the given name
 * POST    /rooms/{name}/messages       =>  create a new message in a room with the given name
 * PUT     /rooms/{name}/messages/{id}  =>  update a message with the given id in a room with the given name
 * DELETE  /rooms/{name}/messages/{id}  =>  delete a message with the given id in a room with the given name
 * etc.
 */
router.post("/update-members", (req, res) => {
  const { roomName, members } = req.body;
  const rooms = model.getRooms();
  // Find the corresponding room in your server's data or database
  const room = rooms.find((room) => room.name === roomName);
  if (room && room.members < 2) {
    room.members = room.members + 1; // Update the members count for the room
    res.sendStatus(200).json({ updated: true}); // Send a response to acknowledge the update
  } else {
    res.status(404).send("Room full").json({ updated: false}); // Send an error response if the room is not found
  }
});

router.post("/getLobbies", (req, res) => {
  
  
  res.status(200).json({ lobbies: model.getRooms() });

});
router.get("/rooms", (req, res) => {
  const rooms = model.getRooms();

  // Choose the appropriate HTTP response status code and send an HTTP response, if any, back to the client
  res.status(200).json({ rooms }); // same as { rooms: rooms }
});
router.post("/createroom", async (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body
  const { username } = req.body;

  const { id } = req.session;

  
  // Create a new user with the given name and associate it with the currently active session

  console.log("createroom");
  // model.createUser(id, username);
  // model.createAssistant(id, username);

  model.createGame(username);
  model.createRoom(username);
  //model.broadcast2(model.getRooms());

  req.session.save((err) => {
    if (err) console.error(err);
    else
      console.debug(
        `Saved user: ${JSON.stringify(model.findAssistantById(id))}`
      );
  });

  // FIXME Send HTTP response status code 200 OK only when the login was successful

  res.status(200).json({ authenticated: true });
});

router.get("/rooms/:name/messages", (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body
  const { name } = req.params;
  const room = model.findRoomByName(name);

  // Use an unique session identifier to access information about the user making the request
  const { id, socketID } = req.session;
  const user = model.findUserById(id);

  // Check if a room with the given name exists
  if (room === undefined) {
    res.status(404).end();
    return;
  }


  // FIXME Check if the user making the request is authorized to request data

  // Join the specified room
  user.joinRoom(room);
  model.join(socketID, room);
  const game = model.findGameByName(name);

  if(game.getPlayer1Id() == -1){
    game.setPlayer1Id(id);
    game.setTurn(id);
  }else if(game.getPlayer2Id() == -1){
    game.setPlayer2Id(id)
}
  // Send a join message to all connected clients in the room
  room.addMessage(game.getGameBoard());
  model.broadcast(room, game.getGameBoard());

  res.status(200).json({ messages: room.messages });
});

router.post("/rooms/:name/messages", (req, res) => {
  const { name } = req.params;
  const { message } = req.body;
  const room = model.findRoomByName(name);

  const { id } = req.session;
  const user = model.findUserById(id);

  // FIXME Check if a room with the given name exists, if the user making the request is authorized to send a message in the room etc.

  // Send a custom message to all connected clients in the room
  room.addMessage(`${user.name}: ${message}`);
  model.broadcast(room, `${user.name}: ${message}`);

  res.status(200).end();
});


router.post("/rooms/:name/movePiece", (req, res) => {
  const { name } = req.params;
  const { oldPosition, newPosition } = req.body;
  const room = model.findRoomByName(name);
  
  const game = model.findGameByName(name);

  const { id } = req.session;
  const user = model.findUserById(id);

  console.log('Check Piece:', model.checkPiece(oldPosition, game.getGameId()));
  console.log('Game Turn:', game.getTurn());
  console.log('Player 1 ID:', game.getPlayer1Id());
  console.log('Player 2 ID:', game.getPlayer2Id());
  const board = game.getGameBoard();

  const piece = board[oldPosition[0]][oldPosition[1]];
  if(id === game.getTurn() ){
  if(model.checkPiece(oldPosition,game.getGameId()) === "UPPER" && game.getTurn() === game.getPlayer1Id()){

    
      if(model.movePiece(oldPosition, newPosition, board, "UPPER", piece)){
        if(board[newPosition[0]][newPosition[1]] === "k" || board[newPosition[0]][newPosition[1]] === "K" ){
          incrementWin(model.findAssistantById(id).getAssistantName());
          incrementPlayed(model.findAssistantById(id).getAssistantName())
          incrementPlayed(model.findAssistantById(game.getPlayer2Id()).getAssistantName())
          game.setGameBoard(null);
          res.status(200).json({ game_over: true });
        }
       board[newPosition[0]][newPosition[1]] = board[oldPosition[0]][oldPosition[1]];
        board[oldPosition[0]][oldPosition[1]] = '';
        
      }
      else{
        res.status(400).end();
      return;
      }

    }
  
  else if (model.checkPiece(oldPosition,game.getGameId()) === "LOWER" && game.getTurn() === game.getPlayer2Id()){

   

      if(model.movePiece(oldPosition, newPosition, board, "LOWER", piece)){
        if(board[newPosition[0]][newPosition[1]] === "k" || board[newPosition[0]][newPosition[1]] === "K") {
          incrementWin(model.findAssistantById(id).getAssistantName());
          incrementPlayed(model.findAssistantById(id).getAssistantName())
          incrementPlayed(model.findAssistantById(game.getPlayer1Id()).getAssistantName())
          game.setGameBoard(null);
          res.status(200).json({ game_over: true });
        }
    board[newPosition[0]][newPosition[1]] = board[oldPosition[0]][oldPosition[1]];
    board[oldPosition[0]][oldPosition[1]] = '';
    
      }
    
    else{
      res.status(400).end();
      return;
    }
  
  }
  else{
    console.log("Wrong Piece");
    res.status(400).end();
    return;
  }
  
  // FIXME Check if a room with the given name exists, if the user making the request is authorized to send a message in the room etc.

  // Send a custom message to all connected clients in the room
  
  room.addMessage(game.getGameBoard());
  model.broadcast(room, game.getGameBoard());
  if(game.getTurn() === game.getPlayer1Id()){
    game.setTurn(game.getPlayer2Id());

  }
  else{
    game.setTurn(game.getPlayer1Id());

  }
  res.status(200).end();
  }
  else{
    console.log("Not Your Turn");
    res.status(400).end();
  }

});
export default { router };
