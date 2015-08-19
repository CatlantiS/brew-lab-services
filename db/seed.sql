do $$
DECLARE row_count INTEGER DEFAULT 0;
BEGIN

<<<<<<< HEAD
IF NOT EXISTS  (SELECT 1 FROM users.users WHERE username='brewuser') THEN 
	INSERT INTO users.users(username, firstname, lastname, password, email)
	VALUES ('brewuser', 'brew','user',encode(digest('meow', 'SHA1'),'hex'),'brew@brew.com');
	GET DIAGNOSTICS row_count = ROW_COUNT;
END IF;
RAISE NOTICE 'Inserted % rows into users.users.',row_count;

row_count := 0;
IF NOT EXISTS (SELECT 1 FROM users.clients where id=1) THEN
	INSERT INTO users.clients(id,name,secret)
	VALUES (1,'Default Client', 'secret');
	GET DIAGNOSTICS row_count = ROW_COUNT;
END IF;
RAISE NOTICE 'Inserted % rows into users.clients.',row_count;

END;
$$