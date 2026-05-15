import { ChatbotService } from './chatbot.service';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    chat(body: {
        message: string;
        history?: any[];
    }): Promise<{
        success: boolean;
        data: any;
    }>;
}
