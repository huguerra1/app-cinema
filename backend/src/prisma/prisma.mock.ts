// Cada teste recebe mocks novos e nunca instancia um cliente de banco.
export function createPrismaMock() {
  const delegate = () => ({
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  });
  const prisma = {
    user: delegate(),
    profile: delegate(),
    address: delegate(),
    order: delegate(),
    ticket: delegate(),
    session: delegate(),
    snackCombo: delegate(),
    movie: delegate(),
    genre: delegate(),
    room: delegate(),
    snackCombosOnOrders: delegate(),
    $connect: jest.fn(),
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation(
    (callback: (tx: typeof prisma) => Promise<unknown>) => callback(prisma),
  );
  return prisma;
}
