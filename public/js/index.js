const table = document.getElementById('gamesTable');
const textarea = document.getElementById('userText');

const sendForm = async event => {
    event.preventDefault();
    const inputValue = textarea.value;
    const steamIds = splitString(inputValue);
    const html = await getTotalTable(checkIds(steamIds));
    refreshTable(html);
};
const splitString = string => string.split(/,|\s,|\s/);

const checkIds = ids => ids.filter(item => !isNaN(item) && item.length === 17);

const refreshTable = html => table.innerHTML = html;

const getTotalTable = async ids => {
    const result = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({ids})
    });

    return result.text();
};

document.getElementById('sendBtn').addEventListener("click", sendForm);