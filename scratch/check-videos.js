const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany();
  console.log('Videos in DB:', videos.map(v => ({ id: v.id, title: v.title, duration: v.duration })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
