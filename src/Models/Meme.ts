import { model, Schema } from 'mongoose'

export default model('Meme', new Schema({
  id: { type: Number, required: true },
  url: { type: String, required: true }
}))
