import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CommentForPostSQL,
  CommentLikesInfoSQL,
} from '../domain/comments-sql-entity';

@Injectable()
export class CommentsSQLRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async testAllData(): Promise<void> {
    const query = `
      TRUNCATE public."Comments" CASCADE;
    `;
    await this.dataSource.query(query);
  }

  async save(comment: CommentForPostSQL): Promise<string | null> {
    if (comment.newComment) {
      const commentQuery = `
        INSERT INTO public."Comments"(
          "Content", "UserId", "UserLogin", "PostId", "CreatedAt")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING "Id";      
      `;

      let commentIdDb;

      try {
        commentIdDb = await this.dataSource.query(commentQuery, [
          comment.content,
          comment.commentatorInfo.userId,
          comment.commentatorInfo.userLogin,
          comment.postId,
          comment.createdAt,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }

      const commentId = commentIdDb[0].Id;

      return commentId;
    }

    const commentQuery = `
      UPDATE public."Comments"
        SET "Content"= $1, "UserId"= $2, "UserLogin"= $3, "PostId"= $4, "CreatedAt"= $5
        WHERE "Id" = $6;
    `;

    try {
      await this.dataSource.query(commentQuery, [
        comment.content,
        comment.commentatorInfo.userId,
        comment.commentatorInfo.userLogin,
        comment.postId,
        comment.createdAt,
        comment.id,
      ]);
    } catch (err) {
      console.log(err);

      return null;
    }

    const likesInfoDeleteQuery = `
    DELETE FROM public."CommentsLikesInfo"
      WHERE "CommentId" = $1;
    `;

    try {
      await this.dataSource.query(likesInfoDeleteQuery, [comment.id]);
    } catch (err) {
      console.log(err);

      return null;
    }

    comment.likesInfo.map(async (i) => {
      const likesInfoUpdateQuery = `
        INSERT INTO public."CommentsLikesInfo"(
          "UserId", "Login", "AddedAt", "LikeStatus", "CommentId")
          VALUES ($1, $2, $3, $4, $5);
      `;

      try {
        await this.dataSource.query(likesInfoUpdateQuery, [
          i.userId,
          i.login,
          i.addedAt,
          i.likeStatus,
          comment.id,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }
    });

    return null;
  }

  async getCommentById(id: string): Promise<CommentForPostSQL | null> {
    const query = `
      SELECT c.*
      FROM public."Comments" c
      WHERE
        c."Id" = '${id}'
    `;

    let commentDb;

    try {
      commentDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!commentDb[0]) return null;

    const comment = CommentForPostSQL.createSmartComment(commentDb[0]);

    const queryLikesInfo = `
      SELECT l.*
      FROM public."CommentsLikesInfo" l
      WHERE
        l."CommentId" = '${id}'
    `;

    let commentLikesInfoDb;

    try {
      commentLikesInfoDb = await this.dataSource.query(queryLikesInfo);
    } catch (err) {
      console.log(err);

      return null;
    }

    commentLikesInfoDb.forEach((i) =>
      comment.likesInfo.push(CommentLikesInfoSQL.likesInfoMapper(i)),
    );

    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const query = `
    DELETE FROM public."Comments" CASCADE
	    WHERE "Id" = $1;
    `;

    let result;

    try {
      result = await this.dataSource.query(query, [id]);
    } catch (err) {
      return false;
    }

    if (result[1] === 0) return false;

    return true;
  }
}
