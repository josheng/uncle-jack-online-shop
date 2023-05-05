from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
import psycopg2
# import ipdb
from datetime import datetime
import os
from dotenv import load_dotenv
from setup.create_db import create_database

create_database()
load_dotenv()

# database configuration parameters from env file
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')

db = SQLAlchemy()
app = Flask(__name__)

# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_HOST}/{DB_NAME}'

db.init_app(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
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
        {'name': 'Milo', 'description': 'Chocolate Malt Drink', 'price': 4.99, 'image_path': './img/drinks/milo.webp'},
        {'name': '100 Plus', 'description': 'Isotonic Drink', 'price': 8.99, 'image_path': './img/drinks/100plus.webp'},
        {'name': 'Oolong Tea', 'description': 'Tea Brewed from the Mountains', 'price': 3.99, 'image_path': './img/drinks/oolong.webp'},
        {'name': 'Dasani Water', 'description': 'Mineral Water', 'price': 1.50, 'image_path': './img/drinks/dasani.webp'},
        {'name': 'Cheese', 'description': 'Made from Real Cow!', 'price': 12.99, 'image_path': './img/dairy/cheese.webp'},
        {'name': 'Egg', 'description': 'Packed with nutrients!', 'price': 3.50, 'image_path': './img/dairy/egg.webp'},
        {'name': 'Milk', 'description': 'Made from Real Cow!', 'price': 6.45, 'image_path': './img/dairy/milk.webp'},
        {'name': 'Gardenia White Bread', 'description': 'Just a white bread.', 'price': 3.00, 'image_path': './img/breads/gardenia.webp'},
        {'name': 'Sunshine White Bread', 'description': 'White Bread from Sunshine!', 'price': 2.80, 'image_path': './img/breads/sunshine.webp'},
        {'name': 'Sunshine Whole Grain', 'description': 'Very Healthy Bread!', 'price': 3.80, 'image_path': './img/breads/wholegrain.webp'},
    ]

    for product in products:
        # Create product object and add to database session
        new_product = Product(name=product['name'], description=product['description'], price=product['price'], image=product['image_path'])
        print(f"Adding {new_product.name} to database")
        db.session.add(new_product)

    # Commit changes to the database
    db.session.commit()
    print('Database seeded!')

with app.app_context():
    print('Dropping all tables...')
    db.drop_all()
    print('Creating all tables...')
    db.create_all()
    seed_product()

# write a get function to retrieve all products
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    results = [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image": product.image
        } for product in products]

    return jsonify(results)
