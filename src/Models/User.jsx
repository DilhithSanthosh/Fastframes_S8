export const User = {
    name: "User",
    email: "user@gmail.com",
    password: "password",
    userId: "1234567890",
    // add other properties here
};

export const setUserData = (name, email, password, userId) => {
    User.name = name;
    User.email = email;
    User.password = password;
    User.userId = userId;
    // add other properties here

    return User;
};