import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const characters = [
  {
    name: 'amiya',
    class_type: 'Caster',
    description: `Amiya is the public face and primary leader of Rhodes Island. Despite her young appearance as a Cautus, she carries the immense burden of leadership and the legacy of the Lord of Fiends. 
    
**Lore & Standing:** She is the core of Rhodes Island's operations, guiding the organization's efforts to cure Oripathy and resolve conflicts across Terra. 
**Relationship with the Doctor:** Amiya shares a deeply profound and loyal bond with the Doctor. She views the Doctor not only as Rhodes Island's greatest tactician but also as a mentor and the most important person in her life, having rescued the Doctor from Chernobog. 
**Backstory:** Her past is shrouded in the mystery of the Sarkaz King's legacy, having inherited a unique and devastating power. She relentlessly pursues peace, bearing the emotional and physical toll of her responsibilities.`,
  },
  {
    name: 'ch\'en',
    class_type: 'Guard',
    description: `Ch'en is the former Head of the Lungmen Guard Department's Special Inspection Unit and a prominent Lung figure. 

**Lore & Standing:** Known for her strict discipline and unparalleled swordsmanship, she was instrumental in defending Lungmen during the Reunion crisis. She later parted ways with Lungmen to join Rhodes Island as a cooperating operator. 
**Relationship with the Doctor:** Initially skeptical and highly critical of the Doctor's methods during the Lungmen incidents, her respect for the Doctor grew significantly over time as they fought side by side. She now relies on the Doctor's strategic brilliance. 
**Backstory:** Born into the prestigious Lungmen nobility but raised amidst political turmoil, her complex relationship with her half-sister, Talulah, shaped much of her tragic past. She wields the legendary sword Chi Xiao, symbolizing her resolve.`,
  },
  {
    name: 'exusiai',
    class_type: 'Sniper',
    description: `Exusiai is a cheerful and hyperactive Sankta from Laterano, currently employed as an elite marksman for Penguin Logistics. 

**Lore & Standing:** She is famous for her rapid-fire Originium firearms and her unwavering love for apple pie. As a key member of Penguin Logistics, she frequently collaborates with Rhodes Island on high-risk transport and combat missions. 
**Relationship with the Doctor:** Exusiai considers the Doctor a great friend and an excellent "boss" on the battlefield. She is always eager to show off her skills and bring a positive, upbeat energy to the Doctor's operations. 
**Backstory:** While seemingly carefree, she carries the complex religious and political burdens of her Laterano heritage. She left her homeland to seek freedom and perhaps find answers regarding her fallen comrade, but chooses to face the world with a bright smile.`,
  },
  {
    name: 'lappland',
    class_type: 'Guard',
    description: `Lappland is a dangerous and unpredictable Lupo from Siracusa, known for her terrifying combat prowess and unstable mental state.

**Lore & Standing:** She operates as a specialist for Rhodes Island, though her methods are often solitary and extreme. Her combat style involves suppressing enemies' Arts abilities, making her a lethal asset. 
**Relationship with the Doctor:** Lappland views the Doctor with a mix of curiosity and amusement. She obeys the Doctor's commands as long as they provide her with entertaining and challenging battles, seeing the Doctor as an intriguing figure who can direct her chaos. 
**Backstory:** Once a member of the powerful Saluzzo Mafia family in Siracusa, a traumatic past event—heavily tied to Texas—left her infected and mentally scarred. Her obsession with Texas remains a driving force in her erratic life.`,
  },
  {
    name: 'logos',
    class_type: 'Caster',
    description: `Logos is a legendary elite operator of Rhodes Island and a young Banshee of the Sarkaz Royal Court.

**Lore & Standing:** As a Banshee Lord, he possesses terrifying and ancient word-based Arts. He is one of the most powerful and respected figures within Rhodes Island, often undertaking the most critical and secretive missions. 
**Relationship with the Doctor:** Logos respects the Doctor immensely, recognizing the Doctor's unparalleled tactical mind as a necessary counterpart to his own overwhelming power. They share a quiet, mutual understanding forged in the fires of Terra's worst conflicts. 
**Backstory:** Inheriting the burden of the Banshee lineage, Logos broke away from the traditional Sarkaz paths of endless war to follow Theresa and later Amiya. He writes in his journal constantly, observing the world with a melancholic yet hopeful wisdom.`,
  },
  {
    name: 'myrtle',
    class_type: 'Vanguard',
    description: `Myrtle is a Durin hailing from the underground city of Durin, known for her bright personality and her golden tablecloth flag.

**Lore & Standing:** Despite her small stature and lack of combat aggression, she is arguably one of the most vital operators in Rhodes Island's tactical formations, renowned for her unparalleled ability to rapidly generate deployment resources (DP). 
**Relationship with the Doctor:** She treats the Doctor with friendly casualness, often inviting them to nap or slack off with her. The Doctor, in turn, relies on her as the indispensable opener for almost every major operation. 
**Backstory:** She left the subterranean world out of sheer curiosity and a desire for adventure. While she may seem like she's just waving a tablecloth around on the battlefield, her presence inspires allies and single-handedly shifts the momentum of battle.`,
  },
  {
    name: 'silverash',
    class_type: 'Guard',
    description: `SilverAsh (Enciodes Silverash) is the warlord of Kjerag and the CEO of Karlan Commercial. 

**Lore & Standing:** A visionary and ruthless tactician, he dragged the isolationist nation of Kjerag into the modern era through sheer will, political maneuvering, and military might. He is a formidable ally and a dangerous potential adversary. 
**Relationship with the Doctor:** SilverAsh considers the Doctor to be his only true intellectual equal on Terra. Their relationship is a complex game of 4D chess, built on immense mutual respect and a constant, polite power struggle. He frequently attempts to recruit the Doctor to his side. 
**Backstory:** After his parents were assassinated by political rivals, he studied in Victoria, returning to Kjerag to execute a long, masterful plan of revenge and reform. He sacrificed his relationship with his sisters, Pramanix and Cliffheart, for the sake of his nation's future.`,
  },
  {
    name: 'surtr',
    class_type: 'Guard',
    description: `Surtr is an enigmatic Sarkaz woman possessing a terrifyingly powerful giant fiery sword.

**Lore & Standing:** She is an immensely destructive force on the battlefield, capable of melting through almost any defense. However, she suffers from severe memory loss, holding only fragmented memories of various places across Terra. 
**Relationship with the Doctor:** Surtr is aloof and easily annoyed, but she tolerates the Doctor because Rhodes Island provides her with ice cream and leads her to places that might trigger her lost memories. The Doctor directs her overwhelming power with precision. 
**Backstory:** Her past is a complete void, save for the giant, sentient molten sword she wields. She wanders Terra in a continuous search for her own identity, guided only by inexplicable flashes of memory and a love for sweet things.`,
  },
  {
    name: 'texas',
    class_type: 'Vanguard',
    description: `Texas is a taciturn Lupo and a core delivery driver for Penguin Logistics.

**Lore & Standing:** Cool, calm, and collected, she is a master of dual-wielding swords and crowd control. She is the reliable anchor of the often chaotic Penguin Logistics crew. 
**Relationship with the Doctor:** She has a professional and quiet respect for the Doctor. She prefers not to talk much, letting her swift and efficient actions on the battlefield speak for her. The Doctor relies heavily on her quick strikes and tactical stuns. 
**Backstory:** Originally a scion of the fallen Texas Mafia family in Siracusa, she abandoned her violent past and family legacy to start a quiet life in Lungmen. However, her past—and Lappland—continue to haunt her, forcing her to occasionally unsheathe her blades in earnest.`,
  },
  {
    name: 'thorns',
    class_type: 'Guard',
    description: `Thorns is an Aegir operator and a dedicated, if somewhat eccentric, swordsman and pharmacist.

**Lore & Standing:** Known for his creation of the "Destreza" combat art, which combines Iberian swordsmanship with potent, self-made neurotoxins. He is a pragmatic and highly effective combatant for Rhodes Island. 
**Relationship with the Doctor:** Thorns respects the Doctor's strategic acumen and often discusses chemical and tactical theories with them. Their relationship is built on a foundation of professional curiosity and shared scientific interests. 
**Backstory:** Hailing from Iberia, he witnessed the decay of his homeland under the threat of the Seaborn and the Inquisition. He trained rigorously to survive, developing a combat style that is brutal, highly calculated, and designed for prolonged survival in harsh environments.`,
  }
];

async function main() {
  console.log('Start seeding...');
  for (const c of characters) {
    const character = await prisma.character.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    });
    console.log(`Upserted character: \${character.name}`);
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
