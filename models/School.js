const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      // longitude&latitude
      type: [Number],
      required: true
    }
  }
});

//faster for location handling in mongodb
SchoolSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('School', SchoolSchema);
