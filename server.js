import {} from 'dotenv/config.js'
import mongoose from 'mongoose';

import { app } from './app.js'
import { config } from './config/index.js'
import { logError } from './src/helpers/index.js';
import {scheduleTasks} from './src/workers/scheduler.js'

const {PORT, DB} = config
// Do server startup here

const startServer = async () => {
	try {	

		if (!PORT) {
			throw new Error("PORT has not been set as an environment variable");
		}

		if (!DB.URL) {
			throw new Error("MONGO_URI has not been set as an environment variable");	
		}

		
		await mongoose.connect(DB.URL, {
			useNewUrlParser: true,
			dbName: DB_NAME
		});


		app.listen(PORT, (err) => { //start server
			if (err) {
				process.exit(-1)
			}
		console.log(`Started!!! Server listening on ${PORT}`);
		});
		
		scheduleTasks() //initialize the sron

	} catch (error) {

		logError('startServer', error)
		throw new Error("Error occured trying to startup server");	

	}

};

startServer();