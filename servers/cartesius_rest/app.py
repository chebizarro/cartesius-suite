from flask import Flask, render_template, send_from_directory
import config
import os

# create our application
app = Flask(__name__, template_folder = 'static', static_folder = 'static')
app.config.from_object(config)

@app.route('/')
def show_root():
	return render_template('index.html')

@app.route('/modules/<path:filename>')
def get_modules(filename):
	return send_from_directory('/var/www/cartesius/servers/cartesius_rest/modules/', filename)

@app.route('/<path:filename>')
def send_css(filename):
	return app.send_static_file(filename)
