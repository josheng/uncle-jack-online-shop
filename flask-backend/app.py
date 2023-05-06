from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, get_jwt_identity)
from datetime import datetime
import os
from dotenv import load_dotenv
from setup.create_db import create_database
from flask_cors import CORS

create_database()
load_dotenv()

# database configuration parameters from env file
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')

db = SQLAlchemy()
app = Flask(__name__)
CORS(app)
# jwt = JWTManager(app)
# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_HOST}/{DB_NAME}'
# app.config['JWT_SECRET_KEY'] = 'super-secret' # change this to a secure key in production

db.init_app(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(200), nullable=True)
    category = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Product {self.name}>'

class UserActivity(db.Model):
    __tablename__ = 'user_activity'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', backref=db.backref('activity', lazy=True))

    def __repr__(self):
        return f'<UserActivity {self.user.username} - {self.activity_type}>'

def seed_product():
    # product dict
    products = [
        {'name': 'Milo', 'description': 'Chocolate Malt Drink', 'price': 4.99, 'image_path': '/images/drinks/milo.jpg', 'category': 'drinks'},
        {'name': '100 Plus', 'description': 'Isotonic Drink', 'price': 8.99, 'image_path': '/images/drinks/100plus.jpg', 'category': 'drinks'},
        {'name': 'Oolong Tea', 'description': 'Tea Brewed from the Mountains', 'price': 3.99, 'image_path': '/images/drinks/oolong.jpg', 'category': 'drinks'},
        {'name': 'Dasani Water', 'description': 'Mineral Water', 'price': 1.50, 'image_path': '/images/drinks/dasani.jpg', 'category': 'drinks'},
        {'name': 'Cheese', 'description': 'Made from Real Cow!', 'price': 12.99, 'image_path': '/images/dairy/cheese.jpg', 'category': 'dairy'},
        {'name': 'Egg', 'description': 'Packed with nutrients!', 'price': 3.50, 'image_path': '/images/dairy/egg.jpg', 'category': 'dairy'},
        {'name': 'Milk', 'description': 'Made from Real Cow!', 'price': 6.45, 'image_path': '/images/dairy/milk.jpg', 'category': 'dairy'},
        {'name': 'Gardenia White Bread', 'description': 'Just a white bread.', 'price': 3.00, 'image_path': '/images/breads/gardenia.jpg', 'category': 'breads'},
        {'name': 'Sunshine White Bread', 'description': 'White Bread from Sunshine!', 'price': 2.80, 'image_path': '/images/breads/sunshine.jpg', 'category': 'breads'},
        {'name': 'Sunshine Whole Grain', 'description': 'Very Healthy Bread!', 'price': 3.80, 'image_path': '/images/breads/wholegrain.jpg', 'category': 'breads'},
    ]

    for product in products:
        # Create product object and add to database session
        new_product = Product(name=product['name'], description=product['description'], price=product['price'], image=product['image_path'], category=product['category'])
        print(f"Adding {new_product.name} to database")
        db.session.add(new_product)

    # Commit changes to the database
    db.session.commit()
    print('Database seeded!')

# seed 1 user with admin role
def seed_user():
    # Create an admin user
    admin_user = User(username='jack', password_hash='pbkdf2:sha256:150000$wJkxWx2d$2b3c3a9c1f8d9f7cbea0a0c4e4a8f4e4f4b4e4a8f4e4a8f4e4a8f4e4a8f4e4a8', role='admin')
    db.session.add(admin_user)
    db.session.commit()
    print('User seeded!')

#sed 1 user activity
def seed_user_activity():
    # Create an admin user
    user_activity = UserActivity(user_id=1, activity_type='login', timestamp=datetime.now())
    db.session.add(user_activity)
    db.session.commit()
    print('User Activity seeded!')

with app.app_context():
    print('Dropping all tables...')
    db.drop_all()
    print('Creating all tables...')
    db.create_all()
    seed_product()
    seed_user()
    seed_user_activity()

# retrieve all products
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    results = [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image": product.image,
            "category": product.category
        } for product in products]
    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# create a new product
@app.route('/products', methods=['POST'])
def create_product():
    # get the request body
    body = request.get_json()
    # create a new product
    try:
        imgbody = body['image']
    except KeyError:
        imgbody = None
    new_product = Product(name=body['name'], description=body['description'],
                            price=body['price'],
                            image=imgbody, category=body['category'])
    # add the new product to the database
    db.session.add(new_product)
    # commit the changes
    db.session.commit()

    return jsonify({
        "message": "New product created!",
        "success": True
    })

# update a product
@app.route('/products/<int:id>', methods=['PATCH'])
def update_product(id):
    # get the product to update
    product = Product.query.get(id)

    if product is None:
        abort(404)

    # get the request body
    body = request.get_json()

    # update the product
    product.name = body['name']
    product.description = body['description']
    product.price = body['price']
    product.image = body['image']
    product.category = body['category']

    # commit the changes
    db.session.commit()

    return jsonify({
        "message": "Product updated!",
        "success": True
    })

# delete a product
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    # get the product to delete
    product = Product.query.get(id)

    if product is None:
        abort(404)

    # delete the product
    db.session.delete(product)
    # commit the changes
    db.session.commit()

    return jsonify({
        "message": "Product deleted!",
        "success": True
    })

# create a endpoint to add a new user activity
@app.route('/user_activity', methods=['POST'])
def create_user_activity():
    # get the request body
    body = request.get_json()
    # create a new user activity
    new_user_activity = UserActivity(user_id=body['user_id'], activity_type=body['activity_type'], timestamp=datetime.now())
    # add the new user activity to the database
    db.session.add(new_user_activity)
    # commit the changes
    db.session.commit()

    return jsonify({
        "message": "action logged",
        "success": True
    })

# retrieve all user activities
@app.route('/user_activity', methods=['GET'])
def get_user_activity():
    user_activities = UserActivity.query.all()
    results = [
        {
            "id": user_activity.id,
            "user_id": user_activity.user_id,
            "activity_type": user_activity.activity_type,
            "timestamp": user_activity.timestamp
        } for user_activity in user_activities]
    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# get all user
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    results = [
        {
            "id": user.id,
            "username": user.username,
            "role": user.role
        } for user in users]
    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# @app.route('/login', methods=['POST'])
# def login():
#     username = request.json.get('username')
#     password = request.json.get('password')
#     if username != 'admin' or password != 'password':
#         return jsonify({'message': 'Invalid credentials'}), 401

#     access_token = create_access_token(identity=username)
#     return jsonify({'access_token': access_token}), 200
