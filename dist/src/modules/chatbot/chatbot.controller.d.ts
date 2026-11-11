import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    chat(body: ChatMessageDto): Promise<{
        success: boolean;
        data: string;
    }>;
}
