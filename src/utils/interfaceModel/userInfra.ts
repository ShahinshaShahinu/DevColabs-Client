import mongoose, { ObjectId } from "mongoose";

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
  
  
  
  export interface ChatnotificationReactType {
    ReportPostId?: {
        userId?:string
    };
    ChatMessage?: ChatMessage; // Use the Message interface here
    userId?: string;
    senderId?:{ _id?: string | undefined };
    read?: boolean;
    
  }
  
  export interface ChatMessage {
    image: string;
    senderId:String
    text: string;
    timestamp: string;
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
  
  
  