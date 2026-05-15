import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.searchService.globalSearch(query, limit ? +limit : 10);
  }
}
