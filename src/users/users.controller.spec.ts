import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import type { Response } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/* Mock para o servico de usuarios */
const usersServiceMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

/* Função para criar um request autenticado */
function authedReq(userId: number) {
  return {
    user: {
      userId,
      email: 'user@test.com',
      name: 'User',
    },
  } as Parameters<UsersController['update']>[2];
}

/* Teste para verificar se o controller é definido */
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  /* Teste para verificar se o controller é definido */
  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /users (create)', () => {
    it('delega create ao UsersService com o DTO recebido', async () => {
      const dto: CreateUserDto = {
        name: 'Ana',
        email: 'ana@test.com',
        password: '123456',
      };
      const safe = { id: 10, name: 'Ana', email: 'ana@test.com' };
      usersServiceMock.create.mockResolvedValue(safe);

      const result = await controller.create(dto);

      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(safe);
    });
  });

  describe('GET /users (findAll)', () => {
    it('delega findAll ao UsersService', async () => {
      const list = [{ id: 1, name: 'A', email: 'a@x.com', password: 'h' }];
      usersServiceMock.findAll.mockResolvedValue(list);

      const result = await controller.findAll();

      expect(usersServiceMock.findAll).toHaveBeenCalledWith();
      expect(result).toBe(list);
    });
  });

  describe('GET /users/:id (findOne)', () => {
    it('delega findOne ao UsersService com id numérico', async () => {
      const user = { id: 7, name: 'B', email: 'b@x.com', password: 'h' };
      usersServiceMock.findOne.mockResolvedValue(user);

      const result = await controller.findOne('7');

      expect(usersServiceMock.findOne).toHaveBeenCalledWith(7);
      expect(result).toBe(user);
    });
  });

  /* Teste para verificar se o controller atualiza um usuário */
  describe('PATCH :id', () => {
    it('lança ForbiddenException quando o token não é do usuário alvo', () => {
      const dto: UpdateUserDto = { name: 'Outro' };

      expect(() => controller.update(99, dto, authedReq(1))).toThrow(
        ForbiddenException,
      );

      expect(usersServiceMock.update).not.toHaveBeenCalled();
    });

    /* Teste para verificar se o controller repassa update ao UsersService quando o id coincide com o usuário autenticado */
    it('repassa update ao UsersService quando o id coincide com o usuário autenticado', async () => {
      const dto: UpdateUserDto = { name: 'Eu mesmo' };
      const safe = { id: 1, name: 'Eu mesmo', email: 'user@test.com' };
      usersServiceMock.update.mockResolvedValue(safe);

      const result = await controller.update(1, dto, authedReq(1));

      expect(result).toEqual(safe);
      expect(usersServiceMock.update).toHaveBeenCalledWith(1, dto);
    });
  });

  /* Teste para verificar se o controller remove um usuário */
  describe('DELETE :id', () => {
    /* Teste para verificar se o controller lança ForbiddenException quando o token não é do usuário alvo */
    it('lança ForbiddenException quando o token não é do usuário alvo', async () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;

      await expect(controller.remove(99, authedReq(1), res)).rejects.toThrow(
        ForbiddenException,
      );

      expect(usersServiceMock.remove).not.toHaveBeenCalled();
      expect(res.clearCookie).not.toHaveBeenCalled();
    });

    /* Teste para verificar se o controller chama remove e limpa o cookie quando o id coincide com o usuário autenticado */
    it('chama remove e limpa o cookie quando o id coincide com o usuário autenticado', async () => {
      usersServiceMock.remove.mockResolvedValue(undefined);
      const res = { clearCookie: jest.fn() } as unknown as Response;

      await controller.remove(1, authedReq(1), res);

      expect(usersServiceMock.remove).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });
});
