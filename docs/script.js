// Initialize chart instance
let currentChart = null;

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

            // Show/hide qualifying segment selector based on session type
            const sessionData = await fetch(`https://api.openf1.org/v1/sessions?session_key=${sessionKey}`).then(res => res.json());
            console.log('Session Data:', sessionData);
            const analysisType = document.getElementById('analysisType').value;
            
            if (sessionData[0] && sessionData[0].session_name.toLowerCase().includes('qualifying')) {
                qualifyingSegmentDiv.style.display = analysisType === 'fastestLap' ? 'block' : 'none';
            } else {
                qualifyingSegmentDiv.style.display = 'none';
            }
            
            // Hide lap range selector for fastest lap analysis
            lapRangeDiv.style.display = analysisType === 'fastestLap' ? 'none' : 'block';
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

        // Show/hide qualifying segment selector based on analysis and session type
        qualifyingSegmentDiv.style.display = (analysisType === 'fastestLap' && sessionType.includes('qualifying')) ? 'block' : 'none';
        // Always hide lap range selector for fastest lap analysis
        lapRangeDiv.style.display = analysisType === 'fastestLap' ? 'none' : 'block';
    });

    // View toggle handlers
    document.getElementById('chartView').addEventListener('click', () => toggleView('chart'));
    document.getElementById('tableView').addEventListener('click', () => toggleView('table'));

    // Form submit handler
    document.getElementById('queryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous chart if it exists
        if (currentChart) {
            currentChart.destroy();
        }

        const analysisType = document.getElementById('analysisType').value;
        
        // Call appropriate visualization function based on analysis type
        switch (analysisType) {
            case 'fastestLap':
                await visualizeFastestLap();
                break;
            case 'lapTimes':
                await visualizeLapTimes();
                break;
            case 'sectors':
                await visualizeSectors();
                break;
            case 'minisectors':
                await visualizeMinisectors();
                break;
            case 'speedTraps':
                await visualizeSpeedTraps();
                break;
            case 'tyreStrategy':
                await visualizeTyreStrategy();
                break;
        }
    });
});

// Helper function to format time in MM:SS.sss format
function formatTime(seconds) {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
}

// Visualize fastest lap comparison
async function visualizeFastestLap() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;
    const segment = document.getElementById('qualifyingSegment').value;

    // Fetch stint data to determine qualifying segments
    const stintsUrl = `https://api.openf1.org/v1/stints?session_key=${sessionKey}`;
    const [driver1Stints, driver2Stints] = await Promise.all([
        fetch(`${stintsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${stintsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);
    console.log('Driver 1 Stints:', driver1Stints);
    console.log('Driver 2 Stints:', driver2Stints);

    // Fetch lap times for both drivers
    const lapsUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
    const [driver1Laps, driver2Laps] = await Promise.all([
        fetch(`${lapsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${lapsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);
    console.log('Driver 1 Laps:', driver1Laps);
    console.log('Driver 2 Laps:', driver2Laps);

    // Filter laps based on qualifying segment if specified and if it's a qualifying session
    let filteredDriver1Laps = driver1Laps;
    let filteredDriver2Laps = driver2Laps;

    const sessionType = document.getElementById('session').options[document.getElementById('session').selectedIndex]?.text.toLowerCase() || '';
    if (sessionType.includes('qualifying') && segment) {
        // Map segment names to stint numbers (assuming Q1=1, Q2=2, Q3=3)
        const segmentMap = { 'Q1': 1, 'Q2': 2, 'Q3': 3 };
        const segmentNumber = segmentMap[segment];

        // Filter laps by stint number
        filteredDriver1Laps = driver1Laps.filter(lap => {
            const stint = driver1Stints.find(s => lap.lap_number >= s.lap_start && lap.lap_number <= s.lap_end);
            return stint && stint.stint_number === segmentNumber;
        });

        filteredDriver2Laps = driver2Laps.filter(lap => {
            const stint = driver2Stints.find(s => lap.lap_number >= s.lap_start && lap.lap_number <= s.lap_end);
            return stint && stint.stint_number === segmentNumber;
        });
    }

    // Find fastest laps (excluding pit-out laps and laps with null duration)
    const driver1FastestLap = filteredDriver1Laps
        .filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null && lap.duration_sector_1 !== null && lap.duration_sector_2 !== null && lap.duration_sector_3 !== null)
        .reduce((fastest, lap) => 
            (!fastest || lap.lap_duration < fastest.lap_duration) ? lap : fastest
        , null);

    const driver2FastestLap = filteredDriver2Laps
        .filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null && lap.duration_sector_1 !== null && lap.duration_sector_2 !== null && lap.duration_sector_3 !== null)
        .reduce((fastest, lap) =>
            (!fastest || lap.lap_duration < fastest.lap_duration) ? lap : fastest
        , null);

    console.log('Driver 1 Fastest Lap:', driver1FastestLap);
    console.log('Driver 2 Fastest Lap:', driver2FastestLap);

    // Get driver names and codes
    const driver1FullText = document.getElementById('driver1').options[document.getElementById('driver1').selectedIndex].text;
    const driver2FullText = document.getElementById('driver2').options[document.getElementById('driver2').selectedIndex].text;
    
    // Extract last names (everything before the parenthesis)
    const driver1LastName = driver1FullText.split(' (')[0].split(' ').pop();
    const driver2LastName = driver2FullText.split(' (')[0].split(' ').pop();
    
    // Get 3-letter codes from last names
    const driver1Code = driver1LastName.substring(0, 3).toUpperCase();
    const driver2Code = driver2LastName.substring(0, 3).toUpperCase();

    // Create chart data
    const labels = ['Sector 1', 'Sector 2', 'Sector 3', 'Lap Time'];
    const driver1Data = driver1FastestLap ? [
        driver1FastestLap.duration_sector_1,
        driver1FastestLap.duration_sector_2,
        driver1FastestLap.duration_sector_3,
        driver1FastestLap.lap_duration
    ] : [null, null, null, null];

    const driver2Data = driver2FastestLap ? [
        driver2FastestLap.duration_sector_1,
        driver2FastestLap.duration_sector_2,
        driver2FastestLap.duration_sector_3,
        driver2FastestLap.lap_duration
    ] : [null, null, null, null];

// Create chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: driver1Code,
                    data: driver1Data,
                    backgroundColor: 'rgba(255, 45, 85, 0.7)',
                    borderColor: 'rgb(255, 45, 85)',
                    borderWidth: 2,
                    barPercentage: 0.8,
                    borderRadius: 4
                },
                {
                    label: driver2Code,
                    data: driver2Data,
                    backgroundColor: 'rgba(0, 122, 255, 0.7)',
                    borderColor: 'rgb(0, 122, 255)',
                    borderWidth: 2,
                    barPercentage: 0.8,
                    borderRadius: 4
                }
            ]
        },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Fastest Lap Comparison${segment ? ` - ${segment}` : ''}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time (seconds)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 10
                        },
                        min: Math.min(...driver1Data.filter(Boolean), ...driver2Data.filter(Boolean)) * 0.99,
                        max: Math.max(...driver1Data.filter(Boolean), ...driver2Data.filter(Boolean)) * 1.01,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
    });

    // Update table view
    const table = document.querySelector('#analysisTable');
    const thead = table.querySelector('thead') || table.createTHead();
    const tbody = table.querySelector('tbody');
    
    // Update header with driver names
    thead.innerHTML = `
        <tr>
            <th>Metric</th>
            <th>${driver1LastName}</th>
            <th>${driver2LastName}</th>
            <th>Delta</th>
        </tr>
    `;
    tbody.innerHTML = '';

    // Add fastest lap information
    const sectors = ['Sector 1', 'Sector 2', 'Sector 3', 'Lap Time'];
    sectors.forEach((sector, index) => {
        const row = document.createElement('tr');
        const driver1Time = driver1Data[index];
        const driver2Time = driver2Data[index];
        const delta = driver1Time && driver2Time ? (driver1Time - driver2Time).toFixed(3) : 'N/A';
        
            row.innerHTML = `
                <td>${sector}</td>
                <td class="fw-semibold">${formatTime(driver1Time)}</td>
                <td class="fw-semibold">${formatTime(driver2Time)}</td>
                <td class="${delta > 0 ? 'delta-positive' : 'delta-negative'}">${delta !== 'N/A' ? (delta > 0 ? '+' : '') + delta : 'N/A'}</td>
            `;
        tbody.appendChild(row);
    });
}

// Visualize tyre strategy
async function visualizeTyreStrategy(data) {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values and driver information
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;

    // Get driver names and codes
    const driver1FullText = document.getElementById('driver1').options[document.getElementById('driver1').selectedIndex].text;
    const driver2FullText = document.getElementById('driver2').options[document.getElementById('driver2').selectedIndex].text;
    
    // Extract last names (everything before the parenthesis)
    const driver1LastName = driver1FullText.split(' (')[0].split(' ').pop();
    const driver2LastName = driver2FullText.split(' (')[0].split(' ').pop();

    // Fetch stint data for both drivers
    const stintsUrl = `https://api.openf1.org/v1/stints?session_key=${sessionKey}`;
    const [driver1Stints, driver2Stints] = await Promise.all([
        fetch(`${stintsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${stintsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);

    // Get 3-letter codes from driver last names
    const driver1Code = driver1LastName.substring(0, 3).toUpperCase();
    const driver2Code = driver2LastName.substring(0, 3).toUpperCase();

    // Create a timeline visualization
    const maxLap = Math.max(
        ...driver1Stints.map(stint => stint.lap_end),
        ...driver2Stints.map(stint => stint.lap_end)
    );

    const labels = Array.from({length: maxLap}, (_, i) => `Lap ${i + 1}`);

    // Map compounds to colors
    const tyreColors = {
        'SOFT': 'rgb(255, 0, 0)',
        'MEDIUM': 'rgb(255, 255, 0)',
        'HARD': 'rgb(255, 255, 255)',
        'INTERMEDIATE': 'rgb(0, 255, 0)',
        'WET': 'rgb(0, 0, 255)'
    };

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${driver1Code} Tyres`,
                    data: Array.from({length: maxLap}, (_, lap) => {
                        const stint = driver1Stints.find(s => lap + 1 >= s.lap_start && lap + 1 <= s.lap_end);
                        return stint ? 1 : null;
                    }),
                    backgroundColor: Array.from({length: maxLap}, (_, lap) => {
                        const stint = driver1Stints.find(s => lap + 1 >= s.lap_start && lap + 1 <= s.lap_end);
                        return stint ? tyreColors[stint.compound] : 'rgba(0,0,0,0)';
                    }),
                    borderWidth: 1,
                    borderColor: Array.from({length: maxLap}, (_, lap) => {
                        const stint = driver1Stints.find(s => lap + 1 >= s.lap_start && lap + 1 <= s.lap_end);
                        return stint ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0,0,0,0)';
                    }),
                    barPercentage: 0.98,
                    categoryPercentage: 0.98
                },
                {
                    label: `${driver2Code} Tyres`,
                    data: Array.from({length: maxLap}, (_, lap) => {
                        const stint = driver2Stints.find(s => lap + 1 >= s.lap_start && lap + 1 <= s.lap_end);
                        return stint ? -1 : null;
                    }),
                    backgroundColor: Array.from({length: maxLap}, (_, lap) => {
                        const stint = driver2Stints.find(s => lap + 1 >= s.lap_start && lap + 1 <= s.lap_end);
                        return stint ? tyreColors[stint.compound] : 'rgba(0,0,0,0)';
                    }),
                    borderWidth: 1,
                    borderColor: Array.from({length: maxLap}, (_, lap) => {
                        const stint = driver2Stints.find(s => lap + 1 >= s.lap_start && lap + 1 <= s.lap_end);
                        return stint ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0,0,0,0)';
                    }),
                    barPercentage: 0.98,
                    categoryPercentage: 0.98
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tyre Strategy Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const stint = context.datasetIndex === 0 ? 
                                driver1Stints.find(s => context.dataIndex + 1 >= s.lap_start && context.dataIndex + 1 <= s.lap_end) :
                                driver2Stints.find(s => context.dataIndex + 1 >= s.lap_start && context.dataIndex + 1 <= s.lap_end);
                            if (stint) {
                                return `${context.dataset.label}: ${stint.compound} (Age: ${stint.tyre_age_at_start} laps)`;
                            }
                            return context.dataset.label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            }
        }
    });

    // Update table view
    const table = document.querySelector('#analysisTable');
    const thead = table.querySelector('thead') || table.createTHead();
    const tbody = table.querySelector('tbody');
    
    // Update header with tyre compounds
    thead.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                <div class="d-flex justify-content-around">
                    ${Object.entries(tyreColors).map(([compound, color]) => `
                        <div>
                            <span style="display:inline-block;width:20px;height:20px;background-color:${color};margin-right:5px"></span>
                            ${compound}
                        </div>
                    `).join('')}
                </div>
            </td>
        </tr>
        <tr>
            <th>Stint</th>
            <th>${driver1LastName}</th>
            <th>${driver2LastName}</th>
            <th>Difference</th>
        </tr>
    `;
    tbody.innerHTML = '';

    // Add stint information
    driver1Stints.forEach((stint, index) => {
        const row = document.createElement('tr');
            row.innerHTML = `
                <td class="fw-semibold">Stint ${stint.stint_number}</td>
                <td>
                    <span class="tyre-compound tyre-${stint.compound.toLowerCase()}">${stint.compound}</span><br>
                    <small class="text-muted">Laps: ${stint.lap_start}-${stint.lap_end}</small><br>
                    <small class="text-muted">Age: ${stint.tyre_age_at_start} laps</small>
                </td>
                <td>
                    ${driver2Stints[index] ? `
                        <span class="tyre-compound tyre-${driver2Stints[index].compound.toLowerCase()}">${driver2Stints[index].compound}</span><br>
                        <small class="text-muted">Laps: ${driver2Stints[index].lap_start}-${driver2Stints[index].lap_end}</small><br>
                        <small class="text-muted">Age: ${driver2Stints[index].tyre_age_at_start} laps</small>
                    ` : '<span class="text-muted">N/A</span>'}
                </td>
                <td>${driver2Stints[index] ? 
                    stint.compound === driver2Stints[index].compound ? 
                        '<span class="badge bg-success">Same compound</span>' : 
                        '<span class="badge bg-warning text-dark">Different compound</span>' 
                    : '<span class="text-muted">N/A</span>'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Visualize lap times comparison
async function visualizeLapTimes() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;

    // Fetch lap times for both drivers
    const lapsUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
    const [driver1Laps, driver2Laps] = await Promise.all([
        fetch(`${lapsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${lapsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);

    // Get driver names and codes
    const driver1FullText = document.getElementById('driver1').options[document.getElementById('driver1').selectedIndex].text;
    const driver2FullText = document.getElementById('driver2').options[document.getElementById('driver2').selectedIndex].text;
    
    // Extract last names (everything before the parenthesis)
    const driver1LastName = driver1FullText.split(' (')[0].split(' ').pop();
    const driver2LastName = driver2FullText.split(' (')[0].split(' ').pop();
    
    // Get 3-letter codes from last names
    const driver1Code = driver1LastName.substring(0, 3).toUpperCase();
    const driver2Code = driver2LastName.substring(0, 3).toUpperCase();

    // Filter out pit-out laps and null durations
    const filteredDriver1Laps = driver1Laps
        .filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null)
        .sort((a, b) => a.lap_number - b.lap_number);
    
    const filteredDriver2Laps = driver2Laps
        .filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null)
        .sort((a, b) => a.lap_number - b.lap_number);

    // Find personal best times for color coding
    const driver1BestTime = Math.min(...filteredDriver1Laps.map(lap => lap.lap_duration));
    const driver2BestTime = Math.min(...filteredDriver2Laps.map(lap => lap.lap_duration));

    // Create chart data
    const maxLaps = Math.max(
        filteredDriver1Laps.length > 0 ? filteredDriver1Laps[filteredDriver1Laps.length - 1].lap_number : 0,
        filteredDriver2Laps.length > 0 ? filteredDriver2Laps[filteredDriver2Laps.length - 1].lap_number : 0
    );

    const labels = Array.from({length: maxLaps}, (_, i) => `Lap ${i + 1}`);
    
    // Create datasets with null for missing laps
    const driver1Data = Array(maxLaps).fill(null);
    const driver2Data = Array(maxLaps).fill(null);

    filteredDriver1Laps.forEach(lap => {
        driver1Data[lap.lap_number - 1] = lap.lap_duration;
    });

    filteredDriver2Laps.forEach(lap => {
        driver2Data[lap.lap_number - 1] = lap.lap_duration;
    });

    // Create chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: driver1Code,
                    data: driver1Data,
                    borderColor: 'rgb(255, 45, 85)',
                    backgroundColor: 'rgba(255, 45, 85, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: driver2Code,
                    data: driver2Data,
                    borderColor: 'rgb(0, 122, 255)',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Lap Times Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Time (seconds)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });

    // Update table view
    const table = document.querySelector('#analysisTable');
    const thead = table.querySelector('thead') || table.createTHead();
    const tbody = table.querySelector('tbody');
    
    // Update header with driver names
    thead.innerHTML = `
        <tr>
            <th>Lap</th>
            <th>${driver1LastName}</th>
            <th>${driver2LastName}</th>
            <th>Delta</th>
        </tr>
    `;
    tbody.innerHTML = '';

    // Add lap time information
    for (let lap = 0; lap < maxLaps; lap++) {
        const row = document.createElement('tr');
        const driver1Time = driver1Data[lap];
        const driver2Time = driver2Data[lap];
        const delta = driver1Time && driver2Time ? (driver1Time - driver2Time).toFixed(3) : 'N/A';
        
        // Style for personal best laps
        const driver1Style = driver1Time === driver1BestTime ? 'font-weight: bold; color: purple;' : '';
        const driver2Style = driver2Time === driver2BestTime ? 'font-weight: bold; color: purple;' : '';
        
        row.innerHTML = `
            <td>Lap ${lap + 1}</td>
            <td style="${driver1Style}">${formatTime(driver1Time)}</td>
            <td style="${driver2Style}">${formatTime(driver2Time)}</td>
            <td>${delta !== 'N/A' ? (delta > 0 ? '+' : '') + delta : 'N/A'}</td>
        `;
        tbody.appendChild(row);
    }
}

// Visualize sectors comparison
async function visualizeSectors() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;

    // Fetch lap times for both drivers
    const lapsUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
    const [driver1Laps, driver2Laps] = await Promise.all([
        fetch(`${lapsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${lapsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);

    // Get driver names and codes
    const driver1FullText = document.getElementById('driver1').options[document.getElementById('driver1').selectedIndex].text;
    const driver2FullText = document.getElementById('driver2').options[document.getElementById('driver2').selectedIndex].text;
    
    // Extract last names (everything before the parenthesis)
    const driver1LastName = driver1FullText.split(' (')[0].split(' ').pop();
    const driver2LastName = driver2FullText.split(' (')[0].split(' ').pop();
    
    // Get 3-letter codes from last names
    const driver1Code = driver1LastName.substring(0, 3).toUpperCase();
    const driver2Code = driver2LastName.substring(0, 3).toUpperCase();

    // Filter valid laps and find best sectors
    const validDriver1Laps = driver1Laps.filter(lap => 
        !lap.is_pit_out_lap && 
        lap.duration_sector_1 !== null && 
        lap.duration_sector_2 !== null && 
        lap.duration_sector_3 !== null
    );

    const validDriver2Laps = driver2Laps.filter(lap => 
        !lap.is_pit_out_lap && 
        lap.duration_sector_1 !== null && 
        lap.duration_sector_2 !== null && 
        lap.duration_sector_3 !== null
    );

    // Find best sectors for each driver
    const driver1BestSectors = {
        s1: Math.min(...validDriver1Laps.map(lap => lap.duration_sector_1)),
        s2: Math.min(...validDriver1Laps.map(lap => lap.duration_sector_2)),
        s3: Math.min(...validDriver1Laps.map(lap => lap.duration_sector_3))
    };

    const driver2BestSectors = {
        s1: Math.min(...validDriver2Laps.map(lap => lap.duration_sector_2)),
        s2: Math.min(...validDriver2Laps.map(lap => lap.duration_sector_2)),
        s3: Math.min(...validDriver2Laps.map(lap => lap.duration_sector_3))
    };

    // Calculate theoretical best laps
    const driver1TheoreticalBest = driver1BestSectors.s1 + driver1BestSectors.s2 + driver1BestSectors.s3;
    const driver2TheoreticalBest = driver2BestSectors.s1 + driver2BestSectors.s2 + driver2BestSectors.s3;

    // Calculate average sectors
    const driver1AvgSectors = {
        s1: validDriver1Laps.reduce((sum, lap) => sum + lap.duration_sector_1, 0) / validDriver1Laps.length,
        s2: validDriver1Laps.reduce((sum, lap) => sum + lap.duration_sector_2, 0) / validDriver1Laps.length,
        s3: validDriver1Laps.reduce((sum, lap) => sum + lap.duration_sector_3, 0) / validDriver1Laps.length
    };

    const driver2AvgSectors = {
        s1: validDriver2Laps.reduce((sum, lap) => sum + lap.duration_sector_1, 0) / validDriver2Laps.length,
        s2: validDriver2Laps.reduce((sum, lap) => sum + lap.duration_sector_2, 0) / validDriver2Laps.length,
        s3: validDriver2Laps.reduce((sum, lap) => sum + lap.duration_sector_3, 0) / validDriver2Laps.length
    };

    // Create chart data
    const labels = ['Sector 1', 'Sector 2', 'Sector 3'];
    const driver1BestData = [driver1BestSectors.s1, driver1BestSectors.s2, driver1BestSectors.s3];
    const driver2BestData = [driver2BestSectors.s1, driver2BestSectors.s2, driver2BestSectors.s3];
    const driver1AvgData = [driver1AvgSectors.s1, driver1AvgSectors.s2, driver1AvgSectors.s3];
    const driver2AvgData = [driver2AvgSectors.s1, driver2AvgSectors.s2, driver2AvgSectors.s3];

    // Create chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${driver1Code} Best`,
                    data: driver1BestData,
                    backgroundColor: 'rgba(255, 45, 85, 0.8)',
                    borderColor: 'rgb(255, 45, 85)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: `${driver1Code} Avg`,
                    data: driver1AvgData,
                    backgroundColor: 'rgba(255, 45, 85, 0.3)',
                    borderColor: 'rgb(255, 45, 85)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: `${driver2Code} Best`,
                    data: driver2BestData,
                    backgroundColor: 'rgba(0, 122, 255, 0.8)',
                    borderColor: 'rgb(0, 122, 255)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: `${driver2Code} Avg`,
                    data: driver2AvgData,
                    backgroundColor: 'rgba(0, 122, 255, 0.3)',
                    borderColor: 'rgb(0, 122, 255)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sector Times Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Time (seconds)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });

    // Update table view
    const table = document.querySelector('#analysisTable');
    const thead = table.querySelector('thead') || table.createTHead();
    const tbody = table.querySelector('tbody');
    
    // Update header with driver names
    thead.innerHTML = `
        <tr>
            <th>Sector</th>
            <th>${driver1LastName}</th>
            <th>${driver2LastName}</th>
            <th>Delta (Best)</th>
        </tr>
    `;
    tbody.innerHTML = '';

    // Add sector information
    ['Sector 1', 'Sector 2', 'Sector 3'].forEach((sector, index) => {
        const row = document.createElement('tr');
        const driver1Best = driver1BestData[index];
        const driver2Best = driver2BestData[index];
        const driver1Avg = driver1AvgData[index];
        const driver2Avg = driver2AvgData[index];
        const delta = (driver1Best - driver2Best).toFixed(3);
        
        row.innerHTML = `
            <td>${sector}</td>
            <td>Best: ${formatTime(driver1Best)}<br>Avg: ${formatTime(driver1Avg)}</td>
            <td>Best: ${formatTime(driver2Best)}<br>Avg: ${formatTime(driver2Avg)}</td>
            <td>${delta > 0 ? '+' : ''}${delta}</td>
        `;
        tbody.appendChild(row);
    });

    // Add theoretical best lap row
    const theoreticalRow = document.createElement('tr');
    const theoreticalDelta = (driver1TheoreticalBest - driver2TheoreticalBest).toFixed(3);
    
    theoreticalRow.innerHTML = `
        <td><strong>Theoretical Best</strong></td>
        <td><strong>${formatTime(driver1TheoreticalBest)}</strong></td>
        <td><strong>${formatTime(driver2TheoreticalBest)}</strong></td>
        <td><strong>${theoreticalDelta > 0 ? '+' : ''}${theoreticalDelta}</strong></td>
    `;
    tbody.appendChild(theoreticalRow);
}

// Visualize speed traps comparison
async function visualizeSpeedTraps() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;

    // Fetch lap times for both drivers
    const lapsUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
    const [driver1Laps, driver2Laps] = await Promise.all([
        fetch(`${lapsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${lapsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);

    // Get driver names and codes
    const driver1FullText = document.getElementById('driver1').options[document.getElementById('driver1').selectedIndex].text;
    const driver2FullText = document.getElementById('driver2').options[document.getElementById('driver2').selectedIndex].text;
    
    // Extract last names (everything before the parenthesis)
    const driver1LastName = driver1FullText.split(' (')[0].split(' ').pop();
    const driver2LastName = driver2FullText.split(' (')[0].split(' ').pop();
    
    // Get 3-letter codes from last names
    const driver1Code = driver1LastName.substring(0, 3).toUpperCase();
    const driver2Code = driver2LastName.substring(0, 3).toUpperCase();

    // Filter valid laps and find maximum speeds
    const validDriver1Laps = driver1Laps.filter(lap => 
        !lap.is_pit_out_lap && 
        lap.i1_speed !== null && 
        lap.i2_speed !== null && 
        lap.st_speed !== null
    );

    const validDriver2Laps = driver2Laps.filter(lap => 
        !lap.is_pit_out_lap && 
        lap.i1_speed !== null && 
        lap.i2_speed !== null && 
        lap.st_speed !== null
    );

    // Find maximum speeds for each driver
    const driver1MaxSpeeds = {
        i1: Math.max(...validDriver1Laps.map(lap => lap.i1_speed)),
        i2: Math.max(...validDriver1Laps.map(lap => lap.i2_speed)),
        st: Math.max(...validDriver1Laps.map(lap => lap.st_speed))
    };

    const driver2MaxSpeeds = {
        i1: Math.max(...validDriver2Laps.map(lap => lap.i1_speed)),
        i2: Math.max(...validDriver2Laps.map(lap => lap.i2_speed)),
        st: Math.max(...validDriver2Laps.map(lap => lap.st_speed))
    };

    // Calculate average speeds
    const driver1AvgSpeeds = {
        i1: validDriver1Laps.reduce((sum, lap) => sum + lap.i1_speed, 0) / validDriver1Laps.length,
        i2: validDriver1Laps.reduce((sum, lap) => sum + lap.i2_speed, 0) / validDriver1Laps.length,
        st: validDriver1Laps.reduce((sum, lap) => sum + lap.st_speed, 0) / validDriver1Laps.length
    };

    const driver2AvgSpeeds = {
        i1: validDriver2Laps.reduce((sum, lap) => sum + lap.i1_speed, 0) / validDriver2Laps.length,
        i2: validDriver2Laps.reduce((sum, lap) => sum + lap.i2_speed, 0) / validDriver2Laps.length,
        st: validDriver2Laps.reduce((sum, lap) => sum + lap.st_speed, 0) / validDriver2Laps.length
    };

    // Create chart data
    const labels = ['Intermediate 1', 'Intermediate 2', 'Speed Trap'];
    const driver1MaxData = [driver1MaxSpeeds.i1, driver1MaxSpeeds.i2, driver1MaxSpeeds.st];
    const driver2MaxData = [driver2MaxSpeeds.i1, driver2MaxSpeeds.i2, driver2MaxSpeeds.st];
    const driver1AvgData = [driver1AvgSpeeds.i1, driver1AvgSpeeds.i2, driver1AvgSpeeds.st];
    const driver2AvgData = [driver2AvgSpeeds.i1, driver2AvgSpeeds.i2, driver2AvgSpeeds.st];

    // Create chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${driver1Code} Max`,
                    data: driver1MaxData,
                    backgroundColor: 'rgba(255, 45, 85, 0.8)',
                    borderColor: 'rgb(255, 45, 85)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: `${driver1Code} Avg`,
                    data: driver1AvgData,
                    backgroundColor: 'rgba(255, 45, 85, 0.3)',
                    borderColor: 'rgb(255, 45, 85)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: `${driver2Code} Max`,
                    data: driver2MaxData,
                    backgroundColor: 'rgba(0, 122, 255, 0.8)',
                    borderColor: 'rgb(0, 122, 255)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: `${driver2Code} Avg`,
                    data: driver2AvgData,
                    backgroundColor: 'rgba(0, 122, 255, 0.3)',
                    borderColor: 'rgb(0, 122, 255)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Speed Traps Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Speed (km/h)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });

    // Update table view
    const table = document.querySelector('#analysisTable');
    const thead = table.querySelector('thead') || table.createTHead();
    const tbody = table.querySelector('tbody');
    
    // Update header with driver names
    thead.innerHTML = `
        <tr>
            <th>Location</th>
            <th>${driver1LastName}</th>
            <th>${driver2LastName}</th>
            <th>Delta (Max)</th>
        </tr>
    `;
    tbody.innerHTML = '';

    // Add speed information
    ['Intermediate 1', 'Intermediate 2', 'Speed Trap'].forEach((location, index) => {
        const row = document.createElement('tr');
        const driver1Max = driver1MaxData[index];
        const driver2Max = driver2MaxData[index];
        const driver1Avg = driver1AvgData[index];
        const driver2Avg = driver2AvgData[index];
        const delta = (driver1Max - driver2Max).toFixed(1);
        
        row.innerHTML = `
            <td>${location}</td>
            <td>Max: ${driver1Max.toFixed(1)} km/h<br>Avg: ${driver1Avg.toFixed(1)} km/h</td>
            <td>Max: ${driver2Max.toFixed(1)} km/h<br>Avg: ${driver2Avg.toFixed(1)} km/h</td>
            <td>${delta > 0 ? '+' : ''}${delta} km/h</td>
        `;
        tbody.appendChild(row);
    });
}

// Visualize mini-sectors comparison
async function visualizeMinisectors() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;

    // Fetch lap times for both drivers
    const lapsUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
    const [driver1Laps, driver2Laps] = await Promise.all([
        fetch(`${lapsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${lapsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);

    // Get driver names and codes
    const driver1FullText = document.getElementById('driver1').options[document.getElementById('driver1').selectedIndex].text;
    const driver2FullText = document.getElementById('driver2').options[document.getElementById('driver2').selectedIndex].text;
    
    // Extract last names (everything before the parenthesis)
    const driver1LastName = driver1FullText.split(' (')[0].split(' ').pop();
    const driver2LastName = driver2FullText.split(' (')[0].split(' ').pop();
    
    // Get 3-letter codes from last names
    const driver1Code = driver1LastName.substring(0, 3).toUpperCase();
    const driver2Code = driver2LastName.substring(0, 3).toUpperCase();

    // Find fastest laps (excluding pit-out laps and laps with null duration)
    const driver1FastestLap = driver1Laps
        .filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null)
        .reduce((fastest, lap) => 
            (!fastest || lap.lap_duration < fastest.lap_duration) ? lap : fastest
        , null);

    const driver2FastestLap = driver2Laps
        .filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null)
        .reduce((fastest, lap) =>
            (!fastest || lap.lap_duration < fastest.lap_duration) ? lap : fastest
        , null);

    // Combine all mini-sectors
    const driver1Segments = [
        ...(driver1FastestLap?.segments_sector_1 || []),
        ...(driver1FastestLap?.segments_sector_2 || []),
        ...(driver1FastestLap?.segments_sector_3 || [])
    ];

    const driver2Segments = [
        ...(driver2FastestLap?.segments_sector_2 || []),
        ...(driver2FastestLap?.segments_sector_2 || []),
        ...(driver2FastestLap?.segments_sector_3 || [])
    ];

    // Map segment values to colors
    const segmentColors = {
        2048: 'rgb(255, 255, 0)', // yellow
        2049: 'rgb(0, 255, 0)',   // green
        2051: 'rgb(128, 0, 128)', // purple
        2064: 'rgb(128, 128, 128)' // grey for pitlane
    };

    // Create chart data
    const labels = Array.from({length: driver1Segments.length}, (_, i) => `MS${i + 1}`);
    const driver1Data = driver1Segments.map(segment => segment === 2051 ? 1 : segment === 2049 ? 0.5 : 0);
    const driver2Data = driver2Segments.map(segment => segment === 2051 ? 1 : segment === 2049 ? 0.5 : 0);

    // Create chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: driver1Code,
                    data: driver1Data,
                    backgroundColor: driver1Segments.map(segment => segmentColors[segment] || 'rgba(0,0,0,0)'),
                    borderColor: driver1Segments.map(segment => segment ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0,0,0,0)'),
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                },
                {
                    label: driver2Code,
                    data: driver2Data,
                    backgroundColor: driver2Segments.map(segment => segmentColors[segment] || 'rgba(0,0,0,0)'),
                    borderColor: driver2Segments.map(segment => segment ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0,0,0,0)'),
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Mini-Sectors Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        },
                        generateLabels: function(chart) {
                            const defaultLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            const customLabels = [
                                {
                                    text: 'Purple (Fastest)',
                                    fillStyle: segmentColors[2051],
                                    strokeStyle: 'rgba(0, 0, 0, 0.1)'
                                },
                                {
                                    text: 'Green (Personal Best)',
                                    fillStyle: segmentColors[2049],
                                    strokeStyle: 'rgba(0, 0, 0, 0.1)'
                                },
                                {
                                    text: 'Yellow (Standard)',
                                    fillStyle: segmentColors[2048],
                                    strokeStyle: 'rgba(0, 0, 0, 0.1)'
                                }
                            ];
                            return [...defaultLabels, ...customLabels];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            }
        }
    });

    // Update table view
    const table = document.querySelector('#analysisTable');
    const thead = table.querySelector('thead') || table.createTHead();
    const tbody = table.querySelector('tbody');
    
    // Update header with driver names and legend
    thead.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                <div class="d-flex justify-content-around">
                    <div>
                        <span style="display:inline-block;width:20px;height:20px;background-color:${segmentColors[2051]};margin-right:5px"></span>
                        Purple (Fastest)
                    </div>
                    <div>
                        <span style="display:inline-block;width:20px;height:20px;background-color:${segmentColors[2049]};margin-right:5px"></span>
                        Green (Personal Best)
                    </div>
                    <div>
                        <span style="display:inline-block;width:20px;height:20px;background-color:${segmentColors[2048]};margin-right:5px"></span>
                        Yellow (Standard)
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <th>Mini-Sector</th>
            <th>${driver1LastName}</th>
            <th>${driver2LastName}</th>
            <th>Comparison</th>
        </tr>
    `;
    tbody.innerHTML = '';

    // Add mini-sector information
    const sectors = ['Sector 1', 'Sector 2', 'Sector 3'];
    let miniSectorCount = 1;
    
    sectors.forEach((sector, sectorIndex) => {
        // Add sector header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <td colspan="4" style="background-color: #f8f9fa"><strong>${sector}</strong></td>
        `;
        tbody.appendChild(headerRow);

        // Get segments for this sector
        const driver1SectorSegments = sectorIndex === 0 ? 
            driver1FastestLap?.segments_sector_1 : 
            sectorIndex === 1 ? 
                driver1FastestLap?.segments_sector_2 : 
                driver1FastestLap?.segments_sector_3;

        const driver2SectorSegments = sectorIndex === 0 ? 
            driver2FastestLap?.segments_sector_1 : 
            sectorIndex === 1 ? 
                driver2FastestLap?.segments_sector_2 : 
                driver2FastestLap?.segments_sector_3;

        // Add mini-sector rows
        if (driver1SectorSegments && driver2SectorSegments) {
            driver1SectorSegments.forEach((segment, index) => {
                const row = document.createElement('tr');
                const driver2Segment = driver2SectorSegments[index];
                
                const getSegmentText = (segment) => {
                    switch(segment) {
                        case 2051: return 'Purple';
                        case 2049: return 'Green';
                        case 2048: return 'Yellow';
                        case 2064: return 'Pit Lane';
                        default: return 'N/A';
                    }
                };

                const getComparison = (seg1, seg2) => {
                    if (seg1 === 2051 && seg2 !== 2051) return `${driver1LastName} Fastest`;
                    if (seg2 === 2051 && seg1 !== 2051) return `${driver2LastName} Fastest`;
                    if (seg1 === seg2) return 'Equal';
                    if (seg1 === 2049 && seg2 === 2048) return `${driver1LastName} Better`;
                    if (seg2 === 2049 && seg1 === 2048) return `${driver2LastName} Better`;
                    return 'N/A';
                };

                row.innerHTML = `
                    <td>MS${miniSectorCount}</td>
                    <td style="background-color: ${segmentColors[segment]}20">${getSegmentText(segment)}</td>
                    <td style="background-color: ${segmentColors[driver2Segment]}20">${getSegmentText(driver2Segment)}</td>
                    <td>${getComparison(segment, driver2Segment)}</td>
                `;
                tbody.appendChild(row);
                miniSectorCount++;
            });
        }
    });
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
