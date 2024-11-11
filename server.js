const app = require('./index.js');
const Database = require('better-sqlite3');
require('dotenv').config();

async function main() {
  try {

    const db = new Database('my-database.db'); // 'my-database.db' is the SQLite database file
    console.log('server.js: Successfully connected to SQLite Database.');

    // Example of creating a table if not already present
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();


    app.locals.db = db;

    // Start the server
    // app.listen(process.env.PORT || 9090, () => {
    app.listen(9090, () => {
      // console.log(`server.js: Server is running on port ${process.env.PORT || 9090} and listening for HTTP requests`);
      console.log(`server.js: Server is running on port 9090 and listening for HTTP requests`);
    });

  } catch (err) {
    console.error('server.js: Error initializing SQLite Database:', err);
  }
}

// Run the main function and catch any unhandled errors
main().catch(err => console.log('server.js: Main function error:', err));