import json
import os 
from flask import Flask, redirect, request, url_for, request, jsonify, abort, session
from flask_login import LoginManager, UserMixin, login_user, logout_user,\
    current_user
import feedparser
from src.models import setup_db, User, Feed
from src.config import CLIENT_ID, CLIENT_SECRET, API_URL, ACCESS_TOKEN, AUTHORIZE_URL
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
from six.moves.urllib.parse import urlencode

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
    return response

setup_db(app)

@app.route('/')
def index():
    return 'Welcome to Rss Feed.'



'''
GET request for getting feeds based on user information. 
If no user exists, meaning user is new or that user was created prior but never add any rss url 
to feed, create new user in database 
request json format:
    {
        "given_name": "Mr. Test",
        "email": "test@test.com",
        "picture": "picture_link"
    }
'''
@app.route('/api/feeds', methods=['POST'])
def get_feed():
    #TODO: real time update
    #feed_url = request.get_json() #Not correct
    search_user = request.get_json()
    #print(search_user)
    user = User.query.filter(User.email == search_user['email']).first()
    #print(user)
    if user is None:
        user = User(name=search_user.get('given_name'),email=search_user.get('email'),picture=search_user.get('picture'))
        user.insert()

    user_id = user.id

    feed_urls = Feed.query.filter(Feed.user_id == user_id).all()

    feed_dict = {}
    feed_count = 0

    for rss in feed_urls:
        rssFeed = feedparser.parse(rss.feed_url)
        feed = []
        for entry in rssFeed.entries:
            new_entry = {}
            new_entry['title'] = entry.title 
            new_entry['description'] = entry.summary 
            published = ''
            if 'published' in entry:
                published = entry.published 
            new_entry['published'] = published
            image = ''
            if 'image' in  entry:
                image = entry.image.href 
            new_entry['image'] = image
            new_entry['link'] = entry.link
            feed.append(new_entry)
        feed_dict[rss.id] = feed 
        feed_count += 1

    return jsonify({
        'success': True, 
        'feeds': feed_dict,
        'no_feed': feed_count,
        'user_id': user_id
    })

@app.route('/api/urls', methods=['POST'])
def get_url():
    data = request.get_json()
    user_id = User.query.filter(User.email == data.get('email')).first().id
    check_feed = Feed.query.filter(Feed.user_id == user_id).all()

    return jsonify({
        'success': True,
        'urls': [url.format() for url in check_feed]
    })

'''
request json format:
    {
        "url": "rss_feed_url",
        "email": "test@test.com"
    }
'''
@app.route('/api/feeds/add', methods=['POST'])
def add_feed():
    data = request.get_json()
    url = data.get('url', '')
    user_id = User.query.filter(User.email == data.get('email')).first().id
    check_feed = Feed.query.filter(Feed.user_id == user_id).filter(Feed.feed_url == url).first()

    try:
        feedparser.parse(url)
    except: 
        print('Invalid url')
        feed_urls = Feed.query.filter(Feed.user_id == user_id).all()        
        return jsonify({
        'success': False,
        'feeds': [i.format() for i in feed_urls]
        })
        
    if check_feed is None:
        feed = Feed(user_id=user_id, feed_url=url)
        feed.insert()

    feed_urls = Feed.query.filter(Feed.user_id == user_id).all()        
            
    return jsonify({
        'success': True,
        'feeds': [i.format() for i in feed_urls]
    })


'''
request json format:
    {
        "email": "test@test.com"
    }
'''
@app.route('/api/feeds/<int:feed_id>', methods=["DELETE"])
def delete_feed(feed_id):
    # data = request.get_json()
    # user = User.query.filter(User.email == data.get('email', '')).first()
    # if user is None: 
    #     return jsonify({
    #         'success': False,
    #         'message': 'User doesn\'t exist'
    #     })

    feed = Feed.query.filter(Feed.id == feed_id).first()

    feed_id = feed.id
    #print(feed_id)
    feed.delete()

    return jsonify({
        'success': True, 
        'deleted': feed_id
    })



## Error Handling
'''
Example error handling for unprocessable entity
'''
@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable"
    }), 422



@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found"
    }), 404


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)