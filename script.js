const clients = [
  { name: 'Teacher-Laptop', type: 'Laptop', interface: 'WiFi 5GHz', ip: '192.168.50.11', mac: '3C:52:82:7A:11:01', status: 'Online' },
  { name: 'Student-Tablet-01', type: 'Tablet', interface: 'WiFi 5GHz', ip: '192.168.50.12', mac: '3C:52:82:7A:11:02', status: 'Online' },
  { name: 'Student-Tablet-02', type: 'Tablet', interface: 'WiFi 5GHz', ip: '192.168.50.13', mac: '3C:52:82:7A:11:03', status: 'Online' },
  { name: 'Student-Tablet-03', type: 'Tablet', interface: 'WiFi 2.4GHz', ip: '192.168.50.14', mac: '3C:52:82:7A:11:04', status: 'Online' },
  { name: 'Projector', type: 'Display', interface: 'LAN', ip: '192.168.50.15', mac: '3C:52:82:7A:11:05', status: 'Online' },
  { name: 'IoT-Camera', type: 'Camera', interface: 'WiFi 2.4GHz', ip: '192.168.50.16', mac: '3C:52:82:7A:11:06', status: 'Online' },
  { name: 'Smart-TV', type: 'TV', interface: 'LAN', ip: '192.168.50.17', mac: '3C:52:82:7A:11:07', status: 'Online' },
  { name: 'Teacher-Phone', type: 'Phone', interface: 'WiFi 5GHz', ip: '192.168.50.18', mac: '3C:52:82:7A:11:08', status: 'Online' },
  { name: 'Printer-RoomA', type: 'Printer', interface: 'WiFi 2.4GHz', ip: '192.168.50.19', mac: '3C:52:82:7A:11:09', status: 'Online' },
  { name: 'Lab-PC-01', type: 'Desktop', interface: 'LAN', ip: '192.168.50.20', mac: '3C:52:82:7A:11:0A', status: 'Online' },
  { name: 'Lab-PC-02', type: 'Desktop', interface: 'LAN', ip: '192.168.50.21', mac: '3C:52:82:7A:11:0B', status: 'Online' },
  { name: 'Guest-Phone', type: 'Phone', interface: 'Guest WiFi', ip: '192.168.50.22', mac: '3C:52:82:7A:11:0C', status: 'Online' }
];

const state = {
  currentBand: '2.4GHz',
  wireless: {
    '2.4GHz': {
      ssid: 'SpectraHome_2.4G',
      hide: 'No',
      auth: 'WPA2/WPA3-Personal',
      password: 'StrongPass!24',
      bandwidth: '20/40 MHz'
    },
    '5GHz': {
      ssid: 'SpectraHome_5G',
      hide: 'No',
      auth: 'WPA2/WPA3-Personal',
      password: 'StrongPass!5G',
      bandwidth: '80 MHz'
    }
  },
  lan: { ip: '192.168.50.1', mask: '255.255.255.0' },
  dhcp: { start: '192.168.50.2', end: '192.168.50.100' },
  guest: { enabled: 'Enabled', ssid: 'Classroom_Guest' }
};

document.getElementById('loginBtn').addEventListener('click', () => {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  const msg = document.getElementById('loginMsg');
  if (u === 'admin' && p === 'admin123') {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    msg.textContent = '';
    refreshWirelessPreview();
    loadWirelessBand('2.4GHz');
  } else {
    msg.textContent = 'Incorrect username or password.';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => location.reload());

function goToPage(page){
  document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
  const menuBtn = document.querySelector(`.menu-item[data-page="${page}"]`);
  if (menuBtn) menuBtn.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  if (page === 'wireless') loadWirelessBand(state.currentBand);
}

document.querySelectorAll('.menu-item').forEach(btn => btn.addEventListener('click', () => goToPage(btn.dataset.page)));
document.querySelectorAll('.top-tabs').forEach(group => {
  group.addEventListener('click', e => {
    if (!e.target.classList.contains('tab')) return;
    group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
  });
});

function showToast(text){
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function isValidIp(ip){
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (part === '' || isNaN(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function loadWirelessBand(band){
  state.currentBand = band;
  const cfg = state.wireless[band];
  document.getElementById('bandSelect').value = band;
  document.getElementById('currentBandLabel').textContent = band;
  document.getElementById('ssid').value = cfg.ssid;
  document.getElementById('hideSsid').value = cfg.hide;
  document.getElementById('authMethod').value = cfg.auth;
  document.getElementById('wifiPassword').value = cfg.password;
  document.getElementById('channelBandwidth').value = cfg.bandwidth;
  document.querySelectorAll('.wireless-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.band === band);
  });
}

function refreshWirelessPreview(){
  document.getElementById('ssid24Preview').textContent = state.wireless['2.4GHz'].ssid;
  document.getElementById('ssid5Preview').textContent = state.wireless['5GHz'].ssid;
  document.getElementById('summary24Ssid').textContent = state.wireless['2.4GHz'].ssid;
  document.getElementById('summary24Auth').textContent = state.wireless['2.4GHz'].auth;
  document.getElementById('summary5Ssid').textContent = state.wireless['5GHz'].ssid;
  document.getElementById('summary5Auth').textContent = state.wireless['5GHz'].auth;
  const auths = [state.wireless['2.4GHz'].auth, state.wireless['5GHz'].auth].join(' ');
  document.getElementById('securityBadge').textContent = auths.includes('WPA3') ? 'WPA2/WPA3' : (auths.includes('WPA2') ? 'WPA2' : 'OPEN');
}

function applyWireless(){
  const band = document.getElementById('bandSelect').value;
  const ssid = document.getElementById('ssid').value.trim();
  const hide = document.getElementById('hideSsid').value;
  const auth = document.getElementById('authMethod').value;
  const password = document.getElementById('wifiPassword').value.trim();
  const bandwidth = document.getElementById('channelBandwidth').value;
  const msg = document.getElementById('wirelessMsg');

  if (!ssid) return msg.textContent = 'SSID cannot be empty.';
  if (auth !== 'Open System' && password.length < 8) return msg.textContent = 'Password must be at least 8 characters.';

  state.wireless[band] = { ssid, hide, auth, password, bandwidth };
  refreshWirelessPreview();
  msg.textContent = `${band} wireless settings applied successfully.`;
  showToast(`${band} SSID updated to ${ssid}`);
}

function resetWireless(){
  loadWirelessBand(state.currentBand);
  document.getElementById('wirelessMsg').textContent = 'Changes reverted.';
}

function applyLan(){
  const ip = document.getElementById('routerIp').value.trim();
  const mask = document.getElementById('subnetMask').value.trim();
  const msg = document.getElementById('lanMsg');
  if (!isValidIp(ip) || !isValidIp(mask)) return msg.textContent = 'Please enter a valid IP address and subnet mask.';
  state.lan.ip = ip;
  state.lan.mask = mask;
  msg.textContent = 'LAN IP settings applied successfully.';
  showToast(`Router LAN IP changed to ${ip}`);
}

function resetLan(){
  document.getElementById('routerIp').value = state.lan.ip;
  document.getElementById('subnetMask').value = state.lan.mask;
  document.getElementById('lanMsg').textContent = 'Changes reverted.';
}

function applyDhcp(){
  const start = document.getElementById('dhcpStart').value.trim();
  const end = document.getElementById('dhcpEnd').value.trim();
  const enabled = document.getElementById('dhcpEnabled').value;
  const msg = document.getElementById('dhcpMsg');
  if (enabled === 'Yes' && (!isValidIp(start) || !isValidIp(end))) return msg.textContent = 'Please enter a valid DHCP range.';
  state.dhcp.start = start;
  state.dhcp.end = end;
  document.getElementById('dhcpPreview').textContent = `${start} - ${end}`;
  msg.textContent = 'DHCP settings applied successfully.';
  showToast('DHCP settings applied.');
}

function resetDhcp(){
  document.getElementById('dhcpStart').value = state.dhcp.start;
  document.getElementById('dhcpEnd').value = state.dhcp.end;
  document.getElementById('dhcpMsg').textContent = 'Changes reverted.';
}

function applyGuest(){
  const enabled = document.getElementById('guestEnabled').value;
  const ssid = document.getElementById('guestSsid').value.trim();
  state.guest.enabled = enabled;
  state.guest.ssid = ssid;
  document.getElementById('guestPreview').textContent = enabled;
  document.getElementById('guestMsg').textContent = 'Guest network settings applied successfully.';
  showToast('Guest network updated.');
}

function resetGuest(){
  document.getElementById('guestEnabled').value = state.guest.enabled;
  document.getElementById('guestSsid').value = state.guest.ssid;
  document.getElementById('guestMsg').textContent = 'Changes reverted.';
}


const challengeSets = {
  "1": {
    "ssid24": "Sec2_IoT_Lab_24G",
    "ssid5": "Sec2_IoT_Lab_5G",
    "auth": "WPA2-Personal",
    "password": "IoT@2026Lab",
    "lan": "192.168.10.1",
    "admin": "Admin@1001"
  },
  "2": {
    "ssid24": "SmartHome_Class24",
    "ssid5": "SmartHome_Class5",
    "auth": "WPA2/WPA3-Personal",
    "password": "HomeLab#2468",
    "lan": "192.168.20.1",
    "admin": "Admin@1002"
  },
  "3": {
    "ssid24": "BlkB_IoT_24G",
    "ssid5": "BlkB_IoT_5G",
    "auth": "WPA2-Personal",
    "password": "Router!1357",
    "lan": "10.0.0.1",
    "admin": "Admin@1003"
  },
  "4": {
    "ssid24": "TrainNet_24G",
    "ssid5": "TrainNet_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "Secure@9876",
    "lan": "172.16.1.1",
    "admin": "Admin@1004"
  },
  "5": {
    "ssid24": "Lab5_Devices_24G",
    "ssid5": "Lab5_Devices_5G",
    "auth": "WPA2-Personal",
    "password": "ClassNet@5050",
    "lan": "192.168.30.1",
    "admin": "Admin@1005"
  },
  "6": {
    "ssid24": "Sec3_STEM_24G",
    "ssid5": "Sec3_STEM_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "STEMlab#6060",
    "lan": "192.168.40.1",
    "admin": "Admin@1006"
  },
  "7": {
    "ssid24": "MakerRoom_24G",
    "ssid5": "MakerRoom_5G",
    "auth": "WPA2-Personal",
    "password": "MakeIT!7070",
    "lan": "10.10.10.1",
    "admin": "Admin@1007"
  },
  "8": {
    "ssid24": "IoT_TestBed_24G",
    "ssid5": "IoT_TestBed_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "TestBed@8080",
    "lan": "172.16.10.1",
    "admin": "Admin@1008"
  },
  "9": {
    "ssid24": "RoomA_Net_24G",
    "ssid5": "RoomA_Net_5G",
    "auth": "WPA2-Personal",
    "password": "RoomA#9090",
    "lan": "192.168.60.1",
    "admin": "Admin@1009"
  },
  "10": {
    "ssid24": "DemoRouter_24G",
    "ssid5": "DemoRouter_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "DemoNet!1010",
    "lan": "192.168.70.1",
    "admin": "Admin@1010"
  },
  "11": {
    "ssid24": "Sec1_LabA_24G",
    "ssid5": "Sec1_LabA_5G",
    "auth": "WPA2-Personal",
    "password": "LabA@1111",
    "lan": "192.168.80.1",
    "admin": "Admin@1011"
  },
  "12": {
    "ssid24": "Sec4_Project_24G",
    "ssid5": "Sec4_Project_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "Project#1212",
    "lan": "192.168.90.1",
    "admin": "Admin@1012"
  },
  "13": {
    "ssid24": "Innovation_24G",
    "ssid5": "Innovation_5G",
    "auth": "WPA2-Personal",
    "password": "Innovate!1313",
    "lan": "10.20.30.1",
    "admin": "Admin@1013"
  },
  "14": {
    "ssid24": "RoomB_STEM_24G",
    "ssid5": "RoomB_STEM_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "STEMroom@1414",
    "lan": "172.20.14.1",
    "admin": "Admin@1014"
  },
  "15": {
    "ssid24": "AppliedAI_24G",
    "ssid5": "AppliedAI_5G",
    "auth": "WPA2-Personal",
    "password": "Applied#1515",
    "lan": "192.168.110.1",
    "admin": "Admin@1015"
  },
  "16": {
    "ssid24": "TestZone_24G",
    "ssid5": "TestZone_5G",
    "auth": "WPA2/WPA3-Personal",
    "password": "ZonePass!1616",
    "lan": "10.16.16.1",
    "admin": "Admin@1016"
  }
};


let currentChallengeSet = 1;

function showChallengeSet(setNumber){
  currentChallengeSet = setNumber;
  document.querySelectorAll('.challenge-set').forEach(el => el.style.display = 'none');
  const section = document.getElementById(`challengeSet${setNumber}`);
  if (section) section.style.display = 'block';
  document.querySelectorAll('.challenge-tab').forEach(btn => {
    btn.classList.remove('primary', 'active');
  });
  const activeBtn = document.getElementById(`challengeTab${setNumber}`);
  if (activeBtn) activeBtn.classList.add('primary', 'active');
  const msg = document.getElementById('challengeMsg');
  if (msg) msg.textContent = '';
}

function checkChallenge(){
  const target = challengeSets[currentChallengeSet];
  const adminPasswordField = document.getElementById('adminPassword') || document.getElementById('adminPwd') || document.getElementById('newAdminPassword');
  const currentAdminPassword = adminPasswordField ? adminPasswordField.value : '';
  const checks = [
    state.wireless['2.4GHz'].ssid === target.ssid24,
    state.wireless['5GHz'].ssid === target.ssid5,
    state.wireless['2.4GHz'].auth === target.auth && state.wireless['5GHz'].auth === target.auth,
    state.wireless['2.4GHz'].password === target.password && state.wireless['5GHz'].password === target.password,
    state.lan.ip === target.lan,
    currentAdminPassword === target.admin
  ];
  const score = checks.filter(Boolean).length;
  const msg = document.getElementById('challengeMsg');

  if (score === 6) {
    msg.textContent = `Excellent. You got 6/6 correct for Challenge Set ${currentChallengeSet}.`;
    if (typeof showToast === 'function') showToast(`Challenge Set ${currentChallengeSet} completed.`);
  } else {
    msg.textContent = `You got ${score}/6 correct for Challenge Set ${currentChallengeSet}. Check both SSIDs, authentication, Wi-Fi password, LAN IP, and admin password again.`;
  }
}

window.showChallengeSet = showChallengeSet;

window.applyWireless = applyWireless;
window.resetWireless = resetWireless;
window.applyLan = applyLan;
window.resetLan = resetLan;
window.applyDhcp = applyDhcp;
window.resetDhcp = resetDhcp;
window.applyGuest = applyGuest;
window.resetGuest = resetGuest;
window.checkChallenge = checkChallenge;
window.showToast = showToast;
window.goToPage = goToPage;

function renderClients(){
  const tbody = document.getElementById('clientTableBody');
  if (!tbody) return;
  tbody.innerHTML = clients.map((client, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${client.name}</td>
      <td>${client.type}</td>
      <td>${client.interface}</td>
      <td>${client.ip}</td>
      <td>${client.mac}</td>
      <td class="status-online">${client.status}</td>
    </tr>
  `).join('');
}

document.getElementById('bandSelect')?.addEventListener('change', (e) => loadWirelessBand(e.target.value));
document.querySelectorAll('.wireless-tab').forEach(tab => {
  tab.addEventListener('click', () => loadWirelessBand(tab.dataset.band));
});
const viewClientsLink = document.getElementById('viewClientsLink');
if (viewClientsLink) viewClientsLink.addEventListener('click', (e) => { e.preventDefault(); goToPage('clients'); });

renderClients();
refreshWirelessPreview();


function refreshOpStrip(){
  const el = document.getElementById('opSsid');
  if(el){
    el.textContent = state.wireless['2.4GHz'].ssid + ' / ' + state.wireless['5GHz'].ssid;
  }
}

const _oldRefreshWirelessPreview = refreshWirelessPreview;
refreshWirelessPreview = function(){
  _oldRefreshWirelessPreview();
  refreshOpStrip();
};

document.addEventListener('DOMContentLoaded', function(){
  refreshOpStrip();
  const hideBtn = document.getElementById('hideClientsBtn');
  if (hideBtn) hideBtn.textContent = 'Hide';
  const viewLink = document.getElementById('viewAllClientsLink') || document.getElementById('viewClientsLink');
  if (viewLink) viewLink.textContent = 'View List';
});
