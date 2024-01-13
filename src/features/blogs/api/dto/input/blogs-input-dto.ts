export class BlogPostType {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string){}
}

export class PostForBlogPostType {
    blogId: string;
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string){}
}

export class BlogPutType {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string){}
}
