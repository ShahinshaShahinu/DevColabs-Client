import mongoose, { ObjectId } from "mongoose";

export interface Comment  {
    _id?:string 
    postId:Posts;
    userId:User
    Comment: string;
    Date:string
}


export interface User {
  _id?: string;
  UserName: string;
  email: string;
  password: string;
  profileImg?: string;
  isGoogle?: boolean;
  token?: number;
  status?: boolean;
  UserBackgroundImage?: string;
  role?: string;
  profile?: {
    FirstName: string;
    LastName: string;
    AboutMe: string;
    Headline: string;
    Hashtags?: string
    Pronouns: string;
  };
  UserHshTag?: {
    SelectedTags: [
      {
        HshTagId: string
      }
    ]
  }
  Userfollowers?: string[];
  Joined?:String
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

export interface Data {
  FirstName: string;
  profile: any;
  UserPosts: any[];
  count: number;
  userProfileData: UserProfile;
  UserHshTag:object
}


export interface AllUsers {
  senderId: any;
  id: any;
  image: string | undefined;
  name: string | undefined;
  data?:any
  _id?: string;
  UserName: string;
  email: string;
  password: string;
  profileImg?: string;
  isGoogle?: boolean;
  token?: number;
  status?: boolean;
  UserBackgroundImage?: string;
  profile?: {
    FirstName: string;
    LastName: string;
    AboutMe: string;
    Headline: string;
    Hashtags?: string
    Pronouns: string;
  };
  UserHshTag?: {
    SelectedTags: [
      {
        HshTagId:{
          Hashtag:string
        }
      }
    ]
  },
  userId?:{
    _id:string
    profileImg:string
    UserName:string
  }
  
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
  }
  
  
  export interface UrlData {
    [x: string]: any;
    _id?:string | ObjectId
    title: string,
    content: string;
    image: string,
    userId?: {
      _id:string
      profileImg: string;
      UserName: string;
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
    Videos?:string[] |undefined ,
  
  }
  
  
  export interface AllUsers {
    senderId: any;
    id: any;
    image: string | undefined;
    name: string | undefined;
    data?:any
    _id?: string;
    UserName: string;
    email: string;
    password: string;
    profileImg?: string;
    isGoogle?: boolean;
    token?: number;
    status?: boolean;
    UserBackgroundImage?: string;
    profile?: {
      FirstName: string;
      LastName: string;
      AboutMe: string;
      Headline: string;
      Hashtags?: string
      Pronouns: string;
    };
    UserHshTag?: {
      SelectedTags: [
        {
          HshTagId:{
            Hashtag:string
          }
        }
      ]
    },
    userId?:{
      _id:string
      profileImg:string
      UserName:string
    }
    
  }
  

  export interface CommunityUser {
    _id: any;
 
    userId?: string[]
    Name?: string
    CreatedAdmin?: {
        _id:string
    }
    Message?: [{
        text?: string;
        senderId?: string
        image?:string
        video?:String,
        timestamp?: string
       
    }]
    Image?: string
    HashTag?:string[]
    CreatedDate?: string
}

export interface Chats {
  _id?: string;
  userId: mongoose.Types.ObjectId | string 
  senderId?: mongoose.Types.ObjectId | string 
  Message?: [{
      text?: string;
      senderId: mongoose.Types.ObjectId | string;
      image?: String ,
      video?:String,
      timestamp?: string;
      readBy?: string[]
  }];
  CreatedDate?: string;
}


export interface UserIdObject {
  senderId?:{
      _id:string
      UserName: string;
      profileImg: string | undefined;
  }
  _id: any;
  id: any;
  userId: {
      _id: any;
      UserName: string;
      profileImg: string | undefined;
  };
  chat: {
      userId: {
          UserName: string;
          profileImg: string | undefined;
      };
      
  };
}