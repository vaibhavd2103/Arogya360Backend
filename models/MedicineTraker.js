const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineTrackerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

const MedicineTracker = mongoose.model(
  "MedicineTracker",
  medicineTrackerSchema
);
module.exports = MedicineTracker;
