document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value;

    const appointment = { name, date, time, notes };
    addAppointmentToTable(appointment);
    saveAppointment(appointment);
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
        deleteAppointment(appointment, newRow);
    });
    actionsCell.appendChild(deleteButton);
}

function saveAppointment(appointment) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function deleteAppointment(appointment, row) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.filter(a => a.name !== appointment.name || a.date !== appointment.date || a.time !== appointment.time);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    row.remove();
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.forEach(addAppointmentToTable);
}

document.addEventListener('DOMContentLoaded', loadAppointments);