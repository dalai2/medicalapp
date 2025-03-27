import { Request, Response } from 'express';
import MedicalConsultation from '../models/MedicalConsultation';
import MedicalHistory from '../models/MedicalHistory';
import logger from '../utils/logger';
import mongoose, { Types } from 'mongoose';

export const createConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
      const consultation = new MedicalConsultation(req.body);
      await consultation.save();

      // Update the patient's medical history
      const history = await MedicalHistory.findOne({ patientId: consultation.patientId });
      if (history) {
          history.consultations.push(consultation._id as Types.ObjectId); // Correct typing
          await history.save();
      } else {
          // Create a new medical history record if it doesn't exist
          const newHistory = new MedicalHistory({
              patientId: consultation.patientId,
              consultations: [consultation._id], // if the schema is correct, this should work without a cast.
          });
          await newHistory.save();
      }

      res.status(201).json(consultation);
  } catch (error) {
      logger.error('Error creating consultation:', error);
      res.status(400).json({ message: 'Error creating consultation', error });
  }
};
// Get a consultation by ID
export const getConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const consultation = await MedicalConsultation.findById(req.params.id);
    if (!consultation) {
      res.status(404).json({ message: 'Consultation not found' });
      return;
    }
    res.json(consultation);
  } catch (error) {
    logger.error('Error fetching consultation:', error);
    res.status(500).json({ message: 'Error fetching consultation', error });
  }
};

// Update a consultation by ID
export const updateConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const consultation = await MedicalConsultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!consultation) {
      res.status(404).json({ message: 'Consultation not found' });
      return;
    }
    res.json(consultation);
  } catch (error) {
    logger.error('Error updating consultation:', error);
    res.status(400).json({ message: 'Error updating consultation', error });
  }
};

// Delete a consultation by ID
export const deleteConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const consultation = await MedicalConsultation.findByIdAndDelete(id);

    if (!consultation) {
      res.status(404).json({ message: 'Consultation not found' });
    }

    const { patientId } = req.body;
    const patientObjectId = new mongoose.Types.ObjectId(patientId);
    const consultationObjectId = new mongoose.Types.ObjectId(id);

    await MedicalHistory.updateOne(
      { patientId: patientObjectId },
      { $pull: { consultations: consultationObjectId } }
    );

    res.status(200).json({ message: 'Consultation deleted' });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    if (!res.headersSent) { //Check if headers have already been sent.
        res.status(500).json({ message: 'Error deleting consultation', error: error });
    }
  }
};