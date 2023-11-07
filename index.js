const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

// The "serialize-javascript" package can serialize JavaScript expressions to a string.
// It can also introduce vulnerabilities if used improperly.
app.use(express.static('public'));
const serialize = require('serialize-javascript');

// This is an example of a user database.
const users = {
  alice: { username: 'alice', role: 'user' },
  bob: { username: 'bob', role: 'user' }
};

// Login endpoint to simulate creating a session
app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const { username } = req.body;
  const user = users[username];
  
  if (user) {
    // Serialize user object and encode in Base64 to simulate a session cookie
    const serialized = Buffer.from(serialize(user)).toString('base64');
    res.cookie('session', serialized, { httpOnly: true });
    res.send(`Logged in as ${username}`);
  } else {
    res.status(401).send('Login failed');
  }
});

// Admin endpoint which checks for the deserialized user role
app.get('/admin', (req, res) => {
  const { session } = req.cookies;
  if (!session) {
    return res.status(401).send('No session found');
  }
  
  try {
    // Deserialize user from base64-encoded cookie
    const user = eval('(' + Buffer.from(session, 'base64').toString('utf8') + ')');
    
    if (user.role === 'admin') {
      res.send('Welcome, admin. The flag is FLAG{Bonaparti}');
    } else {
      res.send('Access Denied');
    }
  } catch (error) {
    res.status(400).send('Invalid session data');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
