import fs from 'fs';
import path from 'path';
import DoctorAvailability from '../models/DoctorsAvailability';
import { unifyAvailability, processAvailability } from '../services/doctorService';

jest.mock('fs');
jest.mock('../models/DoctorsAvailability');

describe('doctorService', () => {
    describe('unifyAvailability', () => {
        it('should unify schedules correctly', () => {
            const schedules = [
                {
                    idDoctor: 'doc1',
                    idClinic: 'clinic1',
                    slotdates: [
                        {
                            date: '2024-01-01',
                            slots: [
                                { dateTime: '2024-01-01T10:00:00Z' },
                                { dateTime: '2024-01-01T11:00:00Z' },
                            ],
                        },
                        {
                            date: '2024-01-02',
                            slots: [{ dateTime: '2024-01-02T12:00:00Z' }],
                        },
                    ],
                },
                {
                    idDoctor: 'doc2',
                    idClinic: 'clinic2',
                    slotdates: [
                        {
                            date: '2024-01-01',
                            slots: [{ dateTime: '2024-01-01T14:00:00Z' }],
                        },
                    ],
                },
            ];

            const result = unifyAvailability(schedules);

            expect(result).toEqual({
                '2024-01-01': [
                    { doctorId: 'doc1', clinicId: 'clinic1', time: '10:00:00' },
                    { doctorId: 'doc1', clinicId: 'clinic1', time: '11:00:00' },
                    { doctorId: 'doc2', clinicId: 'clinic2', time: '14:00:00' },
                ],
                '2024-01-02': [{ doctorId: 'doc1', clinicId: 'clinic1', time: '12:00:00' }],
            });
        });

        it('should handle schedules without slots', () => {
             const schedules = [{
                    idDoctor: 'doc1',
                    idClinic: 'clinic1',
                    slotdates: [{ date: '2024-01-01', slots: [] }, {date: '2024-01-02'}]
             }];
            const result = unifyAvailability(schedules);
            expect(result).toEqual({
                '2024-01-01': [],
                '2024-01-02': [],
            });
        });
    });

    describe('processAvailability', () => {
        const mockFilePath = path.join(__dirname, '../../src/pruebaTecnica.json');

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should process availability and save to database', async () => {
            const mockFileData = JSON.stringify({
                schedules: [
                    {
                        idDoctor: 'doc1',
                        idClinic: 'clinic1',
                        slotdates: [
                            {
                                date: '2024-01-01',
                                slots: [{ dateTime: '2024-01-01T10:00:00Z' }],
                            },
                        ],
                    },
                ],
            });
            (fs.readFileSync as jest.Mock).mockReturnValue(mockFileData);
            const mockSave = jest.fn().mockResolvedValue(true);
            (DoctorAvailability.prototype.save as jest.Mock).mockImplementation(mockSave);
            (DoctorAvailability.deleteMany as jest.Mock).mockResolvedValue(true);

            await processAvailability();

            expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf-8');
            expect(DoctorAvailability.deleteMany).toHaveBeenCalledWith({});
            expect(DoctorAvailability).toHaveBeenCalledWith({
                date: '2024-01-01',
                availability: [{ doctorId: 'doc1', clinicId: 'clinic1', time: '10:00:00' }],
            });
            expect(mockSave).toHaveBeenCalled();
        });

        it('should throw error for invalid data format', async () => {
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));

            await expect(processAvailability()).rejects.toThrow(
                'Formato de datos inválido: Se esperaba un objeto con una propiedad "schedules" que sea un array'
            );
        });

        it('should throw error for invalid schedules array', async () => {
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ schedules: 'invalid' }));

            await expect(processAvailability()).rejects.toThrow(
                'Formato de datos inválido: Se esperaba un objeto con una propiedad "schedules" que sea un array'
            );
        });
    });
});