# Fastguy

A web application for analyzing and comparing Formula 1 driver performance using the OpenF1 API.

## Features

- Compare fastest laps between two drivers
- Analyze lap time progression
- Compare sector times
- View mini-sector performance
- Compare speed trap data
- Analyze tyre strategies

## Project Structure

```
├── js/
│   ├── visualization/
│   │   ├── fastestLap.js    # Fastest lap comparison visualization
│   │   └── tyreStrategy.js  # Tyre strategy visualization
│   └── main.js              # Main application logic
├── styles.css               # Application styles
└── index.html              # Main HTML file
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/GregorySimone/Fastguy.git
cd Fastguy
```

2. Serve the files using a local web server. For example, using Python:
```bash
python -m http.server 8000
```

3. Open your browser and navigate to `http://localhost:8000`

## Usage

1. Select a year, grand prix, and session
2. Choose two drivers to compare
3. Select the type of analysis you want to perform
4. View the results in either chart or table format

## Data Source

This application uses the [OpenF1 API](https://openf1.org/) to fetch Formula 1 data. The API provides:

- Session information
- Driver details
- Lap times
- Sector times
- Speed trap data
- Tyre strategy information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT