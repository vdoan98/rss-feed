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


#### API Documentation 


#### Development instructions 

Run the development server: 

```bash
FLASK_APP=app
FLASK_ENV=development 
py app.py  
```