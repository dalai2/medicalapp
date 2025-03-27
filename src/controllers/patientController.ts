import { Request, Response } from 'express';
import Patient from '../models/Patient';
import logger from '../utils/logger';
import MedicalHistory from '../models/MedicalHistory';

// Create a new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const patient = new Patient(req.body);
      const savedPatient = await patient.save();
      res.status(201).json(savedPatient);
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        // Handle validation errors
        logger.error('Error creating patient:', error);
        res.status(400).json({ message: 'Error creating patient', error: error.message });
      } else {
        // Handle unexpected errors
        logger.error('Unexpected error creating patient:', error);
        res.status(500).json({ 
          message: 'Unexpected error creating patient', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  };

// Get all patients
export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find(); // Find all patients

    // Populate medical history for each patient
    const populatedPatients = await Promise.all(
      patients.map(async (patient) => {
        const history = await MedicalHistory.findOne({ patientId: patient._id }).populate('consultations');
        return { ...patient.toObject(), medicalHistory: history ? history.consultations : [] };
      })
    );

    res.json(populatedPatients);
  } catch (error) {
    logger.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error });
  }
};

// Get a patient by ID
export const getPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id).populate('medicalHistory');
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return; // Exit early if patient is not found
    }
    // Populate the medical history
    const history = await MedicalHistory.findOne({ patientId: patient._id }).populate('consultations');
    res.json({ ...patient.toObject(), medicalHistory: history ? history.consultations : [] });
  } catch (error) {
    logger.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient', error });
  }
};

// Update a patient by ID
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return; // Exit early if patient is not found
    }
    res.json(patient);
  } catch (error) {
    logger.error('Error updating patient:', error);
    res.status(400).json({ message: 'Error updating patient', error });
  }
};

// Delete a patient by ID
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return; // Exit early if patient is not found
    }
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    logger.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient', error });
  }
};