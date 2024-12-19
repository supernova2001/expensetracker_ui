import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "../public/dashboardStyle.css";

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const userEmail = localStorage.getItem('userEmail');
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    const [manualExpense, setManualExpense] = useState({
        companyName: '',
        date: '',
        totalAmount: '',
        modeOfPayment: ''
    });
    const [expenseGoal, setExpenseGoal] = useState({
        month: '',
        year: '',
        amount: 0
    });
    const [totalSpent, setTotalSpent] = useState(0);

    const { enqueueSnackbar } = useSnackbar();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            enqueueSnackbar("Please select a file to upload", { variant: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await axios.post("http://localhost:4000/api/uploadocument", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponse(res.data);
            enqueueSnackbar("Document uploaded successfully!", { variant: "success" });
            updateTotalSpent(res.data.extractedInformation);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Failed to upload document", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const addExpense = async () => {
        if (!file) {
            enqueueSnackbar("Please upload a document first.", { variant: "error" });
            return;
        }

        const addExpenseFormData = new FormData();
        addExpenseFormData.append("userEmail", userEmail);
        addExpenseFormData.append("file", file);

        setError(null);
        setResponse(null);

        try {
            const res = await axios.post("http://localhost:4000/api/addexpense", addExpenseFormData);
            setResponse(res.data);
            enqueueSnackbar("Expenses added successfully!", { variant: "success" });
            updateTotalSpent(res.data.extractedInformation);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Failed to add expense", { variant: "error" });
        }
    };

    const handleManualInputChange = (e) => {
        setManualExpense({
            ...manualExpense,
            [e.target.name]: e.target.value
        });
    };

    const addManualExpense = async () => {
        try {
            const res = await axios.post("http://localhost:4000/api/addmanualexpense", {
                ...manualExpense,
                userEmail
            });
            setResponse(res.data);
            enqueueSnackbar("Manual expense added successfully!", { variant: "success" });
            updateTotalSpent(res.data.extractedInformation);
            setManualExpense({
                companyName: '',
                date: '',
                totalAmount: '',
                modeOfPayment: ''
            });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Failed to add manual expense", { variant: "error" });
        }
    };

    const updateTotalSpent = (expenses) => {
        const total = expenses.reduce((acc, expense) => 
            acc + parseFloat(expense.totalAmount.replace(/[^0-9.-]+/g, "")), 0);
        setTotalSpent(total);
        checkGoalExceeded(total);
    };

    const checkGoalExceeded = (total) => {
        if (total > expenseGoal.amount) {
            sendAlertEmail(total);
        }
    };

    const sendAlertEmail = async (totalSpent) => {
        try {
            await axios.post('http://localhost:4000/api/send-alert', {
                email: userEmail,
                totalSpent,
                goal: expenseGoal.amount
            });
            enqueueSnackbar("Alert email sent successfully!", { variant: "info" });
        } catch (error) {
            enqueueSnackbar("Failed to send alert email", { variant: "error" });
        }
    };

    return (
        <div className="dashboard-home">
            <h2 className="dashboard-main-title">Hey {user.firstname}! How have you been?</h2>
            <h2 className="dashboard-title">I am here to help you with managing your expenses. Upload an invoice or bill and I will do everything else.</h2>
            
            <div className="upload-box">
                <input type="file" onChange={handleFileChange} />
                <button className="upload-document" onClick={handleUpload} disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload Document'}
                </button>
            </div>

            {isLoading && <p className="summary-loader">Generating summary... Please wait.</p>}
            
            {response && !isLoading && (
                <div className="summary-box">
                    <p>{JSON.stringify(response.extractedInformation, null, 2)}</p>
                </div>
            )}

            <div>
                <button className="add-expense-button" onClick={addExpense} disabled={isLoading}>
                    Add Expenses from the document
                </button>
            </div>

            <h2 className="manual-dashboard-title">Don't have your invoices handy? No problem add your expenses here manually.</h2>
            
            <div className="manual-expense-form" style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
                <h3 style={{ marginBottom: '10px' }}>Add Expense Manually</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="text"
                        name="companyName"
                        value={manualExpense.companyName}
                        onChange={handleManualInputChange}
                        placeholder="Company Name"
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="date"
                        name="date"
                        value={manualExpense.date}
                        onChange={handleManualInputChange}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="number"
                        name="totalAmount"
                        value={manualExpense.totalAmount}
                        onChange={handleManualInputChange}
                        placeholder="Amount Spent"
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <select
                        name="modeOfPayment"
                        value={manualExpense.modeOfPayment}
                        onChange={handleManualInputChange}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select Payment Mode</option>
                        <option value="CREDIT">Credit Card</option>
                        <option value="DEBIT">Debit Card</option>
                        <option value="CASH">Cash</option>
                    </select>
                    <button 
                        onClick={addManualExpense} 
                        style={{ padding: '10px 20px', backgroundColor: '#21839A', color: '#fff', borderRadius: '4px', border: 'none' }}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="expense-goal-form" style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
                <h3 style={{ marginBottom: '10px' }}>Set Expense Goal</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <select 
                        value={expenseGoal.month}
                        onChange={(e) => setExpenseGoal(prev => ({...prev, month: e.target.value}))}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select Month</option>
                        {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }))
                            .map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))
                        }
                    </select>
                    <select 
                        value={expenseGoal.year}
                        onChange={(e) => setExpenseGoal(prev => ({...prev, year: e.target.value}))}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select Year</option>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)
                            .map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))
                        }
                    </select>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={expenseGoal.amount}
                        onChange={(e) => setExpenseGoal(prev => ({...prev, amount: parseFloat(e.target.value)}))}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button 
                        onClick={async () => {
                            try {
                                await axios.post('http://localhost:4000/api/set-expense-goal', {
                                    userEmail,
                                    month: expenseGoal.month,
                                    year: expenseGoal.year,
                                    goalAmount: expenseGoal.amount
                                });
                                enqueueSnackbar("Expense goal set successfully!", { variant: "success" });
                            } catch (error) {
                                enqueueSnackbar("Failed to set expense goal", { variant: "error" });
                            }
                        }}
                        style={{ padding: '10px 20px', backgroundColor: '#21839A', color: '#fff', borderRadius: '4px', border: 'none' }}
                    >
                        Set Goal
                    </button>
                </div>
                {totalSpent > expenseGoal.amount && 
                    <p style={{ color: 'red' }}>You have exceeded your expense goal!</p>
                }
            </div>
        </div>
    );
};

export default Dashboard;