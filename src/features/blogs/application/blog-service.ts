import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogModelType } from "../domain/blogs-entity";
import { BlogsRepository } from "../infrastructure/blogs-repository";
import { BlogPostType, BlogPutType } from "../api/dto/input/blogs-input-dto";

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        protected blogsRepository: BlogsRepository){}
    async testAllData (): Promise<void> {
        return this.blogsRepository.testAllData()
    }

    async createBlog (dto: BlogPostType): Promise<string | null> {    
        const newBlog = Blog.createBlog(dto.name, dto.description, dto.websiteUrl)
        const newBlogModel = new this.BlogModel(newBlog)

        await this.blogsRepository.save(newBlogModel)
        
        return newBlogModel._id.toString()
    }

    async updateBlog (id: string, dto: BlogPutType): Promise<Boolean> {
        const blog = await this.blogsRepository.getBlogById(id)

        if (blog) {
            blog.updateBlog(dto.name, dto.description, dto.websiteUrl)
            return true
        }
        
        return false
    }

    async deleteBlog (id: string): Promise<Boolean> {
        return this.blogsRepository.deleteBlog(id)
    }
}
