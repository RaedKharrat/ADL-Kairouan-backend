"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
const prisma_service_1 = require("../../prisma/prisma.service");
let ChatbotService = class ChatbotService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    onModuleInit() {
        this.initModel();
    }
    initModel() {
        if (this.ai)
            return;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('GEMINI_API_KEY is not defined. Chatbot will not work.');
            return;
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
    }
    async generateResponse(message, history = []) {
        this.initModel();
        if (!this.ai) {
            return "Le service d'assistance IA est actuellement en maintenance (clé API manquante). Veuillez réessayer plus tard.";
        }
        const [projects, stats, rawSettings] = await Promise.all([
            this.prisma.project.findMany({ where: { status: 'PUBLISHED', deletedAt: null }, take: 5, select: { title: true, slug: true, excerpt: true } }),
            this.prisma.statistic.findMany({ where: { isActive: true }, take: 4 }),
            this.prisma.siteSetting.findMany({
                where: { group: { in: ['GENERAL', 'SOCIAL', 'CONTACT'] } },
            }),
        ]);
        const settings = Object.fromEntries(rawSettings.map((s) => [s.key, s.value]));
        const contextPrompt = `
      Tu es l'assistant IA officiel de l'ADL Kairouan (Association de Développement Local). 
      Ton but est d'aider les citoyens, partenaires et visiteurs à comprendre nos actions et à naviguer sur la plateforme.
      
      CONTEXTE ACTUEL DE LA PLATEFORME :
      - Nom du site : ${settings.siteName || 'ADL Kairouan'}
      - Description : ${settings.siteDescription || 'Vision Urbaine 2030'}
      - Projets récents : ${projects.map((p) => `${p.title} (Lien: /projects/${p.slug})`).join(', ')}
      - Chiffres clés : ${stats.map((s) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ')}
      - Contact : ${settings.contactEmail || 'contact@adl-kairouan.tn'}, ${settings.contactPhone || '+216 55 566 536'}

      DIRECTIVES :
      1. Sois professionnel, courtois et institutionnel.
      2. Réponds en français (ou dans la langue de l'utilisateur si approprié).
      3. Donne des liens vers la plateforme quand c'est pertinent (ex: /projects, /reports, /contact).
      4. Si on te demande "Quoi de neuf ?", parle des projets récents listés ci-dessus.
      5. Ne parle jamais de politique partisane ou de sujets hors sujet à l'ADL.
      6. Garde tes réponses concises et structurées.
    `;
        try {
            const formattedHistory = (history || []).map(h => ({
                role: h.role === 'model' ? 'model' : 'user',
                parts: h.parts || [{ text: h.content }]
            }));
            const response = await this.ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    { role: 'user', parts: [{ text: `Instructions Système: ${contextPrompt}` }] },
                    { role: 'model', parts: [{ text: "Compris. Je suis prêt à assister les utilisateurs en tant qu'assistant officiel de l'ADL Kairouan." }] },
                    ...formattedHistory,
                    { role: 'user', parts: [{ text: message }] }
                ]
            });
            return response.text || "Désolé, je n'ai pas pu générer de réponse.";
        }
        catch (error) {
            console.error('Gemini Error:', error);
            return "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer dans quelques instants.";
        }
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map