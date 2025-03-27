import mongoose, { Document, Schema } from 'mongoose';

interface IMedicalHistory extends Document {
    patientId: mongoose.Types.ObjectId;
    consultations: mongoose.Types.ObjectId[];
  }
  
  const MedicalHistorySchema: Schema = new Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalConsultation' }],
  });
  
  export default mongoose.model<IMedicalHistory>('MedicalHistory', MedicalHistorySchema);