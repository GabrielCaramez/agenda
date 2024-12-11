import sqlite3

# Conectar ao banco de dados (o arquivo será criado se não existir)
conn = sqlite3.connect('agenda.db')

# Criar um cursor
cursor = conn.cursor()

# Criar a tabela de usuários
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
''')

# Criar a tabela de compromissos
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

# Confirmar as mudanças e fechar a conexão
conn.commit()
conn.close()