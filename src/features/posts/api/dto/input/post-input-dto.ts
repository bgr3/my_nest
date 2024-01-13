export class PostPostType {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string){}
}

export class PostPutType {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,){}
}