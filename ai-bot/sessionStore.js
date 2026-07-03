import fs from 'fs';
import path from 'path';

const SESSION_FILE = path.join(process.cwd(), 'sessions.json');

// Initialize sessions in-memory
let sessions = {};

// Load sessions from file if it exists
if (fs.existsSync(SESSION_FILE)) {
  try {
    const rawData = fs.readFileSync(SESSION_FILE, 'utf8');
    sessions = JSON.parse(rawData);
  } catch (err) {
    console.error('Failed to load session file, starting with empty sessions:', err);
    sessions = {};
  }
}

// Save sessions to disk
function persistSessions() {
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write session file:', err);
  }
}

export const STATES = {
  CHATTING: 'CHATTING'
};

export function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = {
      userId,
      state: STATES.CHATTING,
      history: [],
      lastInteraction: new Date().toISOString()
    };
    persistSessions();
  }
  return sessions[userId];
}

export function saveSession(userId, data) {
  sessions[userId] = {
    ...sessions[userId],
    ...data,
    lastInteraction: new Date().toISOString()
  };
  persistSessions();
}

export function resetSession(userId) {
  sessions[userId] = {
    userId,
    state: STATES.CHATTING,
    history: [],
    lastInteraction: new Date().toISOString()
  };
  persistSessions();
  return sessions[userId];
}

export function updateSessionState(userId, state) {
  const session = getSession(userId);
  session.state = state;
  persistSessions();
}

export function addToHistory(userId, role, content) {
  const session = getSession(userId);
  session.history.push({ role, content });
  
  // Cap history size to prevent context window bloat (keep last 30 messages)
  if (session.history.length > 30) {
    session.history = session.history.slice(-30);
  }
  persistSessions();
}

export function getHistory(userId) {
  const session = getSession(userId);
  return session.history;
}
