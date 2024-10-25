from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# Conectar ao banco de dados SQLite
def connect_db():
    conn = sqlite3.connect('agenda.db')
    return conn

# Criar a tabela de compromissos
def create_table():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            notes TEXT
        )
    ''')
    conn.commit()
    conn.close()

create_table()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/appointments', methods=['GET', 'POST'])
def manage_appointments():
    conn = connect_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json()
        cursor.execute('''
            INSERT INTO appointments (name, date, time, notes)
            VALUES (?, ?, ?, ?)
        ''', (data['name'], data['date'], data['time'], data['notes']))
        conn.commit()
        return jsonify({'message': 'Appointment created'}), 201

    elif request.method == 'GET':
        cursor.execute('SELECT * FROM appointments')
        appointments = cursor.fetchall()
        return jsonify(appointments)

    conn.close()

@app.route('/appointments/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_appointment(id):
    conn = connect_db()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json()
        cursor.execute('''
            UPDATE appointments
            SET name = ?, date = ?, time = ?, notes = ?
            WHERE id = ?
        ''', (data['name'], data['date'], data['time'], data['notes'], id))
        conn.commit()
        return jsonify({'message': 'Appointment updated'})

    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM appointments WHERE id = ?', (id,))
        conn.commit()
        return jsonify({'message': 'Appointment deleted'})

    conn.close()

if __name__ == '__main__':
    app.run(debug=True)