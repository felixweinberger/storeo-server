import bcrypt from 'bcrypt';
import atob from 'atob';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import log from '../../Helpers/log';
import sequelize from '../../db';
import User from '../../Schemas/UserModel';

dotenv.config();

const userLogin = async (req, res) => {
  const [authType, encodedString] = req.headers.authorization.split(' ');
  if (authType === 'Basic') {
    const [email, password] = atob(encodedString).split(':');

    const [user] = await sequelize.query('SELECT id, first_name, last_name, password, role FROM users WHERE email = :email',
      { replacements: { email }, type: sequelize.QueryTypes.SELECT });

    user.role = (user.role === 0) ? 'user' : 'admin';

    log('user is ', user);
    //  The following block of code runs if the user with that email is found
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      log('isPasswordValid', isPasswordValid);
      if (isPasswordValid) {
        const jwtSecret = process.env.JWT_SECRET;
        // Token generation
        const token = jwt.sign({ email }, jwtSecret);
        // Insert token for user in the DB
        await sequelize.query(
          'UPDATE users SET auth_token = ? WHERE email = ?',
          {
            model: User,
            replacements: [token, email],
            type: sequelize.QueryTypes.INSERT,
          },
        );
        // Deleting password property on user object before sending to client
        delete user.password;
        user.token = token;

        res
          .status(200)
          .send(user);
      } else {
        res
          .status(400)
          .send('Wrong password.');
      }
    } else {
      res
        .status(400)
        .send('No user is associated to the given email.');
    }
  }
};

export default userLogin;
