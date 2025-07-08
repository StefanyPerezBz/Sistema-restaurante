import React, { useState, useEffect } from 'react';
import { Timeline } from "flowbite-react";
import { Rating } from '@mui/material';
import axios from 'axios';
import { CircularProgress, Alert } from '@mui/material';

function ShowFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/showFeedback`);
        setFeedbackList(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress size={24} color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error" className="text-sm">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-6">Comentarios de clientes</h2>

        {feedbackList.length === 0 ? (
          <p className="text-center py-4 text-sm text-gray-500">
            No hay comentarios disponibles.
          </p>
        ) : (
          <Timeline className="max-w-3xl mx-auto">
            {feedbackList.map((feedbackItem, index) => (
              <Timeline.Item key={index} className="mb-4">
                <Timeline.Point className="w-3 h-3 bg-yellow-500" />
                <Timeline.Content className="ml-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <Timeline.Title className="text-base font-medium text-yellow-600">
                      {feedbackItem.name}
                    </Timeline.Title>
                    <div className="flex items-center">
                      <Rating 
                        name={`rating-${index}`}
                        value={feedbackItem.rate}
                        precision={0.5}
                        size="small"
                        sx={{ 
                          fontSize: '18px',
                          color: '#facc15'
                        }}
                        readOnly
                      />
                      <span className="ml-1 text-xs text-gray-500">
                        {feedbackItem.rate.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Timeline.Time className="text-xs mb-1 text-gray-500">
                    {new Date(feedbackItem.date || Date.now()).toLocaleDateString()}
                  </Timeline.Time>
                  <Timeline.Body className="text-sm mt-1 text-gray-700">
                    {feedbackItem.feedback}
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </div>
    </div>
  );
}

export default ShowFeedback;