import { Request, Response } from 'express';
import { getDoctorAvailability } from '../controllers/doctorController';
import { processAvailability } from '../services/doctorService';
import logger from '../utils/logger';


jest.mock('../services/doctorService');
jest.mock('../utils/logger');

describe('getDoctorAvailability', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockRequest = {};
        mockResponse = {
            json: mockJson,
            status: mockStatus,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 with availability data on success', async () => {
        const mockAvailability = {
            doctorId: 'doc123',
            availableSlots: ['2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'],
        };
        (processAvailability as jest.Mock).mockResolvedValue(mockAvailability);

        await getDoctorAvailability(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Disponibilidad unificada con éxito',
            availability: mockAvailability,
        });
        expect(logger.info).toHaveBeenCalledWith('Disponibilidad guardada exitosamente en MongoDB');
    });

    it('should return 500 with error message on failure', async () => {
        const mockError = new Error('Availability processing failed');
        (processAvailability as jest.Mock).mockRejectedValue(mockError);

        await getDoctorAvailability(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Error al procesar la disponibilidad' });
        expect(logger.error).toHaveBeenCalledWith('Error al procesar la disponibilidad:', mockError);
    });

    it('should handle unexpected errors', async () => {
        const unexpectedError = 'Unexpected error';
        (processAvailability as jest.Mock).mockRejectedValue(unexpectedError);

        await getDoctorAvailability(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Error al procesar la disponibilidad' });
        expect(logger.error).toHaveBeenCalledWith('Error al procesar la disponibilidad:', unexpectedError);
    });
});