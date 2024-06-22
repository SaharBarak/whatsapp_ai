import cron from 'node-cron';
import axios from 'axios';

export function scheduleCronJobs() {
    cron.schedule('0 0 * * 0', () => { // Runs every Sunday at midnight
        console.log('Running cron job to generate and send newsletter...');
        axios.get('http://localhost:3000/generate-newsletter')
            .then(() => axios.get('http://localhost:3000/send-newsletter'))
            .catch(error => console.error('Error during cron job execution:', error));
    });
}
