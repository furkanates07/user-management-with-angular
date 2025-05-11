# User Management Angular Project

This project provides an Angular application for managing users. Users can be listed, added, updated, and deleted with various functionalities. The project is styled with **Tailwind CSS** and developed with **Angular**.

## Features

- **User List Page**: A page for listing users.
- **Add User**: A form to add a new user.
- **Update User**: A form to update existing users.
- **User Details Dialog**: A dialog to view user details.
- **Delete User Dialog**: A confirmation dialog to delete a user.
- **User Filtering**: Filter users by **first name**, **last name**, **username**, **email**, and **phone number**.

## Technologies Used

- **Angular**: Web application development framework.
- **Tailwind CSS**: A utility-first CSS framework for building custom designs.

## User Service

Users are currently loaded from the **`assets/data/users.json`** file. The **UserService** class provides a centralized way to manage user data using RxJS and `BehaviorSubject`.

### User Operations

- **List Users**: Access the current list of users using the `users$` observable or `getUsers()` method.
- **Get User by ID**: Retrieve a user using `getUserById(id: number)`.

- **Add User**: Use `addUser(user: User)` to add a new user. A unique ID is automatically assigned based on the current maximum ID.

- **Update User**: Use `updateUser(updatedUser: User)` to update the details of an existing user.

- **Delete User**: Use `deleteUser(id: number)` to remove a user from the list.

- **Verify/Unverify User**:

  - `verifyUser(id: number)`: Marks a user as verified.
  - `unverifyUser(id: number)`: Marks a user as unverified.

- **Check for Duplicate Fields**:
  - `isEmailTaken(email: string, excludeUserId?: number)`: Checks if the email already exists.
  - `isPhoneTaken(phone: string, excludeUserId?: number)`: Checks if the phone number already exists.
  - `isUsernameTaken(username: string, excludeUserId?: number)`: Checks if the username already exists.

> ⚠️ Currently, all user operations are performed in memory, and changes are not persisted to disk or a backend server.

## Images

- **User List**
  ![UserList](/src/assets/screenshots/user-list.jpeg)

- **User Details**
  ![UserDetails](/src/assets/screenshots/user-details-dialog.jpeg)

- **Update User**
  ![UpdateUser](/src/assets/screenshots/update-user-dialog.jpeg)

- **Add User**
  ![AddUser](/src/assets/screenshots/add-user-dialog.jpeg)

- **Filter User**
  ![FilterUser](/src/assets/screenshots/filter-user.jpeg)

- **Delete User**
  ![DeleteUser](/src/assets/screenshots/delete-user-dialog.jpeg)

## Setup

1. Clone the repository to your local machine:

```bash
git clone https://github.com/furkanates07/user-management-with-angular.git
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the project:

```bash
ng serve -o
```

4. Access the app via your browser at `http://localhost:4200`.

## Contributing

Feel free to submit issues or pull requests if you find any bugs or want to add new features.
