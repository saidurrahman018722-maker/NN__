import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newCharacters = [
  { name: 'phantom', class_type: 'Specialist', description: 'A mysterious assassin who stalks the shadows.' },
  { name: 'skadi', class_type: 'Guard', description: 'A bounty hunter with immense strength from the ocean.' },
  { name: 'kal\'tsit', class_type: 'Medic', description: 'A brilliant doctor accompanied by a spine-chilling summon.' },
  { name: 'w', class_type: 'Sniper', description: 'A volatile mercenary with a penchant for explosives.' },
  { name: 'nian', class_type: 'Defender', description: 'A casual blacksmith who happens to be a living myth.' },
  { name: 'mudrock', class_type: 'Defender', description: 'A formidable warrior clad in heavy armor.' },
  { name: 'eyjafjalla', class_type: 'Caster', description: 'A gifted vulcanologist dealing devastating Arts damage.' },
  { name: 'saria', class_type: 'Defender', description: 'A steadfast protector with potent healing capabilities.' },
  { name: 'ifrit', class_type: 'Caster', description: 'A fiery combatant who burns everything in a straight line.' },
  { name: 'hoshiguma', class_type: 'Defender', description: 'A stalwart shield of the L.G.D.' },
];

async function main() {
  console.log('Seeding new characters...');
  for (const char of newCharacters) {
    await prisma.character.upsert({
      where: { name: char.name },
      update: {},
      create: char,
    });
  }
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
