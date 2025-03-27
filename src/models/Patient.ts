import mongoose, { Schema, Document } from 'mongoose';

interface IPatient extends Document {
  name: string;
  dob: Date;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  medicalHistory: mongoose.Types.ObjectId[];
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  medicalHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalHistory' }],
});

export default mongoose.model<IPatient>('Patient', PatientSchema);