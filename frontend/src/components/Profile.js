import React, { useState, useEffect} from "react";
import Nav from "./Nav";
import {useParams} from 'react-router-dom';
import _, { size } from 'lodash';
import { apiUrl } from "../api";

const Profile = () => {
    const [isActive, setIsActive] = useState(false); // For Animation
    const {userId} = useParams();
    const [username, setUsername] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsActive(true);
    }, []);

    // For Audio Handling
    const [audioFile, setAudioFile] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);


    // Fetch users and username
    useEffect(() => {
        fetch(apiUrl('/api/all/users'))
            .then(response => response.json())
            .then(data => {
                const user = data.users.find(user => user.id === userId);
                if (user) {
                    setUsername(user.username);
                    setAudioUrl(user.storedAudioUrl);
                } else {
                    console.error("User not Found");
                }
            })
            .catch(err => {
                console.error("Failed to fetch user", err);
            });
    }, [userId]);

    const handleFileChange = (event) => {
        setAudioFile(event.target.files[0]);
    }

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('audioFile', audioFile);
        formData.append('userId', userId);

        fetch(apiUrl('/api/upload'), {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.fileUrl) {
                    setAudioUrl(data.fileUrl);
                } else {
                    setError('Failed to upload files');
                }
            })
            .catch(err => {
                setError('Error uploading file');
            });
    };

    return (
        <>
        <Nav/>
        <main className="profile">
            <div className={`profileContainer ${isActive ? "active" : ""}`}>
                <img className="profilePicture" src="/profilePicture.png" alt="profPic"></img>
                <h1>{_.capitalize(username)}</h1>
                {audioUrl ? (
                    // If there's an audio URL, show the audio preview
                    <div className="audioPreview">
                        <p>Audio Preview:</p>
                        <p className="previewDescription">Users hear this when they see your posts!</p>
                        <audio controls src={audioUrl} />
                        <div className="uploadForm">
                        <p className="changePreview">Change Preview</p>
                        <input type='file' onChange={handleFileChange} />
                        <button className="modalBtn" onClick={handleUpload}>Upload</button>
                    </div>
                    </div>
                ) : (
                    // If there's no audio URL, show the upload form
                    <div className="uploadForm">
                        <p>Audio preview:</p>
                        <p className="previewDescription">Users will hear this when they see your posts!</p>
                        <input type='file' onChange={handleFileChange} />
                        <button className="modalBtn" onClick={handleUpload}>Upload</button>
                    </div>
                )}
                
                {error && <p>{error}</p>}
            </div>
            
        </main>
        </>
    );
};

export default Profile;