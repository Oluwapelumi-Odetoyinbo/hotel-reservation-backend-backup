MongoDB Connection Explanation

This note explains a Mongoose-based MongoDB connection setup for a Node.js/Express/TypeScript backend, integrated with a Winston logger.

Code

import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectToDB = async (): Promise<void> => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI as string);
        logger.info(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectToDB;

Breakdown





Imports:





mongoose: Mongoose library for MongoDB, providing schemas and models.



logger: Winston logger from ../utils/logger for logging connection events.



TypeScript: Mongoose has built-in types; logger is typed as winston.Logger.



Function Definition:





connectToDB = async (): Promise<void>: Async function returning a Promise<void>.



Purpose: Connects to MongoDB and handles errors.



Connection Logic:





await mongoose.connect(process.env.MONGODB_URI as string):





Connects to MongoDB using the URI from MONGODB_URI environment variable.



as string: Assumes MONGODB_URI is a string (requires validation).



connect.connection.host: Logs the connected host (e.g., localhost).



Error Handling:





try-catch: Catches connection errors (e.g., invalid URI, server down).



logger.error: Logs errors to logs/error.log and logs/combined.log.



process.exit(1): Exits the app on failure.



Export:





export default connectToDB: Allows use in other files (e.g., Express server).

Usage Example





Call in Express server:

import connectToDB from './db';
import express from 'express';

const app = express();
const startServer = async () => {
    await connectToDB();
    app.listen(3000, () => console.log('Server running on port 3000'));
};
startServer();

Best Practices





Validate MONGODB_URI:

if (!process.env.MONGODB_URI) {
    logger.error('MONGODB_URI is not defined');
    process.exit(1);
}



Connection Options:

mongoose.connect(process.env.MONGODB_URI, { connectTimeoutMS: 10000 });



Retry Logic:





Retry failed connections before exiting (e.g., 3 attempts with 5s delay).



Connection Events:

mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));



Graceful Shutdown:

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
});

Pitfalls to Avoid





Missing MONGODB_URI: Validate to avoid runtime errors.



Error Logging: Use (error as Error).message for cleaner logs.



Immediate Exit: Consider retries instead of process.exit.



Connection Leaks: Close connections on shutdown.

Study Tips





Test: Call connectToDB() and check logs for success/error messages.



Extend: Add retry logic or connection events.



Review: Read Mongoose docs (https://mongoosejs.com/docs/connections.html) for advanced options.