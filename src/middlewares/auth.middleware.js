'use strict';

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { SECRETORKEY } from '../config';
import { User } from '../models';

export const initializePassport = () => passport.initialize();

export const passportInit = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: SECRETORKEY,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);

        // Lo q mande aqui como 2do parametro sera el value de    req.user
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    })
  );
};

export const protectWithJWT = (req, res, next) => {
  if (req.path === '/join/login' || req.path === '/join/signup') return next();

  return passport.authenticate('jwt', { session: false })(req, res, next);
};
