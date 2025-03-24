from urllib.request import urlopen
import json
import pandas as pd

# Function to get lap data for a specific driver and lap
def get_lap_data(session_key, driver_number, lap_number):
    url = f'https://api.openf1.org/v1/laps?session_key={session_key}&driver_number={driver_number}&lap_number={lap_number}'
    response = urlopen(url)
    data = json.loads(response.read().decode('utf-8'))
    return data[0] if data else None

# Color mapping for minisectors
color_mapping = {
    0: "not available",
    2048: "yellow sector",
    2049: "green sector",
    2050: "unknown",
    2051: "purple sector",
    2052: "unknown",
    2064: "pitlane",
    2068: "unknown"
}

# Get session key for 2025 Chinese GP race
sessions_url = 'https://api.openf1.org/v1/sessions?year=2025&country_name=China&session_name=Race'
response = urlopen(sessions_url)
sessions_data = json.loads(response.read().decode('utf-8'))
race_session_key = sessions_data[0]['session_key']

# Driver numbers
verstappen_number = 1
piastri_number = 81

# Get lap 10 data for both drivers
verstappen_lap = get_lap_data(race_session_key, verstappen_number, 10)
piastri_lap = get_lap_data(race_session_key, piastri_number, 10)

# Create a DataFrame to compare sector 1 minisectors
comparison_data = []

if verstappen_lap and piastri_lap:
    for i, (ver_segment, pia_segment) in enumerate(zip(verstappen_lap['segments_sector_1'], piastri_lap['segments_sector_1']), 1):
        comparison_data.append({
            'Minisector': i,
            'Verstappen': color_mapping.get(ver_segment, "unknown"),
            'Piastri': color_mapping.get(pia_segment, "unknown")
        })

    df = pd.DataFrame(comparison_data)
    print("\nSector 1 Minisector Comparison - Lap 10")
    print("========================================")
    print(df.to_string(index=False))
    
    # Print sector 1 times
    print("\nSector 1 Times:")
    print(f"Verstappen: {verstappen_lap['duration_sector_1']:.3f}s")
    print(f"Piastri: {piastri_lap['duration_sector_1']:.3f}s")
    print(f"Delta: {(verstappen_lap['duration_sector_1'] - piastri_lap['duration_sector_1']):.3f}s")
else:
    print("Error: Could not retrieve lap data for one or both drivers")
