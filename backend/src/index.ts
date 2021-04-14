import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import User from './User';
import { IMongoDBUser } from './types';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

dotenv.config();

const app = express();

mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('Connected to MongoDB!')
});

// Middleware
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
));

// app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 1000 * 60 * 60 * 24 * 7 // one week 
    // }
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: IMongoDBUser, done: any) => {
  return done(null, user._id);
});

passport.deserializeUser((id: String, done: any) => {
  User.findById(id, (err: Error, doc: IMongoDBUser) => {

    return done(null, doc);
  });
});

passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT}`,
  clientSecret: `${process.env.GOOGLE_SECRET}`,
  callbackURL: "/auth/google/callback"
},
function(_: any, __: any, profile: any, cb: any) {
  User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
    if (err) {
      return cb(err, null);
    }
    if (!doc) {
      const newUser = new User({ 
        googleId: profile.id,
        username: profile.displayName
      });
      await newUser.save();
      cb(null, newUser);
    }
    cb(null, doc);
  }); 
}));

passport.use(new FacebookStrategy({
  clientID: `${process.env.FACEBOOK_CLIENT}`,
  clientSecret: `${process.env.FACEBOOK_SECRET}`,
  callbackURL: "/auth/facebook/callback"
},
function(_: any, __: any, profile: any, cb: any) {
  User.findOne({ facebookId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
    if (err) {
      return cb(err, null);
    }
    if (!doc) {
      const newUser = new User({ 
        facebookId: profile.id,
        username: profile.displayName
      });
      await newUser.save();
      cb(null, newUser);
    }
    cb(null, doc);
  }); 
}
));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/auth/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send("success");
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
});

app.get('/getuser', (req, res) => {
  res.send(req.user);
});

app.listen(4000, () => {
  console.log('Server started...');
});