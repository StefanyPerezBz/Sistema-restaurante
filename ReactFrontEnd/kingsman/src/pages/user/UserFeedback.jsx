import ShowFeedback from './ShowFeedback'; // Import ShowFeedback component
import React, { useState } from 'react';
import { Textarea, Button, Alert } from "flowbite-react";
import { Rating } from '@mui/material';
import { TextInput  } from "flowbite-react";


export default function UserFeedback() {
    const [name, setName] = useState(''); // State for name input
    const [feedback, setFeedback] = useState(''); // State for feedback input
    const [rate, setRate] = useState(3); // Placeholder value for rating
    const [submitting, setSubmitting] = useState(false); // State to manage submission status
    const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct feedback object
        const feedbackData = {
            name: name,
            feedback: feedback,
            rate: rate
        };

        // Set submitting to true while waiting for response
        setSubmitting(true);

        try {
            // Make POST request to backend
            const response = await fetch('http://localhost:8080/addFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            // Reset form fields
            setName('');
            setFeedback('');
            setRate(3);

            // Handle response
            if (response.ok) {
                console.log('Feedback submitted successfully');
                setShowAlert(true); // Show alert on successful submission

                // Set a timer to hide the alert after one second
                setTimeout(() => {
                    setShowAlert(false);
                }, 1000);
            } else {
                console.error('Error submitting feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            // Set submitting back to false after request is complete
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-0">
            <div className="flex flex-row w-full">
                {/* Left side for ShowFeedback */}
                <div className="w-1/3 p-5">
                    <ShowFeedback />
                </div>
                {/* Right side for Feedback */}
                <div className="w-2/3 p-5">
                
                    <div className="sticky top-0 h-screen overflow-y-auto flex justify-center items-center  ">
                        <form onSubmit={handleSubmit} className="p-5 bg-slate-300 border-black rounded-lg">
                            <div className="mb-8 flex justify-between">
                                <h1 className="text-xl font-bold">Kingsman</h1>
                                <h1 className="text-xl font-bold">Your Feedback</h1>
                            </div>
                            <hr />
                            <div className="mb-7">
                                <p className="text-lg mb-2">We would like your feedback to improve our service</p>
                                <div>
                                    {/* Name input */}
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        required
                                        shadow
                                    />
                                </div>
                                <div className="flex justify-center items-center">
                                    {/* Rating input */}
                                    <Rating
                                        name="rate"
                                        value={rate}
                                        precision={0.5} // Allow half-star increments
                                        sx={{ fontSize: '32px' }} // Increase the size of stars
                                        onChange={(event, newValue) => {
                                            setRate(newValue);
                                        }}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className="mb-4">
                                <div className="mb-2">
                                    <label htmlFor="comment" className="text-lg">Your Feedback</label>
                                </div>
                                {/* Feedback input */}
                                <Textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Leave an opinion..."
                                    required
                                    rows={7}
                                />
                            </div>
                            <div className="mb-4 flex justify-end">
                                {/* Submit button */}
                                <Button type="submit" color="blue" pill disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                                </Button>
                            </div>
                            <div className='flex justify-center'>
                                {showAlert && (
                                    <Alert color="success" rounded>
                                        <span className="font-medium"></span> Feedback submitted successfully.
                                    </Alert>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
