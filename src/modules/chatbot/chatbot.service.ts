import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private ai: GoogleGenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.initModel();
  }

  private initModel() {
    if (this.ai) return;
    // The SDK reads GEMINI_API_KEY from environment variables automatically if passed as empty object
    // But in NestJS we ensure it exists via ConfigService
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Chatbot will not work.');
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateResponse(message: string, history: any[] = []) {
    this.initModel();

    if (!this.ai) {
      return "Le service d'assistance IA est actuellement en maintenance (clé API manquante). Veuillez réessayer plus tard.";
    }

    // 1. Fetch dynamic context to make the AI "alive"
    const [projects, stats, rawSettings] = await Promise.all([
      this.prisma.project.findMany({ where: { status: 'PUBLISHED', deletedAt: null }, take: 5, select: { title: true, slug: true, excerpt: true } }),
      this.prisma.statistic.findMany({ where: { isActive: true }, take: 4 }),
      this.prisma.siteSetting.findMany({
        where: { group: { in: ['GENERAL', 'SOCIAL', 'CONTACT'] } },
      }),
    ]);

    const settings = Object.fromEntries(rawSettings.map((s: any) => [s.key, s.value]));

    const contextPrompt = `
      Tu es l'assistant IA officiel de l'ADL Kairouan (Association de Développement Local). 
      Ton but est d'aider les citoyens, partenaires et visiteurs à comprendre nos actions et à naviguer sur la plateforme.
      
      CONTEXTE ACTUEL DE LA PLATEFORME :
      - Nom du site : ${settings.siteName || 'ADL Kairouan'}
      - Description : ${settings.siteDescription || 'Vision Urbaine 2030'}
      - Projets récents : ${projects.map((p: any) => `${p.title} (Lien: /projects/${p.slug})`).join(', ')}
      - Chiffres clés : ${stats.map((s: any) => `${s.label}: ${s.value}${s.suffix || ''}`).join(', ')}
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
      // Map history to the format expected by the new SDK
      // The new SDK uses 'contents' which can be an array of messages
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

      // Based on your documentation screenshot, 'text' is a property: response.text
      // Note: TypeScript might complain if it's not in the @types yet, but we'll follow the doc
      return (response as any).text || "Désolé, je n'ai pas pu générer de réponse.";
    } catch (error) {
      console.error('Gemini Error:', error);
      return "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer dans quelques instants.";
    }
  }
}
