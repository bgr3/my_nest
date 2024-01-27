import { Filter } from '../../../infrastructure/dto/input/input-dto';
import { postFilter } from '../infrastructure/posts-query-repository';

export const postCheckQuery = (query: any): Filter => {
  const queryFilter = { ...postFilter };

  if (query.pageNumber) {
    queryFilter.pageNumber = Number(query.pageNumber);
  }

  if (query.pageSize) {
    queryFilter.pageSize = Number(query.pageSize);
  }

  if (typeof query.sortBy == 'string') {
    queryFilter.sortBy = query.sortBy;
  }

  if (typeof query.sortDirection === 'string') {
    queryFilter.sortDirection = query.sortDirection;
  }

  return queryFilter;
};
