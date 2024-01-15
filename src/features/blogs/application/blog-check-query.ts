import { BlogFilter } from "../api/dto/middle/blogs-middle-dto"
import { blogFilter } from "../infrastructure/blogs-query-repository"

export const blogCheckQuery = (query: any): BlogFilter => {
  const queryFilter = {...blogFilter}

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

    if (typeof query.searchNameTerm === 'string') {
      queryFilter.searchNameTerm = query.searchNameTerm
    }

    return queryFilter
}