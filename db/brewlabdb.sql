--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE EXTENSION pgcrypto;

CREATE SCHEMA users;

SET search_path = users, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

ALTER SCHEMA users OWNER TO postgres;

CREATE TABLE users.users 
(
	id serial primary key,
	username varchar(255),
	firstname varchar(255),
	lastname varchar(255),
	password varchar(255),
	email varchar(255)
);



--
-- Name: Application; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Application";


ALTER SCHEMA "Application" OWNER TO postgres;

--
-- Name: Definitions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Definitions";


ALTER SCHEMA "Definitions" OWNER TO postgres;

--
-- Name: Recipes; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Recipes";


ALTER SCHEMA "Recipes" OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = "Application", pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: User; Type: TABLE; Schema: Application; Owner: postgres; Tablespace: 
--

CREATE TABLE "User" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE "User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: Application; Owner: postgres
--

CREATE SEQUENCE "User_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: Application; Owner: postgres
--

ALTER SEQUENCE "User_id_seq" OWNED BY "User".id;


SET search_path = "Definitions", pg_catalog;

--
-- Name: Units; Type: TABLE; Schema: Definitions; Owner: postgres; Tablespace: 
--

CREATE TABLE "Units" (
    name text NOT NULL,
    definition text
);


ALTER TABLE "Units" OWNER TO postgres;

SET search_path = "Recipes", pg_catalog;

--
-- Name: Recipe; Type: TABLE; Schema: Recipes; Owner: postgres; Tablespace: 
--

CREATE TABLE "Recipe" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    volume numeric,
    units text,
    "yeastType" text
);


ALTER TABLE "Recipe" OWNER TO postgres;

--
-- Name: RecipeVersion; Type: TABLE; Schema: Recipes; Owner: postgres; Tablespace: 
--

CREATE TABLE "RecipeVersion" (
    "versionDate" date NOT NULL
)
INHERITS ("Recipe");


ALTER TABLE "RecipeVersion" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE; Schema: Recipes; Owner: postgres
--

CREATE SEQUENCE "Recipe_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Recipe_id_seq" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: Recipes; Owner: postgres
--

ALTER SEQUENCE "Recipe_id_seq" OWNED BY "Recipe".id;


SET search_path = "Application", pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: Application; Owner: postgres
--

ALTER TABLE ONLY "User" ALTER COLUMN id SET DEFAULT nextval('"User_id_seq"'::regclass);


SET search_path = "Recipes", pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: Recipes; Owner: postgres
--

ALTER TABLE ONLY "Recipe" ALTER COLUMN id SET DEFAULT nextval('"Recipe_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: Recipes; Owner: postgres
--

ALTER TABLE ONLY "RecipeVersion" ALTER COLUMN id SET DEFAULT nextval('"Recipe_id_seq"'::regclass);


SET search_path = "Application", pg_catalog;

--
-- Name: user_id_pkey; Type: CONSTRAINT; Schema: Application; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT user_id_pkey PRIMARY KEY (id);


--
-- Name: user_name_key; Type: CONSTRAINT; Schema: Application; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT user_name_key UNIQUE (name);


SET search_path = "Definitions", pg_catalog;

--
-- Name: units_name_pk; Type: CONSTRAINT; Schema: Definitions; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Units"
    ADD CONSTRAINT units_name_pk PRIMARY KEY (name);


SET search_path = "Recipes", pg_catalog;

--
-- Name: recipe_id_pkey; Type: CONSTRAINT; Schema: Recipes; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Recipe"
    ADD CONSTRAINT recipe_id_pkey PRIMARY KEY (id);


--
-- Name: recipeversion_id_pkey; Type: CONSTRAINT; Schema: Recipes; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "RecipeVersion"
    ADD CONSTRAINT recipeversion_id_pkey PRIMARY KEY (id);


--
-- Name: recipeversion_versionDate_key; Type: CONSTRAINT; Schema: Recipes; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "RecipeVersion"
    ADD CONSTRAINT "recipeversion_versionDate_key" UNIQUE ("versionDate");


--
-- Name: recipe_units_fkey; Type: FK CONSTRAINT; Schema: Recipes; Owner: postgres
--

ALTER TABLE ONLY "Recipe"
    ADD CONSTRAINT recipe_units_fkey FOREIGN KEY (units) REFERENCES "Definitions"."Units"(name);


--
-- Name: recipe_userId_fkey; Type: FK CONSTRAINT; Schema: Recipes; Owner: postgres
--

ALTER TABLE ONLY "Recipe"
    ADD CONSTRAINT "recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Application"."User"(id);


--
-- Name: recipeversion_units_fkey; Type: FK CONSTRAINT; Schema: Recipes; Owner: postgres
--

ALTER TABLE ONLY "RecipeVersion"
    ADD CONSTRAINT recipeversion_units_fkey FOREIGN KEY (units) REFERENCES "Definitions"."Units"(name);


--
-- Name: recipeversion_userId_fkey; Type: FK CONSTRAINT; Schema: Recipes; Owner: postgres
--

ALTER TABLE ONLY "RecipeVersion"
    ADD CONSTRAINT "recipeversion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Application"."User"(id);


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

