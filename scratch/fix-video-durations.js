const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany();
  const durations = ['04:20', '02:15', '03:50', '05:10'];
  
  for (let i = 0; i < videos.length; i++) {
    await prisma.video.update({
      where: { id: videos[i].id },
      data: { duration: durations[i % durations.length] }
    });
  }
  console.log('Updated', videos.length, 'videos with mock durations.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
