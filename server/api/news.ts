import { defineEventHandler, getQuery, readBody, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Função para buscar a notícia mais recente
 */
const fetchLatestNews = async () => {
  console.log('Fetching the most recent news');
  return await prisma.news.findFirst({
    where: { status: 'approved' },
    orderBy: {
      createdAt: 'desc', // Ordena pela data de criação mais recente
    },
    include: {
      category: true,
      user: true,
    },
  });
};

/**
 * Função para buscar as 4 últimas notícias
 */
const fetchLatestFourNews = async () => {
  console.log('Fetching the 4 most recent news');
  return await prisma.news.findMany({
    where: { status: 'approved' },
    orderBy: {
      createdAt: 'desc', // Ordena pela data de criação mais recente
    },
    take: 4, // Limita a 4 notícias
    include: {
      category: true,
      user: true,
    },
  });
};

const fetchLatestTwoNews = async () => {
  console.log('Fetching the 2 most recent news');
  return await prisma.news.findMany({
    where: { status: 'approved' },
    orderBy: {
      createdAt: 'asc', // Ordena pela data de criação mais recente
    },
    take: 2, // Limita a 4 notícias
    include: {
      category: true,
      user: true,
    },
  });
};

const fetchLatestThreeNews = async () => {
  console.log('Fetching the 3 most recent news');
  return await prisma.news.findMany({
    where: { status: 'approved' },
    orderBy: {
      createdAt: 'desc', // Ordena pela data de criação mais recente
    },
    take: 3, // Limita a 4 notícias
    include: {
      category: true,
      user: true,
    },
  });
};

const fetchLatestSixNews = async () => {
  return await prisma.news.findMany({
    where: { status: 'approved' }, // Filtra as notícias aprovadas
    take: 6, // Limita a 6 notícias
    include: {
      category: true,
      user: true,
    },
  });
};

/**
 * Função para registrar um acesso na tabela ViewNews
 */
const logViewNews = async (newsId: number) => {
  console.log(`Logging view for news ID: ${newsId}`);
  // Verifique se o newsId existe na tabela de notícias
  const newsExists = await prisma.news.findUnique({
    where: { id: newsId },
  });

  if (!newsExists) {
    throw new Error(`News with ID ${newsId} does not exist`);
  }

  return await prisma.viewNews.create({
    data: {
      newsId,
      // outros campos que precisar passar
    },
  });
};

/**
 * Função para buscar as 4 notícias mais acessadas
 */
const fetchMostViewedNews = async () => {
  console.log('Fetching the 4 most viewed news');

  // Contar o número de visualizações de cada notícia
  const mostViewed = await prisma.viewNews.groupBy({
    by: ['newsId'], // Agrupar pelas notícias
    _count: {
      newsId: true, // Contar o número de visualizações
    },
    orderBy: {
      _count: {
        newsId: 'desc', // Ordena pelas visualizações mais altas
      },
    },
    take: 4, // Limita a 4 notícias
  });

  // Extrair os IDs das notícias mais vistas
  const newsIds = mostViewed.map((view) => view.newsId);

  // Buscar as notícias correspondentes
  const mostViewedNews = await prisma.news.findMany({
    where: {
      id: { in: newsIds },
      status: 'approved',
    },
    include: {
      category: true,
      user: true,
    },
  });

  // Ordenar as notícias na mesma ordem de visualizações
  const orderedNews = newsIds.map(
    (id) => mostViewedNews.find((news) => news.id === id)
  );

  return orderedNews;
};


/**
 * Função para buscar uma notícia específica ou todas as notícias
 */
const fetchNews = async (id?: string | number) => {
  if (id) {
    console.log(`Fetching news with ID: ${id}`);
    const newsItem = await prisma.news.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        user: true,
        comments: true,
      },
    });

    if (!newsItem) {
      throw new Error(`News item with ID ${id} not found.`);
    }

    // Registra o acesso à notícia na tabela ViewNews
    await logViewNews(Number(id));

    return newsItem;
  } else {
    console.log('Fetching all news items');
    return await prisma.news.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }
};

const fetchNewsByUser = async (id?: string | number) => {
  if (id) {
    console.log(`Fetching news with ID: ${id}`);
    const newsItem = await prisma.news.findMany({
      where: { userId: Number(id) },
      include: {
        category: true,
        user: true,
        comments: true,
      },
    });

    if (!newsItem) {
      throw new Error(`News item with ID ${id} not found.`);
    }

    // Registra o acesso à notícia na tabela ViewNews
    // await logViewNews(Number(id));

    return newsItem;
  } else {
    console.log('Fetching all news items');
    return await prisma.news.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }
};

const fetchRandomSixNews = async () => {

  return await prisma.$queryRaw`
    SELECT *
    FROM News
    WHERE status = 'approved'
    ORDER BY RAND()
    LIMIT 6
  `;
};

const fetchRandomFourNews = async () => {

  return await prisma.$queryRaw`
    SELECT *
    FROM News
    WHERE status = 'approved'
    ORDER BY RAND()
    LIMIT 4
  `;
};

const fetchRandomTreeNews = async () => {
  return await prisma.$queryRaw`
    SELECT *
    FROM News
    WHERE status = 'approved'
    ORDER BY RAND()
    LIMIT 3
  `;
};

const fetchRandomTwoNews = async () => {
  return await prisma.$queryRaw`
    SELECT *
    FROM News
    WHERE status = 'approved'
    ORDER BY RAND()
    LIMIT 2
  `;
};


export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    const query = getQuery(event);
    const id = query.id;
    const user_id = query.user_id;
    const latest = query.latest;
    const randomSix = query.randomSix;
    const randomFour = query.randomFour;
    const randomTree = query.randomTree;
    const randomTwo = query.randomTwo;
    const latestTwo = query.latestTwo;
    const latestTree = query.latestTree;
    const latestFour = query.latestFour;
    const latestSix = query.latestSix;
    const mostViewed = query.mostViewed; // Nova query para buscar as mais visualizadas

    switch (method) {
      case 'GET':
        // Verifica se a rota é para a notícia mais recente
        if (latest) {
          console.log(latest);
          return await fetchLatestNews(); // Retorna a notícia mais recente
        }

        if (latestTwo) {
          return await fetchLatestTwoNews();
        }

        if (latestTree) {
          return await fetchLatestThreeNews();
        }

        // Verifica se a rota é para as 4 últimas notícias
        if (latestFour) {
          console.log(latestFour);
          return await fetchLatestFourNews(); // Retorna as 4 últimas notícias
        }

        if (latestSix) {
          console.log(latestSix);
          return await fetchLatestSixNews(); // Retorna as 4 últimas notícias
        }

        // Verifica se a rota é para as 4 notícias mais acessadas
        if (mostViewed) {
          console.log(mostViewed);
          return await fetchMostViewedNews(); // Retorna as 4 notícias mais acessadas
        }
        if (randomSix) {
          return await fetchRandomSixNews(); // Retorna 6 notícias aleatórias
        }

        if (randomFour) {
          return await fetchRandomFourNews(); // Retorna 4 notícias aleatórias
        }

        if (randomTree) {
          return await fetchRandomTreeNews(); // Retorna 3 notícias aleatórias
        }

        if (randomTwo) {
          return await fetchRandomTwoNews(); // Retorna 2 notícias aleatórias
        }

        if (user_id) {
          return await fetchNewsByUser(user_id); // Retorna uma notícia específica e registra o acesso
        }

        // Caso contrário, busca a notícia por ID ou todas as notícias
        if (id) {
          return await fetchNews(id); // Retorna uma notícia específica e registra o acesso
        } else {
          return await fetchNews(); // Retorna todas as notícias
        }

      case 'POST': {
        const newNewsData = await readBody(event);

        return await prisma.news.create({
          data: {
            title: newNewsData.title,
            content: newNewsData.content,
            image: newNewsData.image,
            status: newNewsData.status ?? 'pending',
            categoryId: Number(newNewsData.categoryId),
            userId: Number(newNewsData.userId),
          },
        });
      }

      case 'PUT': {
        if (!id) {
          throw createError({
            statusCode: 400,
            message: 'ID da notícia não fornecido.',
          });
        }

        const body = await readBody(event);

        // Atualiza a notícia no banco de dados
        const updatedNews = await prisma.news.update({
          where: { id: Number(id) },
          data: {
            title: body.title,
            content: body.content,
            image: body.image,
            status: body.status,
            categoryId: Number(body.categoryId),
            userId: Number(body.userId),
          },
        });

        // Retorna a notícia atualizada
        return updatedNews;
      }

      case 'DELETE': {
        // Primeiro, exclui as entradas relacionadas na tabela viewNews
        await prisma.viewNews.deleteMany({
          where: { newsId: Number(id) },
        });
      
        // Agora, exclui a notícia
        const deletedNews = await prisma.news.delete({
          where: { id: Number(id) },
        });
      
        return deletedNews;
      }
      

      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  } catch (error: unknown) {
    console.error('Handler error:', error);
    return {
      error: true,
      message: (error as Error).message || 'An unexpected error occurred.',
    };
  }
});
