import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.note.deleteMany();

  // Create dummy data
  await prisma.note.createMany({
    data: [
      {
        title: 'Next.js Development Tips',
        content: `# Next.js Development Best Practices

1. Use Server Components when possible
2. Implement proper error boundaries
3. Optimize images with next/image
4. Leverage API routes effectively

These practices help create more efficient and maintainable applications.`,
        tags: ['Next.js', 'Development', 'Web'],
      },
      {
        title: 'GraphQL vs REST',
        content: `# Comparing GraphQL and REST APIs

GraphQL:
- Single endpoint
- Client-specified data
- Reduced over-fetching
- Built-in documentation

REST:
- Multiple endpoints
- Server-defined responses
- Simpler caching
- Widely adopted`,
        tags: ['API', 'GraphQL', 'REST', 'Development'],
      },
      {
        title: 'TypeScript Tips',
        content: `# Essential TypeScript Tips

1. Use strict mode
2. Leverage type inference
3. Implement proper interfaces
4. Utilize utility types

TypeScript enhances code quality and developer experience.`,
        tags: ['TypeScript', 'Development', 'Programming'],
      },
    ],
  });

  console.log('✅ Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
