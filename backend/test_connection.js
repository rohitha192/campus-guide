// This is a simple test script to check the database connection.

const mongoose = require('mongoose');

// The address of your database.
const DATABASE_ADDRESS = "mongodb://localhost:27017/vignanGuideDB";

// The structure of your Event data.
const EventSchema = new mongoose.Schema({
    name: String,
    description: String,
    startTime: Date,
    endTime: Date,
    locationName: String,
    council: String
});

// The model that connects to the 'events' collection.
const Event = mongoose.model('Event', EventSchema);

// The main function that runs the test.
async function runTest() {
    console.log('--- [STARTING FINAL CONNECTION TEST] ---');
    console.log('Attempting to connect to:', DATABASE_ADDRESS);

    try {
        // 1. Connect to the database.
        await mongoose.connect(DATABASE_ADDRESS);
        console.log('✅✅✅ SUCCESS: Connected to the database!');

        // 2. Find all documents in the 'events' collection.
        console.log("Searching for all documents in the 'events' collection...");
        const events = await Event.find({}); // The {} means "find everything".

        // 3. Report the results.
        console.log(`\n--- [TEST RESULTS] ---`);
        console.log(`FOUND ${events.length} EVENTS IN THE DATABASE.`);

        if (events.length > 0) {
            console.log('Here are the names of the events found:');
            // Print the name of each event found.
            events.forEach(event => {
                console.log(`- ${event.name}`);
            });
        } else {
            console.log('The code connected, but the "events" collection appears to be empty or does not exist in this database.');
        }

    } catch (error) {
        console.error('\n--- [!!! TEST FAILED !!!] ---');
        console.error('❌❌❌ FAILED TO CONNECT TO THE DATABASE.');
        console.error('This means the address is wrong or the database server is not running.');
        console.error(error);
    } finally {
        // 4. Disconnect from the database.
        await mongoose.disconnect();
        console.log('\n--- [TEST COMPLETE] ---');
    }
}

// Run the test.
runTest();