import { model, Schema } from 'mongoose'
import type { Meme } from '../Types'

export default model<Meme>('Meme', new Schema({
  id: { type: Number, required: true },
  url: { type: String, required: true }
}))
