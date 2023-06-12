import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

const hasToken = () => {
	const token = localStorage.getItem('token');
	return !!token; // Return true if token exists, false otherwise
};

const Home = lazy(() => import('./DashboardPage/HomePage'));
const AuthPage = lazy(() => import('./AuthPage/AuthPage'));
const Landing = lazy(() => import('./HomePage/LandingPage'));
const BotsSelection = lazy(() => import('./BotSelectionPage/BotSelectionPage'));
const Game = lazy(() => import('./GamePage/GamePage'));

const HomeRoute = () => {
	const isAuthenticated = hasToken();
	return isAuthenticated ? <Home /> : <Navigate to="/login" replace />;
};

const LoginRoute = () => {
	return <AuthPage current_view="login" />;
};

const SignupRoute = () => {
	return <AuthPage current_view="signup" />;
};

const LandingRoute = () => {
	const isAuthenticated = hasToken();
	return <Landing isAuthenticated={isAuthenticated} />;
};

const BotsRoute = () => {
	const isAuthenticated = hasToken();
	return isAuthenticated ? <BotsSelection /> : <Navigate to="/login" replace />;
};

const GameRoute = () => {
	const isAuthenticated = hasToken();
	return isAuthenticated ? <Game /> : <Navigate to="/login" replace />;
};

const App = () => {
	return (
		<Router>
			<Suspense fallback={<div></div>}>
				<Routes>
					<Route path="/" element={<LandingRoute />} />
					<Route path="/login" element={<LoginRoute />} />
					<Route path="/signup" element={<SignupRoute />} />
					<Route path="/home" element={<HomeRoute />} />
					<Route path="/bots" element={<BotsRoute />} />
					<Route path="/game/:gameId" element={<GameRoute />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Suspense>
		</Router>
	);
};

export default App;
