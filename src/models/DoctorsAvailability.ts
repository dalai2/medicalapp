import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the availability document
interface IAvailability extends Document {
  date: string;
  availability: {
    doctorId: string;
    clinicId: string;
    time: string;
  }[];
}

// Define the schema for the availability
const AvailabilitySchema: Schema = new Schema({
  date: {
    type: String,
    required: true,
  },
  availability: [
    {
      doctorId: {
        type: String,
        required: true,
      },
      clinicId: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create the model from the schema
const DoctorAvailability = mongoose.model<IAvailability>('DoctorAvailability', AvailabilitySchema);

export default DoctorAvailability;