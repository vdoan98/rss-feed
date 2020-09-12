import os 
import unittest 
import json 
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from src.models import setup_db, User, Feed

class RssFeedTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client 
        self.database_name = "rssfeed"
        self.database_path = "postgres://{}:{}@{}/{}".format('postgres', 'DataPass98','localhost:5432', self.database_name)
        setup_db(self.app)

        self.new_rss = ""

        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            self.db.create_all()

    

    def test_get_feed(self):
        res = self.client().get('/feeds', username='jsnow')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['no_feed'])

    def test_add_feed(self):
        res = self.client().post('/feeds', username='jsnow', json=self.new_rss)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

    def test_delete_feed_fail(self):
        res = self.client().delete('/feeds/3', username='jsnow')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['success'], False)

    def test_delete_feed_fail(self):
        res = self.client().delete('/feeds/3', username='skywalker')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['deleted'], 3)

    
# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()


