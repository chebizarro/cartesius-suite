import logging

# import the Flask Config class
from flask.config import Config
from werkzeug.datastructures import ImmutableDict

# import the config file
import config

# import the Server container
from lib.servers import CartesiusServer
from tornado.ioloop import IOLoop


class CartesiusSuite :
	#: Default configuration parameters.
	default_config = ImmutableDict({
		'DEBUG':                                False,
		'SERVER_NAME':                          None,
		'APPLICATION_ROOT':                     None
	})

	def __init__(self, configuration = None) :
		self.make_config(configuration)
		self.make_servers()

	def make_config(self, configuration):
		self.config = Config(None, self.default_config)
		
		if (configuration) :
			self.config.from_object(configuration)

	def make_servers(self) :
		self.servers = {}
		for server in self.config['SERVERS'] :
			server_path = self.config['SERVER_PATH'] + "." + server['path'] + "."
			if( 'app_name' in server ) :
				server_path += server['app_name']
			else :
				server_path += 'app'
			self.servers[server['name']] = CartesiusServer(server_path)

	def start(self, server) :
		self.servers[server].start()

	def start_all(self) :
		for server in self.servers :
			self.servers[server].start()

	def stop(self, server) :
		self.servers[server].stop()

	def stop_all(self) :
		for server in self.servers :
			server.stop()
	
		
def main():
	logging.info("Starting Cartesius App Suite")
	app = CartesiusSuite(config)
	app.start_all()
	IOLoop.instance().start()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()
