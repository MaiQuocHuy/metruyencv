import { PaginatedDto } from '../dto/paginate.dto';

export default class PaginateUtil {
  static paginationReturn({ page, total, limit, offset }) {
    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      offset: offset,
    };
  }

  static setPaginateDto<T>(paginateDto: T, data: any, pagination: object) {
    paginateDto['results'] = data;
    paginateDto['total'] = pagination['totalItems'];
    paginateDto['offset'] = pagination['offset'];
    paginateDto['totalPages'] = pagination['totalPages'];
    return paginateDto;
  }
}
