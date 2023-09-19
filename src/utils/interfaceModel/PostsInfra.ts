import mongoose from "mongoose";

export interface CIHashtag {
    _id?:string| undefined
    HashTag?: [];
    Hashtag?: string;
    createdAt?: Date | undefined;
}

export interface CHashtag {
    Hashtag: string;
    createdAt: Date ;
}

export interface IHashtag {
    Hashtag: string;
    createdAt: Date;
}

export interface Posts {
  [x: string]: any;
  _id?:string
  title: string,
  content: string;
  image: string,
  userId?: string | {
    UserName?: string;
  };
  likes?: {
    Count: number;
    LikedUsers: [
      {
        userId: string,
        liked:boolean
      }
    ];
  };
  HashTag:string[],
  Date?:string,
  Comments?: mongoose.Types.ObjectId[];
  status?:boolean,
  Videos?:string[]
  Created?:string
}


export interface Data {
    FirstName: string;
    profile: any;
    UserPosts: any[];
    count: number;
    userProfileData: UserProfile;
    UserHshTag:object
  }
  
  export interface UserProfile {
    UserBackgroundImage: string;
    UserName: string;
    email: string;
    password: string;
    profile: {
      AboutMe: string;
      FirstName: string;
      Hashtags: string;
      Headline: string;
      LastName: string;
      Pronouns: string;
    };
    profileImg: string;
    status: boolean;
    __v: number;
    _id: string;
  }