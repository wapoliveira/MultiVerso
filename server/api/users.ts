import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Função para hash da senha
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  switch (method) {
    case 'GET': {
      const id = getQuery(event).id as string
      if (id) {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
        })
        return user
      } else {
        const users = await prisma.user.findMany()
        return users
      }
    }

    case 'POST': {
      const body = await readBody(event)
      const { name, email, password, role } = body

      if (!name || !email || !password) {
        throw createError({
          statusCode: 400,
          message: 'Campos obrigatórios não fornecidos.',
        })
      }

      const hashedPassword = await hashPassword(password)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'user',
        },
      })

      return newUser
    }

    case 'PUT': {
      const body = await readBody(event)
      const id = getQuery(event).id as string

      if (!id || !body.name || !body.email) {
        throw createError({
          statusCode: 400,
          message: 'Campos obrigatórios não fornecidos.',
        })
      }

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          name: body.name,
          email: body.email,
          role: body.role || 'user',
        },
      })

      return updatedUser
    }

    case 'PATCH': {
      const body = await readBody(event)
      const id = getQuery(event).id as string
      const { newPassword } = body
    
      if (!id || !newPassword) {
        throw createError({
          statusCode: 400,
          message: 'ID ou nova senha não fornecidos.',
        })
      }
    
      try {
        // Verifica se o usuário existe
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
        })
    
        if (!user) {
          throw createError({
            statusCode: 404,
            message: 'Usuário não encontrado.',
          })
        }
    
        // Gera o hash da nova senha
        const hashedPassword = await hashPassword(newPassword)
    
        // Atualiza a senha no banco
        const updatedPasswordUser = await prisma.user.update({
          where: { id: Number(id) },
          data: {
            password: hashedPassword,
          },
        })
    
        return updatedPasswordUser
      } catch (error) {
        console.error('Erro ao atualizar a senha:', error)
        throw createError({
          statusCode: 500,
          message: 'Erro ao atualizar a senha.',
          details: error.message,
        })
      }
    }
    

    case 'DELETE': {
      const id = getQuery(event).id as string

      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'ID não fornecido.',
        })
      }

      const deletedUser = await prisma.user.delete({
        where: { id: Number(id) },
      })

      return deletedUser
    }

    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
  }
})
