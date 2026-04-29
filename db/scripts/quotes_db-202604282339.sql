--
-- PostgreSQL database dump
--

-- Dumped from database version 17.9 (Debian 17.9-1.pgdg13+1)
-- Dumped by pg_dump version 17.5 (Homebrew)

-- Started on 2026-04-28 23:39:09 ADT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE quotes_db;
--
-- TOC entry 3448 (class 1262 OID 16384)
-- Name: quotes_db; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE quotes_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\connect quotes_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 848 (class 1247 OID 16390)
-- Name: insurance_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.insurance_type AS ENUM (
    'automotive',
    'home',
    'life'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16408)
-- Name: Quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quotes" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    insurance_type public.insurance_type NOT NULL,
    date_submitted date NOT NULL,
    estimate numeric NOT NULL,
    ownerid uuid NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16400)
-- Name: incompletequotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incompletequotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fields json,
    ownerid uuid NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16428)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fname character varying NOT NULL,
    lname character varying NOT NULL,
    dob date NOT NULL,
    email text NOT NULL
);


--
-- TOC entry 3441 (class 0 OID 16408)
-- Dependencies: 218
-- Data for Name: Quotes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3440 (class 0 OID 16400)
-- Dependencies: 217
-- Data for Name: incompletequotes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3442 (class 0 OID 16428)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('d3eb9d8b-162d-4b51-8add-ce56a205636a', 'Elkeno', 'Jones', '1991-10-01', 'ej@mail.com');
INSERT INTO public.users VALUES ('565c6aca-76c0-4b2a-86f7-8e9eec85d0d1', 'Fabian', 'Ward', '1991-01-01', 'fw@mail.com');
INSERT INTO public.users VALUES ('6f53e2c1-8d46-4faa-a0de-d5b920b0fb9b', 'Khari', 'Wood', '1993-02-01', 'kw@mail.com');


--
-- TOC entry 3288 (class 2606 OID 16407)
-- Name: incompletequotes incomplete_quotes_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incompletequotes
    ADD CONSTRAINT incomplete_quotes_pk PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 16435)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 16447)
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (email);


--
-- TOC entry 3293 (class 2606 OID 16441)
-- Name: incompletequotes incompletequote_owner_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incompletequotes
    ADD CONSTRAINT incompletequote_owner_fk FOREIGN KEY (ownerid) REFERENCES public.users(id);


--
-- TOC entry 3294 (class 2606 OID 16436)
-- Name: Quotes quote_owner_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quotes"
    ADD CONSTRAINT quote_owner_fk FOREIGN KEY (ownerid) REFERENCES public.users(id);


-- Completed on 2026-04-28 23:39:09 ADT

--
-- PostgreSQL database dump complete
--

