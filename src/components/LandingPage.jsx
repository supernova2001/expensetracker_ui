import React from "react";
import "../style.css";
import Router from '../routes/router';
import routes from '../routes/routes';
import Link from '../routes/link';

const Home = ({ navigate }) => {
    const goToLogin = () => {
        window.location.href = "/login"; 
    };

    return (
        <>
        <div className="about">
            <div className="introduction">
                <div className="introduction_title">
                    <h1 style={{fontSize: "50px"}}>Finding it difficult to manage your expenses?</h1>
                    <h3 style={{marginLeft: "-440px", fontSize: "30px"}}>Don't worry! Let Expeasy handle it for you!</h3>
                </div>
            </div>
            <div className="information">
                <div className="introduction_title">
                  
                </div>
            </div>
            <div className="features">
                <div className="feature_title">
                    <h3>What is Expeasy</h3>
                    <p>
                    Welcome to Expeasy—your all-in-one financial planner designed to simplify and enhance your financial management. Set your monthly goals, track your expenses in real-time, and watch your savings grow effortlessly. With Expeasy, you can earn virtual coins, participate in challenges, and unlock rewards as you progress towards your financial targets. Our interactive dashboard provides a clear snapshot of your financial health, including goal progress, spending summaries, and personalized tips. Whether you're saving for a big vacation, building an emergency fund, or paying off debt, Expeasy makes it easy to stay on top of your finances and achieve your goals. Start your journey today and take control of your financial future with Expeasy.
                    </p>
                </div>
            </div>
            <div className="about_card">
                <div className="about_title">
                    <h3>Features</h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                    in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home;