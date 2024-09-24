// Get the event code input field and button
const eventCodeInput = document.getElementById('event-code');
const getWebsitesButton = document.getElementById('getWebsites');

// Get the admin password input field and button
const adminPasswordInput = document.getElementById('admin-password');
const loginAdminButton = document.getElementById('loginAdmin');

// Get the admin panel and status elements
const adminPanel = document.getElementById('admin-panel');
const adminStatusList = document.getElementById('adminStatus');

// Get the connection status element
const connectionStatus = document.getElementById('connection-status');

// Set up the API request to Airtable
const airtableApiUrl = `https://api.airtable.com/v0/${BASE_ID}/Table%201`;
const apiKey = `${API_KEY}`;
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

// Handle the event code input and button click
getWebsitesButton.addEventListener('click', async () => {
  const eventCode = eventCodeInput.value.trim();
  if (eventCode) {
    try {
      const response = await fetch(`${airtableApiUrl}?filterByFormula=EVENT_CODE%3D%22${eventCode}%22`, {
        headers: headers
      });
      const data = await response.json();
      const submissionsList = document.getElementById('Status');
      submissionsList.innerHTML = '';
      data.records.forEach(record => {
        const submissionItem = document.createElement('li');
        submissionItem.textContent = `${record.fields.Name} - ${record.fields.Email}`;
        submissionsList.appendChild(submissionItem);
      });
    } catch (error) {
      console.error(error);
      connectionStatus.style.backgroundColor = 'red';
    }
  }
});

// Handle the admin login and button click
loginAdminButton.addEventListener('click', async () => {
  const adminPassword = adminPasswordInput.value.trim();
  if (adminPassword) {
    try {
      // TO DO: Implement admin login logic here
      // For now, just show the admin panel
      adminPanel.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      document.getElementById('login-error').textContent = 'Invalid admin password';
    }
  }
});

// Handle the fetch all event codes and websites button click
document.getElementById('fetchAll').addEventListener('click', async () => {
  try {
    const response = await fetch(airtableApiUrl, {
      headers: headers
    });
    const data = await response.json();
    const adminStatusList = document.getElementById('adminStatus');
    adminStatusList.innerHTML = '';
    data.records.forEach(record => {
      const statusItem = document.createElement('li');
      statusItem.textContent = `${record.fields.Event Code} - ${record.fields.Website}`;
      adminStatusList.appendChild(statusItem);
    });
  } catch (error) {
    console.error(error);
    connectionStatus.style.backgroundColor = 'red';
  }
});

// Set up the connection status checker
setInterval(() => {
  fetch(airtableApiUrl, {
    headers: headers
  })
  .then(response => response.ok ? connectionStatus.style.backgroundColor = 'green' : connectionStatus.style.backgroundColor = 'red')
  .catch(error => connectionStatus.style.backgroundColor = 'red');
}, 1000);
