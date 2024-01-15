import { PostFilterType } from "../api/dto/middle/post-middle-dto"
import { postFilter } from "../infrastructure/posts-query-repository"

export const postCheckQuery = (query: any): PostFilterType => {
    const queryFilter = {...postFilter}

    if (query.pageNumber) {
        queryFilter.pageNumber = Number (query.pageNumber)
      }
    
      if (query.pageSize) {
        queryFilter.pageSize = Number (query.pageSize)
      }
    
      if (typeof query.sortBy == 'string') {
        queryFilter.sortBy = query.sortBy
      }
    
      if (typeof query.sortDirection === 'string') {
        queryFilter.sortDirection = query.sortDirection
      }

      return queryFilter
}