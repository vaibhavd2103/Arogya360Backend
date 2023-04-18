const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waterReminderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

const WaterReminder = mongoose.model("WaterReminder", waterReminderSchema);
module.exports = WaterReminder;
