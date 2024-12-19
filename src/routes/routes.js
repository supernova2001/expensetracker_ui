import Home from '../components/LandingPage';
import LoginForm from '../components/LoginPage';
import RegisterForm from '../components/RegisterPage';
import Dashboard from '../components/Dashboard';
import ExpenseDetails from '../components/TrackExpenses';
import TrackGoals from '../components/trackGoals';


const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/login', component: LoginForm },
  {path: '/register', component: RegisterForm},
  {path: '/dashboard', component: Dashboard},
  {path: "/expenses", component: ExpenseDetails},
  {path: "/expense-goals",component: TrackGoals}
];

export default routes;