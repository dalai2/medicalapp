import mongoose, { Schema, Document } from 'mongoose';

interface IMedicalConsultation extends Document {
    patientId: mongoose.Types.ObjectId;
    date: Date;
    doctorId: string;
    notes: string;
    prescriptions: string[];
  }
  
  const MedicalConsultationSchema: Schema = new Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true },
    doctorId: { type: String, required: true },
    notes: { type: String, required: true },
    prescriptions: [{ type: String }],
  });
  
  export default mongoose.model<IMedicalConsultation>('MedicalConsultation', MedicalConsultationSchema);