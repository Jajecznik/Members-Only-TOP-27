const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database/queries');

module.exports = (passport) => {
  // Configure Passport.js to use the Local Strategy for authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.getUserById(id);

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};