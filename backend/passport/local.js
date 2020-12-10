// 로그인 전략들을 설정

// done(null, false, {reason: 유저가 없다}). 여기서 첫번째 인자는 서버쪽 오류, 세번째는 로직상의 오류일때 사용됨.
// 성공했을때는 두번째 인자를 사용함.

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'userId',
        passwordField: 'password',
      },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({ where: { userId } });
          if (!user) {
            return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: '비밀번호가 틀립니다.' });
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
