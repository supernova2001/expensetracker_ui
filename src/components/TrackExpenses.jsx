import React, { useState, useEffect } from "react";
import axios from "axios";
import "../public/dashboardStyle.css";
import { ResponsivePie } from "@nivo/pie";

const ExpenseDetails = () => {
    const [monthlyExpenses, setMonthlyExpenses] = useState({});
    const [yearlyExpenses, setYearlyExpenses] = useState({});
    const [expandedMonths, setExpandedMonths] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState('');


    useEffect(() => {
        const fetchExpenses = async () => {
            const email = localStorage.getItem("userEmail");

            if (!email) {
                setError("Email not found in local storage");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const res = await axios.get(`http://localhost:4000/api/expenses?Email=${email}`);
                const groupedByMonth = groupByMonth(res.data.expenses);
                const groupedByYear = groupByYear(res.data.expenses);
                setMonthlyExpenses(groupedByMonth);
                setYearlyExpenses(groupedByYear);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch expenses");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const handleSearch = async () => {
        try {
          const userEmail = localStorage.getItem("userEmail");
          const response = await axios.post('http://localhost:4000/api/expense-query', { query: searchQuery,user: userEmail  });
          setSearchResult(response.data.result);
        } catch (error) {
          console.error('Error querying data:', error);
          setSearchResult('An error occurred while processing your query.');
        }
    };

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

    const groupByYear = (expenses) => {
        return expenses.reduce((acc, expense) => {
            const date = new Date(expense.date);
            const year = date.getFullYear();

            const amount = parseFloat(expense.totalAmount.replace(/[^0-9.-]+/g, ""));

            if (!acc[year]) {
                acc[year] = 0;
            }
            acc[year] += amount;

            return acc;
        }, {});
    };

    const transformMonthlyExpenses = () => {
        return Object.entries(monthlyExpenses).map(([month, { total }]) => ({
            id: month,
            label: month,
            value: total,
        }));
    };

    const transformYearlyExpenses = () => {
        return Object.entries(yearlyExpenses).map(([year, total]) => ({
            id: year,
            label: year,
            value: total,
        }));
    };

    const toggleMonth = (month) => {
        setExpandedMonths((prev) => ({
            ...prev,
            [month]: !prev[month],
        }));
    };

    return (
        <div className="dashboard-home">
            <h2>Track your expenses here!</h2>
            <h3 className="dashboard-sub-title">
                You get your monthly expenses, yearly expenses, insights around your expenses and what not?, everything!
            </h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {isLoading && <p className="loading">Loading expenses... Please wait.</p>}

            {/* Pie Chart Visualizations */}
            <div className="expenses-container" style={{ display: "flex", gap: "20px" }}>
                <div className="monthly-expenses" style={{ flex: 1 }}>
                    <h3>Monthly Expenses</h3>
                    {Object.keys(monthlyExpenses).length > 0 ? (
                        <div style={{ height: "400px" }}>
                            <ResponsivePie
                                data={transformMonthlyExpenses()}
                                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={{ scheme: "nivo" }}
                                borderWidth={1}
                                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextColor="#333333"
                                sliceLabelsSkipAngle={10}
                                sliceLabelsTextColor="#ffffff"
                                legends={[
                                    {
                                        anchor: "bottom",
                                        direction: "row",
                                        translateY: 56,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        symbolSize: 18,
                                        symbolShape: "circle",
                                    },
                                ]}
                            />
                        </div>
                    ) : (
                        <p>No monthly expenses found</p>
                    )}
                </div>

                <div className="yearly-expenses" style={{ flex: 1 }}>
                    <h3>Yearly Expenses</h3>
                    {Object.keys(yearlyExpenses).length > 0 ? (
                        <div style={{ height: "400px" }}>
                            <ResponsivePie
                                data={transformYearlyExpenses()}
                                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={{ scheme: "category10" }}
                                borderWidth={1}
                                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextColor="#333333"
                                sliceLabelsSkipAngle={10}
                                sliceLabelsTextColor="#ffffff"
                                legends={[
                                    {
                                        anchor: "bottom",
                                        direction: "row",
                                        translateY: 56,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        symbolSize: 18,
                                        symbolShape: "circle",
                                    },
                                ]}
                            />
                        </div>
                    ) : (
                        <p>No yearly expenses found</p>
                    )}
                </div>
            </div>

            {/* Toggle Bars for Monthly and Yearly Expenses */}
            <div className="toggle-bars-container" style={{ display: "flex", gap: "20px" }}>
                <div className="monthly-expenses-toggle" style={{ flex: 1 }}>
                    {Object.keys(monthlyExpenses).length > 0 ? (
                        Object.entries(monthlyExpenses).map(([month, { expenses, total }]) => (
                            <div key={month} className="month-group">
                                <div
                                    className="month-header"
                                    onClick={() => toggleMonth(month)}
                                    style={{
                                        cursor: "pointer",
                                        background: "#21839A",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        marginBottom: "10px",
                                        color: "white",
                                    }}
                                >
                                    <h4>
                                        {month} - <span>Total Spent: ${total.toFixed(2)}</span>
                                    </h4>
                                </div>
                                {expandedMonths[month] && (
                                    <div
                                        className="expenses-container"
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "15px",
                                            paddingBottom: "10px",
                                        }}
                                    >
                                        {expenses.map((expense, index) => (
                                            <div
                                                key={index}
                                                className="expense-box"
                                                style={{
                                                    border: "1px solid #ccc",
                                                    borderRadius: "8px",
                                                    padding: "10px",
                                                    width: "200px",
                                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                    background: "#ffffff",
                                                }}
                                            >
                                                <p><strong>Company:</strong> {expense.companyName}</p>
                                                <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                                                <p><strong>Amount spent:</strong> {expense.totalAmount}</p>
                                                <p><strong>Payment mode:</strong> {expense.modeOfPayment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No monthly expenses found</p>
                    )}
                </div>

                <div className="yearly-expenses-toggle" style={{ flex: 1 }}>
                    {Object.keys(yearlyExpenses).length > 0 ? (
                        Object.entries(yearlyExpenses).map(([year, total]) => (
                            <div
                                key={year}
                                style={{
                                    background: "#f9f9f9",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                            >
                                <h4>{year} - Total Spent: ${total.toFixed(2)}</h4>
                            </div>
                        ))
                    ) : (
                        <p>No yearly expenses found</p>
                    )}
                </div>
            </div>

            {/* Search Bar */}
<div className="search-container" style={{ marginTop: '20px', marginBottom: "20px" }}>
  <h3>Ask questions about your expenses</h3>
  <div style={{ display: 'flex', gap: '10px' }}>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Enter your question here"
      style={{ flex: 1, padding: '10px', fontSize: '16px' }}
    />
    <button
      onClick={handleSearch}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#21839A',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Search
    </button>
  </div>
  {searchResult && (
    <div className="search-result" style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
      <h4>Answer:</h4>
      <p>{searchResult}</p>
    </div>
  )}
</div>

        </div>
    );
};

export default ExpenseDetails;