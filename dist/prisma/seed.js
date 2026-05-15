"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    await prisma.user.upsert({
        where: { email: 'admin@platform.tn' },
        update: {},
        create: {
            email: 'admin@platform.tn',
            name: 'Super Admin',
            password: hashedPassword,
            role: client_1.Role.SUPER_ADMIN,
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
            role: client_1.Role.EDITOR,
            isActive: true,
        },
    });
    const settings = [
        { key: 'site_name', value: 'ADL Kairouan', group: 'GENERAL', label: 'Site Name' },
        { key: 'site_tagline', value: 'Association de Développement Local', group: 'GENERAL', label: 'Site Tagline' },
        { key: 'site_description', value: 'Une plateforme institutionnelle dédiée au développement local et à la transparence.', group: 'GENERAL', label: 'Site Description' },
        { key: 'contact_email', value: 'contact@adlkairouan.tn', group: 'CONTACT', label: 'Contact Email' },
        { key: 'contact_phone_tn', value: '+216 55 566 536', group: 'CONTACT', label: 'Phone Tunisia' },
        { key: 'contact_phone_ca', value: '+1 514 712 1919', group: 'CONTACT', label: 'Phone Canada' },
        { key: 'contact_address', value: 'Kairouan, Tunisie', group: 'CONTACT', label: 'Address' },
        { key: 'social_facebook', value: 'https://facebook.com/adlkairouan', group: 'SOCIAL', label: 'Facebook' },
        { key: 'social_twitter', value: 'https://twitter.com/adlkairouan', group: 'SOCIAL', label: 'Twitter/X' },
        { key: 'social_linkedin', value: 'https://linkedin.com/company/adlkairouan', group: 'SOCIAL', label: 'LinkedIn' },
        { key: 'social_youtube', value: 'https://youtube.com/@adlkairouan', group: 'SOCIAL', label: 'YouTube' },
        { key: 'seo_title', value: 'ADL Kairouan — Association de Développement Local', group: 'SEO', label: 'Default SEO Title' },
        { key: 'seo_description', value: 'ADL Kairouan œuvre pour le développement local, la transparence et la bonne gouvernance.', group: 'SEO', label: 'Default SEO Description' },
        { key: 'footer_text', value: '© 2025 ADL Kairouan. Tous droits réservés.', group: 'GENERAL', label: 'Footer Text' },
    ];
    for (const s of settings) {
        await prisma.siteSetting.upsert({
            where: { key: s.key },
            update: {},
            create: { key: s.key, value: s.value, group: s.group, label: s.label },
        });
    }
    await prisma.heroSlide.createMany({
        skipDuplicates: true,
        data: [
            { title: 'Développement Local & Transparence', subtitle: 'Une organisation dédiée au progrès de notre communauté', ctaText: 'Nos Projets', ctaLink: '/projects', image: '/images/hero-1.jpg', order: 0, isActive: true },
            { title: 'Ensemble Pour Un Avenir Meilleur', subtitle: 'Rejoignez-nous dans notre mission de développement durable', ctaText: 'À Propos', ctaLink: '/about', image: '/images/hero-2.jpg', order: 1, isActive: true },
        ],
    });
    await prisma.statistic.createMany({
        skipDuplicates: true,
        data: [
            { label: 'Projets Réalisés', value: '150', suffix: '+', icon: 'briefcase', order: 0 },
            { label: 'Partenaires', value: '45', suffix: '+', icon: 'handshake', order: 1 },
            { label: 'Bénéficiaires', value: '1200', suffix: '+', icon: 'users', order: 2 },
            { label: 'Années d\'Expérience', value: '15', suffix: '+', icon: 'calendar', order: 3 },
        ],
    });
    const cats = await Promise.all([
        prisma.projectCategory.upsert({ where: { slug: 'education' }, update: {}, create: { name: 'Éducation', slug: 'education', order: 0 } }),
        prisma.projectCategory.upsert({ where: { slug: 'infrastructure' }, update: {}, create: { name: 'Infrastructure', slug: 'infrastructure', order: 1 } }),
        prisma.projectCategory.upsert({ where: { slug: 'sante' }, update: {}, create: { name: 'Santé', slug: 'sante', order: 2 } }),
        prisma.projectCategory.upsert({ where: { slug: 'environnement' }, update: {}, create: { name: 'Environnement', slug: 'environnement', order: 3 } }),
    ]);
    await prisma.project.upsert({
        where: { slug: 'renovation-ecole-primaire-kairouan' },
        update: {},
        create: {
            title: 'Rénovation École Primaire Kairouan',
            slug: 'renovation-ecole-primaire-kairouan',
            excerpt: 'Projet de rénovation complète de l\'école primaire Ibn Khaldoun incluant modernisation des salles de classe.',
            content: '<p>Ce projet vise à améliorer les conditions d\'apprentissage...</p>',
            coverImage: '/images/project-1.jpg',
            tags: ['éducation', 'rénovation', 'jeunesse'],
            featured: true,
            status: client_1.PublishStatus.PUBLISHED,
            publishedAt: new Date(),
            categoryId: cats[0].id,
            seoTitle: 'Rénovation École Primaire — ADL Kairouan',
            seoDescription: 'Découvrez notre projet de rénovation de l\'école primaire Ibn Khaldoun à Kairouan.',
        },
    });
    const blogCat = await prisma.blogCategory.upsert({
        where: { slug: 'actualites' },
        update: {},
        create: { name: 'Actualités', slug: 'actualites' },
    });
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@platform.tn' } });
    await prisma.blogPost.upsert({
        where: { slug: 'bilan-annuel-2024-adl-kairouan' },
        update: {},
        create: {
            title: 'Bilan Annuel 2024 — ADL Kairouan',
            slug: 'bilan-annuel-2024-adl-kairouan',
            excerpt: 'Retour sur une année riche en projets et en partenariats pour le développement local.',
            content: '<p>L\'année 2024 a été marquée par des réalisations importantes...</p>',
            featured: true,
            status: client_1.PublishStatus.PUBLISHED,
            publishedAt: new Date(),
            authorId: adminUser.id,
            categoryId: blogCat.id,
            readingTime: 5,
        },
    });
    await prisma.fAQ.createMany({
        skipDuplicates: true,
        data: [
            { question: 'Qu\'est-ce que l\'ADL Kairouan ?', answer: 'L\'Association de Développement Local de Kairouan est une organisation à but non lucratif...', order: 0, isActive: true },
            { question: 'Comment participer à nos projets ?', answer: 'Vous pouvez nous contacter via le formulaire de contact ou par email...', order: 1, isActive: true },
            { question: 'Comment faire un don ?', answer: 'Les dons peuvent être effectués via virement bancaire ou en ligne...', order: 2, isActive: true },
        ],
    });
    await prisma.testimonial.createMany({
        skipDuplicates: true,
        data: [
            { name: 'Ahmed Mansour', role: 'Directeur', organization: 'École Ibn Khaldoun', content: 'L\'ADL Kairouan a transformé notre école. Les enfants ont maintenant un environnement d\'apprentissage moderne.', rating: 5, featured: true, order: 0, isActive: true },
            { name: 'Fatma Ben Ali', role: 'Présidente', organization: 'Association des Femmes', content: 'Un partenariat exemplaire qui a permis d\'autonomiser des dizaines de femmes de la région.', rating: 5, featured: true, order: 1, isActive: true },
        ],
    });
    await prisma.partner.createMany({
        skipDuplicates: true,
        data: [
            { name: 'Ministère de l\'Éducation', logo: '/images/partners/moe.png', order: 0, isActive: true },
            { name: 'Union Européenne', logo: '/images/partners/eu.png', website: 'https://europa.eu', order: 1, isActive: true },
            { name: 'PNUD Tunisie', logo: '/images/partners/undp.png', website: 'https://undp.org', order: 2, isActive: true },
        ],
    });
    const reportCat = await prisma.reportCategory.upsert({
        where: { slug: 'rapport-annuel' },
        update: {},
        create: { name: 'Rapport Annuel', slug: 'rapport-annuel' },
    });
    await prisma.report.createMany({
        skipDuplicates: true,
        data: [
            { title: 'Rapport Annuel 2023', description: 'Bilan complet des activités et finances 2023', fileUrl: '/reports/rapport-2023.pdf', fileType: 'PDF', year: 2023, published: true, featured: true, categoryId: reportCat.id },
            { title: 'Rapport Annuel 2022', description: 'Bilan complet des activités et finances 2022', fileUrl: '/reports/rapport-2022.pdf', fileType: 'PDF', year: 2022, published: true, categoryId: reportCat.id },
        ],
    });
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('🔑 Admin credentials:');
    console.log('   Email:    admin@platform.tn');
    console.log('   Password: Admin@123456');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map