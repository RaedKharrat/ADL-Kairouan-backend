import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private ai: GoogleGenAI | null = null;
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) { }

  onModuleInit() {
    this.initModel();
  }

  private initModel() {
    if (this.ai) return;
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not defined. Chatbot will not work.');
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.logger.log('GoogleGenAI (new SDK) initialized successfully.');
  }

  async generateResponse(message: string, history: any[] = []) {
    this.initModel();

    if (!this.ai) {
      return "Le service d'assistance IA est actuellement en maintenance (clé API manquante). Veuillez réessayer plus tard.";
    }

    // 1. Fetch dynamic context from DB
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

    const settings = Object.fromEntries(rawSettings.map((s: any) => [s.key, s.value]));

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
      - Projets récents : ${projects.map((p: any) => `[${p.title}](/projects/${p.slug})`).join(', ')}
      - Statistiques clés : ${stats.map((s: any) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ')}
      - Email Officiel : ${settings.contact_email || 'contact@adlkairouan.tn'}

      CONSIGNES DE RÉPONSE :
      1. Sois moderne, concis et efficace.
      2. Utilise le Markdown (gras, listes à puces) pour rendre la réponse lisible et élégante.
      3. Inclus systématiquement un lien pertinent si l'utilisateur pose une question sur un service ou un projet.
      4. Ne parle pas de politique ou de sujets hors contexte associatif.
    `;

    try {
      // 2. Build conversation history as 'contents' array
      // The new SDK uses { role, parts: [{ text }] } format
      const formattedHistory = (history || []).map((h) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(h.content || h.parts?.[0]?.text || '') }],
      }));

      // 3. Append the current user message
      const contents = [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      // 4. Call the new SDK — systemInstruction lives inside config
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      const text = response.text;

      if (!text) throw new Error('Empty response from Gemini');
      return text;
    } catch (error: any) {
      // Log the full error for debugging
      this.logger.error('Gemini Chat Error — full details:', JSON.stringify({
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText,
        errorDetails: error?.errorDetails,
        stack: error?.stack?.split('\n')[0],
      }));

      const msg: string = error?.message || JSON.stringify(error) || '';

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
}
