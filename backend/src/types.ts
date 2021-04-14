export interface IMongoDBUser {
  _id: string,
  __v: number,
  googleId?: string,
  facebookId?: string,
  username: string
}