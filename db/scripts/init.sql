--
-- PostgreSQL database dump
--

-- Dumped from database version 17.9 (Debian 17.9-1.pgdg13+1)
-- Dumped by pg_dump version 17.5 (Homebrew)

-- Started on 2026-05-04 14:38:45 ADT
--
-- TOC entry 848 (class 1247 OID 16499)
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
-- TOC entry 218 (class 1259 OID 16511)
-- Name: incompletequotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incompletequotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fields json,
    ownerid uuid NOT NULL,
    estimate numeric,
    insurance_type public.insurance_type,
    date_submitted date DEFAULT CURRENT_DATE
);


--
-- TOC entry 217 (class 1259 OID 16505)
-- Name: quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    insurance_type public.insurance_type NOT NULL,
    date_submitted date DEFAULT CURRENT_DATE NOT NULL,
    estimate numeric NOT NULL,
    ownerid uuid NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16517)
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
-- TOC entry 3445 (class 0 OID 16511)
-- Dependencies: 218
-- Data for Name: incompletequotes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.incompletequotes VALUES ('fac615bf-11fe-4115-a270-003dca5ac451', '"{\"insurance_type\":\"home\",\"estimate\":15,\"ownerid\":\"565c6aca-76c0-4b2a-86f7-8e9eec85d0d1\"}"', '565c6aca-76c0-4b2a-86f7-8e9eec85d0d1', NULL, 'home', '2026-04-30');
INSERT INTO public.incompletequotes VALUES ('aecaa20e-ea4f-4e2e-99cb-5415d5432042', '"{\"insurance_type\":\"life\",\"estimate\":20,\"ownerid\":\"565c6aca-76c0-4b2a-86f7-8e9eec85d0d1\"}"', '565c6aca-76c0-4b2a-86f7-8e9eec85d0d1', NULL, 'life', '2026-04-30');
INSERT INTO public.incompletequotes VALUES ('d0fb5aae-9dcb-4e8a-8a46-b3d14dfd0765', '"{\"insurance_type\":\"life\",\"estimate\":25,\"ownerid\":\"6f53e2c1-8d46-4faa-a0de-d5b920b0fb9b\"}"', '6f53e2c1-8d46-4faa-a0de-d5b920b0fb9b', NULL, 'life', '2026-04-30');
INSERT INTO public.incompletequotes VALUES ('84a4738a-82ef-4248-bc84-27dce623ebc9', NULL, '6f53e2c1-8d46-4faa-a0de-d5b920b0fb9b', 10, 'automotive', '2026-04-30');


--
-- TOC entry 3444 (class 0 OID 16505)
-- Dependencies: 217
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quotes VALUES ('6466dd8f-7a10-4cc3-ab0e-4085945508a7', 'automotive', '2026-04-30', 58.25, '565c6aca-76c0-4b2a-86f7-8e9eec85d0d1');


--
-- TOC entry 3446 (class 0 OID 16517)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('d3eb9d8b-162d-4b51-8add-ce56a205636a', 'Elkeno', 'Jones', '1991-10-01', 'ej@mail.com');
INSERT INTO public.users VALUES ('565c6aca-76c0-4b2a-86f7-8e9eec85d0d1', 'Fabian', 'Ward', '1991-01-01', 'fw@mail.com');
INSERT INTO public.users VALUES ('6f53e2c1-8d46-4faa-a0de-d5b920b0fb9b', 'Khari', 'Wood', '1993-02-01', 'kw@mail.com');


--
-- TOC entry 3292 (class 2606 OID 16524)
-- Name: incompletequotes incomplete_quotes_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incompletequotes
    ADD CONSTRAINT incomplete_quotes_pk PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 16540)
-- Name: quotes quotes_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pk PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 16526)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 16528)
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (email);


--
-- TOC entry 3298 (class 2606 OID 16529)
-- Name: incompletequotes incompletequote_owner_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incompletequotes
    ADD CONSTRAINT incompletequote_owner_fk FOREIGN KEY (ownerid) REFERENCES public.users(id);


--
-- TOC entry 3297 (class 2606 OID 16534)
-- Name: quotes quote_owner_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quote_owner_fk FOREIGN KEY (ownerid) REFERENCES public.users(id);


-- Completed on 2026-05-04 14:38:45 ADT

--
-- PostgreSQL database dump complete
--

