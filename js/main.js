// Import visualization functions
import { visualizeFastestLap } from './visualization/fastestLap.js';
import { visualizeTyreStrategy } from './visualization/tyreStrategy.js';

// Export chart instance for visualization functions to use
window.currentChart = null;

// Helper function to format time in MM:SS.sss format
window.formatTime = function(seconds) {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
}

// Toggle between chart and table views
function toggleView(view) {
    const chartContainer = document.getElementById('chartContainer');
    const tableContainer = document.getElementById('tableContainer');
    const chartBtn = document.getElementById('chartView');
    const tableBtn = document.getElementById('tableView');

    if (view === 'chart') {
        chartContainer.classList.remove('d-none');
        tableContainer.classList.add('d-none');
        chartBtn.classList.add('active');
        tableBtn.classList.remove('active');
    } else {
        chartContainer.classList.add('d-none');
        tableContainer.classList.remove('d-none');
        chartBtn.classList.remove('active');
        tableBtn.classList.add('active');
    }
}

// Initialize dropdowns and event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Populate year dropdown (2023-2025)
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        yearSelect.appendChild(option);
    }

    // Year change handler
    yearSelect.addEventListener('change', async () => {
        const year = yearSelect.value;
        const grandPrixSelect = document.getElementById('grandPrix');
        const sessionSelect = document.getElementById('session');
        const driver1Select = document.getElementById('driver1');
        const driver2Select = document.getElementById('driver2');

        // Reset dependent dropdowns
        grandPrixSelect.innerHTML = '<option value="">Select Grand Prix</option>';
        sessionSelect.innerHTML = '<option value="">Select Session</option>';
        driver1Select.innerHTML = '<option value="">Select Driver 1</option>';
        driver2Select.innerHTML = '<option value="">Select Driver 2</option>';

        if (year) {
            // Enable Grand Prix dropdown
            grandPrixSelect.disabled = false;
            
            // Fetch meetings for selected year
            const meetings = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`).then(res => res.json());
            console.log('Meetings:', meetings);
            
            // Populate Grand Prix dropdown
            meetings.forEach(meeting => {
                const option = document.createElement('option');
                option.value = meeting.meeting_key;
                option.textContent = meeting.meeting_name;
                grandPrixSelect.appendChild(option);
            });
        } else {
            // Disable dependent dropdowns
            grandPrixSelect.disabled = true;
            sessionSelect.disabled = true;
            driver1Select.disabled = true;
            driver2Select.disabled = true;
        }
    });

    // Grand Prix change handler
    document.getElementById('grandPrix').addEventListener('change', async (e) => {
        const meetingKey = e.target.value;
        const sessionSelect = document.getElementById('session');
        const driver1Select = document.getElementById('driver1');
        const driver2Select = document.getElementById('driver2');

        // Reset dependent dropdowns
        sessionSelect.innerHTML = '<option value="">Select Session</option>';
        driver1Select.innerHTML = '<option value="">Select Driver 1</option>';
        driver2Select.innerHTML = '<option value="">Select Driver 2</option>';

        if (meetingKey) {
            // Enable session dropdown
            sessionSelect.disabled = false;
            
            // Fetch sessions for selected meeting
            const sessions = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`).then(res => res.json());
            console.log('Sessions:', sessions);
            
            // Populate session dropdown
            sessions.forEach(session => {
                const option = document.createElement('option');
                option.value = session.session_key;
                option.textContent = session.session_name;
                sessionSelect.appendChild(option);
            });
        } else {
            // Disable dependent dropdowns
            sessionSelect.disabled = true;
            driver1Select.disabled = true;
            driver2Select.disabled = true;
        }
    });

    // Session change handler
    document.getElementById('session').addEventListener('change', async (e) => {
        const sessionKey = e.target.value;
        const driver1Select = document.getElementById('driver1');
        const driver2Select = document.getElementById('driver2');
        const qualifyingSegmentDiv = document.querySelector('.qualifying-segment-div');
        const lapRangeDiv = document.querySelector('.lap-range-div');

        // Reset driver dropdowns
        driver1Select.innerHTML = '<option value="">Select Driver 1</option>';
        driver2Select.innerHTML = '<option value="">Select Driver 2</option>';

        if (sessionKey) {
            // Enable driver dropdowns
            driver1Select.disabled = false;
            driver2Select.disabled = false;
            
            // Fetch drivers for selected session
            const drivers = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`).then(res => res.json());
            console.log('Drivers:', drivers);
            
            // Populate driver dropdowns
            drivers.forEach(driver => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = driver.driver_number;
                option2.value = driver.driver_number;
                option1.textContent = `${driver.full_name} (${driver.driver_number})`;
                option2.textContent = `${driver.full_name} (${driver.driver_number})`;
                driver1Select.appendChild(option1);
                driver2Select.appendChild(option2.cloneNode(true));
            });

            // Show/hide qualifying segment selector and lap range based on session type
            const sessionData = await fetch(`https://api.openf1.org/v1/sessions?session_key=${sessionKey}`).then(res => res.json());
            console.log('Session Data:', sessionData);
            
            const isQualifying = sessionData[0] && sessionData[0].session_name.toLowerCase().includes('qualifying');
            
            // For qualifying sessions, always show segment selector and hide lap range
            if (isQualifying) {
                qualifyingSegmentDiv.style.display = 'block';
                lapRangeDiv.style.display = 'none';
            } else {
                qualifyingSegmentDiv.style.display = 'none';
                // Only show lap range if not fastest lap analysis
                const analysisType = document.getElementById('analysisType').value;
                lapRangeDiv.style.display = analysisType === 'fastestLap' ? 'none' : 'block';
            }
        } else {
            // Disable driver dropdowns
            driver1Select.disabled = true;
            driver2Select.disabled = true;
            qualifyingSegmentDiv.style.display = 'none';
            lapRangeDiv.style.display = 'block';
        }
    });

    // Analysis type change handler
    document.getElementById('analysisType').addEventListener('change', (e) => {
        const analysisType = e.target.value;
        const qualifyingSegmentDiv = document.querySelector('.qualifying-segment-div');
        const lapRangeDiv = document.querySelector('.lap-range-div');
        const sessionType = document.getElementById('session').options[document.getElementById('session').selectedIndex]?.text.toLowerCase() || '';

        // For qualifying sessions, always show segment selector and hide lap range
        if (sessionType.includes('qualifying')) {
            qualifyingSegmentDiv.style.display = 'block';
            lapRangeDiv.style.display = 'none';
        } else {
            qualifyingSegmentDiv.style.display = 'none';
            // Only show lap range if not fastest lap analysis
            lapRangeDiv.style.display = analysisType === 'fastestLap' ? 'none' : 'block';
        }
    });

    // View toggle handlers
    document.getElementById('chartView').addEventListener('click', () => toggleView('chart'));
    document.getElementById('tableView').addEventListener('click', () => toggleView('table'));

    // Form submit handler
    document.getElementById('queryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous chart if it exists
        if (window.currentChart) {
            window.currentChart.destroy();
        }

        const analysisType = document.getElementById('analysisType').value;
        
        // Call appropriate visualization function based on analysis type
        switch (analysisType) {
            case 'fastestLap':
                await visualizeFastestLap();
                break;
            case 'tyreStrategy':
                await visualizeTyreStrategy();
                break;
        }
    });
});
