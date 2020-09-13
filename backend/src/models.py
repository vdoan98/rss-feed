from sqlalchemy import Column, String, Integer, ForeignKey
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
import json 

database_name = "rssfeed"
database_path = "postgresql://{}:{}@{}/{}".format('postgres', 'DataPass98','localhost:5432', database_name)

db = SQLAlchemy()
lm = LoginManager()

def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app 
    lm = LoginManager(app)
    db.init_app(app)
    db.create_all()
    migrate = Migrate(app, db)

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=False, unique=True)
    picture = db.Column(db.String, nullable=True)

    def __init__(self, name, email, picture):
        self.name = name
        self.email = email
        self.picture = picture 

    def insert(self):
        db.session.add(self)
        db.session.commit()

class Feed(db.Model):
    __tablename__ = 'feed'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("users.id"), nullable=False)
    feed_url = db.Column(db.String, nullable=False)

    def __init__(self, user_id, feed_url):
        self.user_id = user_id 
        self.feed_url = feed_url

    def insert(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def format(self):
        return {
            'id': self.id, 
            'user_id': self.user_id,
            'feed_url': self.feed_url
        }

