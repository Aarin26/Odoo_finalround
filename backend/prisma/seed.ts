import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample cities
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        name: 'Paris',
        country: 'France',
        description: 'The City of Light, famous for its art, fashion, gastronomy and culture.',
        category: 'Cultural',
        avgCost: 150
      }
    }),
    prisma.city.create({
      data: {
        name: 'Tokyo',
        country: 'Japan',
        description: 'A fascinating blend of ultramodern and traditional, offering endless discovery.',
        category: 'Modern',
        avgCost: 200
      }
    }),
    prisma.city.create({
      data: {
        name: 'New York',
        country: 'USA',
        description: 'The Big Apple, a city that never sleeps with endless entertainment options.',
        category: 'Urban',
        avgCost: 250
      }
    })
  ])

  console.log('✅ Sample cities created:', cities.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
