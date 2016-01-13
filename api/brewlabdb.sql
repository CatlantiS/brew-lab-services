--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'LATIN1';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: definitions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA definitions;


ALTER SCHEMA definitions OWNER TO postgres;

--
-- Name: logs; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA logs;


ALTER SCHEMA logs OWNER TO postgres;

--
-- Name: recipes; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA recipes;


ALTER SCHEMA recipes OWNER TO postgres;

--
-- Name: users; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = definitions, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ingredient; Type: TABLE; Schema: definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE ingredient (
    name text NOT NULL,
    definition text,
    type text NOT NULL
);


ALTER TABLE ingredient OWNER TO postgres;

--
-- Name: hops; Type: TABLE; Schema: definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE hops (
    origin text
)
INHERITS (ingredient);


ALTER TABLE hops OWNER TO postgres;

--
-- Name: ingredient_type; Type: TABLE; Schema: definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE ingredient_type (
    name text NOT NULL,
    definition text
);


ALTER TABLE ingredient_type OWNER TO postgres;

--
-- Name: malt; Type: TABLE; Schema: definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE malt (
    origin text
)
INHERITS (ingredient);


ALTER TABLE malt OWNER TO postgres;

--
-- Name: units; Type: TABLE; Schema: definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE units (
    name text NOT NULL,
    definition text,
    type text NOT NULL
);


ALTER TABLE units OWNER TO postgres;

--
-- Name: yeast; Type: TABLE; Schema: definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE yeast (
    attenuation text,
    flocculation text
)
INHERITS (ingredient);


ALTER TABLE yeast OWNER TO postgres;

SET search_path = logs, pg_catalog;

--
-- Name: logs; Type: TABLE; Schema: logs; Owner: postgres; Tablespace: 
--

CREATE TABLE logs (
    id integer NOT NULL,
    utcdate timestamp without time zone,
    level character varying(50),
    url character varying(255),
    userid integer,
    message text
);


ALTER TABLE logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: logs; Owner: postgres
--

CREATE SEQUENCE logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: logs; Owner: postgres
--

ALTER SEQUENCE logs_id_seq OWNED BY logs.id;


SET search_path = recipes, pg_catalog;

--
-- Name: recipe; Type: TABLE; Schema: recipes; Owner: postgres; Tablespace: 
--

CREATE TABLE recipe (
    "recipeId" integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    volume numeric,
    units text
);


ALTER TABLE recipe OWNER TO postgres;

--
-- Name: recipe_ingredient; Type: TABLE; Schema: recipes; Owner: postgres; Tablespace: 
--

CREATE TABLE recipe_ingredient (
    "recipeIngredientId" integer NOT NULL,
    "recipeId" integer NOT NULL,
    ingredient text NOT NULL,
    type text NOT NULL,
    volume numeric,
    units text
);


ALTER TABLE recipe_ingredient OWNER TO postgres;

--
-- Name: recipe_ingredient_recipeIngredientId_seq; Type: SEQUENCE; Schema: recipes; Owner: postgres
--

CREATE SEQUENCE "recipe_ingredient_recipeIngredientId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "recipe_ingredient_recipeIngredientId_seq" OWNER TO postgres;

--
-- Name: recipe_ingredient_recipeIngredientId_seq; Type: SEQUENCE OWNED BY; Schema: recipes; Owner: postgres
--

ALTER SEQUENCE "recipe_ingredient_recipeIngredientId_seq" OWNED BY recipe_ingredient."recipeIngredientId";


--
-- Name: recipe_recipeId_seq; Type: SEQUENCE; Schema: recipes; Owner: postgres
--

CREATE SEQUENCE "recipe_recipeId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "recipe_recipeId_seq" OWNER TO postgres;

--
-- Name: recipe_recipeId_seq; Type: SEQUENCE OWNED BY; Schema: recipes; Owner: postgres
--

ALTER SEQUENCE "recipe_recipeId_seq" OWNED BY recipe."recipeId";


SET search_path = users, pg_catalog;

--
-- Name: clients; Type: TABLE; Schema: users; Owner: postgres; Tablespace: 
--

CREATE TABLE clients (
    id integer NOT NULL,
    name character varying(255),
    secret character varying(255)
);


ALTER TABLE clients OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: users; Owner: postgres; Tablespace: 
--

CREATE TABLE role (
    id integer NOT NULL,
    type text NOT NULL,
    name text NOT NULL
);


ALTER TABLE role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: users; Owner: postgres
--

CREATE SEQUENCE role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: postgres
--

ALTER SEQUENCE role_id_seq OWNED BY role.id;


--
-- Name: role_type; Type: TABLE; Schema: users; Owner: postgres; Tablespace: 
--

CREATE TABLE role_type (
    type text NOT NULL,
    definition text,
    "isAdmin" boolean
);


ALTER TABLE role_type OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: users; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    username character varying(255),
    firstname character varying(255),
    lastname character varying(255),
    password character varying(255),
    email character varying(255),
    role text
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: users; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


SET search_path = logs, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: logs; Owner: postgres
--

ALTER TABLE ONLY logs ALTER COLUMN id SET DEFAULT nextval('logs_id_seq'::regclass);


SET search_path = recipes, pg_catalog;

--
-- Name: recipeId; Type: DEFAULT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe ALTER COLUMN "recipeId" SET DEFAULT nextval('"recipe_recipeId_seq"'::regclass);


--
-- Name: recipeIngredientId; Type: DEFAULT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe_ingredient ALTER COLUMN "recipeIngredientId" SET DEFAULT nextval('"recipe_ingredient_recipeIngredientId_seq"'::regclass);


SET search_path = users, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY role ALTER COLUMN id SET DEFAULT nextval('role_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


SET search_path = definitions, pg_catalog;

--
-- Name: hops_name_pkey; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY hops
    ADD CONSTRAINT hops_name_pkey PRIMARY KEY (name);


--
-- Name: ingredientType_name_pkey; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ingredient_type
    ADD CONSTRAINT "ingredientType_name_pkey" PRIMARY KEY (name);


--
-- Name: ingredient_ingredient_type_unique; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ingredient
    ADD CONSTRAINT ingredient_ingredient_type_unique UNIQUE (name, type);


--
-- Name: ingredient_name_pkey; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ingredient
    ADD CONSTRAINT ingredient_name_pkey PRIMARY KEY (name);


--
-- Name: malt_name_pkey; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY malt
    ADD CONSTRAINT malt_name_pkey PRIMARY KEY (name);


--
-- Name: units_name_pkey; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY units
    ADD CONSTRAINT units_name_pkey PRIMARY KEY (name);


--
-- Name: yeast_name_pkey; Type: CONSTRAINT; Schema: definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY yeast
    ADD CONSTRAINT yeast_name_pkey PRIMARY KEY (name);


SET search_path = logs, pg_catalog;

--
-- Name: logs_pkey; Type: CONSTRAINT; Schema: logs; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


SET search_path = recipes, pg_catalog;

--
-- Name: recipeIngredient_recipeIngredientId_pkey; Type: CONSTRAINT; Schema: recipes; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY recipe_ingredient
    ADD CONSTRAINT "recipeIngredient_recipeIngredientId_pkey" PRIMARY KEY ("recipeIngredientId");


--
-- Name: recipe_recipeId_pkey; Type: CONSTRAINT; Schema: recipes; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY recipe
    ADD CONSTRAINT "recipe_recipeId_pkey" PRIMARY KEY ("recipeId");


SET search_path = users, pg_catalog;

--
-- Name: clients_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: roleType_type_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY role_type
    ADD CONSTRAINT "roleType_type_pkey" PRIMARY KEY (type);


--
-- Name: role_id_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_id_pkey PRIMARY KEY (id);


--
-- Name: role_name_unique; Type: CONSTRAINT; Schema: users; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_name_unique UNIQUE (name);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: fki_role_name_fkey; Type: INDEX; Schema: users; Owner: postgres; Tablespace: 
--

CREATE INDEX fki_role_name_fkey ON users USING btree (role);


SET search_path = definitions, pg_catalog;

--
-- Name: ingredient_type_fkey; Type: FK CONSTRAINT; Schema: definitions; Owner: postgres
--

ALTER TABLE ONLY ingredient
    ADD CONSTRAINT ingredient_type_fkey FOREIGN KEY (type) REFERENCES ingredient_type(name);


SET search_path = logs, pg_catalog;

--
-- Name: userid_id_fkey; Type: FK CONSTRAINT; Schema: logs; Owner: postgres
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT userid_id_fkey FOREIGN KEY (userid) REFERENCES users.users(id);


SET search_path = recipes, pg_catalog;

--
-- Name: recipeIngredient_recipeId_fkey; Type: FK CONSTRAINT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe_ingredient
    ADD CONSTRAINT "recipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES recipe("recipeId");


--
-- Name: recipeIngredient_type_fkey; Type: FK CONSTRAINT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe_ingredient
    ADD CONSTRAINT "recipeIngredient_type_fkey" FOREIGN KEY (type) REFERENCES definitions.ingredient_type(name);


--
-- Name: recipeIngredient_units_fkey; Type: FK CONSTRAINT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe_ingredient
    ADD CONSTRAINT "recipeIngredient_units_fkey" FOREIGN KEY (units) REFERENCES definitions.units(name);


--
-- Name: recipe_units_fkey; Type: FK CONSTRAINT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe
    ADD CONSTRAINT recipe_units_fkey FOREIGN KEY (units) REFERENCES definitions.units(name);


--
-- Name: recipe_userId_fkey; Type: FK CONSTRAINT; Schema: recipes; Owner: postgres
--

ALTER TABLE ONLY recipe
    ADD CONSTRAINT "recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES users.users(id);


SET search_path = users, pg_catalog;

--
-- Name: roleType_type_fkey; Type: FK CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY role
    ADD CONSTRAINT "roleType_type_fkey" FOREIGN KEY (type) REFERENCES role_type(type);


--
-- Name: role_name_fkey; Type: FK CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT role_name_fkey FOREIGN KEY (role) REFERENCES role(name);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

