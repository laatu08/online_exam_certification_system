import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManageQuestions from './pages/ManageQuestions/ManageQuestions';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Navbar from './pages/Navbar/Navbar';
import Footer from './pages/Footer';
import CreateExam from './pages/CreateExam/CreateExam';
import ExamList from './pages/ExamList/ExamList';

function PrivateRoute({ children }) {
  return localStorage.getItem('adminToken') ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<PrivateRoute><Home></Home></PrivateRoute>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/exams/create" element={<PrivateRoute><CreateExam /></PrivateRoute>} />
        <Route path="/exams/list" element={<PrivateRoute><ExamList /></PrivateRoute>} />
        <Route path="/exams/:id/questions" element={<PrivateRoute><ManageQuestions /></PrivateRoute>} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
