import React, { useState, useEffect } from 'react';
import { Timeline } from "flowbite-react";
import { Rating } from '@mui/material';
import axios from 'axios'; // Import Axios for making HTTP requests

export default function ShowFeedback() {
  const [feedbackList, setFeedbackList] = useState([]); // State to store feedback data

  useEffect(() => {
    // Function to fetch feedback data from the backend
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:8080/showFeedback');
        setFeedbackList(response.data); // Update feedbackList state with data from the backend
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    // Call fetchFeedback when the component mounts and whenever the feedbackList changes
    fetchFeedback();
  }, [feedbackList]); // Dependency array includes feedbackList, so the effect will re-run whenever feedbackList changes

  return (
    <Timeline className="mt-12 ml-10">
      {feedbackList.map((feedbackItem, index) => (
        <Timeline.Item key={index}>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Title>{feedbackItem.name}</Timeline.Title>
            <Timeline.Time className='flex justify-self-start'>
              <div className="flex justify-center items-center">
                {/* Display star rating dynamically */}
                <Rating 
                  name="foods-rating"
                  value={feedbackItem.rate}
                  precision={0.5} // Allow half-star increments
                  sx={{ fontSize: '32px' }} // Increase the size of stars
                  readOnly // Make the rating read-only
                />
              </div>
            </Timeline.Time>
            <Timeline.Body>
              {feedbackItem.feedback}
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
