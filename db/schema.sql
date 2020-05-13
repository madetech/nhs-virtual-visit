--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hospitals (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    trust_id integer NOT NULL
);




--
-- Name: hospitals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hospitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: hospitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hospitals_id_seq OWNED BY public.hospitals.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);



--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: scheduled_calls_table; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scheduled_calls_table (
    id integer NOT NULL,
    patient_name text,
    call_time timestamp with time zone,
    recipient_number text,
    call_id text,
    provider character varying(255) DEFAULT 'jitsi'::character varying NOT NULL,
    recipient_name character varying(255),
    ward_id integer NOT NULL,
    call_password character varying(255) DEFAULT ''::character varying NOT NULL
);


--
-- Name: scheduled_calls_table_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scheduled_calls_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scheduled_calls_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scheduled_calls_table_id_seq OWNED BY public.scheduled_calls_table.id;


--
-- Name: trusts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trusts (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    admin_code character varying(255) NOT NULL
);



--
-- Name: trusts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trusts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trusts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trusts_id_seq OWNED BY public.trusts.id;


--
-- Name: ward_visit_totals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ward_visit_totals (
    id integer NOT NULL,
    ward_id integer NOT NULL,
    total_date date NOT NULL,
    total integer NOT NULL
);


--
-- Name: ward_visit_totals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ward_visit_totals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ward_visit_totals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ward_visit_totals_id_seq OWNED BY public.ward_visit_totals.id;


--
-- Name: wards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wards (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    hospital_name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    trust_id integer
);


--
-- Name: wards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wards_id_seq OWNED BY public.wards.id;


--
-- Name: hospitals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospitals ALTER COLUMN id SET DEFAULT nextval('public.hospitals_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: scheduled_calls_table id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_calls_table ALTER COLUMN id SET DEFAULT nextval('public.scheduled_calls_table_id_seq'::regclass);


--
-- Name: trusts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusts ALTER COLUMN id SET DEFAULT nextval('public.trusts_id_seq'::regclass);


--
-- Name: ward_visit_totals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward_visit_totals ALTER COLUMN id SET DEFAULT nextval('public.ward_visit_totals_id_seq'::regclass);


--
-- Name: wards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards ALTER COLUMN id SET DEFAULT nextval('public.wards_id_seq'::regclass);


--
-- Name: scheduled_calls_table call_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_calls_table
    ADD CONSTRAINT call_id_unique UNIQUE (call_id);


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: scheduled_calls_table scheduled_calls_table_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_calls_table
    ADD CONSTRAINT scheduled_calls_table_pkey PRIMARY KEY (id);


--
-- Name: trusts trusts_admin_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusts
    ADD CONSTRAINT trusts_admin_code_key UNIQUE (admin_code);


--
-- Name: trusts trusts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusts
    ADD CONSTRAINT trusts_pkey PRIMARY KEY (id);


--
-- Name: hospitals unq_hospital_trust; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT unq_hospital_trust UNIQUE (trust_id, name);


--
-- Name: ward_visit_totals unq_ward_date; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward_visit_totals
    ADD CONSTRAINT unq_ward_date UNIQUE (ward_id, total_date);


--
-- Name: ward_visit_totals ward_visit_totals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward_visit_totals
    ADD CONSTRAINT ward_visit_totals_pkey PRIMARY KEY (id);


--
-- Name: wards wards_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_code_key UNIQUE (code);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (id);


--
-- Name: hospitals hospitals_trust_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_trust_id_fkey FOREIGN KEY (trust_id) REFERENCES public.trusts(id);


--
-- Name: scheduled_calls_table scheduled_calls_table_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_calls_table
    ADD CONSTRAINT scheduled_calls_table_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.wards(id);


--
-- Name: ward_visit_totals ward_visit_totals_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward_visit_totals
    ADD CONSTRAINT ward_visit_totals_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.wards(id);


--
-- Name: wards wards_trust_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_trust_id_fkey FOREIGN KEY (trust_id) REFERENCES public.trusts(id);


--
-- PostgreSQL database dump complete
--

