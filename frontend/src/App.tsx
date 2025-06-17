import React, { useState, useEffect } from 'react'
import './style.scss'

const BMICalculator = () => {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [bmiHistory, setBmiHistory] = useState([])
  const [activeTab, setActiveTab] = useState('calculator')
  const [loading, setLoading] = useState(false)

  // Fetch BMI history when component mounts or when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      fetchBMIHistory()
    }
  }, [activeTab])

  const fetchBMIHistory = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/user/bmi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch BMI history.')
      }

      const data = await res.json()
      setBmiHistory(data)
      setMessage('BMI history loaded successfully!')
    } catch (err: any) {
      setMessage(err.message || 'Failed to load BMI history.')
      setBmiHistory([])
    } finally {
      setLoading(false)
    }
  }

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'underweight' }
    if (bmiValue < 25) return { category: 'Normal weight', color: 'normal' }
    if (bmiValue < 30) return { category: 'Overweight', color: 'overweight' }
    return { category: 'Obese', color: 'obese' }
  }

  const getBMIAdvice = (bmiValue: number) => {
    if (bmiValue < 18.5) return 'Kuzuzangpola, You are underweight. Consider a balanced diet and consult a healthcare professional.'
    if (bmiValue < 25) return 'Dra dra You have a healthy weight. Keep up the good lifestyle!.'
    if (bmiValue < 30) return 'Kuzuzangpola, You are overweight. Consider healthy eating and regular exercise..'
    return 'Please consult with a healthcare provider about weight management strategies.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)
    const ageNum = parseInt(age)

    if (!heightNum || !weightNum || !ageNum) {
      setMessage('Please enter valid numbers for all fields.')
      setLoading(false)
      return
    }

    if (heightNum <= 0 || weightNum <= 0 || ageNum <= 0) {
      setMessage('Please enter positive values for all fields.')
      setLoading(false)
      return
    }

    if (heightNum < 50 || heightNum > 300) {
      setMessage('Please enter a realistic height between 50cm and 300cm.')
      setLoading(false)
      return
    }

    if (weightNum < 10 || weightNum > 500) {
      setMessage('Please enter a realistic weight between 10kg and 500kg.')
      setLoading(false)
      return
    }

    if (ageNum < 1 || ageNum > 120) {
      setMessage('Please enter a realistic age between 1 and 120 years.')
      setLoading(false)
      return
    }

    // Convert height from cm to meters for BMI calculation
    const heightInMeters = heightNum / 100
    const bmiVal = +(weightNum / (heightInMeters * heightInMeters)).toFixed(2)
    setBmi(bmiVal)

    try {
      const res = await fetch('/api/create/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          height: heightNum, // Store height in cm
          weight: weightNum,
          age: ageNum,
          bmi: bmiVal,
          createdAt: new Date().toISOString()
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to save BMI data.')
      }

      setMessage('BMI calculated and saved successfully!')
      
      // Clear form after successful save
      setHeight('')
      setWeight('')
      setAge('')
      
      // Refresh history if on history tab
      if (activeTab === 'history') {
        fetchBMIHistory()
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong while saving.')
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateOnly = () => {
    setMessage('')
    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)

    if (!heightNum || !weightNum) {
      setMessage('Please enter valid height and weight.')
      return
    }

    if (heightNum <= 0 || weightNum <= 0) {
      setMessage('Please enter positive values.')
      return
    }

    if (heightNum < 50 || heightNum > 300) {
      setMessage('Please enter a realistic height between 50cm and 300cm.')
      return
    }

    if (weightNum < 10 || weightNum > 500) {
      setMessage('Please enter a realistic weight between 10kg and 500kg.')
      return
    }

    // Convert height from cm to meters for BMI calculation
    const heightInMeters = heightNum / 100
    const bmiVal = +(weightNum / (heightInMeters * heightInMeters)).toFixed(2)
    setBmi(bmiVal)
    setMessage('BMI calculated successfully (not saved to database).')
  }

  const clearForm = () => {
    setHeight('')
    setWeight('')
    setAge('')
    setBmi(null)
    setMessage('')
  }

  const deleteBMIRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this BMI record?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/user/bmi/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete BMI record.')
      }

      setMessage('BMI record deleted successfully!')
      fetchBMIHistory() // Refresh the list
    } catch (err: any) {
      setMessage(err.message || 'Failed to delete record.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bmi-app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">BMI Health Tracker</h1>
          <p className="app-subtitle">Monitor your health with precision</p>
        </header>

        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <span className="tab-text">Calculator</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-text">History</span>
          </button>
        </nav>

        <main className="app-content">
          {activeTab === 'calculator' && (
            <div className="calculator-section">
              <div className="input-form">
                <h2 className="section-title">Enter Your Details</h2>
                
                <div className="input-grid">
                  <div className="input-group">
                    <label className="input-label">
                      Height (centimeters)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="50"
                      max="300"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 175"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="10"
                      max="500"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 70.5"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    onClick={handleCalculateOnly}
                    disabled={loading}
                    className="btn btn-secondary"
                  >
                    Calculate Only
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleSubmit(e)
                    }}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Saving...' : 'Calculate & Save'}
                  </button>

                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className="btn btn-outline"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {bmi !== null && (
                <div className="result-card">
                  <h3 className="result-title">Your BMI Result</h3>
                  <div className="result-main">
                    <div className="bmi-value">
                      <span className="bmi-number">{bmi}</span>
                      <span className="bmi-label">BMI</span>
                    </div>
                    <div className={`bmi-category ${getBMICategory(bmi).color}`}>
                      {getBMICategory(bmi).category}
                    </div>
                  </div>
                  
                  <div className="advice-box">
                    <p className="advice-text">{getBMIAdvice(bmi)}</p>
                  </div>
                  
                  <div className="bmi-scale">
                    <h4 className="scale-title">BMI Scale Reference</h4>
                    <div className="scale-items">
                      <div className="scale-item underweight">
                        <span className="scale-range">&lt;18.5</span>
                        <span className="scale-label">Underweight</span>
                      </div>
                      <div className="scale-item normal">
                        <span className="scale-range">18.5-24.9</span>
                        <span className="scale-label">Normal</span>
                      </div>
                      <div className="scale-item overweight">
                        <span className="scale-range">25-29.9</span>
                        <span className="scale-label">Overweight</span>
                      </div>
                      <div className="scale-item obese">
                        <span className="scale-range">≥30</span>
                        <span className="scale-label">Obese</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section">
              <div className="history-header">
                <h2 className="section-title">BMI History</h2>
                <button
                  onClick={fetchBMIHistory}
                  disabled={loading}
                  className="btn btn-refresh"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-text">Loading BMI history...</div>
                </div>
              ) : bmiHistory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-title">No BMI records found</div>
                  <div className="empty-subtitle">Calculate and save your first BMI to start tracking!</div>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="btn btn-primary"
                  >
                    Go to Calculator
                  </button>
                </div>
              ) : (
                <div className="history-content">
                  <div className="history-stats">
                    <span className="stats-text">Total Records: {bmiHistory.length}</span>
                  </div>
                  
                  <div className="history-grid">
                    {bmiHistory.map((record: any, index: number) => {
                      const category = getBMICategory(record.bmi)
                      return (
                        <div key={record.id || index} className="history-card">
                          <div className="card-header">
                            <div className={`bmi-badge ${category.color}`}>
                              BMI {record.bmi}
                            </div>
                            <div className="card-date">
                              {record.createdAt ? new Date(record.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </div>
                          </div>
                          
                          <div className="card-body">
                            <div className={`category-badge ${category.color}`}>
                              {category.category}
                            </div>
                            
                            <div className="metrics-grid">
                              <div className="metric">
                                <span className="metric-label">Height</span>
                                <span className="metric-value">{record.height}cm</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Weight</span>
                                <span className="metric-value">{record.weight}kg</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Age</span>
                                <span className="metric-value">{record.age}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="card-advice">
                            <span className="advice-text">{getBMIAdvice(record.bmi)}</span>
                          </div>
                          
                          {record.id && (
                            <div className="card-actions">
                              <button
                                onClick={() => deleteBMIRecord(record.id)}
                                disabled={loading}
                                className="btn btn-danger btn-small"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {message && (
          <div className={`message ${message.includes('success') || message.includes('loaded') || message.includes('calculated') ? 'success' : 'error'}`}>
            <span className="message-text">{message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BMICalculator