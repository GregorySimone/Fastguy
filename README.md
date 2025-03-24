# F1 Data Analysis Tool

A web-based tool for analyzing Formula 1 race data using the OpenF1 API. This tool provides various visualizations and comparisons of driver performance data.

## Features

### 1. Fastest Lap Analysis
- Compare fastest lap times between two drivers
- Sector-by-sector breakdown
- Visual bar chart comparison
- Detailed time deltas

### 2. Lap Times Analysis
- Full session lap time comparison
- Line chart showing lap time evolution
- Personal best laps highlighted
- Lap-by-lap delta times

### 3. Sectors Analysis
- Best and average sector times
- Theoretical best lap calculation
- Sector-by-sector comparison
- Performance trends analysis

### 4. Mini-sectors Analysis
- Detailed track segment comparison
- Color-coded performance indicators:
  * Purple: Fastest overall
  * Green: Personal best
  * Yellow: Standard
- Sector-by-sector breakdown

### 5. Speed Traps Analysis
- Speed comparison at three points:
  * First intermediate (I1)
  * Second intermediate (I2)
  * Speed trap (ST)
- Maximum and average speeds
- Speed differentials

### 6. Tyre Strategy Analysis
- Full race tyre compound visualization
- Stint length comparison
- Tyre age tracking
- Strategy differences

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies
```bash
npm install
```

3. Start the proxy server
```bash
node proxy.js
```

4. Open `index.html` in your browser or serve it using a local server

## Usage

1. Select a year from the dropdown
2. Choose a Grand Prix
3. Select a session (Practice, Qualifying, Race)
4. Choose two drivers to compare
5. Select an analysis type:
   - Fastest Lap
   - Lap Times
   - Sectors
   - Mini-sectors
   - Speed Traps
   - Tyre Strategy
6. Toggle between chart and table views for detailed information

## Data Visualization

### Chart Types
- Bar charts for comparing discrete values (sectors, speed traps)
- Line charts for temporal data (lap times)
- Custom visualizations for tyre strategy and mini-sectors

### Table Views
- Detailed numerical data
- Color-coded performance indicators
- Delta time calculations
- Comprehensive statistics

## API Integration

This tool uses the OpenF1 API to fetch real-time and historical Formula 1 data. The proxy server handles API requests to avoid CORS issues.

### Endpoints Used
- `/v1/meetings` - Race weekend information
- `/v1/sessions` - Session details
- `/v1/drivers` - Driver information
- `/v1/laps` - Lap timing data
- `/v1/stints` - Tyre strategy information

## Code Structure

- `index.html` - Main application interface
- `styles.css` - CSS styling
- `script.js` - Core application logic
- `proxy.js` - API proxy server

### Key Functions
- `visualizeFastestLap()` - Fastest lap comparison
- `visualizeLapTimes()` - Full session lap time analysis
- `visualizeSectors()` - Sector time comparison
- `visualizeMinisectors()` - Mini-sector analysis
- `visualizeSpeedTraps()` - Speed trap comparison
- `visualizeTyreStrategy()` - Tyre strategy visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenF1 API for providing the data
- Chart.js for visualization capabilities
- Bootstrap for UI components
