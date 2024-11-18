import { defineEventHandler, readBody, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Certifique-se de ter bcrypt instalado para verificar a senha

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email e senha são obrigatórios.',
    });
  }

  try {
    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Usuário não encontrado.',
      });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Senha inválida.',
      });
    }

    // Remove a senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;

    // Retorna os dados do usuário sem a senha
    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error: unknown) {
    const customError = error instanceof Error ? error : new Error('Erro interno do servidor');
    throw createError({
      statusCode: 'statusCode' in customError ? (customError as any).statusCode : 500,
      message: customError.message,
    });
  }
});
