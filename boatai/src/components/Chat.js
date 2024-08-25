import React, { useState } from 'react';
import sampleData from "./sampleData.json";
import SideBar from './SideBar';
import { Card, Typography, CardContent, Grid, Button, Stack, IconButton, TextField, Modal, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Chat = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [userInput, setUserInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [pastConversation, setPastConversation] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState(null);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [conversationIndex, setConversationIndex] = useState(null);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    }

    const handleQuestionClick = (id) => {
        setSelectedQuestion(prev => (prev == id ? null : id))
    }

    const handleAsk = () => {
        setConversation(prev => [...prev, { type: "user", content: userInput }])

        const matchingData = sampleData.find(data => data.question.toLowerCase().includes(userInput.toLowerCase()))

        setTimeout(() => {
            setConversation(prev => [...prev, { type: "ai", content: matchingData ? matchingData.response : "I'm sorry, I don't have an answer for that question." }])
        }, 1000)
        setUserInput("");
    }
    const handleClick = (type, index) => {
        setIsFeedbackOpen(true)
        setFeedbackType(type)
        setConversationIndex(index)
    }
    const handleClose = () => {
        setIsFeedbackOpen(false)
        setFeedbackType(null)
        setConversationIndex(null)
    }
    const handleSave = () => {
        const newChat = {
            id: new Date().getTime(),
            messages: conversation,
            feedback: feedbackText,
            rating: feedbackType
        }
        setPastConversation(prev => [...prev, newChat])
        setConversation([]);
        setIsOpen(true)
        setFeedbackText("");
    }
    const handleFeedbackTextChange = (event) => {
        setFeedbackText(event.target.value)
    }

    const handleSubmitFeedback = () => {
        const updatedConversation = conversation
        updatedConversation[conversationIndex].rating = feedbackType
        updatedConversation[conversationIndex].feedback = feedbackText
        setConversation(updatedConversation)
        setFeedbackText(null)
        setConversationIndex(null)
        setFeedbackText('')
        setIsFeedbackOpen(false)
    }

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "purple", marginBottom: "50px" }}>
                <h2>Bot AI</h2>

            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <h1>How can I Help you Today?</h1>

            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img style={{ display: "flex", justifyContent: "center", alignItems: "center" }} src='Assets/chatlogo.svg' />
            </div>



            <Grid container spacing={2} justifyContent="center">
                {sampleData.slice(0, 4).map((data) => (
                    <Grid item xs={12} sm={6} key={data.id}>
                        <Card sx={{ minWidth: 275 }} onClick={() => handleQuestionClick(data.id)}>
                            <CardContent>
                                <Typography key={data.id} sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>

                                    {data.question}
                                </Typography>
                                {/*  */}
                                {selectedQuestion == data.id && (
                                    <Typography>
                                        {data.response}
                                    </Typography>
                                )}

                            </CardContent>
                        </Card>
                    </Grid>


                ))}
            </Grid>
            {conversation.map((message, index) => (
                <Card sx={{ minWidth: 275, backgroundColor: "lightyellow" }}>
                    <CardContent>
                        {message.type == "user" ? (
                            <img src="Assets/you.svg" style={{ width: 50, height: 50 }} />
                        ) : (
                            <img src="Assets/chatlogo.svg" style={{ width: 50, height: 50 }} />
                        )}
                        <Typography>
                            <strong>{message.type == "user" ? "you:" : "soulAI:"}</strong>
                            {message.content}
                        </Typography>
                        {(message.type == "ai" && !message?.rating) ? (
                            <Stack direction="row" spacing={1} sx={{ marginTop: "10px" }}>
                                <IconButton onClick={() => handleClick("up", index)}>
                                    <ThumbUpIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={() => handleClick("down", index)}>
                                    <ThumbDownIcon color="error" />
                                </IconButton>
                            </Stack>
                        ) : (message.type == "ai" && message?.rating ?
                            <Stack direction="row" spacing={1} sx={{ marginTop: "10px" }}>
                                {message?.rating === 'up' ?
                                    <IconButton>
                                        Feedback :<ThumbUpIcon color="primary" />
                                    </IconButton>
                                    :
                                    <IconButton>
                                        Feedback :<ThumbDownIcon color="error" />
                                    </IconButton>
                                }
                                <p>{message.feedback}</p>
                            </Stack>
                            :
                            null
                        )
                        }
                    </CardContent>
                </Card>
            ))}
            <div style={{ display: "flex", marginTop: "20px", marginLeft: "5px", justifyContent: "space-between" }}>
                <input style={{ width: "85%" }} type="text" value={userInput} onChange={handleInputChange}></input>
                <Stack spacing={1} direction="row" sx={{ padding: "5px" }}>
                    <Button variant="contained" onClick={handleAsk}>Ask</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </Stack>
            </div>
            <div style={{ marginTop: "20px", padding: "0 20px" }}>

            </div>
            {pastConversation.length > 0 && (
                <SideBar pastConversations={pastConversation} setConversation={setConversation} setIsOpen={setIsOpen} isOpen={isOpen} />
            )}
            <Modal open={isFeedbackOpen} onClose={handleClose} aria-labelledby="modal-title"
                aria-describedby="modal-description" >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, p: 4 }}>

                    <Typography>
                        {feedbackType == "up" ? "Thumps Up Feedback" : "Thumbs down Feedback"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Your Feedback"
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mt: 2 }}
                        value={feedbackText}
                        onChange={handleFeedbackTextChange}
                    />
                    <Button onClick={handleSubmitFeedback}>Submit</Button>
                </Box>
            </Modal>
        </>
    )
}
export default Chat;