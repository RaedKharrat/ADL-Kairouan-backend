import { PrismaClient, Role, PublishStatus, SettingGroup } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with real content...');

  // ── Super Admin ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@platform.tn' },
    update: {},
    create: {
      email: 'admin@platform.tn',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@platform.tn' },
    update: {},
    create: {
      email: 'editor@platform.tn',
      name: 'Content Editor',
      password: hashedPassword,
      role: Role.EDITOR,
      isActive: true,
    },
  });

  // ── Site Settings ─────────────────────────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'ADL Kairouan', group: SettingGroup.GENERAL, label: 'Site Name' },
    { key: 'site_tagline', value: 'Association de Développement Local', group: SettingGroup.GENERAL, label: 'Site Tagline' },
    { key: 'site_description', value: 'Une plateforme institutionnelle dédiée au développement local et à la transparence.', group: SettingGroup.GENERAL, label: 'Site Description' },
    { key: 'contact_email', value: 'contact@adlkairouan.tn', group: SettingGroup.CONTACT, label: 'Contact Email' },
    { key: 'contact_phone_tn', value: '+216 55 566 536', group: SettingGroup.CONTACT, label: 'Phone Tunisia' },
    { key: 'contact_phone_ca', value: '+1 514 712 1919', group: SettingGroup.CONTACT, label: 'Phone Canada' },
    { key: 'contact_address', value: 'Kairouan, Tunisie', group: SettingGroup.CONTACT, label: 'Address' },
    { key: 'social_facebook', value: 'https://facebook.com/adlkairouan', group: SettingGroup.SOCIAL, label: 'Facebook' },
    { key: 'social_twitter', value: 'https://twitter.com/adlkairouan', group: SettingGroup.SOCIAL, label: 'Twitter/X' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/adlkairouan', group: SettingGroup.SOCIAL, label: 'LinkedIn' },
    { key: 'social_youtube', value: 'https://youtube.com/@adlkairouan', group: SettingGroup.SOCIAL, label: 'YouTube' },
    { key: 'seo_title', value: 'ADL Kairouan — Association de Développement Local', group: SettingGroup.SEO, label: 'Default SEO Title' },
    { key: 'seo_description', value: 'ADL Kairouan œuvre pour le développement local, la transparence et la bonne gouvernance.', group: SettingGroup.SEO, label: 'Default SEO Description' },
    { key: 'footer_text', value: '© 2025 ADL Kairouan. Tous droits réservés.', group: SettingGroup.GENERAL, label: 'Footer Text' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value, group: s.group, label: s.label },
    });
  }

  // ── Hero Slides ───────────────────────────────────────────────────────────
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: [
      { 
        title: 'Bâtir l\'Avenir de Kairouan', 
        subtitle: 'Engagement, Transparence et Développement Durable pour notre communauté.', 
        ctaText: 'Nos Projets', 
        ctaLink: '/projects', 
        image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2073&auto=format&fit=crop', 
        order: 0, 
        isActive: true 
      },
      { 
        title: 'Innovation Sociale & Gouvernance', 
        subtitle: 'Des solutions concrètes pour les défis de demain.', 
        ctaText: 'En savoir plus', 
        ctaLink: '/about', 
        image: 'https://images.unsplash.com/photo-1541976590-713954a7a19b?q=80&w=2070&auto=format&fit=crop', 
        order: 1, 
        isActive: true 
      },
    ],
  });

  // ── Statistics ─────────────────────────────────────────────────────────────
  await prisma.statistic.deleteMany();
  await prisma.statistic.createMany({
    data: [
      { label: 'Projets Réalisés', value: '150', suffix: '+', icon: 'briefcase', order: 0 },
      { label: 'Partenaires', value: '45', suffix: '+', icon: 'handshake', order: 1 },
      { label: 'Bénéficiaires', value: '12', suffix: 'k', icon: 'users', order: 2 },
      { label: 'Impact Local', value: '100', suffix: '%', icon: 'trending-up', order: 3 },
    ],
  });

  // ── Project Categories ────────────────────────────────────────────────────
  const educationCat = await prisma.projectCategory.upsert({ where: { slug: 'education' }, update: {}, create: { name: 'Éducation', slug: 'education', order: 0 } });
  const infraCat = await prisma.projectCategory.upsert({ where: { slug: 'infrastructure' }, update: {}, create: { name: 'Infrastructure', slug: 'infrastructure', order: 1 } });
  const envCat = await prisma.projectCategory.upsert({ where: { slug: 'environnement' }, update: {}, create: { name: 'Environnement', slug: 'environnement', order: 2 } });
  const socialCat = await prisma.projectCategory.upsert({ where: { slug: 'social' }, update: {}, create: { name: 'Innovation Sociale', slug: 'social', order: 3 } });

  // ── Projects ─────────────────────────────────────────────────────────────
  await prisma.project.deleteMany();
  const projectsData = [
    {
      title: 'Modernisation de la Grande Mosquée de Kairouan',
      slug: 'modernisation-grande-mosquee',
      excerpt: 'Un projet de préservation du patrimoine alliant technologies modernes et architecture ancestrale.',
      content: '<p>La Grande Mosquée de Kairouan, joyau de l\'architecture islamique, bénéficie d\'un programme de modernisation de son éclairage et de ses systèmes de sécurité...</p>',
      coverImage: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?q=80&w=2070&auto=format&fit=crop',
      tags: ['Patrimoine', 'Culture', 'Kairouan'],
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      categoryId: infraCat.id,
    },
    {
      title: 'Centre d\'Innovation Numérique pour la Jeunesse',
      slug: 'centre-innovation-numerique',
      excerpt: 'Création d\'un espace de co-working et de formation aux métiers du numérique pour les jeunes diplômés.',
      content: '<p>Ce centre vise à réduire le chômage des jeunes en offrant des formations intensives en développement web, design et marketing digital...</p>',
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
      tags: ['Digital', 'Jeunesse', 'Emploi'],
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      categoryId: educationCat.id,
    },
    {
      title: 'Programme de Reboisement Urbain',
      slug: 'reboisement-urbain-kairouan',
      excerpt: 'Initiative citoyenne pour la plantation de 5000 arbres dans les quartiers périphériques de la ville.',
      content: '<p>Face aux défis climatiques, l\'ADL Kairouan lance une vaste campagne de reboisement pour améliorer la qualité de l\'air et créer des îlots de fraîcheur...</p>',
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
      tags: ['Ecologie', 'Climat', 'Ville Verte'],
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      categoryId: envCat.id,
    },
    {
      title: 'Réseau d\'Accompagnement des Artisanes',
      slug: 'accompagnement-artisanes-tapis',
      excerpt: 'Soutien aux femmes artisanes pour la commercialisation internationale du tapis de Kairouan.',
      content: '<p>Ce projet structure une coopérative de femmes artisanes, leur offrant des outils logistiques et numériques pour exporter leur savoir-faire...</p>',
      coverImage: 'https://images.unsplash.com/photo-1597484662317-9bd773ef1567?q=80&w=1974&auto=format&fit=crop',
      tags: ['Femmes', 'Artisanat', 'Commerce'],
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      categoryId: socialCat.id,
    }
  ];

  for (const p of projectsData) {
    await prisma.project.create({ data: p });
  }

  // ── Blog Categories ───────────────────────────────────────────────────────
  const newsCat = await prisma.blogCategory.upsert({ where: { slug: 'actualites' }, update: {}, create: { name: 'Actualités', slug: 'actualites' } });
  const articleCat = await prisma.blogCategory.upsert({ where: { slug: 'articles' }, update: {}, create: { name: 'Articles de Fond', slug: 'articles' } });

  // ── Blog Posts ──────────────────────────────────────────────────────────
  await prisma.blogPost.deleteMany();
  const blogPostsData = [
    {
      title: 'L\'Impact du Digital sur le Développement Local',
      slug: 'impact-digital-developpement-local',
      excerpt: 'Comment les nouvelles technologies transforment la gouvernance des régions en Tunisie.',
      content: '<p>Le numérique n\'est plus une option mais une nécessité pour une gestion transparente et efficace de nos municipalités...</p>',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: articleCat.id,
      readingTime: 6,
    },
    {
      title: 'Inauguration du nouveau centre communautaire',
      slug: 'inauguration-centre-communautaire',
      excerpt: 'Une journée historique pour les habitants du quartier El Mansoura avec l\'ouverture de cet espace.',
      content: '<p>Plus de 500 personnes ont assisté à l\'inauguration officielle du centre, en présence des autorités locales et de nos partenaires...</p>',
      coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop',
      featured: false,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: newsCat.id,
      readingTime: 3,
    },
    {
      title: 'Rapport de Transparence : Bilan du premier semestre',
      slug: 'rapport-transparence-premier-semestre',
      excerpt: 'Consultez les détails de l\'utilisation de nos fonds et l\'avancement de nos projets en cours.',
      content: '<p>Fidèle à ses engagements, l\'ADL publie aujourd\'hui son rapport financier détaillé pour la période allant de Janvier à Juin...</p>',
      coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: newsCat.id,
      readingTime: 8,
    }
  ];

  for (const b of blogPostsData) {
    await prisma.blogPost.create({ data: b });
  }

  // ── Partners ──────────────────────────────────────────────────────────────
  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: [
      { name: 'Ministère du Développement', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Coat_of_arms_of_Tunisia.svg/1200px-Coat_of_arms_of_Tunisia.svg.png', order: 0, isActive: true },
      { name: 'Banque Mondiale', logo: 'https://logos-world.net/wp-content/uploads/2021/02/World-Bank-Logo.png', website: 'https://worldbank.org', order: 1, isActive: true },
      { name: 'UNESCO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/UNESCO_logo.svg/1200px-UNESCO_logo.svg.png', website: 'https://unesco.org', order: 2, isActive: true },
      { name: 'GIZ Tunisie', logo: 'https://www.giz.de/en/images/GIZ_Logo_EN.svg', website: 'https://giz.de', order: 3, isActive: true },
      { name: 'USAID', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/USAID-Identity.svg/1200px-USAID-Identity.svg.png', website: 'https://usaid.gov', order: 4, isActive: true },
      { name: 'Orange Tunisie', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png', website: 'https://orange.tn', order: 5, isActive: true },
    ],
  });

  // ── Reports Categories ────────────────────────────────────────────────────
  const annualReportCat = await prisma.reportCategory.upsert({ where: { slug: 'rapports-annuels' }, update: {}, create: { name: 'Rapports Annuels', slug: 'rapports-annuels' } });
  const financialReportCat = await prisma.reportCategory.upsert({ where: { slug: 'bilans-financiers' }, update: {}, create: { name: 'Bilans Financiers', slug: 'bilans-financiers' } });

  // ── Reports ───────────────────────────────────────────────────────────────
  await prisma.report.deleteMany();
  await prisma.report.createMany({
    data: [
      {
        title: 'Bilan d\'Activité Annuel 2024',
        description: 'Rapport complet sur les réalisations, les défis et les perspectives pour l\'année 2024.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'PDF',
        fileSize: 1024 * 1024 * 2.5, // 2.5 MB
        year: 2024,
        published: true,
        featured: true,
        categoryId: annualReportCat.id
      },
      {
        title: 'Rapport de Transparence Financière S1 2025',
        description: 'Détails des flux financiers et de l\'utilisation des subventions pour le premier semestre 2025.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'PDF',
        fileSize: 1024 * 1024 * 1.8, // 1.8 MB
        year: 2025,
        published: true,
        featured: true,
        categoryId: financialReportCat.id
      },
      {
        title: 'Plan Stratégique Kairouan 2030',
        description: 'Vision à long terme pour le développement durable de la région de Kairouan.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'PDF',
        fileSize: 1024 * 1024 * 5.2, // 5.2 MB
        year: 2023,
        published: true,
        featured: false,
        categoryId: annualReportCat.id
      }
    ]
  });

  // ── Testimonials ──────────────────────────────────────────────────────────
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      { name: 'Mourad Trabelsi', role: 'Habitant', organization: 'Quartier El Mansoura', content: 'L\'ADL Kairouan est la seule organisation qui écoute vraiment nos besoins et agit concrètement sur le terrain.', rating: 5, featured: true, order: 0, isActive: true },
      { name: 'Samiha Gharbi', role: 'Entrepreneuse', organization: 'Start-up Kairouan', content: 'Grâce au centre d\'innovation, j\'ai pu lancer mon projet et trouver mes premiers clients. Un soutien inestimable.', rating: 5, featured: true, order: 1, isActive: true },
      { name: 'Jean Dupont', role: 'Représentant', organization: 'Partenaire International', content: 'Une rigueur et une transparence rares. C\'est un plaisir de collaborer avec une équipe aussi professionnelle.', rating: 5, featured: true, order: 2, isActive: true },
    ],
  });

  // ── FAQ ───────────────────────────────────────────────────────────────────
  await prisma.fAQ.deleteMany();
  await prisma.fAQ.createMany({
    data: [
      { question: 'Comment est financée l\'ADL Kairouan ?', answer: 'Nos fonds proviennent de subventions internationales, de partenariats publics-privés et de dons de citoyens engagés.', order: 0, isActive: true },
      { question: 'Qui peut bénéficier de vos programmes ?', answer: 'Tout habitant de la région de Kairouan, avec une priorité pour les jeunes, les femmes et les populations vulnérables.', order: 1, isActive: true },
      { question: 'Vos rapports sont-ils publics ?', answer: 'Oui, la transparence est l\'un de nos piliers. Tous nos bilans financiers sont téléchargeables sur la page Transparence.', order: 2, isActive: true },
    ],
  });

  console.log('✅ Database populated with rich content successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
