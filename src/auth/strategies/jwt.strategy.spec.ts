import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('validate mapeia sub/email/name para userId/email/name', () => {
    const strategy = new JwtStrategy();

    expect(
      strategy.validate({
        sub: 9,
        email: 'jwt@user.com',
        name: 'Jwt User',
      }),
    ).toEqual({
      userId: 9,
      email: 'jwt@user.com',
      name: 'Jwt User',
    });
  });
});
