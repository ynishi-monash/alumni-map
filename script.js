// Initialize the map and set its view (KEEP THIS CODE AS IS)
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Get modal elements
const videoModal = document.getElementById('video-modal');
const videoFrame = document.getElementById('alumni-video');
const closeButton = document.querySelector('.close-button');

// Function to open the modal and play video
function openModal(videoUrl) {
    videoFrame.src = videoUrl;
    videoModal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    videoModal.style.display = 'none';
    videoFrame.src = ''; // Stop video by clearing src
}

// Add event listener to close button
closeButton.addEventListener('click', closeModal);

// Close modal if user clicks outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === videoModal) {
        closeModal();
    }
});

// Function to load alumni data and add markers to the map
async function loadAlumniData() {
    try {
        const response = await fetch('alumni_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const alumni = await response.json();

        alumni.forEach(alumnus => {
            const marker = L.marker([alumnus.lat, alumnus.lng]).addTo(map);
            
            marker.on('click', () => {
                // Zoom into the area
                map.setView([alumnus.lat, alumnus.lng], 10); // Zoom level 10, adjust as needed
                
                // Open modal with the video
                openModal(alumnus.videoUrl);
            });
        });

    } catch (error) {
        console.error("Could not load alumni data:", error);
    }
}

// Call the function to load data
loadAlumniData();
