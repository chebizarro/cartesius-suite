import logging

import importlib

import threading

# import the Flask Config class
from flask.config import Config
from werkzeug.datastructures import ImmutableDict

# odata
import pyslet.odata2.metadata as edmx
from pyslet.odata2.server import ReadOnlyServer, Server

# custom pgsql driver (may cause conflicts if pgsql package installed
from pgsql import PgSQLEntityContainer

# tornado web server
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado import web

class CartesiusServer(object) :
	# Base class for all other server types
	def __init__(self, path) :
		self.load_app(path)
		
	def load_app(self, path) :
		self.server = importlib.import_module(path, package="app")
		
	def stop(self) :
		pass
	
	def reload(self, config) :
		pass

	def start(self) :
		service_url = self.server.app.config['SERVICE_ROOT'] + ':' + self.server.app.config['SERVICE_PORT']
		self.thread = threading.Thread(
			target=self.run_server, kwargs={'App': self.server.app})
		self.thread.setDaemon(True)
		self.thread.start()
		logging.info("Starting HTTP server on %s" % service_url)
		self.thread.join()

	def run_server(self, App=None):
		"""Starts the web server running"""
		http_server = HTTPServer(WSGIContainer(App))
		http_server.listen(self.server.app.config['SERVICE_PORT'])
		logging.info("HTTP server %s on port %s running" % (self.server.app.config['SERVER_NAME'] , self.server.app.config['SERVICE_PORT']))
			
	
class OdataServer(object) :
	#: Default configuration parameters.
	default_config = ImmutableDict({
		'DEBUG':                                False,
		'SERVER_NAME':                          'ODATA SERVER',
		'APPLICATION_ROOT':                     None,
		'READ_ONLY' :							True,
		'SERVICE_ROOT' :						'http://localhost',
		'SERVICE_PORT' :						'8080',
		'CORS' :								True,
		'METADATA' :							'metadata.xml'
	})
	
	functions = None
	
	def __init__(self, import_name, configuration = None):
		self.make_config(configuration)
		conf = self.config
		service_url = self.config['SERVICE_ROOT'] + ':' + self.config['SERVICE_PORT']

		#super( OdataServer, self ).__init__(service_url)

		if self.config['READ_ONLY'] :
			self.server = ReadOnlyServer(service_url)
		else:
			self.server = Server(serviceRoot=service_url)
		
		self.load_metadata()
		self.make_containers()
		#self.server.SetModel(self.metadata)

		#return self.server
	
	def __call__(self, environ, start_response):
		if self.config['CORS'] :
			return CORS(self.server).__call__(environ, start_response)
		else :
			return self.server.__call__(environ, start_response)

	def make_config(self, configuration):
		self.config = Config(None, self.default_config)
		
		if (configuration) :
			self.config.from_object(configuration)

	def load_metadata(self) :
		"""Loads the metadata file from the current directory."""
		doc = edmx.Document()
		with open(self.config['SERVER_ROOT'] + '/' + self.config['SERVER_NAME'] + '/' + self.config['METADATA'], 'rb') as f:
			doc.Read(f)
		if doc :
			self.metadata = doc
			self.server.SetModel(doc)

		else:
			pass
			#raise error

	def add_function_import(self, rule, endpoint=None, view_func=None, **options):
		# This seems terribly hacky but I can't think of another way...
		funcImport = self.server.model.DataServices[rule]
		if funcImport :
			funcImport.bind(view_func, **options)

		
	def function_import(self, rule, **options):
		def decorator(f):
			endpoint = options.pop('endpoint', None)
			self.add_function_import(rule, endpoint, f, **options)
			return f
		return decorator

	def make_containers(self) :
		for schema in self.metadata.root.DataServices.Schema :
			self.make_container(schema)
	
	def make_container(self, schema) :
		for entity_container in schema.EntityContainer :
			entity_name = schema.Name + '.' + entity_container.Name
			if (self.config["DATASOURCES"][entity_name]) :
				ctype = self.config["DATASOURCES"][entity_name]['dbapi']
		
				if (ctype == 'psycopg2') :
					container = PgSQLEntityContainer(
						pgsql_options = self.config["DATASOURCES"][entity_name]['config'],
							container=self.metadata.root.DataServices[entity_name]
					)
	

class CORS:
	
	def __init__(self, application):
		self.application = application
	
	def __call__(self, environ, start_response): 
		CORS_ORIGIN = '*'
		CORS_HEADERS = 'accept, accept-language, maxdataserviceversion'
		CORS_METHODS = {'GET', 'HEAD', 'OPTIONs'}
		CORS_CREDENTIALS = True
		CORS_MAX_AGE = None
		CORS_PREFLIGHT = False

		if ('HTTP_ORIGIN' in environ) :
			# It's a CORS request
			if (environ['REQUEST_METHOD'] == 'OPTIONS') and ('HTTP_ACCESS_CONTROL_REQUEST_METHOD' in environ):
				if (environ['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] in CORS_METHODS) and ('HTTP_ACCESS_CONTROL_REQUEST_HEADERS' in environ) :
					# It's a preflight request
					CORS_HEADERS = environ['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']
					CORS_METHODS = environ['HTTP_ACCESS_CONTROL_REQUEST_METHOD']
					CORS_PREFLIGHT = True
			

		def set_headers(status, response_headers, exc_info=None) :
			
			if CORS_PREFLIGHT :
				response_headers.append( ('Access-Control-Allow-Methods', CORS_METHODS) )
				response_headers.append( ('Access-Control-Allow-Headers', CORS_HEADERS) )
				status = '204 No Content'
				if CORS_MAX_AGE:
					response_headers.append( ('Access-Control-Max-Age', CORS_MAX_AGE) )
			else :
				response_headers.append( ('Access-Control-Expose-Headers', CORS_HEADERS) )

			response_headers.append( ('Access-Control-Allow-Origin', CORS_ORIGIN) )

			if CORS_CREDENTIALS != None:
				response_headers.append( ('Access-Control-Allow-Credential', "true" if CORS_CREDENTIALS else "false") )

			write = start_response(status, response_headers, exc_info)

			if CORS_PREFLIGHT :
				def write_preflight(data) :
					write(None)
				return write_preflight
			else :
				return write
		
		return self.application(environ, set_headers)
		
