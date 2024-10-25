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
        console.log(data);
        loadAppointments();
    });
});

function loadAppointments() {
    fetch('/appointments')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#appointmentsTable tbody');
            tbody.innerHTML = '';
            data.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment[1]}</td>
                    <td>${appointment[2]}</td>
                    <td>${appointment[3]}</td>
                    <td>${appointment[4]}</td>
                    <td>
                        <button class="delete" onclick="deleteAppointment(${appointment[0]})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}

function deleteAppointment(id) {
    fetch(`/appointments/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadAppointments();
    });
}

document.addEventListener('DOMContentLoaded', loadAppointments);