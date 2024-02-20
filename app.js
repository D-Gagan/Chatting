const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Google OAuth configuration
passport.use(new GoogleStrategy({
  clientID: '888153648277-6al662vpm8h771vtoiqnul5brhc68jg3.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://d-gagan.github.io/Chatting/index.html',
}, (accessToken, refreshToken, profile, done) => {
  // Save user information in the session
  return done(null, profile);
}));

// Passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://d-gagan.github.io/Chatting/index.html');
  }
);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
