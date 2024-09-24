const apiKey = 'pat84MLj08BHlZkVu.87f94a21eafef0884ffa0e4ba1c822e4744fd35687c9bd71202f1b9038d5e705'; // Replace with your API key
const baseId = 'app05mIKwNPO2l1vT'; // Replace with your Base ID
const tableName = 'Boba - YSWS'; // Replace with your table name

async function fetchSubmissions() {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching submissions: ${response.statusText}`);
        }

        const data = await response.json();
        displaySubmissions(data.records);
    } catch (error) {
        console.error(error);
    }
}

function displaySubmissions(records) {
    const submissionList = document.getElementById('submissionList');
    submissionList.innerHTML = '';

    records.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.fields["Submission ID"]} - ${record.fields["Title"]} - ${record.fields["Status"]}`;
        li.onclick = () => showSubmissionDetails(record);
        submissionList.appendChild(li);
    });
}

function showSubmissionDetails(record) {
    document.getElementById('submissionTitle').textContent = `Title: ${record.fields["Title"]}`;
    document.getElementById('submissionStatus').textContent = `Status: ${record.fields["Status"]}`;
    document.getElementById('reviewerComments').value = record.fields["Reviewer Comments"] || '';
    document.getElementById('submissionDetails').classList.remove('hidden');

    // Save record ID for updating later
    document.getElementById('updateStatus').onclick = () => updateSubmissionStatus(record.id);
}

async function updateSubmissionStatus(recordId) {
    const newStatus = prompt("Enter new status (Accepted, Rejected, Pending):");
    const comments = document.getElementById('reviewerComments').value;

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`;
    const body = {
        fields: {
            "Status": newStatus,
            "Reviewer Comments": comments,
        },
    };

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error updating submission: ${response.statusText}`);
        }

        alert('Submission updated successfully!');
        fetchSubmissions(); // Refresh the list
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('fetchSubmissions').addEventListener('click', fetchSubmissions);
