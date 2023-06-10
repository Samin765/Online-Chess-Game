import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolvePath } from "./util.js";

sqlite3.verbose();

// Open and initialize the database
const db = await open({
  filename: resolvePath("db.sqlite"),
  driver: sqlite3.Database,
});

await db.run("DROP TABLE IF EXISTS lorem");
await db.run(
  "CREATE TABLE lorem (username TEXT, password TEXT, win INTEGER, played INTEGER)"
);

await db.run(
  "INSERT INTO lorem (username, password, win, played) VALUES (?, ?, ?, ?)",
  ["samin", "123", 3, 5]
);
await db.run(
  "INSERT INTO lorem (username, password, win , played) VALUES (?, ?, ?, ?)",
  ["elling", "1234", 2, 5]
);

await db.run("DROP TABLE IF EXISTS matches");
await db.run("CREATE TABLE matches (winner TEXT, loser TEXT)");
await db.run("INSERT INTO matches (winner, loser) VALUES (?, ?)", [
  "samin",
  "elling",
]);
await db.run("INSERT INTO matches (winner, loser) VALUES (?, ?)", [
  "samin",
  "elling",
]);
await db.run("INSERT INTO matches (winner, loser) VALUES (?, ?)", [
  "samin",
  "elling",
]);
await db.run("INSERT INTO matches (winner, loser) VALUES (?, ?)", [
  "elling",
  "samin",
]);
await db.run("INSERT INTO matches (winner, loser) VALUES (?, ?)", [
  "elling",
  "samin",
]);

// const statement = await db.prepare("INSERT INTO lorem VALUES (?)");
// for (let i = 0; i < 10; i += 1) {
// statement.run(`ipsum ${i}`);
// }
// statement.finalize();

async function addMatch(winner, loser) {
  console.log(`addmatch + w + L ${winner} ${loser}`);
  const insertQuery = "INSERT INTO matches (winner, loser) VALUES (?, ?)";
  const insertData = [winner, loser];
  try {
    await db.run(insertQuery, insertData);
    return true;
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    return false;
  }
}

async function checkAssistant(username, password) {
  console.log(`${username}+${password}`);
  const row1 = await db.get(
    "SELECT * FROM lorem WHERE username = ? AND password = ?",
    [username, password]
  );

  if (row1) {
    return true;
  }

  return false;
}
async function registerUser(username, password) {
  console.log(`register${username} +${password}`);

  const insertQuery =
    "INSERT INTO lorem (username, password, win, played) VALUES (?, ?, ?, ?)";
  const insertData = [username, password, 0, 0];
  const row1 = await db.get("SELECT * FROM lorem WHERE username = ?", [
    username,
  ]);

  if (row1) {
    console.log("user already exists");
    return true;
  }

  try {
    await db.run(insertQuery, insertData);
    return true;
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    return false;
  }
}

async function incrementWin(username) {
  // Prepare the SQL statement
  const updateQuery = "UPDATE lorem SET win = win + 1 WHERE username = ?";

  try {
    // Execute the SQL statement
    await db.run(updateQuery, [username]);
  } catch (error) {
    // Log any error that occurred
    console.error(`Error updating win count for user ${username}:`, error);
  }
}

async function getUserWins(username) {
  try {
    const row1 = await db.get("SELECT win FROM lorem WHERE username = ?", [
      username,
    ]);
    return row1.win;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
async function getUserPlayed(username) {
  try {
    const row1 = await db.get("SELECT played FROM lorem WHERE username = ?", [
      username,
    ]);
    return row1.played;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
async function getUserHistory(username) {
  try {
    const row1 = await db.all(
      "SELECT * FROM matches WHERE winner = ? OR loser = ?",
      [username, username]
    );
    return row1;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function incrementPlayed(username) {
  // Prepare the SQL statement
  const updateQuery = "UPDATE lorem SET played = played + 1 WHERE username = ?";

  try {
    // Execute the SQL statement
    await db.run(updateQuery, [username]);
  } catch (error) {
    // Log any error that occurred
    console.error(`Error updating played count for user ${username}:`, error);
  }
}

export {
  checkAssistant,
  registerUser,
  incrementWin,
  getUserWins,
  incrementPlayed,
  addMatch,
  getUserPlayed,
  getUserHistory,
};

export default db;
