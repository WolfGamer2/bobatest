// Airtable API Configuration
const apiKey = 'pat84MLj08BHlZkVu.87f94a21eafef0884ffa0e4ba1c822e4744fd35687c9bd71202f1b9038d5e705';
const baseId = 'app05mIKwNPO2l1vT';
const tableName = 'Boba - YSWS';

async function fetchSubmissions() {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching submissions: ${response.statusText}`);
        }

        const data = await response.json();
        displaySubmissions(data.records);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displaySubmissions(records) {
    const submissionsList = document.getElementById('submissions-list'); // Ensure this element exists in your HTML
    submissionsList.innerHTML = ''; // Clear previous submissions

    records.forEach(record => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Submission ID:</strong> ${record.id} <br>
            <strong>Status:</strong> ${record.fields.status || 'N/A'} <br>
            <strong>Details:</strong> ${record.fields.details || 'N/A'}
        `;
        submissionsList.appendChild(listItem);
    });
}

// Call the function to fetch submissions when the page loads
window.onload = fetchSubmissions;

// Optional: Function to add a submission (you can call this on a button click or form submission)
async function addSubmission(details, status) {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    const newSubmission = {
        fields: {
            details: details,
            status: status, // Accepted, Rejected, Pending
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSubmission),
        });

        if (!response.ok) {
            throw new Error(`Error adding submission: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Submission added:', data);
        fetchSubmissions(); // Refresh the list after adding a new submission
    } catch (error) {
        console.error('Error:', error);
    }
}
