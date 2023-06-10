import { Router } from "express";
import model from "../model.js";
import {
  checkAssistant,
  registerUser,
  getUserWins,
  getUserPlayed,
  getUserHistory,
} from "../db.js";

const router = Router();

/**
 * requireAuth is a middleware function that limit access to an endpoint to authenticated users.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
  // Use an unique session identifier to access information about the user making the request
  const { id } = req.session;
  const user = model.findUserById(id);

  if (user === undefined) {
    // Choose the appropriate HTTP response status code and send an HTTP response, if any, back to the client
    res.status(401).end();
    return;
  }

  next();
};

router.post("/logOut", async (req, res) => {
  const { id } = req.session;

  model.removeAssistant(id);
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Could not log out, please try again" });
    }
    return res.status(200).json({ authenticated: false });
  });
});
router.get("/session", requireAuth, (req, res) => {
  res.status(200).json({ authenticated: true });
});

router.get("/userdata", async (req, res) => {
  const { id } = req.session;
  const user = model.findAssistantById(id);
  const username = user.getAssistantName();
  console.log(username);
  const numwins = await getUserWins(username);
  const numplayed = await getUserPlayed(username);
  console.log(`userwins ${numwins}`);
  console.log(`numplayed ${numplayed}`);
  const history = await getUserHistory(username);
  console.log(`hist ${history}`);
  res.status(200).json({ username, numwins, numplayed, history });
  console.log("fetch call server side");
});

router.get("/users/me", (req, res) => {
  const { id } = req.session;
  const assistant = model.findAssistantById(id);

  res.status(200).json({ authenticated: assistant !== undefined });
});

router.post("/login", async (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body
  const { username, password } = req.body;

  const { id } = req.session;

  // Create a new user with the given name and associate it with the currently active session
  if (await checkAssistant(username, password)) {
    console.log("login");
    model.createUser(id, username);
    model.createAssistant(id, username);

    req.session.save((err) => {
      if (err) console.error(err);
      else
        console.debug(
          `Saved user: ${JSON.stringify(model.findAssistantById(id))}`
        );
    });

    // FIXME Send HTTP response status code 200 OK only when the login was successful

    res.status(200).json({ authenticated: true });
  }
});

router.post("/register", async (req) => {
  // Check how to access data being sent as a path, query, header, or cookie parameter or in the HTTP request body
  const { username, password } = req.body;
  const { id } = req.session;

  // Create a new user with the given name and associate it with the currently active session
  if (await registerUser(username, password)) {
    console.log("register");
    // model.createUser(id, username);
    model.createUser(id, username);
    model.createAssistant(id, username);

    req.session.save((err) => {
      if (err) {
        console.error(err);
      } else {
        console.debug(
          `Saved user: ${JSON.stringify(
            model.findAssistantById(id),
            model.findUserById(id)
          )}`
        );
      }
    });
  }

  // Add any desired response handling code here
});

export default { router, requireAuth };
