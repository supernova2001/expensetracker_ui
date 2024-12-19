import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../public/trackGoals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

const TrackGoals = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setError("Email not found in local storage");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [expensesResponse, goalsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/expenses?Email=${email}`),
          axios.get(`http://localhost:4000/api/goal?Email=${email}`)
        ]);

        const groupedExpenses = groupByMonth(expensesResponse.data.expenses);
        setMonthlyExpenses(groupedExpenses);
        setGoals(goalsResponse.data.goals);
        calculateCoins(groupedExpenses, goalsResponse.data.goals);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupByMonth = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
      const amount = parseFloat(expense.totalAmount.replace(/[^0-9.-]+/g, ""));
      if (!acc[monthYear]) {
        acc[monthYear] = { expenses: [], total: 0 };
      }
      acc[monthYear].expenses.push(expense);
      acc[monthYear].total += amount;
      return acc;
    }, {});
  };

  const calculateCoins = (groupedExpenses, goals) => {
    let totalCoins = 0;

    Object.entries(groupedExpenses).forEach(([monthYear, { total }]) => {
      const [month, year] = monthYear.split(" ");
      const goal = goals.find((g) => g.month === month && g.year === parseInt(year));

      if (goal) {
        const difference = goal.goalAmount - total;
        totalCoins += difference; // Add or subtract difference from coins
      }
    });

    setCoins(totalCoins);
  };

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  const handleAIHelp = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/ai-help', {
        expenseData: Object.values(monthlyExpenses).flatMap(month => month.expenses),
        goalData: goals
      });
      setAiSuggestions(response.data.result);
    } catch (error) {
      console.error('Error fetching AI help:', error);
      setError('Failed to get AI suggestions. Please try again.');
    }
  };

  const renderExpenses = () => {
    return Object.entries(monthlyExpenses)
      .map(([monthYear, { expenses, total }]) => {
        const [month, year] = monthYear.split(" ");
        const goal = goals.find((g) => g.month === month && g.year === parseInt(year));
  
        if (!goal) return null; // Skip rendering if no goal exists for this month and year
  
        const isSpentLess = total < goal.goalAmount;
        const gap = Math.min(200, Math.abs(total - goal.goalAmount)); // Dynamically set gap
        const roadmapStyle = {
          gap: `${gap}px`, // Use the calculated gap
        };
  
        return (
          <div key={monthYear} className="month-group-dots" style={{backgroundColor: "white", padding: "20px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #f9f9f9"}}>
            <div className="month-header" onClick={() => toggleMonth(monthYear)}>
              <h3>{monthYear}</h3>
              <div className="roadmap" style={roadmapStyle}>
                <div className={`roadmap-line ${isSpentLess ? "left-to-right" : "right-to-left"}`} />
                {isSpentLess ? (
                  <>
                    <div className="roadmap-item spent">
                      <div className="amount">Total spent: ${total.toFixed(2)}</div>
                      <div className="dot" />
                    </div>
                    <div className="roadmap-item goal">
                      <div className="amount">Goal set: ${goal.goalAmount}</div>
                      <div className="dot" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="roadmap-item goal">
                      <div className="amount">Goal set: ${goal.goalAmount}</div>
                      <div className="dot" />
                    </div>
                    <div className="roadmap-item spent exceeded">
                      <div className="amount">Total spent: ${total.toFixed(2)}</div>
                      <div className="dot" />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="message">
              {isSpentLess ? (
                <p className="success-message">You are on track with your goals!</p>
              ) : (
                <p className="error-message">
                  Oops! You went beyond your limit, you need to work on your financial discipline.
                </p>
              )}
            </div>
            {expandedMonths[monthYear] && (
              <div className="expenses-list">
                {expenses.map((expense, index) => (
                  <div key={index} className="expense-item">
                    <p>
                      <strong>Company:</strong> {expense.companyName}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Amount spent:</strong> {expense.totalAmount}
                    </p>
                    <p>
                      <strong>Payment mode:</strong> {expense.modeOfPayment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })
      .filter(Boolean);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="coins-display" align="right">
        <h2><FontAwesomeIcon icon={faCoins} /> {coins}</h2>
      </div>
      <div className="track-goals-container">
        <h2>Monthly Spending and Goals</h2>
        {renderExpenses()}
      </div>
      <div className='ai-info-icon' onClick={handleAIHelp}>
        <FontAwesomeIcon icon={faWandMagicSparkles} size="2x"/>
      </div>
      {aiSuggestions && (
        <div className="ai-suggestions">
          <h3>AI Suggestions</h3>
          <p>{aiSuggestions}</p>
        </div>
      )}
    </>
  );
};

export default TrackGoals;