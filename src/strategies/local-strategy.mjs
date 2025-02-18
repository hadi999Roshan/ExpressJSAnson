import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside Serialize User");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside deserializer");
  console.log(`Deserializing user ID: ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser); // Pass null as the first argument when there is no error
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  //If we want to authenticate based on otherspecial fields, we should use an options argument like this: usernameField: "email"
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Bad credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
