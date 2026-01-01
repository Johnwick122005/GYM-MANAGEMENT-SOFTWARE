const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend project folder
const staticRoot = path.join(__dirname, 'gym-management-system', 'frontend');
app.use(express.static(staticRoot));

// API: Members
app.get('/api/members', (req, res) => {
  try {
    const members = db.getMembers();
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.get('/api/members/:id', (req, res) => {
  const id = decodeURIComponent(req.params.id);
  const members = db.getMembers();
  const found = members.find(m => m.id === id || m.name === id);
  if (!found) return res.status(404).json({ error: 'Member not found' });
  res.json(found);
});

app.post('/api/members', (req, res) => {
  try {
    const payload = req.body || {};
    const id = payload.id || payload.name ? (payload.name.toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')) : uuidv4();
    const newMember = Object.assign({ id }, payload);
    db.addMember(newMember);
    res.status(201).json(newMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

app.put('/api/members/:id', (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const patch = req.body || {};
    const updated = db.updateMember(id, patch);
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const ok = db.deleteMember(id);
    if (!ok) return res.status(404).json({ error: 'Member not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// API: Dashboard stats
app.get('/api/dashboard-stats', (req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json({ success: true, ...stats, retention: '92%' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// API: Classes
app.get('/api/classes', (req, res) => { res.json(db.getClasses()); });
app.post('/api/classes', (req, res) => {
  try {
    const payload = req.body || {};
    const id = payload.id || `class-${uuidv4()}`;
    const cls = Object.assign({ id }, payload);
    db.addClass(cls);
    res.status(201).json(cls);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add class' }); }
});

// API: Staff
app.get('/api/staff', (req, res) => { res.json(db.getStaff()); });
app.post('/api/staff', (req, res) => {
  try {
    const payload = req.body || {};
    const id = payload.id || `staff-${uuidv4()}`;
    const st = Object.assign({ id }, payload);
    db.addStaff(st);
    res.status(201).json(st);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add staff' }); }
});

// API: Invoices / Billing - basic CRUD (used for billing UI)
app.get('/api/invoices', (req, res) => {
  try {
    res.json(db.getInvoices());
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch invoices' }); }
});
app.post('/api/invoices', (req, res) => {
  try {
    const payload = req.body || {};
    const id = payload.id || `INV-${Math.floor(Math.random()*900+100)}`;
    const inv = Object.assign({ id }, payload);
    db.addInvoice(inv);
    res.status(201).json(inv);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add invoice' }); }
});
app.put('/api/invoices/:id', (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const patch = req.body || {};
    const updated = db.updateInvoice(id, patch);
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update invoice' }); }
});

// Small health endpoint
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Fallback: serve index.html for SPA routing (use middleware to avoid path-to-regexp)
app.use((req, res) => {
  const indexPath = path.join(staticRoot, 'index.html');
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`GymFlow backend running at http://localhost:${port}`);
});
