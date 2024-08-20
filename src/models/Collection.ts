import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requests: [{
    method: { type: String, required: true },
    url: { type: String, required: true },
    headers: { type: Object },
    body: { type: String },
  }],
});

export default mongoose.model('Collection', collectionSchema);