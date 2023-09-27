function showRows(users) {
    for (let user of users) {
        showUserRow(user);
    }
}

function showUserRow(user) {
    const container = createElement('div', '#users', '', {'data-user-id': user.id});

    createElement('div', container, user.id); // idElement

    createElement('div', container, user.name + ' ' + user.lastName); // nameElement

    const actionsElement = createElement('div', container, '', {className: 'actions', 'data-id': user.id});

    createElement(
        'input',
        actionsElement,
        '',
        {type: 'button', value: 'Edit', 'data-type': 'edit'},
        {
            click: editUsersInfo
        }
    ); // editBtnElement

    createElement(
        'input',
        actionsElement,
        '',
        {type: 'button', value: 'Delete', 'data-type': 'delete'},
        {
            click: handleDeleteUser
        }
    ); // deleteBtnElement
    createElement(
        'input',
        actionsElement,
        '',
        {type: 'button', value: 'View', 'data-type': 'view'},
        {
            click: showUsersInfo
        }
    );
}

function showUsersInfo(event) {
    if (document.getElementById('userInfo') !== null) {
        removeElement(document.getElementById('userInfo'));
    }

    const container = document.getElementById('users');
    const userInfo = createElement('div', container, '', {className: 'userInfo', id: 'userInfo'});
    let receivedUserId = getUserId(event);
    for (let user of users) {
        if (user.id == receivedUserId) {
            createElement('p', userInfo, 'User login: ' + user.login);
            createElement('p', userInfo, 'User name: ' + user.name);
            createElement('p', userInfo, 'User last name: ' + user.lastName);
            createElement('p', userInfo, 'User email: ' + user.email);
            /*userInfo.innerHTML = `<H3>Information about user</H3>
                                  <p>User login: ${user.login}<br>User name: ${user.name}<br>User last name: ${user.lastName}<br>User email: ${user.email}</p>`*/
        }
    }
    createElement(
        'input',
        userInfo,
        '',
        {
            type: 'button',
            value: 'Close'
        },
        {
            click: () => cleanElement('#userInfo')
        }
    );
}

function editUsersInfo(event) {
    const userId = getUserId(event);
    const checkedUser = getUserById(userId);
    showUserForm(checkedUser);
}

function updateUserRow(user) {
    const userInfo = document.querySelector(`div[data-user-id="${user.id}"]`);
    const childDivs = userInfo.children;
    const userName = childDivs.item(1);
    userName.textContent = user.name + ' ' + user.lastName;
}

function getUserId(event) {
    return event.target.parentNode.getAttribute('data-id');
}

function getUserById(userId) {
    for (let user of users) {
        if (user.id == userId) {
            return user;
        }
    }
}

function showUserForm(checkedUser) {
    const parentSelector = '#form form';
    createElement(
        'input',
        parentSelector,
        '',
        {
            name: 'login',
            type: 'text',
            placeholder: 'Enter login',
            value: checkedUser.login || '',
            id: 'login',
        }
    ); // login input

    createElement(
        'input',
        parentSelector,
        '',
        {
            name: 'name',
            type: 'text',
            placeholder: 'Enter name',
            value: checkedUser.name || '',
            id: 'name',
        }
    ); // name input

    createElement(
        'input',
        parentSelector,
        '',
        {
            name: 'lastName',
            type: 'text',
            placeholder: 'Enter last name',
            value: checkedUser.lastName || '',
            id: 'last_name',
        }
    ); // lastName input

    createElement(
        'input',
        parentSelector,
        '',
        {
            name: 'email',
            type: 'text',
            placeholder: 'Enter email',
            value: checkedUser.email || '',
            id: 'email',
        }
    ); // email input

    createElement(
        'input',
        parentSelector,
        '',
        {
            type: 'button',
            value: 'Save'
        },
        {
            click: () => handleSaveUser(checkedUser?.id)
        }
    );
    createElement(
        'input',
        parentSelector,
        '',
        {
            type: 'button',
            value: 'Close'
        },
        {
            click: () => cleanElement('#form form')
        }
    );

}

function handleSaveUser(checkedUserId) {
    const formElements = document.forms[0].elements;

    const login = formElements.login.value;
    const name = formElements.name.value;
    const lastName = formElements.lastName.value;
    const email = formElements.email.value;

    const user = {
        login,
        name,
        lastName,
        email,
    };
    if (!checkedUserId) {
        user.id = createId();
    }
    const isValid = validate(user);

    if (isValid) {
        if (checkedUserId) {
            updateUser(checkedUserId, user)
        } else {
            saveUser(user);
        }
        cleanElement('#form form');
    }
}

function createId(length = 16) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let createdId = '';

    for (let i = 0; i < length; i++) {
        createdId += chars[Math.floor(Math.random() * chars.length)];
    }

    return createdId;
}

function validate(user) {
    let allIsValid = true;
    for (let field in user) {
        if (field === 'login' && user[field] === '') {
            document.getElementById('login').classList.add('red_border');
            allIsValid = false;
        }
        if (field === 'name' && user[field] === '') {
            document.getElementById('name').classList.add('red_border');
            allIsValid = false;
        }
        if (field === 'lastName' && user[field] === '') {
            document.getElementById('last_name').classList.add('red_border');
            allIsValid = false;
        }
        if (field === 'email' && user[field] === '') {
            document.getElementById('email').classList.add('red_border');
            allIsValid = false;
        }
    }
    return allIsValid;
}

function updateUser(id, updatedUser) {
    for (let user of users) {
        if (user.id == id) {
            user.login = updatedUser.login;
            user.name = updatedUser.name;
            user.lastName = updatedUser.lastName;
            user.email = updatedUser.email;
            updateStorage(user);
            updateUserRow(user);
        }
    }
}

function saveUser(newUser) {
    users.push(newUser);
    updateStorage();
    showUserRow(newUser);
    console.log(users.find(users => users.id === newUser.id))

}

function handleDeleteUser(event) {
    const userId = getUserId(event);
    messageDeleting(userId);
}

function messageDeleting(userId) {
    const messageBlock = createElement('div', `div[data-user-id="${userId}"]`, 'Are you sure you want to delete this user?', {id: 'deleting'});
    createElement('input',
        messageBlock,
        '',
        {type: 'button', value: 'Yes'},
        {
            click: () => {
                removeElement(messageBlock);
                deleteUserById(+userId);
            }
        })
    createElement('input',
        messageBlock,
        '',
        {type: 'button', value: 'No'},
        {
            click: () => {
                removeElement(messageBlock);
            }
        })
}

function deleteUserById(id) {
    const indexToRemove = users.findIndex(user => user.id === id);
    users.splice(indexToRemove, 1);
    removeElement(`div[data-user-id="${id}"]`);
    updateStorage();
}

function updateStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}