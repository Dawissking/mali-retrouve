import { PrismaClient, DeclarationNature } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.createMany({
    data: [
      { code: 'document', labelFr: 'Document', nature: DeclarationNature.DOCUMENT },
      { code: 'objet', labelFr: 'Objet', nature: DeclarationNature.OBJET },
    ],
    skipDuplicates: true,
  });
  console.log(`Created ${categories.count} categories`);

  const docCat = await prisma.category.findUnique({ where: { code: 'document' } });
  const objCat = await prisma.category.findUnique({ where: { code: 'objet' } });

  if (!docCat || !objCat) throw new Error('Failed to find categories');

  const domains = await prisma.domain.createMany({
    data: [
      { code: 'identite', labelFr: 'Identité', categoryId: docCat.id },
      { code: 'voyage', labelFr: 'Voyage', categoryId: docCat.id },
      { code: 'transport', labelFr: 'Transport', categoryId: docCat.id },
      { code: 'education', labelFr: 'Éducation', categoryId: docCat.id },
      { code: 'professionnel', labelFr: 'Professionnel', categoryId: docCat.id },
      { code: 'sante-assurance', labelFr: 'Santé/Assurance', categoryId: docCat.id },
      { code: 'administratif', labelFr: 'Administratif', categoryId: docCat.id },
      { code: 'personnel', labelFr: 'Personnel', categoryId: objCat.id },
    ],
    skipDuplicates: true,
  });
  console.log(`Created ${domains.count} domains`);

  const domById: Record<string, { id: string }> = {};
  for (const d of await prisma.domain.findMany({ where: { categoryId: docCat.id } })) {
    domById[d.code] = d;
  }
  for (const d of await prisma.domain.findMany({ where: { categoryId: objCat.id } })) {
    domById[d.code] = d;
  }

  const types = await prisma.type.createMany({
    data: [
      // Document / Identité
      { code: 'cni', labelFr: 'Carte Nationale d\'Identité', domainId: domById['identite'].id },
      // Document / Voyage
      { code: 'passeport', labelFr: 'Passeport', domainId: domById['voyage'].id },
      { code: 'visa', labelFr: 'Visa', domainId: domById['voyage'].id },
      // Document / Transport
      { code: 'permis-conduire', labelFr: 'Permis de conduire', domainId: domById['transport'].id },
      { code: 'carte-grise', labelFr: 'Carte grise', domainId: domById['transport'].id },
      // Document / Éducation
      { code: 'diplome', labelFr: 'Diplôme', domainId: domById['education'].id },
      { code: 'certificat-scolaire', labelFr: 'Certificat scolaire', domainId: domById['education'].id },
      // Document / Professionnel
      { code: 'carte-pro', labelFr: 'Carte professionnelle', domainId: domById['professionnel'].id },
      { code: 'badge', labelFr: 'Badge d\'accès', domainId: domById['professionnel'].id },
      // Document / Santé/Assurance
      { code: 'carte-assurance', labelFr: 'Carte d\'assurance', domainId: domById['sante-assurance'].id },
      { code: 'carte-sante', labelFr: 'Carte de santé', domainId: domById['sante-assurance'].id },
      // Document / Administratif
      { code: 'acte-naissance', labelFr: 'Acte de naissance', domainId: domById['administratif'].id },
      { code: 'facture', labelFr: 'Facture', domainId: domById['administratif'].id },
      { code: 'courrier', labelFr: 'Courrier', domainId: domById['administratif'].id },
      // Objet / Personnel
      { code: 'telephone', labelFr: 'Téléphone', domainId: domById['personnel'].id },
      { code: 'cles', labelFr: 'Clés', domainId: domById['personnel'].id },
      { code: 'montre', labelFr: 'Montre', domainId: domById['personnel'].id },
    ],
    skipDuplicates: true,
  });
  console.log(`Created ${types.count} types`);

  // Geographic data for Mali pilot regions (Bamako + Segou)
  const bamako = await prisma.region.upsert({
    where: { code: 'bam' },
    update: { labelFr: 'Bamako' },
    create: { code: 'bam', labelFr: 'Bamako (District)' },
  });

  const segou = await prisma.region.upsert({
    where: { code: 'seg' },
    update: { labelFr: 'Ségou' },
    create: { code: 'seg', labelFr: 'Ségou' },
  });
  console.log('Regions: Bamako, Ségou');

  // Cercles
  const bamakoCercle = await prisma.cercle.upsert({
    where: { regionId_code: { regionId: bamako.id, code: 'bam' } },
    update: { labelFr: 'Bamako' },
    create: { code: 'bam', labelFr: 'Bamako', regionId: bamako.id },
  });

  const segouCercle = await prisma.cercle.upsert({
    where: { regionId_code: { regionId: segou.id, code: 'seg' } },
    update: { labelFr: 'Ségou' },
    create: { code: 'seg', labelFr: 'Ségou', regionId: segou.id },
  });

  // Communes
  const bamakoCommune = await prisma.commune.upsert({
    where: { cercleId_code: { cercleId: bamakoCercle.id, code: 'bam' } },
    update: { labelFr: 'Bamako' },
    create: { code: 'bam', labelFr: 'Bamako', cercleId: bamakoCercle.id },
  });

  const segouCommune = await prisma.commune.upsert({
    where: { cercleId_code: { cercleId: segouCercle.id, code: 'seg' } },
    update: { labelFr: 'Ségou' },
    create: { code: 'seg', labelFr: 'Ségou', cercleId: segouCercle.id },
  });
  console.log('Cercles and Communes seeded');

  // System policies
  await prisma.systemPolicy.createMany({
    data: [
      {
        key: 'matching_thresholds',
        value: {
          high: 80,
          low: 50,
          maxCandidates: 10,
          timeWindowDays: 60,
        },
        description: 'Matching score thresholds for declaration matching',
      },
      {
        key: 'declaration_retention',
        value: { activeDays: 365, archivedDays: 1095 },
        description: 'Declaration retention policy (active + archived)',
      },
      {
        key: 'photo_retention',
        value: { postRestitutionDays: 90, gracePeriodDays: 30 },
        description: 'Photo retention after restitution',
      },
    ],
    skipDuplicates: true,
  });
  console.log('System policies seeded');

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
