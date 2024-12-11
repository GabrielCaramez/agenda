document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value;

    fetch('/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, date, time, notes })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.message === 'Appointment created successfully') {
                loadAppointments();
            }
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.message === 'Login successful') {
                document.getElementById('appointmentForm').style.display = 'block';
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('createAccountForm').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'block';
                loadAppointments();
            }
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('createAccountForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch('/create_account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById('appointmentForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('createAccountForm').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'none';
        }
    })
    .catch(error => console.error('Error:', error));
});

function loadAppointments() {
    fetch('/appointments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(appointments => {
        const tableBody = document.querySelector('#appointmentsTable tbody');
        tableBody.innerHTML = ''; // Limpar a tabela antes de adicionar novos dados

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.name}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.notes}</td>
                <td><button class="delete-btn" data-id="${appointment.id}">Excluir</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar evento de clique para os botões de exclusão
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const appointmentId = this.getAttribute('data-id');
                deleteAppointment(appointmentId);
            });
        });
    })
    .catch(error => console.error('Error:', error));
}

function deleteAppointment(id) {
    fetch(`/appointments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            loadAppointments(); // Recarregar a lista de compromissos
        }
    })
    .catch(error => console.error('Error:', error));
}

// Carregar compromissos ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
});