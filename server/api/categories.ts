import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fetchCategory = async (id?: string | number) => {
  if (id) {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        news: {
          where: { status: 'approved' }, // Filtra para incluir apenas as notícias aprovadas
        },
      },
    });
    return category;
  } else {
    const categories = await prisma.category.findMany({
      include: {
        news: {
          where: { status: 'approved' }, // Filtra para incluir apenas as notícias aprovadas
        },
      },
    });
    return categories;
  }
};

const fetchCategoryLastNews = async () => {
  const category = await prisma.category.findMany({
    include: {
      news: {
        where: { status: 'approved' },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  })
  return category;
}

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const query = getQuery(event)
  const id = query.id
  const lastNews = query.lastNews

  switch (method) {
    case 'GET': {
      if (lastNews) {
        return await fetchCategoryLastNews(); 
      }

      if (id) {
        return await fetchCategory(id);
      } else {
        return await fetchCategory();
      }
    }

    case 'POST': {
      const body = await readBody(event)
      const newCategory = await prisma.category.create({
        data: {
          name: body.name,
        },
      })
      return newCategory
    }

    case 'PUT': {
      const body = await readBody(event)
      const id = query.id as string

      if (!id || !body.name) {
        throw createError({
          statusCode: 400,
          message: 'ID ou nome da categoria não fornecido.',
        })
      }

      const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: {
          name: body.name,
        },
      })

      return updatedCategory
    }

    case 'DELETE': {
      const id = query.id as string

      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'ID não fornecido.',
        })
      }

      const deletedCategory = await prisma.category.delete({
        where: { id: Number(id) },
      })
      return deletedCategory
    }

    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
  }
})
function async() {
  throw new Error('Function not implemented.');
}

