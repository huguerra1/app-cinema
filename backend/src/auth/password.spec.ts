import { hashPassword, verifyPassword } from './password';

describe('Senhas', () => {
  it('gera scrypt com salt aleatório de 16 bytes e hash de 64 bytes', async () => {
    const first = await hashPassword('minha-senha');
    const second = await hashPassword('minha-senha');
    expect(first).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    expect(first).not.toBe(second);
    await expect(verifyPassword('minha-senha', first)).resolves.toBe(true);
    await expect(verifyPassword('outra-senha', first)).resolves.toBe(false);
    await expect(verifyPassword('', first)).resolves.toBe(false);
  });

  it('compara senhas legadas, inclusive Unicode e comprimentos diferentes', async () => {
    await expect(verifyPassword('sênha🔑', 'sênha🔑')).resolves.toBe(true);
    await expect(verifyPassword('sênha', 'sênha🔑')).resolves.toBe(false);
    await expect(verifyPassword('errada', 'correta')).resolves.toBe(false);
  });

  it.each([
    'scrypt$',
    'scrypt$zz$ff',
    'scrypt$' + 'a'.repeat(32) + '$' + 'b'.repeat(126),
    'scrypt$' + 'a'.repeat(32) + '$' + 'b'.repeat(128) + '$extra',
  ])(
    'rejeita hash malformado sem tentar autenticação legada: %s',
    async (value) => {
      await expect(verifyPassword(value, value)).resolves.toBe(false);
    },
  );
});
