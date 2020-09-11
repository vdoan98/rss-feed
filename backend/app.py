import json
import os 
from flask import Flask, redirect, request, url_for, request, jsonify, abort
import feedparser
from src.models import setup_db, User, Feed

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
    return response

setup_db(app)

@app.route('/login', methods=['GET'])
def login():
    #login_data = request.get_json()

    return 

@app.route('/signup', methods=['POST'])
def signup():
    return 

@app.route('/feeds', methods=['GET'])
def get_feed(username):
    #TODO: real time update
    #feed_url = request.get_json() #Not correct
    user_id = User.query.filter_by(username=username).first().id
    feed_urls = Feed.query.filter_by(user_id=user_id).all()

    feed_dict = {}

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
        feed_dict['feed_url'] = feed 

    return jsonify({
        'success': True, 
        'feeds': feed_dict
    })

@app.route('/feeds', methods=['POST'])
def add_feed(username):
    try: 
        data = request.get_json()
        url = data.get('url', '')
        user_id = User.query.filter_by(username=username).first().id

        feed = Feed(user_id=user_id, feed_url=url)

        feed.insert()

        feed_urls = Feed.query.filter_by(user_id=user_id).all()        
        
        return jsonify({
            'success': True,
            'feeds': [feed.url.format() for feed.url in feeds_urls]
        })

    except Exception as e: 
        abort(401)




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

'''
@DONE implement error handlers using the @app.errorhandler(error) decorator
    each error handler should return (with approprate messages):
             jsonify({
                    "success": False,
                    "error": 404,
                    "message": "resource not found"
                    }), 404

'''


'''
@TODO implement error handler for 404
    error handler should conform to general task above
'''

@app.errorhandler(404)
def not_found(error):
    return jsonify({
                    "success": False,
                    "error": 404,
                    "message": "resource not found"
                    }), 404

'''
@TODO implement error handler for AuthError
    error handler should conform to general task above
'''
# @app.errorhandler(AuthError)
# def auth_error(error):
#     error_details = error.error
#     error_status_code = error.status_code 

#     return jsonify({
#                     "success": False,
#                     "error": error_status_code,
#                     "message": error_details['description']
#                     }), error_status_code


if __name__ == "__main__":
    app.run(host='0.0.0.0')