import jwt_decode from 'jwt-decode'
interface decode{
        _id:string,
        role:string
    
    exp:number
}
export const verifyAuth=(token:string):string=>{

    const Decoded :decode= jwt_decode(token)
    
    return Decoded?.role
}

