const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: {type: String},
  image: { type: String },
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  date: { type: Date, default: Date.now },
  timestamps: { type: Boolean,
    default: true
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;