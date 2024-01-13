import { BlogOutput } from "../output/blog-output-dto";

export class BlogFilter {
    constructor(
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: string,
        public searchNameTerm: string){}
}

export class BlogPaginatorType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public  items: BlogOutput[]){}
}