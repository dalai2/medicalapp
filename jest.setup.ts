import mongoose from 'mongoose';

const mongoUri = process.env.TESTDB_URI || 'mongodb://mongodb:27017/testdb';
// Connect to the database before running tests
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri, {
    });
  }
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});