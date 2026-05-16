import { PublishStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';
export declare class ProjectPaginationDto extends PaginationDto {
    categoryId?: string;
    featured?: boolean;
    status?: PublishStatus;
}
