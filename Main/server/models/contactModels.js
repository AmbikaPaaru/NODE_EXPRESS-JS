const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the conact Name"],
    },
    email: {
      type: String,
      required: [true, "Please add the conact Email"],
    },
    phone: {
      type: String,
      required: [true, "Please add the conact Phonenumber"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
