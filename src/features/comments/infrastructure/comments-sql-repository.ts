import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CommentForPostSQL,
  CommentLikesInfoSQL,
} from '../domain/comments-sql-entity';
import { CommentsRawDb } from './dto/comments-repository-dto';

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

    let likesInfoUpdateQuery = `
      INSERT INTO public."CommentsLikesInfo"(
        "UserId", "Login", "AddedAt", "LikeStatus", "CommentId")
        VALUES 
    `;

    comment.likesInfo.map(async (i) => {
      likesInfoUpdateQuery += `('${i.userId}','${i.login}','${i.addedAt}','${i.likeStatus}','${comment.id}'),`;
    });

    likesInfoUpdateQuery = likesInfoUpdateQuery.slice(0, -1);
    likesInfoUpdateQuery += `;`;

    try {
      await this.dataSource.query(likesInfoUpdateQuery);
    } catch (err) {
      console.log(err);

      return null;
    }

    return null;
  }

  async getCommentById(id: string): Promise<CommentForPostSQL | null> {
    const query = `
      SELECT c.*, JSON_AGG(cl.*) as "LikesInfo"
      FROM public."Comments" c
      LEFT JOIN public."CommentsLikesInfo" cl
      ON c."Id" = cl."CommentId"
      WHERE
        c."Id" = '${id}'
      GROUP BY "Id";
    `;

    let commentDbArr;

    try {
      commentDbArr = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!commentDbArr[0]) return null;
    const commentDb: CommentsRawDb = commentDbArr[0];
    if (!commentDb.LikesInfo[0]) commentDb.LikesInfo.splice(0, 1);

    const comment = CommentForPostSQL.createSmartComment(commentDb);

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
