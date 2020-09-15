# RSS Feed

## Getting Started 

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Environment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organized. Instructions for setting up a virtual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)


Initialize and activate a virtualenv:
  ```
  $ cd backend/
  $ pip install virtualenv
  $ py -3 -m venv venv
  $ source venv/Scripts/activate
  ```

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.


## Database Setup
With Postgres running, creating a local database. The application will automatically update the database schema when the application is running in dev mode. 
```bash
CREATE DATABASE rssfeed;
```


## API documentation

### Endpoints
```
POST '/api/feeds'
- Fetch a dictionary of feed urls based on user email. User email is unique and is used as identifier for feed urls. 
- Pass json include the following fields in API. Authentication is done via Auth0 so user need a valid email to create an account. The other information will be included in the user profile provided by Auth0. If the email doesn't exist in the database, a new user is created. 
{
  'email': 'test@test.com',
  'given_name': 'given_name',
  'picture': 'picture'
}
- Return:
{
  'success': True, 
  'feeds': {
    '1': [
      {
        'title': '',
        'published': '',
        'image': '',
        'link': ''
      },
      ...
    ]
  }
}

POST '/api/urls'
- Fetches a list of feed urls based on user email. User email is unique and is used as identifier for feed urls. 
- Pass json include the following fields in API. Authentication is done via Auth0 so user need a valid email to create an account.
{
  'email': 'test@test.com',
}
- Return:
{
  'success': True,
  'urls': ['https://www.latimes.com/entertainment-arts/books/rss2.0.xml#nt=1col-7030col1',...,'https://www.latimes.com/entertainment-arts/rss2.0.xml#nt=1col-7030col1nt=1col-7030col1']
}

POST '/api/urls/add'
- Add new url to database. User email is unique and is used as identifier for feed urls. 
- Pass json include the following fields in API. Authentication is done via Auth0 so user need a valid email to create an account.
{
  'email': 'test@test.com',
  'url': 'https://www.latimes.com/entertainment-arts/rss2.0.xml#nt=1col-7030col1nt=1col-7030col1'
}
- Return:
{
  'success': True, 
  'feeds': ['https://www.latimes.com/entertainment-arts/books/rss2.0.xml#nt=1col-7030col1',...,'https://www.latimes.com/entertainment-arts/rss2.0.xml#nt=1col-7030col1nt=1col-7030col1']
}

DELETE '/api/feeds/<int: feed_id>'
- Delete url from database. 
- Return:
{
  'success': True,
  'deleted': feed_id
}

```

#### Development instructions 

Run the development server: 

```bash
FLASK_APP=app
FLASK_ENV=development 
py app.py  
```