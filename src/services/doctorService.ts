import fs from 'fs';
import path from 'path';
import DoctorAvailability from '../models/DoctorsAvailability';

/**
 * Unifies doctor availability schedules into a structured format.
 *
 * @param schedules An array of doctor schedules.
 * @returns A record (object) where keys are dates (YYYY-MM-DD) and values are arrays of availability slots.
 */
export const unifyAvailability = (schedules: any[]): Record<string, any[]> => {
  const unifiedAvailability: Record<string, any[]> = {};

  schedules.forEach((schedule: any) => {
    schedule.slotdates.forEach((slotdate: any) => {
      // Extract date in YYYY-MM-DD format from slotdate.date
      const date = new Date(slotdate.date).toISOString().split('T')[0];

      // Initialize an array for the date if it doesn't exist in unifiedAvailability
      if (!unifiedAvailability[date]) {
        unifiedAvailability[date] = [];
      }

      // Process slots if they exist in slotdate
      if (slotdate.slots) {
        slotdate.slots.forEach((slot: any) => {
          // Extract time in HH:MM:SS format from slot.dateTime
          const time = new Date(slot.dateTime).toISOString().split('T')[1].split('.')[0];

          // Push availability slot data to the array for the corresponding date
          unifiedAvailability[date].push({
            doctorId: schedule.idDoctor,
            clinicId: schedule.idClinic,
            time: time,
          });
        });
      }
    });
  });

  return unifiedAvailability;
};

/**
 * Processes doctor availability data from a JSON file, unifies it, and saves it to the database.
 *
 * @returns A promise that resolves to the unified availability data.
 * @throws An error if the JSON data format is invalid.
 */
export const processAvailability = async () => {
  // Construct the file path to the JSON file
  const filePath = path.join(__dirname, '../../src/pruebaTecnica.json');

  // Read the JSON file and parse its content
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const doctorsData = JSON.parse(fileData);

  // Validate the structure of the JSON data
  if (!doctorsData || !doctorsData.schedules || !Array.isArray(doctorsData.schedules)) {
    throw new Error('Formato de datos inválido: Se esperaba un objeto con una propiedad "schedules" que sea un array');
  }

  // Unify the availability schedules
  const unifiedAvailability = unifyAvailability(doctorsData.schedules);

  // Clear existing availability data from the database
  await DoctorAvailability.deleteMany({});

  // Iterate over each day in the unified availability and save it to the database
  for (const day in unifiedAvailability) {
    if (Object.prototype.hasOwnProperty.call(unifiedAvailability, day)) {
      const availabilityData = unifiedAvailability[day];

      // Create a new DoctorAvailability document
      const doctorEntry = new DoctorAvailability({
        date: day,
        availability: availabilityData,
      });

      // Save the document to the database
      await doctorEntry.save();
    }
  }

  // Return the unified availability data
  return unifiedAvailability;
};