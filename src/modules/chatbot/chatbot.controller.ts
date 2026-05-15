import { Controller, Post, Body, Version } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Version('1')
  @Post('chat')
  @ApiOperation({ summary: 'Send a message to the AI chatbot' })
  async chat(@Body() body: { message: string; history?: any[] }) {
    const response = await this.chatbotService.generateResponse(body.message, body.history);
    return { success: true, data: response };
  }
}
