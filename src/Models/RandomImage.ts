import { model, Schema } from 'mongoose'

export default model('Random', new Schema({
	_id: { type: Number, required: true },
	url: { type: String, required: true },
	nsfw: { type: Boolean, required: false, default: false }
}))
