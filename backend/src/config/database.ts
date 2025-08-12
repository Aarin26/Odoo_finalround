import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

export { prisma }
