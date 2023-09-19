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