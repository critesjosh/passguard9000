import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './ProtectedContent.css';

const ProtectedContent = ({ encryptedContent, correctPassword }) => {
    const [password, setPassword] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [unlocked, setUnlocked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // Attempt to decrypt the content with the provided password
            const decrypted = CryptoJS.AES.decrypt(encryptedContent, password).toString(CryptoJS.enc.Utf8);

            if (decrypted) {
                setContent(decrypted);
                setUnlocked(true);
                setError('');
            } else {
                setError('Invalid password. Please try again.');
            }
        } catch (err) {
            setError('Invalid password. Please try again.');
        }
    };

    return (
        <div className="protected-content">
            {!unlocked ? (
                <div className="password-form">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="password-input"
                            required
                        />
                        <button type="submit" className="unlock-button">
                            Unlock
                        </button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                <div className="content-container">
                    <div className="content">{content}</div>
                    <button
                        className="lock-button"
                        onClick={() => {
                            setUnlocked(false);
                            setPassword('');
                            setContent('');
                        }}
                    >
                        Lock
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProtectedContent; 