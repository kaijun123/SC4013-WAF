import mongoose from 'mongoose'

export const connectToDb = async (url: string) => {
  await mongoose.connect(url)
  console.log("Connected to the db")
}
