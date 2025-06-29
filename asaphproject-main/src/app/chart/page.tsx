"use client"
import React, { useState, useEffect } from 'react'
import { 
  FaChartLine, 
  FaBrain, 
  FaLightbulb, 
  FaDownload, 
  FaUsers,
  FaHeartbeat,
  FaThermometerHalf,
  FaTint
} from 'react-icons/fa'
import "./chart.css"

interface AiInsight {
  id: number;
  type: string;
  message: string;
  confidence: number;
}

export default function ChartPage() {
  const [selectedChart, setSelectedChart] = useState<string>('line')
  const [timeRange, setTimeRange] = useState<string>('week')
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Sample data for different charts
  const patientData = [
    { name: 'Mon', patients: 65, consultations: 45, aiPredictions: 52 },
    { name: 'Tue', patients: 78, consultations: 62, aiPredictions: 71 },
    { name: 'Wed', patients: 90, consultations: 75, aiPredictions: 83 },
    { name: 'Thu', patients: 81, consultations: 68, aiPredictions: 74 },
    { name: 'Fri', patients: 95, consultations: 82, aiPredictions: 88 },
    { name: 'Sat', patients: 72, consultations: 58, aiPredictions: 65 },
    { name: 'Sun', patients: 68, consultations: 55, aiPredictions: 61 }
  ]

  const aiInsightsData: AiInsight[] = [
    { id: 1, type: 'trend', message: 'Patient volume expected to increase by 15% next week', confidence: 87 },
    { id: 2, type: 'anomaly', message: 'Unusual spike in consultations detected', confidence: 92 },
    { id: 3, type: 'prediction', message: 'Peak hours: 2-4 PM daily', confidence: 78 },
    { id: 4, type: 'recommendation', message: 'Consider adding more staff on weekends', confidence: 85 }
  ]

  useEffect(() => {
    setAiInsights(aiInsightsData)
  }, [])

  const handleChartChange = (chartType: string) => {
    setSelectedChart(chartType)
  }

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="chart-container">
      {/* Header Section */}
      <div className="chart-header">
        <div className="header-content">
          <h1><FaChartLine /> AI-Powered Analytics Dashboard</h1>
          <p>Real-time insights and predictions for healthcare management</p>
        </div>
        <div className="header-actions">
          <button className="download-btn">
            <FaDownload /> Export Data
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="chart-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <div className="chart-type-buttons">
            <button 
              className={selectedChart === 'line' ? 'active' : ''} 
              onClick={() => handleChartChange('line')}
            >
              Line Chart
            </button>
            <button 
              className={selectedChart === 'area' ? 'active' : ''} 
              onClick={() => handleChartChange('area')}
            >
              Area Chart
            </button>
            <button 
              className={selectedChart === 'bar' ? 'active' : ''} 
              onClick={() => handleChartChange('bar')}
            >
              Bar Chart
            </button>
            <button 
              className={selectedChart === 'pie' ? 'active' : ''} 
              onClick={() => handleChartChange('pie')}
            >
              Pie Chart
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Time Range:</label>
          <div className="time-range-buttons">
            <button 
              className={timeRange === 'day' ? 'active' : ''} 
              onClick={() => handleTimeRangeChange('day')}
            >
              Day
            </button>
            <button 
              className={timeRange === 'week' ? 'active' : ''} 
              onClick={() => handleTimeRangeChange('week')}
            >
              Week
            </button>
            <button 
              className={timeRange === 'month' ? 'active' : ''} 
              onClick={() => handleTimeRangeChange('month')}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="chart-grid">
        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Patient Analytics</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#8884d8'}}></span>
                  Patients
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#82ca9d'}}></span>
                  Consultations
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#ffc658'}}></span>
                  AI Predictions
                </span>
              </div>
            </div>
            <div className="chart-content">
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>AI is analyzing data...</p>
                </div>
              ) : (
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    {patientData.map((data, index) => (
                      <div key={index} className="chart-bar">
                        <div className="bar-group">
                          <div 
                            className="bar patients" 
                            style={{height: `${data.patients}%`}}
                          ></div>
                          <div 
                            className="bar consultations" 
                            style={{height: `${data.consultations}%`}}
                          ></div>
                          <div 
                            className="bar predictions" 
                            style={{height: `${data.aiPredictions}%`}}
                          ></div>
                        </div>
                        <span className="bar-label">{data.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="insights-section">
          <div className="insights-card">
            <div className="insights-header">
              <h3><FaBrain /> AI Insights</h3>
              <span className="ai-status">Live</span>
            </div>
            <div className="insights-content">
              {aiInsights.map((insight) => (
                <div key={insight.id} className={`insight-item ${insight.type}`}>
                  <div className="insight-icon">
                    {insight.type === 'trend' && <FaChartLine />}
                    {insight.type === 'anomaly' && <FaLightbulb />}
                    {insight.type === 'prediction' && <FaBrain />}
                    {insight.type === 'recommendation' && <FaUsers />}
                  </div>
                  <div className="insight-content">
                    <p>{insight.message}</p>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{width: `${insight.confidence}%`}}
                      ></div>
                    </div>
                    <span className="confidence-text">{insight.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h4>Total Patients</h4>
              <p className="stat-number">1,247</p>
              <span className="stat-change positive">+12%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaHeartbeat />
            </div>
            <div className="stat-content">
              <h4>Active Cases</h4>
              <p className="stat-number">89</p>
              <span className="stat-change negative">-3%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaThermometerHalf />
            </div>
            <div className="stat-content">
              <h4>Avg. Wait Time</h4>
              <p className="stat-number">15min</p>
              <span className="stat-change positive">-8%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaTint />
            </div>
            <div className="stat-content">
              <h4>AI Accuracy</h4>
              <p className="stat-number">94%</p>
              <span className="stat-change positive">+2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 