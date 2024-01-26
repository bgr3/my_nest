import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts-repository';
import { Post, PostModelType } from '../domain/posts-entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostLikeStatus, PostPostType, PostPutType } from '../api/dto/input/post-input-dto';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs-query-repository';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users-service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    protected postsRepository: PostsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected jwtService: JwtService,
    protected usersService: UsersService,
  ) {}
  async testAllData(): Promise<void> {
    return await this.postsRepository.testAllData();
  }

  async createPost(dto: PostPostType): Promise<string | null> {
    const blogName = (
      await this.blogsQueryRepository.findBlogByID(dto.blogId.trim())
    )?.name;

    if (blogName) {
      const newPost = Post.createPost(
        dto.title,
        dto.shortDescription,
        dto.content,
        dto.blogId,
        blogName,
      );

      const newPostModel = new this.PostModel(newPost);

      await this.postsRepository.save(newPostModel);

      return newPostModel._id.toString();
    }

    return null;
  }

  async updatePost(id: string, dto: PostPutType): Promise<boolean> {
    const blogName = (
      await this.blogsQueryRepository.findBlogByID(dto.blogId.trim())
    )?.name;

    const post = await this.postsRepository.getPostById(id);

    if (!post || !blogName) return false;

    post.updatePost(
      dto.title,
      dto.shortDescription,
      dto.content,
      dto.blogId,
      blogName,
    );
    this.postsRepository.save(post);

    return true;
  }

  async likeStatus (postId: string, accessToken: string, dto: PostLikeStatus): Promise <boolean> {
      const userId = await this.jwtService.verifyAsync(accessToken);
      const user = await this.usersService.findUserDbByID(userId);

      if (!user) return false;

      const login = user.login;
      const likeStatus = dto.likeStatus;

      const post = await this.postsRepository.getPostById(postId);
      
      if (!post) return false;

      post.setLikeStatus(userId, login, likeStatus);
      await this.postsRepository.save(post);

      return true;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.deletePost(id);
  }
}
