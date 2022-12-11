import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'
import { createRoot } from 'react-dom/client';

import App from './App'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

// import the router and wrap the application inside Router tags
root.render(
    <Router>
      <App/>  
    </Router>
    )