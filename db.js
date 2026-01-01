const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Unable to read data file, initializing empty DB', err.message);
    const base = { members: [], classes: [], staff: [], invoices: [], settings: {} };
    fs.writeFileSync(DATA_FILE, JSON.stringify(base, null, 2));
    return base;
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getMembers() {
  const d = readData();
  return d.members || [];
}

function addMember(member) {
  const d = readData();
  d.members = d.members || [];
  d.members.push(member);
  writeData(d);
  return member;
}

function deleteMember(id) {
  const d = readData();
  const before = d.members.length;
  d.members = d.members.filter(m => m.id !== id && m.name !== id);
  writeData(d);
  return d.members.length < before;
}

function updateMember(id, patch) {
  const d = readData();
  let updated = null;
  d.members = d.members.map(m => {
    if (m.id === id || m.name === id) {
      updated = Object.assign({}, m, patch);
      return updated;
    }
    return m;
  });
  writeData(d);
  return updated;
}

function getDashboardStats() {
  const d = readData();
  const activeMembers = (d.members || []).filter(m => (m.status || 'active').toLowerCase() === 'active').length;
  const revenue = (d.invoices || []).filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  return { activeMembers, revenue };
}

function getInvoices() { return readData().invoices || []; }
function addInvoice(inv) {
  const d = readData();
  d.invoices = d.invoices || [];
  d.invoices.push(inv);
  writeData(d);
  return inv;
}
function updateInvoice(id, patch) {
  const d = readData();
  let updated = null;
  d.invoices = d.invoices.map(i => {
    if (i.id === id) {
      updated = Object.assign({}, i, patch);
      return updated;
    }
    return i;
  });
  writeData(d);
  return updated;
}

function getClasses() { return readData().classes || []; }
function addClass(cls) {
  const d = readData();
  d.classes = d.classes || [];
  d.classes.push(cls);
  writeData(d);
  return cls;
}

function getStaff() { return readData().staff || []; }
function addStaff(st) {
  const d = readData();
  d.staff = d.staff || [];
  d.staff.push(st);
  writeData(d);
  return st;
}

module.exports = {
  getMembers, addMember, deleteMember, updateMember,
  getDashboardStats, getClasses, addClass, getStaff, addStaff
};
