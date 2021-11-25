import os

from os.path import join, dirname, realpath

from flask import (Flask, flash, request, redirect, url_for)

from flask import current_app as app

def create_app(test_config=None):

    app = Flask(__name__, static_url_path='/static', instance_relative_config=True)

    app.config['UPLOAD_PATH'] = join(dirname(realpath(__file__)), 'static/uploads/')

    from . import application

    app.register_blueprint(application.bp)

    app.add_url_rule('/', endpoint='index')

    return app
