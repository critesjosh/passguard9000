require('dotenv').config();
const fs = require('fs');
const CryptoJS = require('crypto-js');
const path = require('path');

// Function to read and process the .env file directly
function readEnvFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let secretMessage = '';
    let password = '';
    let inMessage = false;

    for (const line of lines) {
        if (line.startsWith('SECRET_MESSAGE=')) {
            inMessage = true;
            secretMessage = line.substring('SECRET_MESSAGE='.length);
            // Remove starting quote if present
            if (secretMessage.startsWith('"')) {
                secretMessage = secretMessage.substring(1);
            } else {
                inMessage = false; // If no quotes, message is on one line
            }
        }
        else if (inMessage) {
            if (line.endsWith('"')) {
                // End of multi-line message
                secretMessage += '\n' + line.substring(0, line.length - 1);
                inMessage = false;
            } else {
                secretMessage += '\n' + line;
            }
        }
        else if (line.startsWith('CORRECT_PASSWORD=')) {
            password = line.substring('CORRECT_PASSWORD='.length);
        }
    }

    return { secretMessage, password };
}

// Main function
function encryptMessage() {
    try {
        // Read variables from .env file
        let { secretMessage, password } = readEnvFile('./.env');

        if (!secretMessage || !password) {
            console.error('Could not find SECRET_MESSAGE or CORRECT_PASSWORD in .env file');
            return;
        }

        console.log('Found secret message and password in .env file');

        // Now this will work because secretMessage is not a constant
        secretMessage = secretMessage.replace(/\\n/g, '\n');

        // Encrypt the message
        const encryptedMessage = CryptoJS.AES.encrypt(secretMessage, password).toString();

        console.log('\n=== ENCRYPTED MESSAGE ===');
        console.log(encryptedMessage);
        console.log('========================\n');

        // Create directory if it doesn't exist
        const outputPath = './src/data';
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        // Write to src/data/encryptedMessage.json
        fs.writeFileSync(path.join(outputPath, 'encryptedMessage.json'), JSON.stringify({
            encryptedMessage: encryptedMessage
        }, null, 2));

        console.log('Encrypted message saved to src/data/encryptedMessage.json');

        // Verify decryption works
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, password).toString(CryptoJS.enc.Utf8);
        const verified = decrypted === secretMessage;

        console.log('Verification test:', verified ? 'PASSED' : 'FAILED');

        if (!verified) {
            console.error('Warning: The decrypted message does not match the original!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the script
encryptMessage(); 