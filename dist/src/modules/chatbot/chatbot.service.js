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
const genai_1 = require("@google/genai");
const prisma_service_1 = require("../../prisma/prisma.service");
let ChatbotService = ChatbotService_1 = class ChatbotService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.ai = null;
        this.logger = new common_1.Logger(ChatbotService_1.name);
    }
    onModuleInit() {
        this.initModel();
    }
    initModel() {
        if (this.ai)
            return;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            this.logger.warn('GEMINI_API_KEY is not defined. Chatbot will not work.');
            return;
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
        this.logger.log('GoogleGenAI (new SDK) initialized successfully.');
    }
    async generateResponse(message, history = []) {
        this.initModel();
        if (!this.ai) {
            return "Le service d'assistance IA est actuellement en maintenance (clé API manquante). Veuillez réessayer plus tard.";
        }
        const [projects, stats, rawSettings] = await Promise.all([
            this.prisma.project.findMany({
                where: { status: 'PUBLISHED', deletedAt: null },
                take: 5,
                select: { title: true, slug: true, excerpt: true },
            }),
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
      - Projets récents : ${projects.map((p) => p.title).join(', ') || 'Aucun projet récent'}
      - Chiffres clés : ${stats.map((s) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ') || 'Non disponible'}
      - Contact : ${settings.contact_email || 'contact@adlkairouan.tn'}

      DIRECTIVES :
      1. Sois professionnel, courtois et institutionnel.
      2. Réponds toujours en français.
      3. Ne parle jamais de politique partisane.
      4. Garde tes réponses concises (3-5 phrases maximum).
    `;
        try {
            const formattedHistory = (history || []).map((h) => ({
                role: h.role === 'model' ? 'model' : 'user',
                parts: [{ text: String(h.content || h.parts?.[0]?.text || '') }],
            }));
            const contents = [
                ...formattedHistory,
                {
                    role: 'user',
                    parts: [{ text: message }],
                },
            ];
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents,
                config: {
                    systemInstruction,
                },
            });
            const text = response.text;
            if (!text)
                throw new Error('Empty response from Gemini');
            return text;
        }
        catch (error) {
            this.logger.error('Gemini Chat Error:', error?.message || error);
            if (error?.message?.includes('API key') || error?.message?.includes('api key')) {
                return "Le service d'assistance IA n'est pas configuré (Clé API invalide).";
            }
            if (error?.message?.includes('quota') || error?.message?.includes('rate')) {
                return "Le service est temporairement indisponible (quota dépassé). Veuillez réessayer dans quelques minutes.";
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