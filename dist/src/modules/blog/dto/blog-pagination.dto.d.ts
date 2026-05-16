import { PublishStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';
export declare class BlogPaginationDto extends PaginationDto {
    categoryId?: string;
    tagId?: string;
    featured?: boolean;
    status?: PublishStatus;
}
