// Get the form element for posting discussions
const discussionForm = document.getElementById('discussionForm');

// Handle form submission
discussionForm.addEventListener('submit', async (event) => { // Corrected the syntax here
    // Prevent the default form submission (which would reload the page)
    event.preventDefault();

    // Get the title and content from the form inputs
    const title = document.getElementById('discussion-title').value;
    const content = document.getElementById('new-discussion').value;
    const token = localStorage.getItem('token'); // Assuming you store the JWT token here

    // Check if title and content are provided
    if (!title || !content) {
        alert('Title and content are required.');
        return;
    }

    try {
        // Send a POST request to the server to create a new discussion
        const response = await fetch('http://localhost:3001/civics/api/discussions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the token for authorization
            },
            body: JSON.stringify({ title, content })
        });

        // Check if the response is okay (status code 200)
        if (response.ok) {
            const data = await response.json(); // Parse JSON response
            console.log('Discussion posted successfully:', data);
            alert('Discussion posted successfully!');
            // Optionally, update the UI or clear the form
            document.getElementById('discussion-title').value = '';
            document.getElementById('new-discussion').value = '';
            // Optionally, fetch discussions again to refresh the list
            fetchDiscussions();
        } else {
            // Handle error from the server (non-200 status code)
            const errorData = await response.json();
            alert('Error posting discussion: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting discussion: ' + error.message);
    }
});

// Function to fetch discussions (this can be called after posting a new discussion)
async function fetchDiscussions() {
    const response = await fetch('http://localhost:3001/civics/api/discussions');
    if (response.ok) {
        const discussions = await response.json();
        const discussionList = document.getElementById('discussion-list');
        if (discussions.length === 0) {
            discussionList.innerHTML = '<p>No discussions yet. Start one!</p>';
        } else {
            discussionList.innerHTML = discussions.map(discussion => `
                <div class="discussion">
                    <h5>${discussion.title}</h5>
                    <p>${discussion.content}</p>
                    <p><strong>Sentiment Score:</strong> ${discussion.sentiment_score}</p>
                </div>
            `).join('');
        }
    } else {
        console.error('Error fetching discussions:', response.statusText);
    }
}
