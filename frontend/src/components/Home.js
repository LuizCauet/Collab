import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Likes from "./Likes";
import Comments from "./Comments";
import { apiUrl } from "../api";

const Home = () => {
    const navigate = useNavigate();

    // A post
    const [thread, setThread] = useState("");
    // Array with all posts
    const [threadList, setThreadList] = useState([]);

    // Audio
    const [currentAudio, setCurrentAudio] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        createThread();
        setThread("");
    };

    // Checks if User is logged in
    useEffect(() => {
        setIsActive(true);
        const checkUser = () => {
            if (!localStorage.getItem("_id")) {
                navigate("/");
            } else {
                fetch(apiUrl("/api/all/threads"))
                .then((res) => res.json())
                .then((data) => setThreadList(data.threads))
                .catch((err) => console.error(err));
            }
        };
        checkUser();
    }, [navigate]);

    const createThread = () => {
        fetch(apiUrl("/api/create/thread"), {
            method: "POST",
            body: JSON.stringify({
                thread,
                userId: localStorage.getItem("_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setThreadList(data.threads);
            })
            .catch((err) => console.error(err));
    };

    const goToThread = (threadId) => {
        navigate(`/${threadId}/replies`);
    }

    // Gets Audio based on thread and its author's id
    const getAudio = async (thread) => {
        try {
            const response = await fetch(apiUrl('/api/all/users'));
            const data = await response.json();
            const user = data.users.find(user => user.id === thread.userId);

            if (user) {
                return user.storedAudioUrl;  // Return the audio URL directly
            } else {
                console.error("User not found");
                return null;  // Return null if user is not found
            }
        } catch (err) {
            console.error("Failed to fetch user", err);
            return null;  // Return null if there's an error
        }
    };

    // Add audioUrl fetch
    const playAudio = async (thread) => {
        // If audio already playing, stop it
        if (currentAudio && currentAudio.src !== "") {
            currentAudio.pause();
            currentAudio.src = "";  // Reset the previous audio source
        }

        // Get the audio URL
        const audioUrl = await getAudio(thread); // Await the result of getAudio

        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.volume = 0.65;
            audio.play().catch(error => {
                console.error("Audio play failed: ", error);
            });

            setCurrentAudio(audio);  // Store the current audio
        }
    }

    const stopAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
        }
    };

    const handleThreadClick = (thread) => {
        stopAudio();
        goToThread(thread.id);
    }

    const [isActive, setIsActive] = useState(false); // For Animation

    return (
        <>
            <Nav />
            <main className='home'>
                
                <form className='homeForm' onSubmit={handleSubmit}>
                    <div className='home_container'>
                        <textarea
                            type='textarea'
                            rows={3}
                            name='thread'
                            required
                            value={thread}
                            onChange={(e) => setThread(e.target.value)}
                            placeholder="What's on your mind?"
                        />
                    </div>
                    <div className="button_container">
                        <button className='modalBtn'>Post</button>
                    </div>
                </form>

                <div className='thread_container'>
                    {threadList.map((thread) => (
                        <div className='thread_item' 
                            key={thread.id} 
                            onClick={() => handleThreadClick(thread)}
                            onMouseEnter={() => playAudio(thread)}
                            onMouseLeave={stopAudio}
                            >
                            <div className="threadTitleContainer">
                                <p className="postUsername" style={{opacity: "0.5" }}>- {thread.username}</p>
                                <p className="thread_title">{thread.title}</p>
                            </div>
                            <div className='reactions_container'>
                                <Likes numberOfLikes={thread.likes.length} threadId = {thread.id}/>
                                <Comments 
                                    numberOfComments = {thread.replies.length}
                                    threadId={thread.id}
                                    title={thread.title}
                                    />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Home;