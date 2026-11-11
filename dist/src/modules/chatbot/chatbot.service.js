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
      Ton rôle est d'aider les citoyens et partenaires à naviguer sur la plateforme et à s'informer sur nos initiatives.
      
      LANGUE :
      - Détecte automatiquement la langue de l'utilisateur (Français, Arabe tunisien/littéraire, Anglais).
      - Réponds TOUJOURS dans la langue utilisée par l'utilisateur.
      - Si l'utilisateur utilise l'Arabe Tunisien (Derja), réponds de manière chaleureuse en Arabe.

      NAVIGATION & LIENS (Utilise impérativement ces liens Markdown pour guider l'utilisateur) :
      - Explorer les projets : [Projets](/projects)
      - Actualités et Blog : [Blog](/blog)
      - Qui sommes-nous : [À propos](/about)
      - Nous contacter : [Contact](/contact)
      - Faire une réclamation ou signaler un problème : [Signalement/Contact](/contact) (redirige vers contact pour l'instant)

      CONTEXTE DE L'ADL :
      - Plateforme : ${settings.site_name || 'ADL Kairouan'}
      - Objectif : ${settings.site_description || 'Développement local et transparence'}
      - Projets récents : ${projects.map((p) => `[${p.title}](/projects/${p.slug})`).join(', ')}
      - Statistiques clés : ${stats.map((s) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ')}
      - Email Officiel : ${settings.contact_email || 'contact@adlkairouan.tn'}

      CONSIGNES DE RÉPONSE :
      1. Sois moderne, concis et efficace.
      2. Utilise le Markdown (gras, listes à puces) pour rendre la réponse lisible et élégante.
      3. Inclus systématiquement un lien pertinent si l'utilisateur pose une question sur un service ou un projet.
      4. Ne parle pas de politique ou de sujets hors contexte associatif.
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
                model: 'gemini-2.5-flash',
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
            this.logger.error('Gemini Chat Error — full details:', JSON.stringify({
                message: error?.message,
                status: error?.status,
                statusText: error?.statusText,
                errorDetails: error?.errorDetails,
                stack: error?.stack?.split('\n')[0],
            }));
            const msg = error?.message || JSON.stringify(error) || '';
            if (msg.includes('API key') || msg.includes('api key') || msg.includes('API_KEY')) {
                return "Le service d'assistance IA n'est pas configuré (Clé API invalide).";
            }
            if (msg.includes('quota') || msg.includes('rate') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
                return "Le service est temporairement limité. Veuillez réessayer dans quelques instants.";
            }
            if (msg.includes('not found') || msg.includes('404') || msg.includes('MODEL_NOT_FOUND')) {
                return "Modèle IA non disponible. Contactez l'administrateur.";
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