Title: Introduction – OpenF1 API | Real-time and historical Formula 1 data

URL Source: https://openf1.org/

OpenF1 is a free and open-source API that provides real-time and historical Formula 1 data.

The API offers a wealth of information, including lap timings, car telemetry, radio communications, and more. Whether you're looking to create interactive dashboards, dive deep into race analysis, or even develop connected objects that light up every time your favorite driver takes the lead, OpenF1 makes it all possible.

Data can be accessed in either JSON or CSV formats, making it user-friendly for both developers and non-developers alike. For a quick start, you can access the API through your web browser. A sample URL is provided for each method for easy reference.

There are 13 API methods, they are: Car data , Drivers, Intervals, Laps, Location, Meetings, Pit, Position, Race control, Sessions, Stints, Team radio, Weather

Here are some details and code examples for each of those 13 methods.


Car data
--------

Some data about each car, at a sample rate of about 3.7 Hz.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "brake": 0,
    "date": "2023-09-15T13:08:19.923000+00:00",
    "driver_number": 55,
    "drs": 12,
    "meeting_key": 1219,
    "n_gear": 8,
    "rpm": 11141,
    "session_key": 9159,
    "speed": 315,
    "throttle": 99
  },
  {
    "brake": 100,
    "date": "2023-09-15T13:35:41.808000+00:00",
    "driver_number": 55,
    "drs": 8,
    "meeting_key": 1219,
    "n_gear": 8,
    "rpm": 11023,
    "session_key": 9159,
    "speed": 315,
    "throttle": 57
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/car_data`

### Sample URL

[https://api.openf1.org/v1/car\_data?driver\_number=55&session\_key=9159&speed\>\=315](https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed%3E=315)

### Attributes

| Name | Description |
| --- | --- |
| brake | Whether the brake pedal is pressed (`100`) or not (`0`). |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| drs | The Drag Reduction System (DRS) status (see mapping table below). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| n\_gear | Current gear selection, ranging from 1 to 8. `0` indicates neutral or no gear engaged. |
| rpm | Revolutions per minute of the engine. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| speed | Velocity of the car in km/h. |
| throttle | Percentage of maximum engine power being used. |

Below is a table that correlates DRS values to its supposed interpretation (from [FastF1](https://github.com/theOehrly/Fast-F1/blob/317bacf8c61038d7e8d0f48165330167702b349f/fastf1/_api.py#L863)).

| DRS value | Interpretation |
| --- | --- |
| 0 | DRS off |
| 1 | DRS off |
| 2 | ? |
| 3 | ? |
| 8 | Detected, eligible once in activation zone |
| 9 | ? |
| 10 | DRS on |
| 12 | DRS on |
| 14 | DRS on |

Drivers
-------

Provides information about drivers for each session.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "broadcast_name": "M VERSTAPPEN",
    "country_code": "NED",
    "driver_number": 1,
    "first_name": "Max",
    "full_name": "Max VERSTAPPEN",
    "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
    "last_name": "Verstappen",
    "meeting_key": 1219,
    "name_acronym": "VER",
    "session_key": 9158,
    "team_colour": "3671C6",
    "team_name": "Red Bull Racing"
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/drivers`

### Sample URL

[https://api.openf1.org/v1/drivers?driver\_number=1&session\_key=9158](https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158)

### Attributes

| Name | Description |
| --- | --- |
| broadcast\_name | The driver's name, as displayed on TV. |
| country\_code | A code that uniquely identifies the country. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| first\_name | The driver's first name. |
| full\_name | The driver's full name. |
| headshot\_url | URL of the driver's face photo. |
| last\_name | The driver's last name. |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| name\_acronym | Three-letter acronym of the driver's name. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| team\_colour | The hexadecimal color value (RRGGBB) of the driver's team. |
| team\_name | Name of the driver's team. |

Intervals
---------

Fetches real-time interval data between drivers and their gap to the race leader.  
Available during races only, with updates approximately every 4 seconds.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/intervals?session_key=9165&interval<0.005')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "date": "2023-09-17T13:31:02.395000+00:00",
    "driver_number": 1,
    "gap_to_leader": 41.019,
    "interval": 0.003,
    "meeting_key": 1219,
    "session_key": 9165
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/intervals`

### Sample URL

[https://api.openf1.org/v1/intervals?session\_key=9165&interval<0.005](https://api.openf1.org/v1/intervals?session_key=9165&interval%3C0.005)

### Attributes

| Name | Description |
| --- | --- |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| gap\_to\_leader | The time gap to the race leader in seconds, `+1 LAP` if lapped, or `null` for the race leader. |
| interval | The time gap to the car ahead in seconds, `+1 LAP` if lapped, or `null` for the race leader. |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |

Laps
----

Provides detailed information about individual laps.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "date_start": "2023-09-16T13:59:07.606000+00:00",
    "driver_number": 63,
    "duration_sector_1": 26.966,
    "duration_sector_2": 38.657,
    "duration_sector_3": 26.12,
    "i1_speed": 307,
    "i2_speed": 277,
    "is_pit_out_lap": false,
    "lap_duration": 91.743,
    "lap_number": 8,
    "meeting_key": 1219,
    "segments_sector_1": [
      2049,
      2049,
      2049,
      2051,
      2049,
      2051,
      2049,
      2049
    ],
    "segments_sector_2": [
      2049,
      2049,
      2049,
      2049,
      2049,
      2049,
      2049,
      2049
    ],
    "segments_sector_3": [
      2048,
      2048,
      2048,
      2048,
      2048,
      2064,
      2064,
      2064
    ],
    "session_key": 9161,
    "st_speed": 298
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/laps`

### Sample URL

[https://api.openf1.org/v1/laps?session\_key=9161&driver\_number=63&lap\_number=8](https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8)

### Attributes

| Name | Description |
| --- | --- |
| date\_start | The UTC starting date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| duration\_sector\_1 | The time taken, in seconds, to complete the first sector of the lap. |
| duration\_sector\_2 | The time taken, in seconds, to complete the second sector of the lap. |
| duration\_sector\_3 | The time taken, in seconds, to complete the third sector of the lap. |
| i1\_speed | The speed of the car, in km/h, at the first intermediate point on the track. |
| i2\_speed | The speed of the car, in km/h, at the second intermediate point on the track. |
| is\_pit\_out\_lap | A boolean value indicating whether the lap is an "out lap" from the pit (`true` if it is, `false` otherwise). |
| lap\_duration | The total time taken, in seconds, to complete the entire lap. |
| lap\_number | The sequential number of the lap within the session (starts at 1). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| segments\_sector\_1 | A list of values representing the "mini-sectors" within the first sector (see mapping table below). |
| segments\_sector\_2 | A list of values representing the "mini-sectors" within the second sector (see mapping table below). |
| segments\_sector\_3 | A list of values representing the "mini-sectors" within the third sector (see mapping table below). |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| st\_speed | The speed of the car, in km/h, at the speed trap, which is a specific point on the track where the highest speeds are usually recorded. |

Below is a table that correlates segment values to their meaning.

| Value | Color |
| --- | --- |
| 0 | not available |
| 2048 | yellow sector |
| 2049 | green sector |
| 2050 | ? |
| 2051 | purple sector |
| 2052 | ? |
| 2064 | pitlane |
| 2068 | ? |

Segments are not available during races. Also, The segment values may not always align perfectly with the colors shown on TV, for unknown reasons.

Location
--------

The approximate location of the cars on the circuit, at a sample rate of about 3.7 Hz.  
Useful for gauging their progress along the track, but lacks details about lateral placement — i.e. whether the car is on the left or right side of the track. The origin point (0, 0, 0) appears to be arbitrary and not tied to any specific location on the track.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/location?session_key=9161&driver_number=81&date>2023-09-16T13:03:35.200&date<2023-09-16T13:03:35.800')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "date": "2023-09-16T13:03:35.292000+00:00",
    "driver_number": 81,
    "meeting_key": 1219,
    "session_key": 9161,
    "x": 567,
    "y": 3195,
    "z": 187
  },
  {
    "date": "2023-09-16T13:03:35.752000+00:00",
    "driver_number": 81,
    "meeting_key": 1219,
    "session_key": 9161,
    "x": 489,
    "y": 3403,
    "z": 186
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/location`

### Sample URL

[https://api.openf1.org/v1/location?session\_key=9161&driver\_number=81&date\>2023-09-16T13:03:35.200&date<2023-09-16T13:03:35.800](https://api.openf1.org/v1/location?session_key=9161&driver_number=81&date%3E2023-09-16T13:03:35.200&date%3C2023-09-16T13:03:35.800)

### Attributes

| Name | Description |
| --- | --- |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| x | The 'x' value in a 3D Cartesian coordinate system representing the current approximate location of the car on the track. |
| y | The 'y' value in a 3D Cartesian coordinate system representing the current approximate location of the car on the track. |
| z | The 'z' value in a 3D Cartesian coordinate system representing the current approximate location of the car on the track. |

Meetings
--------

Provides information about meetings.  
A meeting refers to a Grand Prix or testing weekend and usually includes multiple sessions (practice, qualifying, race, ...).

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/meetings?year=2023&country_name=Singapore')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "circuit_key": 61,
    "circuit_short_name": "Singapore",
    "country_code": "SGP",
    "country_key": 157,
    "country_name": "Singapore",
    "date_start": "2023-09-15T09:30:00+00:00",
    "gmt_offset": "08:00:00",
    "location": "Marina Bay",
    "meeting_key": 1219,
    "meeting_name": "Singapore Grand Prix",
    "meeting_official_name": "FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2023",
    "year": 2023
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/meetings`

### Sample URL

[https://api.openf1.org/v1/meetings?year=2023&country\_name=Singapore](https://api.openf1.org/v1/meetings?year=2023&country_name=Singapore)

### Attributes

| Name | Description |
| --- | --- |
| circuit\_key | The unique identifier for the circuit where the event takes place. |
| circuit\_short\_name | The short or common name of the circuit where the event takes place. |
| country\_code | A code that uniquely identifies the country. |
| country\_key | The unique identifier for the country where the event takes place. |
| country\_name | The full name of the country where the event takes place. |
| date\_start | The UTC starting date and time, in ISO 8601 format. |
| gmt\_offset | The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT). |
| location | The city or geographical location where the event takes place. |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| meeting\_name | The name of the meeting. |
| meeting\_official\_name | The official name of the meeting. |
| year | The year the event takes place. |

Pit
---

Provides information about cars going through the pit lane.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/pit?session_key=9158&pit_duration<31')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "date": "2023-09-15T09:38:23.038000+00:00",
    "driver_number": 63,
    "lap_number": 5,
    "meeting_key": 1219,
    "pit_duration": 24.5,
    "session_key": 9158
  },
  {
    "date": "2023-09-15T10:05:01.229000+00:00",
    "driver_number": 81,
    "lap_number": 13,
    "meeting_key": 1219,
    "pit_duration": 30.8,
    "session_key": 9158
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/pit`

### Sample URL

[https://api.openf1.org/v1/pit?session\_key=9158&pit\_duration<31](https://api.openf1.org/v1/pit?session_key=9158&pit_duration%3C31)

### Attributes

| Name | Description |
| --- | --- |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| lap\_number | The sequential number of the lap within the session (starts at 1). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| pit\_duration | The time spent in the pit, from entering to leaving the pit lane, in seconds. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |

Position
--------

Provides driver positions throughout a session, including initial placement and subsequent changes.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/position?meeting_key=1217&driver_number=40&position<=3')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "date": "2023-08-26T09:30:47.199000+00:00",
    "driver_number": 40,
    "meeting_key": 1217,
    "position": 2,
    "session_key": 9144
  },
  {
    "date": "2023-08-26T09:35:51.477000+00:00",
    "driver_number": 40,
    "meeting_key": 1217,
    "position": 3,
    "session_key": 9144
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/position`

### Sample URL

[https://api.openf1.org/v1/position?meeting\_key=1217&driver\_number=40&position<\=3](https://api.openf1.org/v1/position?meeting_key=1217&driver_number=40&position%3C=3)

### Attributes

| Name | Description |
| --- | --- |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| position | Position of the driver (starts at 1). |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |

Race control
------------

Provides information about race control (racing incidents, flags, safety car, ...).

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/race_control?flag=BLACK AND WHITE&driver_number=1&date>=2023-01-01&date<2023-09-01')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "category": "Flag",
    "date": "2023-06-04T14:21:01+00:00",
    "driver_number": 1,
    "flag": "BLACK AND WHITE",
    "lap_number": 59,
    "meeting_key": 1211,
    "message": "BLACK AND WHITE FLAG FOR CAR 1 (VER) - TRACK LIMITS",
    "scope": "Driver",
    "sector": null,
    "session_key": 9102
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/race_control`

### Sample URL

[https://api.openf1.org/v1/race\_control?flag=BLACK AND WHITE&driver\_number=1&date\>\=2023-01-01&date<2023-09-01](https://api.openf1.org/v1/race_control?flag=BLACK%20AND%20WHITE&driver_number=1&date%3E=2023-01-01&date%3C2023-09-01)

### Attributes

| Name | Description |
| --- | --- |
| category | The category of the event (`CarEvent`, `Drs`, `Flag`, `SafetyCar`, ...). |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| flag | Type of flag displayed (`GREEN`, `YELLOW`, `DOUBLE YELLOW`, `CHEQUERED`, ...). |
| lap\_number | The sequential number of the lap within the session (starts at 1). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| message | Description of the event or action. |
| scope | The scope of the event (`Track`, `Driver`, `Sector`, ...). |
| sector | Segment ("mini-sector") of the track where the event occurred? (starts at 1). |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |

Sessions
--------

Provides information about sessions.  
A session refers to a distinct period of track activity during a Grand Prix or testing weekend (practice, qualifying, sprint, race, ...).

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/sessions?country_name=Belgium&session_name=Sprint&year=2023')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "circuit_key": 7,
    "circuit_short_name": "Spa-Francorchamps",
    "country_code": "BEL",
    "country_key": 16,
    "country_name": "Belgium",
    "date_end": "2023-07-29T15:35:00+00:00",
    "date_start": "2023-07-29T15:05:00+00:00",
    "gmt_offset": "02:00:00",
    "location": "Spa-Francorchamps",
    "meeting_key": 1216,
    "session_key": 9140,
    "session_name": "Sprint",
    "session_type": "Race",
    "year": 2023
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/sessions`

### Sample URL

[https://api.openf1.org/v1/sessions?country\_name=Belgium&session\_name=Sprint&year=2023](https://api.openf1.org/v1/sessions?country_name=Belgium&session_name=Sprint&year=2023)

### Attributes

| Name | Description |
| --- | --- |
| circuit\_key | The unique identifier for the circuit where the event takes place. |
| circuit\_short\_name | The short or common name of the circuit where the event takes place. |
| country\_code | A code that uniquely identifies the country. |
| country\_key | The unique identifier for the country where the event takes place. |
| country\_name | The full name of the country where the event takes place. |
| date\_end | The UTC ending date and time, in ISO 8601 format. |
| date\_start | The UTC starting date and time, in ISO 8601 format. |
| gmt\_offset | The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT). |
| location | The city or geographical location where the event takes place. |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| session\_name | The name of the session (`Practice 1`, `Qualifying`, `Race`, ...). |
| session\_type | The type of the session (`Practice`, `Qualifying`, `Race`, ...). |
| year | The year the event takes place. |

Stints
------

Provides information about individual stints.  
A stint refers to a period of continuous driving by a driver during a session.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/stints?session_key=9165&tyre_age_at_start>=3')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "compound": "SOFT",
    "driver_number": 16,
    "lap_end": 20,
    "lap_start": 1,
    "meeting_key": 1219,
    "session_key": 9165,
    "stint_number": 1,
    "tyre_age_at_start": 3
  },
  {
    "compound": "SOFT",
    "driver_number": 20,
    "lap_end": 62,
    "lap_start": 44,
    "meeting_key": 1219,
    "session_key": 9165,
    "stint_number": 3,
    "tyre_age_at_start": 3
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/stints`

### Sample URL

[https://api.openf1.org/v1/stints?session\_key=9165&tyre\_age\_at\_start\>\=3](https://api.openf1.org/v1/stints?session_key=9165&tyre_age_at_start%3E=3)

### Attributes

| Name | Description |
| --- | --- |
| compound | The specific compound of tyre used during the stint (`SOFT`, `MEDIUM`, `HARD`, ...). |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| lap\_end | Number of the last completed lap in this stint. |
| lap\_start | Number of the initial lap in this stint (starts at 1). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| stint\_number | The sequential number of the stint within the session (starts at 1). |
| tyre\_age\_at\_start | The age of the tyres at the start of the stint, in laps completed. |

Team radio
----------

Provides a collection of radio exchanges between Formula 1 drivers and their respective teams during sessions.  
Please note that only a limited selection of communications are included, not the complete record of radio interactions.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/team_radio?session_key=9158&driver_number=11')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "date": "2023-09-15T09:40:43.005000",
    "driver_number": 11,
    "meeting_key": 1219,
    "recording_url": "https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-15_Practice_1/TeamRadio/SERPER01_11_20230915_104008.mp3",
    "session_key": 9158
  },
  {
    "date": "2023-09-15T10:32:47.325000",
    "driver_number": 11,
    "meeting_key": 1219,
    "recording_url": "https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-15_Practice_1/TeamRadio/SERPER01_11_20230915_113201.mp3",
    "session_key": 9158
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/team_radio`

### Sample URL

[https://api.openf1.org/v1/team\_radio?session\_key=9158&driver\_number=11](https://api.openf1.org/v1/team_radio?session_key=9158&driver_number=11)

### Attributes

| Name | Description |
| --- | --- |
| date | The UTC date and time, in ISO 8601 format. |
| driver\_number | The unique number assigned to an F1 driver (cf. [Wikipedia](https://en.wikipedia.org/wiki/List_of_Formula_One_driver_numbers#Formula_One_driver_numbers)). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| recording\_url | URL of the radio recording. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |

Weather
-------

The weather over the track, updated every minute.

```
from urllib.request import urlopen
import json

response = urlopen('https://api.openf1.org/v1/weather?meeting_key=1208&wind_direction>=130&track_temperature>=52')
data = json.loads(response.read().decode('utf-8'))
print(data)

# If you want, you can import the results in a DataFrame (you need to install the `pandas` package first)
# import pandas as pd
# df = pd.DataFrame(data)
```

> Output:

```
[
  {
    "air_temperature": 27.8,
    "date": "2023-05-07T18:42:25.233000+00:00",
    "humidity": 58,
    "meeting_key": 1208,
    "pressure": 1018.7,
    "rainfall": 0,
    "session_key": 9078,
    "track_temperature": 52.5,
    "wind_direction": 136,
    "wind_speed": 2.4
  }
]
```

### HTTP Request

`GET https://api.openf1.org/v1/weather`

### Sample URL

[https://api.openf1.org/v1/weather?meeting\_key=1208&wind\_direction\>\=130&track\_temperature\>\=52](https://api.openf1.org/v1/weather?meeting_key=1208&wind_direction%3E=130&track_temperature%3E=52)

### Attributes

| Name | Description |
| --- | --- |
| air\_temperature | Air temperature (°C). |
| date | The UTC date and time, in ISO 8601 format. |
| humidity | Relative humidity (%). |
| meeting\_key | The unique identifier for the meeting. Use `latest` to identify the latest or current meeting. |
| pressure | Air pressure (mbar). |
| rainfall | Whether there is rainfall. |
| session\_key | The unique identifier for the session. Use `latest` to identify the latest or current session. |
| track\_temperature | Track temperature (°C). |
| wind\_direction | Wind direction (°), from 0° to 359°. |
| wind\_speed | Wind speed (m/s). |

Data filtering
--------------

Refine your query by including parameters directly in the URL.  
Results can be filtered by any attribute, except arrays.

**Example**  
To fetch pit-out laps for driver number 55 (Carlos Sainz) that last at least 2 minutes, use: [https://api.openf1.org/v1/laps?session\_key=9222&driver\_number=55&is\_pit\_out\_lap=true&lap\_duration\>\=120](https://api.openf1.org/v1/laps?session_key=9222&driver_number=55&is_pit_out_lap=true&lap_duration%3E%3D120)

Time-Based Filtering
--------------------

You can narrow down your results using time ranges.

**Example**  
To get all sessions in September 2023, use: [https://api.openf1.org/v1/sessions?date\_start\>\=2023-09-01&date\_end<\=2023-09-30](https://api.openf1.org/v1/sessions?date_start%3E%3D2023-09-01&date_end%3C%3D2023-09-30)

The API supports a wide range of date formats (those compatible with Python's `dateutil.parser.parse` method). Examples include:

*   "2021-09-10"
*   "2021-09-10T14:30:20"
*   "2021-09-10T14:30:20+00:00"
*   "09/10/2021"
*   "09-10-2021"
*   "Fri Sep 10 14:30:20 2021"
*   "10 September 2021"
*   "Sep 10, 2021"
*   "2021-09-10 14:30:20 UTC"
*   "2021-09-10 14:30:20+00:00"
*   "2021-09-10 14:30:20 EST"
*   ...and many more.

CSV Format
----------

To receive your query results in CSV format instead of the default JSON, simply append the query parameter `csv=true` to your URL. This feature is particularly handy to import the data into spreadsheet software like Microsoft Excel.

**Example**  
To get all sessions for the year 2023 in CSV format, use the following URL: [https://api.openf1.org/v1/sessions?year=2023&csv=true](https://api.openf1.org/v1/sessions?year=2023&csv=true)

FAQ
---

### Can I access past data during an ongoing session?

Yes, real-time storage allows for instant access to past and current session data.

### What's the delay between live events and API updates?

The API typically updates about 3 seconds after a live event. However, this time could be extended due to factors like serverless cold starts, which occur when the service is scaling up.  
As a point of reference, F1 TV typically has a 6-second delay.

### Is there a query timeout?

Queries are limited to a 1-minute timeout. If your request takes too long, consider breaking it down into smaller queries and then combining the results.

Community and Support
---------------------

For community-driven questions or feedback, we encourage you to participate in our [Github Discussions](https://github.com/br-g/openf1/discussions). If you encounter any bugs or issues, please report them by creating a new issue on [our Github repository](https://github.com/br-g/openf1/issues).

For specialized inquiries, feel free to [reach out to me directly](https://form.typeform.com/to/lCYUbpPz?typeform-source=openf1.org). However, for general support questions, please use the [Github Discussions](https://github.com/br-g/openf1/discussions) platform to ensure that the entire community can benefit from the answers.

Roadmap
-------

*   Race and championship standings, schedules, and starting grids
*   Add data from previous seasons (2018-2022)
*   AI radio transcriptions
*   More precise pit-stop duration
*   Overtakes, undercuts/overcuts data, tyre statistics...

We welcome your ideas and suggestions for OpenF1's future. Please share them on our [Github Discussions page](https://github.com/br-g/openf1/discussions).

Contributing
------------

OpenF1's mission is to democratize Formula 1 data by making it open and accessible to everyone.  
We welcome all contributions that help advance this goal!

To get started, please review our [contribution guidelines](https://github.com/br-g/openf1/blob/main/CONTRIBUTING.md).

### Contributors

*   [br-g](https://github.com/br-g)
*   [PrestonHager](https://github.com/PrestonHager)
*   [Nik-code](https://github.com/Nik-code)

Usage Guidelines
----------------

The OpenF1 API is an open-source service designed to be easily accessible, requiring no authentication and imposing no rate limits. We kindly ask that you use the service responsibly to conserve computational resources. If you find the API useful, please consider [donating](https://www.buymeacoffee.com/openf1) to support the long-term sustainability of the project.

The creators of OpenF1 disclaim any liability for losses or damages incurred through the use of this API. We cannot guarantee the API's continuous availability or the accuracy of its data.

Acknowledgments
---------------

Special thanks to [Philipp Schaefer (theOehrly)](https://github.com/theOehrly) for his contributions to the [FastF1](https://github.com/theOehrly/Fast-F1) Python package, which has greatly inspired OpenF1. The SignalR data recorder used in OpenF1 is also sourced from the [FastF1](https://github.com/theOehrly/Fast-F1) package.
