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
var ChatbotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const prisma_service_1 = require("../../prisma/prisma.service");
let ChatbotService = ChatbotService_1 = class ChatbotService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChatbotService_1.name);
    }
    onModuleInit() {
        this.initModel();
    }
    initModel() {
        if (this.genAI)
            return;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            this.logger.warn('GEMINI_API_KEY is not defined. Chatbot will not work.');
            return;
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async generateResponse(message, history = []) {
        this.initModel();
        if (!this.genAI) {
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
        const systemInstruction = `
      Tu es l'assistant IA officiel de l'ADL Kairouan (Association de Développement Local). 
      Ton but est d'aider les citoyens, partenaires et visiteurs à comprendre nos actions et à naviguer sur la plateforme.
      
      CONTEXTE ACTUEL DE LA PLATEFORME :
      - Nom du site : ${settings.site_name || 'ADL Kairouan'}
      - Description : ${settings.site_description || 'Vision Urbaine 2030'}
      - Projets récents : ${projects.map((p) => `${p.title}`).join(', ')}
      - Chiffres clés : ${stats.map((s) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ')}
      - Contact : ${settings.contact_email || 'contact@adlkairouan.tn'}

      DIRECTIVES :
      1. Sois professionnel, courtois et institutionnel.
      2. Réponds en français.
      3. Ne parle jamais de politique partisane.
      4. Garde tes réponses concises.
    `;
        try {
            const model = this.genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: systemInstruction
            });
            const formattedHistory = (history || []).map(h => ({
                role: h.role === 'model' ? 'model' : 'user',
                parts: [{ text: String(h.content || h.parts?.[0]?.text || "") }]
            }));
            const chat = model.startChat({
                history: formattedHistory,
            });
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();
            if (!text)
                throw new Error('Empty response from Gemini');
            return text;
        }
        catch (error) {
            this.logger.error('Gemini Chat Error:', error);
            if (error?.message?.includes('API key')) {
                return "Le service d'assistance IA n'est pas configuré (Clé API invalide).";
            }
            return "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer dans quelques instants.";
        }
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = ChatbotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map