import sqlite3

# Conectar ao banco de dados (o arquivo será criado se não existir)
conn = sqlite3.connect('agenda.db')

# Criar um cursor
cursor = conn.cursor()

# Criar a tabela de compromissos
cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        notes TEXT
    )
''')

# Confirmar as alterações
conn.commit()

# Fechar a conexão
conn.close()

print("Banco de dados e tabela criados com sucesso.")