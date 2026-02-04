const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb(){
  try{ const raw = fs.readFileSync(DB_PATH, 'utf8'); return JSON.parse(raw); }
  catch(e){ return { clues: [], orders: [], pushed: [], dealer_responses: [], locations: [] }; }
}

function writeDb(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

module.exports = { readDb, writeDb };
