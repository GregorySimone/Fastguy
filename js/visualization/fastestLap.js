// Visualize fastest lap comparison
export async function visualizeFastestLap() {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Get selected values
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;
    const segment = document.getElementById('qualifyingSegment').value;
    const sessionType = document.getElementById('session').options[document.getElementById('session').selectedIndex]?.text.toLowerCase() || '';

    // Fetch stint data for qualifying segments if needed
    let driver1Stints = [], driver2Stints = [];
    if (sessionType.includes('qualifying') && segment) {
        const stintsUrl = `https://api.openf1.org/v1/stints?session_key=${sessionKey}`;
        [driver1Stints, driver2Stints] = await Promise.all([
            fetch(`${stintsUrl}&driver_number=${driver1}`).then(res => res.json()),
            fetch(`${stintsUrl}&driver_number=${driver2}`).then(res => res.json())
        ]);
        console.log('Driver 1 Stints:', driver1Stints);
        console.log('Driver 2 Stints:', driver2Stints);
    }

    // Fetch lap times for both drivers
    const lapsUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`;
    const [driver1Laps, driver2Laps] = await Promise.all([
        fetch(`${lapsUrl}&driver_number=${driver1}`).then(res => res.json()),
        fetch(`${lapsUrl}&driver_number=${driver2}`).then(res => res.json())
    ]);
    console.log('Driver 1 Laps:', driver1Laps);
    console.log('Driver 2 Laps:', driver2Laps);

    // Filter laps based on qualifying segment if it's a qualifying session
    let filteredDriver1Laps = driver1Laps;
    let filteredDriver2Laps = driver2Laps;

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