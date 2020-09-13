import json
import os 
from flask import Flask, redirect, request, url_for, request, jsonify, abort
from flask_login import LoginManager, UserMixin, login_user, logout_user,\
    current_user
import feedparser
from src.models import setup_db, User, Feed
from src.auth import OAuthSignIn

def create_app(test_config=None):
    app = Flask(__name__)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
        return response

    setup_db(app)
    lm = LoginManager(app)
    lm.login_view = 'index'

    @lm.user_loader
    def load_user(id):
        return User.query.get(int(id))

    @app.route('/')
    def index():
        return 'Welcome to Rss Feed.'

    @app.route('/logout')
    def logout():
        logout_user()
        return redirect(url_for('index'))

    @app.route('/authorize/<provider>')
    def oauth_authorize(provider):
        if not current_user.is_anonymous():
            return redirect(url_for('index'))
        oauth = OAuthSignIn.get_provider(provider)
        return oauth.authorize()
    
    @app.route('/callback/<provider>')
    def oauth_callback(provider):
        if not current_user.is_anonymous():
            return redirect(url_for('index'))
        oauth = OAuthSignIn.get_provider(provider)
        social_id, username, email = oauth.callback()
        if social_id is None:
            flash('Authentication failed.')
            return redirect(url_for('index'))
        user = User.query.filter_by(social_id=social_id).first()
        if not user:
            user = User(social_id=social_id, nickname=username, email=email)
            user.insert()
        login_user(user, True)
        return redirect(url_for('index'))

    @app.route('/feeds', methods=['GET'])
    def get_feed(username):
        #TODO: real time update
        #feed_url = request.get_json() #Not correct
        user_id = User.query.filter_by(User.username == username).first().id
        feed_urls = Feed.query.filter_by(Feed.user_id == user_id).all()

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
            feed_dict['feed_url'] = feed 
            feed_count += 1

        return jsonify({
            'success': True, 
            'feeds': feed_dict,
            'no_feed': feed_count
        })

    @app.route('/feeds', methods=['POST'])
    def add_feed(username):
        try: 
            data = request.get_json()
            url = data.get('url', '')
            user_id = User.query.filter_by(User.username == username).first().id

            feed = Feed(user_id=user_id, feed_url=url)

            feed.insert()

            feed_urls = Feed.query.filter_by(Feed.user_id == user_id).all()        
            
            return jsonify({
                'success': True,
                'feeds': [feed.url.format() for feed.url in feeds_urls]
            })

        except Exception as e: 
            abort(401)


    @app.route('/feeds/<int:feed_id>', methods=["DELETE"])
    def delete_feed(username, feed_id):
        user = User.query.filter_by(User.username == username).one_or_none()
        if user is None: 
            abort(422)

        feed = Feed.query.filter_by(Feed.id == feed_id).first()

        feed_id = feed.id
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

    return app

app = create_app()


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)