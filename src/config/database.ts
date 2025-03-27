import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/plenna';
        await mongoose.connect(mongoUri, {}); // Use 'mongodb' as hostname
        console.log('Conexión a MongoDB establecida con éxito');
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
    }
};