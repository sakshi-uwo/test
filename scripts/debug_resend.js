import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Resend import...');
const resend = new Resend(process.env.RESEND_API_KEY);
console.log('Resend instance created.');

async function test() {
    try {
        console.log('API Key present?', !!process.env.RESEND_API_KEY);
        console.log('Attempting to list emails (sanity check)...');
        // This might fail if key is invalid, but we just want to see if SDK works
        const { data, error } = await resend.emails.get('123');
        console.log('SDK Call completed.');
    } catch (e) {
        console.error('SDK Call failed as expected or unexpected:', e.message);
    }
}

test();
