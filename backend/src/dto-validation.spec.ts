import { ValidationPipe } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAddressDto } from './address/dto/create-address.dto';
import { UpdateAddressDto } from './address/dto/update-address.dto';
import { CreateGenreDto } from './genre/dto/create-genre.dto';
import { UpdateGenreDto } from './genre/dto/update-genre.dto';
import { CreateMovieDto } from './movie/dto/create-movie.dto';
import { UpdateMovieDto } from './movie/dto/update-movie.dto';
import { CreateOrderDto } from './order/dto/create-order.dto';
import { SnackComboOrderDto } from './order/dto/snack-combo-order.dto';
import { UpdateOrderDto } from './order/dto/update-order.dto';
import { CreateProfileDto } from './profile/dto/create-profile.dto';
import { UpdateProfileDto } from './profile/dto/update-profile.dto';
import { CreateRoomDto } from './room/dto/create-room.dto';
import { UpdateRoomDto } from './room/dto/update-room.dto';
import { CreateSessionDto } from './session/dto/create-session.dto';
import { UpdateSessionDto } from './session/dto/update-session.dto';
import { CreateSnackComboDto } from './snack-combo/dto/create-snack-combo.dto';
import { UpdateSnackComboDto } from './snack-combo/dto/update-snack-combo.dto';
import { CreateTicketDto } from './ticket/dto/create-ticket.dto';
import { UpdateTicketDto } from './ticket/dto/update-ticket.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';

const id = '11111111-1111-4111-8111-111111111111';
const cases: {
  dto: ClassConstructor<object>;
  valid: Record<string, unknown>;
  invalid: Record<string, unknown>[];
}[] = [
  {
    dto: CreateMovieDto,
    valid: {
      title: 'Matrix',
      durationMinutes: 136,
      synopsis: 'Uma descoberta.',
      genreId: id,
    },
    invalid: [
      { title: '' },
      { title: 12 },
      { title: 'a'.repeat(256) },
      { durationMinutes: 0 },
      { durationMinutes: 1.5 },
      { durationMinutes: '136' },
      { durationMinutes: 2147483648 },
      { synopsis: '' },
      { synopsis: 'a'.repeat(10001) },
      { genreId: 'inválido' },
    ],
  },
  {
    dto: CreateSessionDto,
    valid: {
      startTime: '2026-11-11T20:00:00.000Z',
      movieId: id,
      roomId: id,
      price: 25.5,
    },
    invalid: [
      { startTime: 'amanhã' },
      { startTime: '2026-02-30T20:00:00.000Z' },
      { movieId: 'inválido' },
      { roomId: '' },
      { price: -1 },
      { price: 0 },
      { price: '25' },
      { price: Infinity },
    ],
  },
  {
    dto: CreateTicketDto,
    valid: { seat: 'A1', sessionId: id, orderId: id },
    invalid: [
      { seat: '' },
      { seat: 1 },
      { seat: 'a'.repeat(21) },
      { sessionId: 'inválido' },
      { orderId: 'inválido' },
    ],
  },
  {
    dto: CreateOrderDto,
    valid: {
      ticketIds: [id],
      snackCombos: [{ snackComboId: id, quantity: 2 }],
    },
    invalid: [
      { ticketIds: 'inválido' },
      { ticketIds: ['inválido'] },
      { snackCombos: {} },
      { snackCombos: ['inválido'] },
      { snackCombos: [null] },
      { snackCombos: [{ snackComboId: 'inválido', quantity: 1 }] },
      { snackCombos: [{ snackComboId: id, quantity: 0 }] },
      { snackCombos: [{ snackComboId: id, quantity: 1.5 }] },
      { snackCombos: [{ snackComboId: id, quantity: '2' }] },
      { snackCombos: [{ snackComboId: id, quantity: 2147483648 }] },
      { snackCombos: [{ snackComboId: id }] },
    ],
  },
  {
    dto: CreateUserDto,
    valid: {
      name: 'Cliente',
      email: 'cliente@example.com',
      password: 'senha-segura',
    },
    invalid: [
      { name: '' },
      { name: 1 },
      { name: 'a'.repeat(256) },
      { email: 'inválido' },
      { email: 'a'.repeat(255) + '@example.com' },
      { password: 'curta' },
      { password: 123456 },
      { password: 'a'.repeat(1025) },
    ],
  },
  {
    dto: CreateAddressDto,
    valid: {
      street: 'Rua A',
      number: 10,
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      userId: id,
    },
    invalid: [
      { street: '' },
      { street: 'a'.repeat(256) },
      { number: -1 },
      { number: 1.5 },
      { number: 2147483648 },
      { city: '' },
      { state: 'a'.repeat(101) },
      { zipCode: 'a'.repeat(21) },
      { userId: 'inválido' },
    ],
  },
  {
    dto: CreateGenreDto,
    valid: { name: 'Drama' },
    invalid: [{ name: '' }, { name: 1 }, { name: 'a'.repeat(101) }],
  },
  {
    dto: CreateProfileDto,
    valid: { name: 'USER' },
    invalid: [{ name: '' }, { name: 1 }, { name: 'a'.repeat(101) }],
  },
  {
    dto: CreateRoomDto,
    valid: { name: 'Sala 1', capacity: 100 },
    invalid: [
      { name: '' },
      { name: 'a'.repeat(101) },
      { capacity: 0 },
      { capacity: 1.5 },
      { capacity: 2147483648 },
    ],
  },
  {
    dto: CreateSnackComboDto,
    valid: { name: 'Pipoca e refri', price: 19.9 },
    invalid: [
      { name: '' },
      { name: 'a'.repeat(256) },
      { price: 0 },
      { price: -1 },
      { price: '19.9' },
      { price: NaN },
    ],
  },
  {
    dto: LoginUserDto,
    valid: { email: 'cliente@example.com', password: 'senha-legada' },
    invalid: [
      { email: 'inválido' },
      { password: '' },
      { password: 1 },
      { password: 'a'.repeat(1025) },
    ],
  },
];

describe.each(cases)('Validação de $dto.name', ({ dto, valid, invalid }) => {
  it('aceita o payload válido e remove campos extras com whitelist', async () => {
    const instance = plainToInstance(dto, {
      ...valid,
      id,
      createdAt: 'ignorado',
      profileId: id,
    });
    await expect(validate(instance, { whitelist: true })).resolves.toHaveLength(
      0,
    );
    expect(instance).toEqual(valid);
  });

  it.each(invalid)('rejeita campos inválidos: %j', async (changes) => {
    const instance = plainToInstance(dto, { ...valid, ...changes });
    const errors = await validate(instance, { whitelist: true });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(Object.keys(changes)),
    );
  });
});

describe('Compatibilidade dos payloads dos clientes', () => {
  it('remove preço legado do ingresso, mesmo quando não é numérico', async () => {
    const instance = plainToInstance(CreateTicketDto, {
      seat: 'A1',
      sessionId: id,
      price: 'ignorado',
    });
    await expect(validate(instance, { whitelist: true })).resolves.toHaveLength(
      0,
    );
    expect(instance).toEqual({ seat: 'A1', sessionId: id });
  });

  it('remove userId e total do pedido e campos extras dos itens aninhados', async () => {
    const instance = plainToInstance(CreateOrderDto, {
      userId: 'ignorado',
      total: 0,
      ticketIds: [id],
      snackCombos: [{ snackComboId: id, quantity: 2, price: 0, orderId: id }],
    });
    await expect(validate(instance, { whitelist: true })).resolves.toHaveLength(
      0,
    );
    expect(instance).toEqual({
      ticketIds: [id],
      snackCombos: [{ snackComboId: id, quantity: 2 }],
    });
    expect(instance.snackCombos?.[0]).toBeInstanceOf(SnackComboOrderDto);
  });

  it('aceita os opcionais omitidos em sessão, ingresso, pedido e endereço', async () => {
    for (const [dto, payload] of [
      [
        CreateSessionDto,
        { startTime: '2026-11-11T20:00:00.000Z', movieId: id, roomId: id },
      ],
      [CreateTicketDto, { seat: 'A1', sessionId: id }],
      [CreateOrderDto, {}],
      [
        CreateAddressDto,
        {
          street: 'Rua A',
          number: 0,
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000',
        },
      ],
    ] as [ClassConstructor<object>, object][]) {
      await expect(
        validate(plainToInstance(dto, payload)),
      ).resolves.toHaveLength(0);
    }
  });

  it('transforma o corpo em DTO e preserva os tipos sem conversão implícita', async () => {
    const pipe = new ValidationPipe({ whitelist: true, transform: true });
    const result: unknown = await pipe.transform(
      {
        title: 'Matrix',
        durationMinutes: 136,
        synopsis: 'Uma descoberta.',
        genreId: id,
        sessions: [],
      },
      { type: 'body', metatype: CreateMovieDto },
    );
    expect(result).toBeInstanceOf(CreateMovieDto);
    expect(result).not.toHaveProperty('sessions');
    expect(result).toHaveProperty('durationMinutes', 136);
  });
});

const updates: [ClassConstructor<object>, Record<string, unknown>][] = [
  [UpdateAddressDto, { number: -1 }],
  [UpdateGenreDto, { name: '' }],
  [UpdateMovieDto, { durationMinutes: 0 }],
  [UpdateOrderDto, { snackCombos: [{ snackComboId: id, quantity: 0 }] }],
  [UpdateProfileDto, { name: '' }],
  [UpdateRoomDto, { capacity: 0 }],
  [UpdateSessionDto, { startTime: 'inválido' }],
  [UpdateSnackComboDto, { price: -1 }],
  [UpdateTicketDto, { seat: '' }],
  [UpdateUserDto, { password: 'curta' }],
];

describe.each(updates)('%s herda as validações do Create', (dto, invalid) => {
  it('aceita atualização vazia e rejeita campo inválido', async () => {
    await expect(validate(plainToInstance(dto, {}))).resolves.toHaveLength(0);
    const errors = await validate(plainToInstance(dto, invalid));
    expect(errors.length).toBeGreaterThan(0);
  });

  if (dto !== UpdateOrderDto) {
    it('rejeita null em campo obrigatório do Create', async () => {
      const field = Object.keys(invalid)[0];
      const errors = await validate(plainToInstance(dto, { [field]: null }));
      expect(errors.length).toBeGreaterThan(0);
    });
  }
});
