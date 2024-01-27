export class Paginator<T> {
    public pagesCount: number;
    public page: number;
    public pageSize: number;
    public totalCount: number;
    public items: T[];
}