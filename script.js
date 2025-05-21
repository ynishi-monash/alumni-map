// Initialize the map and set its view (KEEP THIS CODE AS IS)
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Get modal elements (KEEP THIS CODE AS IS)
const videoModal = document.getElementById('video-modal');
const videoFrame = document.getElementById('alumni-video');
const closeButton = document.querySelector('.close-button');

// Function to open the modal and play video (KEEP THIS CODE AS IS)
function openModal(videoUrl) {
    videoFrame.src = videoUrl;
    videoModal.style.display = 'block';
}

// Function to close the modal (KEEP THIS CODE AS IS)
function closeModal() {
    videoModal.style.display = 'none';
    videoFrame.src = ''; // Stop video by clearing src

    // Zoom out to world view with animation
    map.flyTo([20, 0], 2, { // Target coordinates [lat, lng], zoom level
        animate: true,
        duration: 1.5 // Animation duration in seconds
    });
}

// Add event listener to close button (KEEP THIS CODE AS IS)
closeButton.addEventListener('click', closeModal);

// Close modal if user clicks outside of the modal content (KEEP THIS CODE AS IS)
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
            // Create custom HTML for the marker icon
            const customIcon = L.divIcon({
                className: 'custom-alumni-marker', // CSS class for styling
                html: `
                    <div class="marker-thumbnail">
                        <img src="${alumnus.thumbnailUrl}" alt="${alumnus.name}" style="width:40px; height:40px; border-radius: 50%;">
                    </div>
                    <div class="marker-info">
                        <b>${alumnus.name}</b><br>
                        ${alumnus.occupation}<br>
                        ${alumnus.country}
                    </div>
                `,
                iconSize: [150, 60], // Approximate size of the HTML content (width, height)
                iconAnchor: [75, 30]  // Point of the icon which will correspond to marker's location (center-ish)
            });

            const marker = L.marker([alumnus.lat, alumnus.lng], { icon: customIcon }).addTo(map);
            
            marker.on('click', () => {
                // Animate zoom to the country level
                map.flyTo([alumnus.lat, alumnus.lng], 6, { // Zoom level 6 for country view, adjust as needed
                    animate: true,
                    duration: 1.5 // Animation duration in seconds
                }); 
                
                // Open modal with the video (ensure this is still delayed slightly if flyTo is long, or opens once flyTo completes)
                // For simplicity, we open it immediately. If animation is long, consider using flyTo's 'end' event.
                openModal(alumnus.videoUrl);
            });
        });

    } catch (error) {
        console.error("Could not load alumni data:", error);
    }
}

// Call the function to load data (KEEP THIS LINE)
loadAlumniData();
