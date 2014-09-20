## The Cartesius Suite

The Cartesius Suite is an Open Source suite of applications which includes:

* Cartesius COP - The Cartesius [Common Operating Picture](en.wikipedia.org/wiki/Common_operational_picture
) - a web application which enables the coordination and monitoring of people and assets in various operating environments
* An Odata2 server platform based on Steve Lay's [Pyslet](https://github.com/swl10/pyslet)
* A REST server platform based on Armin Ronacher's [Flask](https://github.com/mitsuhiko/flask/)
* The Cartesius Suite application which provides a [Tornado](https://github.com/tornadoweb/tornado) webserver to run all of the above

Although the suite is designed for serving instances of the Cartesius COP web application, it can be configured to run any [WSGI](http://wsgi.readthedocs.org/) compliant server.

### Dependencies

Cartesius requires the following Python libraries:

* [Tornado](https://github.com/tornadoweb/tornado)
* [Pyslet](https://github.com/swl10/pyslet)
* [Flask](https://github.com/mitsuhiko/flask/)

The Odata2 backend usese the DB2 api and currently supports the following DBMS:

* [SQLite](http://www.sqlite.org/)
* [PostgreSQL](http://www.postgresql.org/) - requires the [psycopg2](http://initd.org/psycopg/) Python module

### Cartesius COP
The Cartesius COP is a web platform which uses the following technologies:

* [OpenUI5](http://sap.github.io/openui5/) from SAP for web and mobile UX
* [Leaflet](http://leafletjs.com/) for displaying and manipulating maps

Although you can use any map as the background layer, Cartesius is set to use [OpenStreetMap](http://openstreetmap.org) by default.

Cartesius is free to use and abuse and is licensed under xxx
