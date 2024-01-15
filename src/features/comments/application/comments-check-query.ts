import { CommentsFilter } from "../api/dto/middle/comments-middle-dto"
import { commentFilter } from "../infrastructure/comments-query-repository"

export const commentCheckQuery = (query: any): CommentsFilter => {
    const queryFilter = {...commentFilter}

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