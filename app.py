from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Conectar ao banco de dados SQLite
def connect_db():
    conn = sqlite3.connect('agenda.db')
    return conn

# Criar as tabelas de usuários e compromissos
def create_tables():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            notes TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

create_tables()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_account', methods=['POST'])
def create_account():
    data = request.json
    username = data['username']
    password = generate_password_hash(data['password'])

    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username already exists'}), 400
    finally:
        conn.close()

    return jsonify({'message': 'Account created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[1], password):
        session['user_id'] = user[0]
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/appointments', methods=['POST'])
def create_appointment():
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.json
    name = data['name']
    date = data['date']
    time = data['time']
    notes = data.get('notes', '')

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO appointments (name, date, time, notes, user_id) VALUES (?, ?, ?, ?, ?)', 
                   (name, date, time, notes, session['user_id']))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Appointment created successfully'}), 201

@app.route('/appointments', methods=['GET'])
def get_appointments():
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, date, time, notes FROM appointments WHERE user_id = ?', (session['user_id'],))
    appointments = cursor.fetchall()
    conn.close()

    return jsonify([{
        'id': appointment[0],
        'name': appointment[1],
        'date': appointment[2],
        'time': appointment[3],
        'notes': appointment[4]
    } for appointment in appointments]), 200

@app.route('/appointments/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM appointments WHERE id = ? AND user_id = ?', (id, session['user_id']))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Appointment deleted successfully'}), 200

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)