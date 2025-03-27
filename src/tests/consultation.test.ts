import request from 'supertest';
import app from '../app';
import MedicalConsultation from '../models/MedicalConsultation';
import MedicalHistory from '../models/MedicalHistory';
import mongoose from 'mongoose';
import Patient from '../models/Patient';

describe('Consultation Controller', () => {
    let patientId: string;

    beforeEach(async () => {
        // Create a patient record before each test
        const patient = new Patient({
            "name": "Johnny Dee ",
            "dob": "1990-01-01",
            "contactInfo": {
                "phone": "123-456-7890",
                "email": "john.dee@example.com",
                "address": "123 Main St"
            }
        });
        const savedPatient = await patient.save() as { _id: mongoose.Types.ObjectId };
        patientId = savedPatient._id.toString(); // Store the patient ID
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new consultation', async () => {
        const mockConsultationData = {
            patientId: patientId,
            date: '2024-05-03T00:00:00.000Z',
            doctorId: 'doc001',
            notes: 'Test notes',
            prescriptions: ['Prescription 1'],
        };

        const historyFindOneSpy = jest.spyOn(MedicalHistory, 'findOne');
        const consultationSaveSpy = jest.spyOn(MedicalConsultation.prototype, 'save');
        const historySaveSpy = jest.spyOn(MedicalHistory.prototype, 'save');

        const response = await request(app).post('/consultations').send(mockConsultationData);

        expect(response.status).toBe(201);
        expect(response.body.patientId).toEqual(patientId);
        expect(consultationSaveSpy).toHaveBeenCalled();
        expect(historyFindOneSpy).toHaveBeenCalledWith({ patientId: new mongoose.Types.ObjectId(patientId) });
        expect(historySaveSpy).toHaveBeenCalled();
    });

    it('should return 400 for invalid consultation data', async () => {
        const invalidConsultationData = {
            patientId: patientId,
            date: 'invalid-date', // Invalid date format
            doctorId: 'doc001',
            notes: 'Test notes',
            prescriptions: ['Prescription 1'],
        };

        const response = await request(app).post('/consultations').send(invalidConsultationData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing required fields', async () => {
        const incompleteConsultationData = {
            patientId: patientId,
            // Missing date and doctorId
            notes: 'Test notes',
            prescriptions: ['Prescription 1'],
        };

        const response = await request(app).post('/consultations').send(incompleteConsultationData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it('should get a consultation by ID', async () => {
        const mockConsultation = { _id: 'consult1', patientId: 'patient1', date: new Date().toISOString(), doctorId: 'doc001', notes: 'Test notes', prescriptions: [] };
        jest.spyOn(MedicalConsultation, 'findById').mockResolvedValue(mockConsultation as any);

        const response = await request(app).get('/consultations/consult1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockConsultation);
    });

    it('should return 404 if consultation not found', async () => {
        jest.spyOn(MedicalConsultation, 'findById').mockResolvedValue(null);

        const response = await request(app).get('/consultations/nonexistentId');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Consultation not found' });
    });

    it('should update a consultation by ID', async () => {
        const mockConsultation = { _id: 'consult1', patientId: 'patient1', date: new Date().toISOString(), doctorId: 'doc001', notes: 'Test notes', prescriptions: [] };
        const updatedData = { notes: 'Updated notes' };
        const updatedConsultation = { ...mockConsultation, notes: 'Updated notes' };
        jest.spyOn(MedicalConsultation, 'findByIdAndUpdate').mockResolvedValue(updatedConsultation as any);

        const response = await request(app).put('/consultations/consult1').send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedConsultation);
    });

    it('should return 404 when updating a non-existent consultation', async () => {
        jest.spyOn(MedicalConsultation, 'findByIdAndUpdate').mockResolvedValue(null);

        const response = await request(app).put('/consultations/nonexistentId').send({ notes: 'Updated notes' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Consultation not found' });
    });
    it('should delete a consultation by ID', async () => {
        const patientId = new mongoose.Types.ObjectId().toString();
        const consultationId = new mongoose.Types.ObjectId().toString();

        const mockConsultation = {
            _id: consultationId,
            patientId: patientId,
            date: new Date().toISOString(),
            doctorId: 'doc001',
            notes: 'Test notes',
            prescriptions: [],
        };

        jest.spyOn(MedicalConsultation, 'findByIdAndDelete').mockResolvedValue(mockConsultation as any);

        const historyUpdateSpy = jest.spyOn(MedicalHistory, 'updateOne');

        const response = await request(app).delete(`/consultations/${consultationId}`).send({ patientId: patientId });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Consultation deleted' });
        expect(historyUpdateSpy).toHaveBeenCalledWith(
            { patientId: new mongoose.Types.ObjectId(patientId) },
            { $pull: { consultations: new mongoose.Types.ObjectId(consultationId) } } //convert to ObjectId
        );
    });
});