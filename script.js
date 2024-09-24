const personalAccessToken = 'patdfXp1GNKbEgjA6.95bf5a74f7c45af0bfc40004081122ceb9ed0205e99d922948d0b14cd54ea69e'; // Replace with your actual personal access token
const baseId = 'app05mIKwNPO2l1vT'; // Replace with your actual Base ID
const tableName = 'Boba - YSWS'; // Replace with your actual Table Name

async function fetchSubmissions(eventCode) {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula={eventCode}="${eventCode}"`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${personalAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.records || [];
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}

document.getElementById('getSubmissions').addEventListener('click', async () => {
    const eventCode = document.getElementById('event-code').value;
    const submissions = await fetchSubmissions(eventCode);
    const submissionList = document.getElementById('submissionList');
    submissionList.innerHTML = '';

    if (submissions.length > 0) {
        submissions.forEach(record => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Name:</strong> ${record.fields.name || 'Name'}
                <br>
                <strong>Website:</strong> <a href="${record.fields.gitHubURL}" target="_blank">${record.fields.gitHubURL || 'GitHub Pages URL'}</a>
                <br>
                <strong>Status:</strong> ${record.fields.status || 'Status'}
            `;
            submissionList.appendChild(listItem);
        });
    } else {
        submissionList.innerHTML = '<li>No submissions found for this event code.</li>';
    }
});
