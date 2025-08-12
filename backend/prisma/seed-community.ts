import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding community data...')

  // Create demo users for community trips
  const users = [
    {
      email: 'sarah.traveler@email.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      password: 'demo123'
    },
    {
      email: 'mike.adventurer@email.com',
      firstName: 'Mike',
      lastName: 'Chen',
      password: 'demo123'
    },
    {
      email: 'emma.explorer@email.com',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      password: 'demo123'
    },
    {
      email: 'alex.backpacker@email.com',
      firstName: 'Alex',
      lastName: 'Thompson',
      password: 'demo123'
    },
    {
      email: 'lisa.culture@email.com',
      firstName: 'Lisa',
      lastName: 'Wang',
      password: 'demo123'
    }
  ]

  const createdUsers = []
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        role: 'USER'
      }
    })
    createdUsers.push(user)
    console.log(`✅ Created user: ${user.firstName} ${user.lastName}`)
  }

  // Create sample community trips
  const sampleTrips = [
    {
      name: 'Paris Cultural Immersion',
      description: 'A week-long journey through the heart of French culture, art, and cuisine. From the Louvre to hidden bistros, experience Paris like a local.',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      budget: 2800,
      isPublic: true,
      userId: createdUsers[0].id
    },
    {
      name: 'Tokyo Tech & Tradition',
      description: 'Explore the perfect blend of cutting-edge technology and ancient traditions. From Shibuya crossing to serene temples, discover Japan\'s dual nature.',
      startDate: new Date('2024-07-20'),
      endDate: new Date('2024-07-28'),
      budget: 3200,
      isPublic: true,
      userId: createdUsers[1].id
    },
    {
      name: 'Bali Wellness Retreat',
      description: 'Recharge your soul with yoga, meditation, and beach therapy. Experience the spiritual side of Bali while enjoying pristine beaches and rice terraces.',
      startDate: new Date('2024-08-05'),
      endDate: new Date('2024-08-15'),
      budget: 1900,
      isPublic: true,
      userId: createdUsers[2].id
    },
    {
      name: 'New York City Adventure',
      description: 'The ultimate urban exploration! Broadway shows, Central Park walks, and iconic landmarks. Experience the city that never sleeps.',
      startDate: new Date('2024-09-10'),
      endDate: new Date('2024-09-17'),
      budget: 3000,
      isPublic: true,
      userId: createdUsers[3].id
    },
    {
      name: 'Santorini Romantic Escape',
      description: 'Picture-perfect sunsets, white-washed buildings, and crystal-clear waters. The perfect romantic getaway in the Greek islands.',
      startDate: new Date('2024-10-15'),
      endDate: new Date('2024-10-22'),
      budget: 2500,
      isPublic: true,
      userId: createdUsers[4].id
    },
    {
      name: 'Machu Picchu Trek',
      description: 'An unforgettable adventure through the Andes to the ancient Incan citadel. Experience the magic of Peru\'s most iconic destination.',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-10'),
      budget: 2200,
      isPublic: true,
      userId: createdUsers[0].id
    },
    {
      name: 'Iceland Northern Lights',
      description: 'Chase the aurora borealis across Iceland\'s dramatic landscapes. From glaciers to hot springs, experience nature\'s most spectacular light show.',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-08'),
      budget: 2800,
      isPublic: true,
      userId: createdUsers[1].id
    },
    {
      name: 'Thailand Food Journey',
      description: 'A culinary adventure through Thailand\'s diverse regions. From street food in Bangkok to cooking classes in Chiang Mai.',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-25'),
      budget: 1600,
      isPublic: true,
      userId: createdUsers[2].id
    }
  ]

  const createdTrips = []
  for (const tripData of sampleTrips) {
    const trip = await prisma.trip.create({
      data: tripData
    })
    createdTrips.push(trip)
    console.log(`✅ Created trip: ${trip.name}`)
  }

  // Create sample reviews for each trip
  const sampleReviews = [
    {
      content: 'Absolutely incredible experience! The itinerary was perfectly planned and we saw all the highlights. The local recommendations were spot on, especially the hidden bistros in Montmartre. Highly recommend this trip!',
      userId: createdUsers[1].id
    },
    {
      content: 'This trip exceeded all expectations! The blend of technology and tradition was fascinating. The food was amazing and the people were so welcoming. Can\'t wait to go back to Japan!',
      userId: createdUsers[2].id
    },
    {
      content: 'Perfect balance of adventure and relaxation. The yoga sessions at sunrise were magical, and the rice terrace hikes were breathtaking. Bali truly is paradise on earth.',
      userId: createdUsers[3].id
    },
    {
      content: 'What an amazing city! Broadway was incredible, Central Park was beautiful, and the food scene is unmatched. This trip gave us the perfect NYC experience.',
      userId: createdUsers[4].id
    },
    {
      content: 'Romantic doesn\'t even begin to describe this place. The sunsets are like nothing I\'ve ever seen. The hotels were perfect and the food was delicious. Perfect honeymoon destination!',
      userId: createdUsers[0].id
    },
    {
      content: 'The trek was challenging but absolutely worth it! The views of Machu Picchu at sunrise were unforgettable. Our guide was knowledgeable and the group was great. Highly recommend for adventure seekers!',
      userId: createdUsers[1].id
    },
    {
      content: 'The northern lights were spectacular! Even when they weren\'t visible, Iceland\'s landscapes were breathtaking. The hot springs were a perfect way to relax after long days of exploring.',
      userId: createdUsers[2].id
    },
    {
      content: 'Food heaven! Every meal was better than the last. The cooking classes were fun and educational. Thailand\'s hospitality is unmatched. Can\'t wait to recreate these dishes at home!',
      userId: createdUsers[3].id
    }
  ]

  // Add multiple reviews per trip
  for (let i = 0; i < createdTrips.length; i++) {
    const trip = createdTrips[i]
    
    // Add the main review
    await prisma.comment.create({
      data: {
        content: sampleReviews[i].content,
        userId: sampleReviews[i].userId,
        tripId: trip.id
      }
    })

    // Add additional reviews from other users
    const additionalReviews = [
      'Great planning and execution. Will definitely use this platform again!',
      'Amazing memories made on this trip. The local insights were invaluable.',
      'Perfect timing and weather. Everything went smoothly from start to finish.',
      'The cultural experiences were authentic and meaningful. Highly recommend!',
      'Beautiful destinations and great company. This trip had it all!'
    ]

    for (let j = 0; j < 3; j++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
      const randomReview = additionalReviews[Math.floor(Math.random() * additionalReviews.length)]
      
      await prisma.comment.create({
        data: {
          content: randomReview,
          userId: randomUser.id,
          tripId: trip.id
        }
      })
    }
  }

  console.log(`✅ Created ${createdTrips.length} sample trips`)
  console.log(`✅ Created multiple reviews for each trip`)
  console.log('\n🎉 Community data seeding completed!')
  console.log('\n📱 Demo Credentials for all users:')
  console.log('   Password: demo123')
  console.log('\n🌍 Sample Trips Available:')
  createdTrips.forEach(trip => {
    console.log(`   - ${trip.name} (${trip.budget}$)`)
  })
  console.log('\n💬 Each trip has multiple reviews from the community!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
