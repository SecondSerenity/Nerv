# NERV Project

The goal of this project is to build a cloud dashboard for tracking the status of sensors and inventory of my home. Use cases I want to cover:
- See the current temperature of different rooms.
- View historical sensor data in summarized graphs.
- Track a list of items and their current amounts with additional metadata.
- Support API clients for sensors and scripts to update data within the dashboard.

Data will be stored using a database, but for the start of the project no database server will be used to keep things simple. A sqlite file named 'app.db' should be created using the table structure from `sql/scaffold.sqlite`.