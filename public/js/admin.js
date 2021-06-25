const socket = io();
let connectionsUsers = [];

socket.on("admin_list_all_users", connections => {
    connectionsUsers = connections;

    document.getElementById("list_users").innerHTML = "";

    let template = document.getElementById("template").innerHTML;

    connections.forEach(connection => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id
        });

        document.getElementById("list_users").innerHTML += rendered;
    });
});

function call(id) {

    const connection = connectionsUsers.find(connection => connection.socket_id === id);

    const template = document.getElementById("admin_template").innerHTML;

    const rendered = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id
    });

    document.getElementById("supports").innerHTML += rendered;

    const params = {
        user_id: connection.user_id
    }

    socket.emit("admin_list_messages_by_user", params, (messages) => {
        const divMessages = document.getElementById(`allMessages${connection.user_id}`);

        messages.forEach(message => {
            const messageDiv = document.createElement("div");

            if(message.admin_id === null) {
                messageDiv.className = "admin_message_client";
                messageDiv.innerHTML = `<span>${connection.user.email}</span>`;
                messageDiv.innerHTML += `<span>${message.text}</span>`;
                messageDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
            } else {
                messageDiv.className = "admin_message_admin";
                messageDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
                messageDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
            }
            
            divMessages.appendChild(messageDiv);
        });
    });
}

function sendMessage(id) {
    const text = document.getElementById(`send_message_${id}`);

    const params = {
        text: text.value,
        user_id: id
    }

    socket.emit("admin_send_message", params);

    const divMessages = document.getElementById(`allMessages${id}`);
    const messageDiv = document.createElement("div");
    
    messageDiv.className = "admin_message_admin";
    messageDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
    messageDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;
    
    divMessages.appendChild(messageDiv);
    
    text.value = '';
}

socket.on("admin_receive_message", (data) => {
    const connection = connectionsUsers.find((connection) => (connection.socket_id = data.socket_id))
    
    const divMessages = document.getElementById(`allMessages${data.message.user_id}`);

    const messageDiv = document.createElement("div");

    messageDiv.className = "admin_message_client";
    messageDiv.innerHTML = `<span>${connection.user.email}</span>`;
    messageDiv.innerHTML += `<span>${data.message.text}</span>`;
    messageDiv.innerHTML += `<span class="admin_date">${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

    divMessages.appendChild(messageDiv);
});