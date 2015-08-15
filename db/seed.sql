INSERT INTO users.users(username, firstname, lastname, password, email)
VALUES ('brewuser', 'brew','user',encode(digest('meow', 'SHA1'),'hex'),'brew@brew.com');

INSERT INTO users.clients(clientId,name,secret)
VALUES (1,'Default Client', 'secret');