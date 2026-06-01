import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User, { Role } from "../modules/user/user.model";

const getRole = async () => {
  const isFirstAccount = (await User.countDocuments({})) === 0;
  return isFirstAccount ? Role.ADMIN : Role.USER;
};

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
  },
  async(_accessToken, _refreshToken, profile, done) => {
    try{
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if(!email) return done(null, false);

        let user = await User.findOne({ email })

        if(!user){
            user = await User.create({
                name,
                email,
                provider: "google",
                googleId: profile.id,
                role: await getRole(),
                isEmailVerified: true,
                verified: new Date(),
            });
        }

        if(!user.googleId){
            user.googleId = profile.id;
            user.provider = "google";
            user.isEmailVerified = true;
            user.verified = new Date();
            await user.save();
        }

        done(null, user);
    }catch(error){
        done(error as Error)
    }
  }
),
);


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
      scope: ["user:email"],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.username || "GitHub User";

        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            provider: "github",
            githubId: profile.id,
            role: await getRole(),
            isEmailVerified: true,
            verified: new Date(),
          });
        }

        if (!user.githubId) {
          user.githubId = profile.id;
          user.provider = "github";
          user.isEmailVerified = true;
          user.verified = new Date();
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

export default passport;
