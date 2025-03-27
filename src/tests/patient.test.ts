import request from 'supertest';
import app from '../app'; 
import Patient from '../models/Patient';
import logger from '../utils/logger';
import mongoose from 'mongoose';

// Mock the Patient model and logger
jest.mock('../models/Patient');
jest.mock('../utils/logger',);

describe('Patient Controller', () => {
    afterEach(async () => {
        jest.clearAllMocks();
         await Promise.all(Object.values(mongoose.connection.collections).map(c => c.deleteMany({})));
    });
    afterAll(async () => {
        // Close the MongoDB connection after all tests
        await mongoose.connection.close();
    });
    it('should create a new patient successfully', async () => {
        const mockPatientData = { name: 'John Doe', dob: '1990-01-01', contactInfo: { phone: '123-456-7890', email: 'john.doe@example.com', address: '123 Main St' } };
        const mockSavedPatient = { ...mockPatientData, _id: '12345', __v: 0, medicalHistory: [] };
    
        const saveMock = jest.fn().mockResolvedValue(mockSavedPatient); // Create a separate mock function
    
        jest.spyOn(Patient.prototype, 'save').mockImplementation(saveMock);
    
        const response = await request(app).post('/patients').send(mockPatientData);
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockSavedPatient);
        expect(Patient.prototype.save).toHaveBeenCalledTimes(1); // Check if save was called
      });

    it('should return 400 if there is a validation error', async () => {
        const mockPatientData = { name: '', dob: '1990-01-01', contactInfo: { phone: '123-456-7890', email: 'john.doe@example.com', address: '123 Main St' } }; // Invalid data

        // Mock the save method to throw a validation error
        (Patient.prototype.save as jest.Mock) = jest.fn().mockImplementation(() => {
            const error = new Error('Validation error');
            error.name = 'ValidationError';
            throw error;
        });

        const response = await request(app).post('/patients').send(mockPatientData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Error creating patient');
        expect(logger.error).toHaveBeenCalledWith(
            'Error creating patient:',
            expect.any(Error)
        );
    });

    it('should return 500 if an unexpected error occurs', async () => {
        const mockPatientData = { name: 'John Doe', dob: '1990-01-01', contactInfo: { phone: '123-456-7890', email: 'john.doe@example.com', address: '123 Main St' } };

        // Mock the save method to throw an unexpected error
        (Patient.prototype.save as jest.Mock) = jest.fn().mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        const response = await request(app).post('/patients').send(mockPatientData);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Unexpected error creating patient');
        expect(logger.error).toHaveBeenCalledWith(
            'Unexpected error creating patient:',
            expect.any(Error)
        );
    });
    it('should update a patient by ID', async () => {
        const mockPatient = { _id: '1', name: 'Patient One', dob: '1991-04-04', contactInfo: { phone: '123', email: 'p1@example.com', address: 'Addr 1' }, medicalHistory: [] };
        const updatedData = { name: 'Updated Name' };
        const updatedPatient = { ...mockPatient, name: 'Updated Name' };
    
        jest.spyOn(Patient, 'findByIdAndUpdate').mockResolvedValue(updatedPatient as any);
    
        const response = await request(app).put('/patients/1').send(updatedData);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedPatient);
      });
    
      it('should return 404 if patient not found when updating', async () => {
        const updatedData = { name: 'Updated Name' };
        jest.spyOn(Patient, 'findByIdAndUpdate').mockResolvedValue(null);
    
        const response = await request(app).put('/patients/nonexistentId').send(updatedData);
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Patient not found' });
      });
    
      it('should delete a patient by ID', async () => {
        const mockPatient = { _id: '1', name: 'Patient One', dob: '1991-04-04', contactInfo: { phone: '123', email: 'p1@example.com', address: 'Addr 1' }, medicalHistory: [] };
        jest.spyOn(Patient, 'findByIdAndDelete').mockResolvedValue(mockPatient as any);
    
        const response = await request(app).delete('/patients/1');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Patient deleted' });
      });
    
      it('should return 404 if patient not found when deleting', async () => {
        jest.spyOn(Patient, 'findByIdAndDelete').mockResolvedValue(null);
    
        const response = await request(app).delete('/patients/nonexistentId');
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Patient not found' });
    });
});