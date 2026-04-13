import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { AUTH_COOKIE_NAME, authCookieBase } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const authServiceMock = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let prevNodeEnv: string | undefined;

  beforeEach(async () => {
    jest.clearAllMocks();
    prevNodeEnv = process.env.NODE_ENV;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    if (prevNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = prevNodeEnv;
    }
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('POST auth/login', () => {
    const dto: LoginDto = {
      email: 'user@test.com',
      password: '123456',
    };

    it('define cookie access_token com httpOnly, maxAge e secure=false fora de production', async () => {
      process.env.NODE_ENV = 'development';
      authServiceMock.login.mockResolvedValue({
        user: { id: 1, name: 'U', email: 'user@test.com' },
        access_token: 'jwt.token.mock',
      });
      const res = { cookie: jest.fn() } as unknown as Response;

      const result = await controller.login(dto, res);

      expect(result).toEqual({
        user: { id: 1, name: 'U', email: 'user@test.com' },
      });
      expect(res.cookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        'jwt.token.mock',
        expect.objectContaining({
          ...authCookieBase,
          httpOnly: true,
          maxAge: 20 * 60 * 1000,
          secure: false,
        }),
      );
    });

    it('define cookie com secure=true quando NODE_ENV é production', async () => {
      process.env.NODE_ENV = 'production';
      authServiceMock.login.mockResolvedValue({
        user: { id: 2, name: 'P', email: 'p@test.com' },
        access_token: 'jwt.prod',
      });
      const res = { cookie: jest.fn() } as unknown as Response;

      await controller.login(dto, res);

      expect(res.cookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        'jwt.prod',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 20 * 60 * 1000,
          secure: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
    });
  });

  describe('POST auth/logout', () => {
    it('clearCookie usa nome access_token, authCookieBase e secure conforme NODE_ENV', async () => {
      process.env.NODE_ENV = 'production';
      const res = { clearCookie: jest.fn() } as unknown as Response;

      await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        expect.objectContaining({
          ...authCookieBase,
          secure: true,
        }),
      );
    });

    it('logout usa secure=false fora de production', async () => {
      process.env.NODE_ENV = 'test';
      const res = { clearCookie: jest.fn() } as unknown as Response;

      await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
        }),
      );
    });
  });

  describe('GET auth/me', () => {
    it('retorna { id, email, name } a partir de req.user', () => {
      const req = {
        user: {
          userId: 42,
          email: 'me@test.com',
          name: 'Me User',
        },
      } as Parameters<AuthController['me']>[0];

      expect(controller.me(req)).toEqual({
        id: 42,
        email: 'me@test.com',
        name: 'Me User',
      });
    });
  });
});
