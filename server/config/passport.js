import passport from 'passport'
import {User} from '../models'
import localStrategy from './strategies/local'

/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(async function(id, done) {
		try {
			const user = await User.findById(id, '-salt -password')
			done(null, user)
		} catch (err) {
			done(err)
		}

	});

	// Initialize strategies
	localStrategy()
};
