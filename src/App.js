import React from 'react';
import ProtectedContent from './components/ProtectedContent';
import './App.css';
import encryptedData from './data/encryptedMessage.json';

// Use the password from environment variables or fallback
const correctPassword = process.env.REACT_APP_CORRECT_PASSWORD || "secret123";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Protected Content</h1>
            </header>
            <main>
                <ProtectedContent
                    encryptedContent={encryptedData.encryptedMessage}
                    correctPassword={correctPassword}
                />
            </main>
            <footer>
                <p>Enter the password to unlock the content</p>
            </footer>
        </div>
    );
}

export default App; 