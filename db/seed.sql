do $$
DECLARE row_count INTEGER DEFAULT 0;
BEGIN

row_count := 0;
IF NOT EXISTS  (SELECT 1 FROM users.users WHERE username='brewuser') THEN 
	INSERT INTO users.users(username, firstname, lastname, password, email)
	VALUES ('brewuser', 'brew','user','$2a$10$BhAAnfQFra3h/AwC5V0Mj.u7cUI6AZLiKQKJRUKxWUiJMHuSIFioa','brew@brew.com'); -- password is meow, encrypted and salted with bcrypt
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

row_count := 0;
IF NOT EXISTS (SELECT 1 FROM "Definitions"."Units" where name='Gallons') THEN
	INSERT INTO "Definitions"."Units"(name)
	VALUES('Gallons');
	GET DIAGNOSTICS row_count = ROW_COUNT;
END IF;
RAISE NOTICE 'Inserted % rows into Definitions.Units.',row_count;

row_count := 0;
IF NOT EXISTS (SELECT 1 FROM "Definitions"."Units" where name='Liters') THEN
	INSERT INTO "Definitions"."Units"(name)
	VALUES('Liters');
	GET DIAGNOSTICS row_count = ROW_COUNT;
END IF;
RAISE NOTICE 'Inserted % rows into Definitions.Units.',row_count;

END;
$$