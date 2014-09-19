from flask import Flask, render_template 
import config
import os

# create our application
app = Flask(__name__, template_folder = 'public_html', static_folder = 'public_html')
app.config.from_object(config)

@app.route('/')
def show_root():
	return render_template('index.html')

@app.route('/<path:filename>')
def send_css(filename):
	return app.send_static_file(filename)
