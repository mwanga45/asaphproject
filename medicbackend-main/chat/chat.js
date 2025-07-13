require('dotenv').config()
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Environment variable for Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log(GEMINI_API_KEY)

// Validate API key
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
  console.error('⚠️  WARNING: GEMINI_API_KEY not set or invalid in environment variables');
  console.error('Please set your Gemini API key in the .env file');
}

// POST endpoint to handle AI chat requests
router.post('/chat', async (req, res) => {
  try {
    const { message, context = 'healthcare' } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured. Please set up the Gemini API key.'
      });
    }

    // Prepare the request for Gemini API
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: `You are a healthcare AI assistant. Please provide helpful, accurate, and professional responses about healthcare topics. User question: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('🤖 Sending request to Gemini API...');

    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Extract the response text
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    console.log('✅ Gemini API response received successfully');

    // Send response back to frontend
    res.json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date().toISOString(),
        type: 'ai_response'
      }
    });

  } catch (error) {
    console.error('❌ Error calling Gemini API:');

    // Handle different types of errors
    if (error.response) {
      // API responded with error status
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
      
      // Don't expose API key in error logs
      const errorDetails = {
        status: error.response.status,
        message: error.response.data?.error?.message || 'Unknown API error'
      };
      
      res.status(error.response.status).json({
        success: false,
        error: 'AI service error',
        details: errorDetails
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from Gemini API');
      res.status(503).json({
        success: false,
        error: 'AI service unavailable - no response received'
      });
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// GET endpoint to check if the service is running
router.get('/health', (req, res) => {
  const apiKeyStatus = GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY' ? 'configured' : 'not configured';
  
  res.json({
    success: true,
    message: 'AI Chat service is running',
    timestamp: new Date().toISOString(),
    apiKeyStatus: apiKeyStatus
  });
});

// POST endpoint for generating healthcare insights
router.post('/insights', async (req, res) => {
  try {
    const { data, analysisType = 'general' } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data is required for analysis'
      });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured. Please set up the Gemini API key.'
      });
    }

    const prompt = `Analyze this healthcare data and provide insights: ${JSON.stringify(data)}. 
    Analysis type: ${analysisType}. 
    Please provide: 
    1. Key findings
    2. Trends identified
    3. Recommendations
    4. Confidence level (0-100)`;

    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      data: {
        insights: aiResponse,
        timestamp: new Date().toISOString(),
        type: 'insights',
        analysisType
      }
    });

  } catch (error) {
    console.error('Error generating insights:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

// POST endpoint for generating charts recommendations
router.post('/chart-recommendation', async (req, res) => {
  try {
    const { data, chartType = 'auto' } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data is required for chart recommendation'
      });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured. Please set up the Gemini API key.'
      });
    }

    const prompt = `Based on this data: ${JSON.stringify(data)}, recommend the best chart type for visualization. 
    Preferred chart type: ${chartType}. 
    Please provide: 
    1. Recommended chart type
    2. Reason for recommendation
    3. Data preparation suggestions`;

    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      data: {
        recommendation: aiResponse,
        timestamp: new Date().toISOString(),
        type: 'chart_recommendation',
        chartType
      }
    });

  } catch (error) {
    console.error('Error generating chart recommendation:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate chart recommendation'
    });
  }
});

module.exports = router;