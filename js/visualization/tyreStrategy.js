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