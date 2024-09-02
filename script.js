document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value;

    const appointment = { name, date, time, notes };
    createAppointment(appointment);
});

function addAppointmentToTable(appointment) {
    const table = document.getElementById('appointmentsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const nameCell = newRow.insertCell(0);
    const dateCell = newRow.insertCell(1);
    const timeCell = newRow.insertCell(2);
    const notesCell = newRow.insertCell(3);
    const actionsCell = newRow.insertCell(4);

    nameCell.textContent = appointment.name;
    dateCell.textContent = appointment.date;
    timeCell.textContent = appointment.time;
    notesCell.textContent = appointment.notes;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Apagar';
    deleteButton.addEventListener('click', function() {
        deleteAppointment(appointment.id, newRow);
    });
    actionsCell.appendChild(deleteButton);
}

function createAppointment(appointment) {
    fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(data => {
        addAppointmentToTable(data);
    })
    .catch(error => console.error('Erro:', error));
}

function deleteAppointment(id, row) {
    fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        row.remove();
    })
    .catch(error => console.error('Erro:', error));
}

function loadAppointments() {
    fetch('http://localhost:8080/api/appointments')
    .then(response => response.json())
    .then(data => {
        data.forEach(addAppointmentToTable);
    })
    .catch(error => console.error('Erro:', error));
}

document.addEventListener('DOMContentLoaded', loadAppointments);