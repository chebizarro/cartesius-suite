DEBUG = False
SERVER_NAME = 'GDELT'
SERVER_ROOT = 'servers'
READ_ONLY = True
SERVICE_ROOT = 'http://localhost'
SERVICE_PORT = '5050'
CORS = 	True
METADATA = 'GDELT.xml'
DATASOURCES = {
	"GDELTSchema.GDELT" : {
		"name" : "gdelt" ,
		"dbapi" : "psycopg2",
		"config" : {
			"database" : "postgres",
			"user" : "postgres",
			"password" : "postgres",
			"host"	: "127.0.0.1"
			}
		}
	}
