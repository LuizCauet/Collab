import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { apiUrl } from "../api";

const Replies = () => {
    const [replyList, setReplyList] = useState([]);
    const [reply, setReply] = useState("");
    const [title, setTitle] = useState("");
    const [isActive, setIsActive] = useState(false); // For Animation
    const navigate = useNavigate();
    const { id } = useParams();

    const addReply = () => {
        fetch(apiUrl("/api/create/reply"), {
			method: "POST",
			body: JSON.stringify({
				id,
				userId: localStorage.getItem("_id"),
				reply,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
                console.log(data.message);
				window.location.reload();
			})
			.catch((err) => console.error(err));
	};

    useEffect(() => {
        setIsActive(true);

        const fetchReplies = () => {
            fetch(apiUrl("/api/thread/replies"), {
                method: "POST",
                body: JSON.stringify({
                    id,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setReplyList(data.replies);
                    setTitle(data.title);
                })
                .catch((err) => console.error(err));
        };
        fetchReplies();
    }, [id]);

    const handleSubmitReply = (e) => {
        e.preventDefault();
        addReply();
        setReply("");
    };

    const handleBackButton = () => {
        navigate('/dashboard');
    }

    return (
        <>
        <Nav />
        <main className='replies'>
            <div className="titleContainer">
                <svg className="backButton"  onClick={handleBackButton} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <h1 className='replies_title'>{title}</h1>
            </div>

            
            
            <form className='modal_content' onSubmit={handleSubmitReply}>
                <label htmlFor='reply'>Reply to the thread</label>
                <textarea
                    rows={5}
                    required
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    type='text'
                    name='reply'
                    className='modalInput'
                />
                <div className="button_container">
                    <button className='modalBtn'>Send</button>
                </div>
                
            </form>
    
            <div className={`replies_container ${isActive ? 'slideUp' : ''}`}>
                {replyList.map((reply) => (
                    <div className='reply'>
                            <div>
                                <p className="reply_username" style={{ opacity: "0.5" }}>- {reply.name}</p>
                            </div>
                            <div>
                                <p className="reply_text">{reply.text}</p>
                            </div>
                        </div>
                ))}
            </div>
        </main>
        </>
    );    
};

export default Replies;