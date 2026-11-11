import { Controller, Post, Body, Version, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatMessageDto } from './dto/chat.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Version('1')
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 AI queries per minute per IP
  @ApiOperation({ summary: 'Send a message to the AI chatbot' })
  @ApiResponse({ status: 200, description: 'AI response generated successfully' })
  async chat(@Body() body: ChatMessageDto) {
    const response = await this.chatbotService.generateResponse(body.message, body.history);
    return { success: true, data: response };
  }
}
