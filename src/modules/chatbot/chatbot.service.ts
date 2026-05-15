import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.initModel();
  }

  private initModel() {
    if (this.genAI) return;
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not defined. Chatbot will not work.');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(message: string, history: any[] = []) {
    this.initModel();

    if (!this.genAI) {
      return "Le service d'assistance IA est actuellement en maintenance (clé API manquante). Veuillez réessayer plus tard.";
    }

    // 1. Fetch dynamic context
    const [projects, stats, rawSettings] = await Promise.all([
      this.prisma.project.findMany({ where: { status: 'PUBLISHED', deletedAt: null }, take: 5, select: { title: true, slug: true, excerpt: true } }),
      this.prisma.statistic.findMany({ where: { isActive: true }, take: 4 }),
      this.prisma.siteSetting.findMany({
        where: { group: { in: ['GENERAL', 'SOCIAL', 'CONTACT'] } },
      }),
    ]);

    const settings = Object.fromEntries(rawSettings.map((s: any) => [s.key, s.value]));

    const systemInstruction = `
      Tu es l'assistant IA officiel de l'ADL Kairouan (Association de Développement Local). 
      Ton but est d'aider les citoyens, partenaires et visiteurs à comprendre nos actions et à naviguer sur la plateforme.
      
      CONTEXTE ACTUEL DE LA PLATEFORME :
      - Nom du site : ${settings.site_name || 'ADL Kairouan'}
      - Description : ${settings.site_description || 'Vision Urbaine 2030'}
      - Projets récents : ${projects.map((p: any) => `${p.title}`).join(', ')}
      - Chiffres clés : ${stats.map((s: any) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ')}
      - Contact : ${settings.contact_email || 'contact@adlkairouan.tn'}

      DIRECTIVES :
      1. Sois professionnel, courtois et institutionnel.
      2. Réponds en français.
      3. Ne parle jamais de politique partisane.
      4. Garde tes réponses concises.
    `;

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction
      });

      const formattedHistory = (history || []).map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.content || h.parts?.[0]?.text || "" }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Gemini Chat Error:', error);
      return "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer dans quelques instants.";
    }
  }
}
