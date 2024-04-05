import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostORM } from '../../domain/posts-orm-entity';

export class PostsORMRepository {
  constructor(
    @InjectRepository(PostORM)
    private readonly postsRepository: Repository<PostORM>,
  ) {}

  async testAllData(): Promise<void> {
    this.postsRepository.delete({});
  }

  async save(post: PostORM): Promise<string | null> {
    const postResult = await this.postsRepository.save(post);

    return postResult.id;
  }

  async getPostById(id: string): Promise<PostORM | null> {
    let post;

    try {
      post = await this.postsRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return post;
  }

  async deletePost(id: string): Promise<boolean> {
    let result;

    try {
      result = await this.postsRepository.delete(id);
    } catch (err) {
      console.log(err);

      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
