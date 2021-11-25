from flask import Flask, render_template, redirect, url_for, request, jsonify, Blueprint
import hashlib
import os
from werkzeug.utils import secure_filename
from flask import current_app as app
from flask import Flask, Response, request, render_template, redirect, url_for, Blueprint, jsonify
from flaskr.config import *

print("nft_address: ", nft_address)

bp = Blueprint('app', __name__)

@bp.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@bp.route('/mynfts', methods=['GET', 'POST'])
def mynfts():
    return render_template('mynfts.html')

@bp.route('/nft/<int:id>', methods=['GET', 'POST'])
def nft(id):
    print("id: ", id)

    return render_template('item.html', id=id)

@bp.route('/create', methods=['GET', 'POST'])
def create():
    return render_template('create.html')

@bp.route('/profile', methods=['GET', 'POST'])
def profile():
    return render_template('profile.html')

@bp.route('/like', methods=['GET', 'POST'])
def like():
    print("like")
    if request.method == "POST":

        form = request.form

        form_json = json.dumps(form)
        metadata = json.loads(form_json)['metadata']
        metadata = json.loads(metadata)

        with open(app.root_path+'/static/uploads/metadata/'+metadata['id']+'.json', 'w') as f:
            json.dump({
                'name': metadata['name'],
                'description': metadata['description'],
                'image': metadata['image'],
                'count': metadata['count'],
                'flag': metadata['flag'],
                'category': metadata['category'],
                'artist': metadata['artist']
            }, f)

        status = "success"

    else:
         status = "update error"
    return json.dumps({'status':status});

@bp.route('/edit', methods=['GET', 'POST'])
def edit():
    isFile = False
    if request.method == "POST":
        try:
            file = request.files['file']
            form = request.form
            form_json = json.dumps(form)
            metadata = json.loads(form_json)['metadata']
            metadata = json.loads(metadata)
            isFile = True
        except:
            form = request.form
            form_json = json.dumps(form)
            metadata = json.loads(form_json)['metadata']
            metadata = json.loads(metadata)

            pass
        if isFile or metadata['imagePath'] != '':

            try:
                name, file_extension = os.path.splitext(file.filename)
                filename = secure_filename(file.filename)

                file.seek(0)
                file.save(os.path.join(app.config['UPLOAD_PATH'])+'artists/images/'+metadata['artist']+file_extension)
                with open(app.root_path+'/static/uploads/artists/metadata/'+metadata['artist']+'.json', 'w') as f:
                    json.dump({
                        'username': metadata['username'],
                        'bio': metadata['bio'],
                        'image': request.url_root+'static/uploads/artists/images/'+metadata['artist']+file_extension,
                        'artist': metadata['artist'],
                        'social': metadata['social'],
                        'score': "0"
                    }, f)
                entry = {'3': "metadata['artist']"}

                with open(app.root_path+'/static/uploads/artists/artists.json', "r+") as file:

                    data = json.load(file)
                    data_list = list(data)
                    exist = False
                    for elmt in data_list:
                        if(data[elmt] == metadata['artist']):

                            exist = True

                    if not exist:

                        entry = {(int)(data["0"]) + 1: metadata['artist']}

                        data.update(entry)
                        data["0"] = (int)(data["0"]) + 1
                        file.seek(0)
                        json.dump(data, file)
                status = "success"
            # elif metadata['imagePath'] != '':
            except:
                form = request.form
                form_json = json.dumps(form)
                metadata = json.loads(form_json)['metadata']
                metadata = json.loads(metadata)
                with open(app.root_path+'/static/uploads/artists/metadata/'+metadata['artist']+'.json', 'w') as f:
                    json.dump({
                        'username': metadata['username'],
                        'bio': metadata['bio'],
                        'image': metadata['imagePath'],
                        'artist': metadata['artist'],
                        'social': metadata['social'],
                        'score': "0"
                    }, f)

                with open(app.root_path+'/static/uploads/artists/artists.json', "r+") as file:

                    data = json.load(file)
                    data_list = list(data)
                    exist = False
                    for elmt in data_list:
                        if(data[elmt] == metadata['artist']):

                            exist = True

                    if not exist:
                        print("last index: ", data_list[-1])
                        entry = {(int)(data["0"]) + 1: metadata['artist']}
                        print("entry: ", entry)
                        data.update(entry)
                        data["0"] = (int)(data["0"]) + 1
                        file.seek(0)
                        json.dump(data, file)
                status = "success"
        else:
            status = "No file uploaded"
    else:
         status = "uploaded error"
    return json.dumps({'status':status});

@bp.route('/listing/<int:id>', methods=['GET', 'POST'])
def listing(id):

    data = request.json
    print("listing: ", id)
    return render_template('listing.html', id=id)

@bp.route('/update', methods=['GET', 'POST'])
def update():
    if request.method == "POST":

        form = request.form

        form_json = json.dumps(form)
        metadata = json.loads(form_json)['metadata']
        metadata = json.loads(metadata)

        with open(app.root_path+'/static/uploads/artists/metadata/'+metadata['artist']+'.json', 'w') as f:
            json.dump({
                'username': metadata['username'],
                'bio': metadata['bio'],
                'image': metadata['image'],
                'artist': metadata['artist'],
                'score': metadata['score'],
                'social': metadata['social']
            }, f)

        status = "success"

    else:
         status = "uploaded error"
    return json.dumps({'status':status});


@bp.route('/metadata', methods=['GET', 'POST'])
def metadata():
    if request.method == "POST":
        file = request.files['file']
        form = request.form
        if file.filename != '':

            abi_json = json.dumps(nft_abi)

            nft_contract = w3.eth.contract(
                abi=abi_json,
                address=nft_address
                )

            tokenIds = nft_contract.functions.totalSupply().call()

            name, file_extension = os.path.splitext(file.filename)
            filename = secure_filename(file.filename)
            form_json = json.dumps(form)
            metadata = json.loads(form_json)['metadata']
            metadata = json.loads(metadata)

            file.seek(0)
            file.save(os.path.join(app.config['UPLOAD_PATH'])+'nft/'+(str)(tokenIds)+file_extension)
            with open(app.root_path+'/static/uploads/metadata/'+(str)(tokenIds)+'.json', 'w') as f:
                json.dump({
                    'name': metadata['name'],
                    'description': metadata['description'],
                    'image': request.url_root+'static/uploads/nft/'+(str)(tokenIds)+file_extension,
                    'count': "0",
                    'flag': "false",
                    'category': metadata['category'],
                    'artist': metadata['artist']
                }, f)
            status = "success"
        else:
            status = "No file uploaded"
    else:
         status = "uploaded error"
    return json.dumps({'status':status});
