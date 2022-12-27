import { CommentInfo } from "./comment.model";
import { LikeInfo } from "./like.model";

export interface PostInfo {
    PostID : number;
    ProfileID : number;
    ProfileName : string;
    ProfilePicture : string;
    PostDate : Date;
    PostImage : string;
    PostMessage: string;
    PostLikeCnt: number;
    PostLikeList : string
    PostCommentCnt : number;
    PostCommentList : string;
    tmpCommnetList : string;
    tmpLikeList : string;
    PostTag : string;
    PostCommentArray : CommentInfo[];
    PostLikeArray : LikeInfo[];
    showLikeList : number ;
}