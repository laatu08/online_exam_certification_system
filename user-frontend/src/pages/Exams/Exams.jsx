import React from 'react'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Exams.css'

const Exams = () => {
    const [exams,setExams]=useState([]);

    useEffect(()=>{
        axios.get('http://localhost:5000/api/user/',{
            headers:{authorization:`Bearer ${localStorage.getItem('token')}`}
        })
        .then(response=>setExams(response.data))
        .catch(error=>console.error('Error fetching exams',error))
    },[])

  return (
    <div className='exams-container'>
      <h2>Available Exams</h2>
      <ul className='exams-list'>
        {exams.map(exam=>(
            <li key={exam.id} className='exam-item'>
                <Link to={`/exams/${exam.id}`} className='exam-link'>{exam.title}</Link>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default Exams
