/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: angel suleiman
*  Student ID: 152961231
*  Date: 16/07/2025
*
*  Published URL: Your Vercel URL Here
********************************************************************************/

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const projects = require('./modules/projects');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files (Tailwind output)
app.use(express.static('public'));

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Home
app.get('/', (req, res) => {
  res.render('home');
});

// All Projects
app.get('/solutions/projects', async (req, res) => {
  try {
    const allProjects = await projects.getAllProjects();
    res.render('projects', { projects: allProjects });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { error: err.message });
  }
});

// Single Project
app.get('/solutions/project/:id', async (req, res) => {
  try {
    const project = await projects.getProjectById(req.params.id);
    if (project) {
      res.render('project', { project });
    } else {
      res.status(404).render('404');
    }
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { error: err.message });
  }
});

// Add Project Form
app.get('/solutions/add', async (req, res) => {
  try {
    const sectors = await projects.getAllSectors();
    res.render('addProject', { sectors });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { error: err.message });
  }
});

// Add Project Submission
app.post('/solutions/add', async (req, res) => {
  try {
    await projects.addProject(req.body);
    res.redirect('/solutions/projects');
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { error: err.message });
  }
});

// 404 Page
app.use((req, res) => {
  res.status(404).render('404');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
