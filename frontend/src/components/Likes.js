import React from "react";
import { apiUrl } from "../api";

const Likes = ({ numberOfLikes, threadId }) => {

    // Sends like to server
    const handleLikeFunction = (e) => {

        // Prevents from clicking on thread itself
        e.stopPropagation();

        fetch(apiUrl("/api/thread/like"), {
            method: "POST",
            body: JSON.stringify({
                threadId,
                userId: localStorage.getItem("_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error_message) {
                    alert(data.error_message);
                } else {
                    alert(data.message);
                    
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className='likes_container'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"
                className='w-4 h-4 likesBtn'
                onClick={handleLikeFunction}
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
            <p style={{ color: "#FFFFFF" }}>
                {numberOfLikes === 0 ? "0" : numberOfLikes}
            </p>
        </div>
    );
};

export default Likes;