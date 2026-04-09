/* ============================================================
   dashboard.js — DIGIVAULT
   Provides: openAccountPage(), toggleDashboard(), doLogout()
============================================================ */
'use strict';

function openAccountPage() {
  var user = null;
  try { user = JSON.parse(localStorage.getItem('tw_user')); } catch(e) {}
  window.location.href = user ? 'account.html' : 'login.html';
}

function toggleDashboard() {
  openAccountPage();
}

function doLogout() {
  if (typeof DVAPI !== 'undefined') {
    DVAPI.Auth.logout();
  } else {
    localStorage.removeItem('tw_user');
    localStorage.removeItem('dv_token');
    sessionStorage.removeItem('tw_user');
    window.location.replace('login.html');
  }
}