--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-25 16:06:22

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
-- TOC entry 228 (class 1255 OID 91807)
-- Name: check_fechas_horarios(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_fechas_horarios() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
  IF NEW.fecha_hora_fin < NEW.fecha_hora_inicio THEN
    RAISE EXCEPTION 'FECHA FIN INFERIOR';
  END IF;
  RETURN NEW;
END;$$;


ALTER FUNCTION public.check_fechas_horarios() OWNER TO postgres;

--
-- TOC entry 240 (class 1255 OID 91815)
-- Name: obtener_parents(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_parents(p_id_clasificacion integer) RETURNS TABLE(id_clasificacion integer, nombre character varying, descripcion character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_current_id INTEGER := p_id_clasificacion;
BEGIN
    WHILE v_current_id IS NOT NULL LOOP
        RETURN QUERY
        SELECT c.id_clasificacion, c.nombre, c.descripcion --, c.parent_id
        FROM public.clasificacion c
        WHERE c.id_clasificacion = v_current_id;

        SELECT d.parent_id INTO v_current_id
        FROM public.clasificacion d
        WHERE d.id_clasificacion = v_current_id;
    END LOOP;
END;
$$;


ALTER FUNCTION public.obtener_parents(p_id_clasificacion integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 91631)
-- Name: auditorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditorias (
    id_auditoria integer NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    ip character varying,
    descripcion character varying,
    id_persona bigint NOT NULL,
    id_evento bigint NOT NULL
);


ALTER TABLE public.auditorias OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 91636)
-- Name: auditorias_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditorias_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditorias_id_auditoria_seq OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 218
-- Name: auditorias_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditorias_id_auditoria_seq OWNED BY public.auditorias.id_auditoria;


--
-- TOC entry 219 (class 1259 OID 91637)
-- Name: clasificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clasificacion (
    id_clasificacion integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying,
    imagen character varying,
    orden character varying,
    type_id bigint,
    parent_id bigint,
    id_icono bigint,
    adicional json
);


ALTER TABLE public.clasificacion OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 91642)
-- Name: clasificacion_id_clasificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clasificacion_id_clasificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clasificacion_id_clasificacion_seq OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 220
-- Name: clasificacion_id_clasificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clasificacion_id_clasificacion_seq OWNED BY public.clasificacion.id_clasificacion;


--
-- TOC entry 221 (class 1259 OID 91643)
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id_curso integer NOT NULL,
    id_nombre bigint NOT NULL,
    id_type bigint,
    id_status bigint,
    duracion double precision,
    descripcion_corto character varying,
    descripcion_html character varying,
    costo double precision NOT NULL,
    codigo character varying NOT NULL,
    id_facilitador bigint,
    id_foto bigint,
    id_modalidad bigint NOT NULL,
    id_forma_pago bigint,
    fecha_hora_inicio timestamp without time zone,
    fecha_hora_fin timestamp without time zone,
    color character varying
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 91648)
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_id_curso_seq OWNER TO postgres;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 222
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_curso_seq OWNED BY public.cursos.id_curso;


--
-- TOC entry 223 (class 1259 OID 91649)
-- Name: documentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos (
    id_documento integer NOT NULL,
    id_tipo bigint NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    url character varying,
    descripcion character varying NOT NULL
);


ALTER TABLE public.documentos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 91654)
-- Name: documentos_id_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documentos_id_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documentos_id_documento_seq OWNER TO postgres;

--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 224
-- Name: documentos_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_id_documento_seq OWNED BY public.documentos.id_documento;


--
-- TOC entry 227 (class 1259 OID 91783)
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    id_curso bigint NOT NULL,
    fecha_hora_inicio timestamp without time zone NOT NULL,
    fecha_hora_fin timestamp without time zone NOT NULL,
    "observación" character varying
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 91655)
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    id_persona integer NOT NULL,
    nombre character varying NOT NULL,
    apellido character varying NOT NULL,
    telefono character varying NOT NULL,
    "contraseña" character varying NOT NULL,
    id_genero bigint NOT NULL,
    id_pregunta bigint NOT NULL,
    cedula character varying NOT NULL,
    gmail character varying NOT NULL,
    id_foto bigint,
    id_status bigint,
    respuesta character varying NOT NULL,
    id_rol json
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 91660)
-- Name: personas_id_persona_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personas_id_persona_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personas_id_persona_seq OWNER TO postgres;

--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 226
-- Name: personas_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personas_id_persona_seq OWNED BY public.personas.id_persona;


--
-- TOC entry 4667 (class 2604 OID 91661)
-- Name: auditorias id_auditoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_id_auditoria_seq'::regclass);


--
-- TOC entry 4668 (class 2604 OID 91662)
-- Name: clasificacion id_clasificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion ALTER COLUMN id_clasificacion SET DEFAULT nextval('public.clasificacion_id_clasificacion_seq'::regclass);


--
-- TOC entry 4669 (class 2604 OID 91663)
-- Name: cursos id_curso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id_curso SET DEFAULT nextval('public.cursos_id_curso_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 91664)
-- Name: documentos id_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id_documento SET DEFAULT nextval('public.documentos_id_documento_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 91665)
-- Name: personas id_persona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas ALTER COLUMN id_persona SET DEFAULT nextval('public.personas_id_persona_seq'::regclass);


--
-- TOC entry 4852 (class 0 OID 91631)
-- Dependencies: 217
-- Data for Name: auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditorias (id_auditoria, fecha_hora, ip, descripcion, id_persona, id_evento) FROM stdin;
\.


--
-- TOC entry 4854 (class 0 OID 91637)
-- Dependencies: 219
-- Data for Name: clasificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clasificacion (id_clasificacion, nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional) FROM stdin;
53	aaafaWifi		\N	\N	27	\N	53	\N
56	aaafaMars		\N	\N	27	\N	56	\N
13	Participante Externo	\N	\N	\N	3	15	\N	\N
110	Carreras		\N	\N	\N	\N	9503	\N
28	aaafaVenusMars	\N	\N	\N	27	\N	28	\N
8	Preguntas		\N	\N	\N	\N	9320	\N
14	Personal IUJO	\N	\N	\N	3	11	\N	\N
108	Desarrollo web creativo: HTML, CSS y JAVASCRIPT		\N	\N	5	61	8991	\N
100004	faMapLocationDot	xx	\N	\N	27	\N	100004	\N
120	Ventana Principal		\N	\N	73	73	\N	\N
84	Cual es tu comida favorita?		\N	\N	8	\N	\N	\N
111	Informatica		\N	0	110	\N	102	\N
57	Cual es tu pelicula favorita?		\N	\N	8	\N	\N	\N
113	Contaduria		\N	0	110	\N	102	\N
114	Electronica		\N	0	110	\N	102	\N
115	Electrotecnia		\N	0	110	\N	102	\N
112	 Administración 		\N	\N	110	\N	102	\N
122	Estado	Lista de Estados de Venezuela	\N	\N	\N	\N	100004	\N
124	Parroquias	Lista de Parroquias de Venezuela	\N	\N	\N	\N	100005	\N
29	aaafaUser	\N	\N	\N	27	\N	29	\N
61	Oficio Tecnológico emergente	estos son progrmas	\N	\N	4	4	8414	\N
30	aaafaUncharted	\N	\N	\N	27	\N	30	\N
6	Masculino	sexo masculino	\N	\N	1	\N	9053	\N
3	Rol		\N	\N	\N	\N	9751	\N
4	Programas		\N	\N	\N	\N	9503	\N
5	Cursos	\N	\N	\N	\N	4	9019	\N
109	Mantenimiento y Reparación de PC		\N	\N	5	61	9873	\N
12	Estudiante IUJO	\N	\N	\N	3	11	9772	\N
8065	faArrowLeft		\N	\N	27	\N	8065	\N
8066	faArrowLeftLong		\N	\N	27	\N	8066	\N
27	Íconos		\N	\N	\N	\N	8926	\N
123	Municipios	Lista de Municipios de Venezuela	\N	\N	\N	\N	9048	\N
1	Géneros		\N	\N	\N	\N	9792	\N
100	Menú de Configuracion		\N	\N	73	73	\N	\N
54	Cisco Academy 		\N	\N	4	4	8657	\N
10001	Amazonas		\N	\N	122	122	\N	\N
15	Super Administrador	Tiene acceso a todo el sistema	\N	\N	3	\N	97	{"id_objeto":[] }
7	Femenino	sexo femenino	\N	\N	1	\N	9790	\N
73	Objetos		\N	\N	\N	\N	9768	\N
8067	faArrowPointer		\N	\N	27	\N	8067	\N
96	Facilitador	Tiene acceso a ver los cursos que da	\N	\N	3	\N	95	{"id_objeto":[100067,100068] }
8068	faArrowRight		\N	\N	27	\N	8068	\N
11	Participante 	Tiene acceso solo a participar a los cursos \n	\N	\N	3	\N	9503	{"id_objeto":[100] }
98	Administrador	Tiene acceso a los programas y cursos	\N	\N	3	\N	\N	\N
107	Aprende a programar en Python desde cero, con VSCode		\N	\N	5	61	8438	\N
33	aaafaGraduationCap	\N	\N	\N	27	\N	33	\N
9	Cual es tu Animal favorito?		\N	\N	8	\N	\N	\N
8069	faArrowRightArrowLeft		\N	\N	27	\N	8069	\N
8070	faArrowRightFromBracket		\N	\N	27	\N	8070	\N
8071	faArrowRightLong		\N	\N	27	\N	8071	\N
8072	faArrowRightToBracket		\N	\N	27	\N	8072	\N
8073	faArrowRightToCity		\N	\N	27	\N	8073	\N
8074	faArrowRotateLeft		\N	\N	27	\N	8074	\N
8075	faArrowRotateRight		\N	\N	27	\N	8075	\N
8076	faArrowTrendDown		\N	\N	27	\N	8076	\N
34	aaafaMapLocation	\N	\N	\N	27	\N	34	\N
35	aaafaIcons	\N	\N	\N	27	\N	35	\N
10002	Anzoátegui		\N	\N	122	\N	\N	\N
10003	Apure		\N	\N	122	\N	\N	\N
8077	faArrowTrendUp		\N	\N	27	\N	8077	\N
10004	Aragua		\N	\N	122	\N	\N	\N
10005	Barinas		\N	\N	122	\N	\N	\N
10006	Bolívar		\N	\N	122	\N	\N	\N
10007	Carabobo		\N	\N	122	\N	\N	\N
10008	Cojedes		\N	\N	122	\N	\N	\N
10009	Delta Amacuro		\N	\N	122	\N	\N	\N
10010	Falcón		\N	\N	122	\N	\N	\N
10011	Guárico		\N	\N	122	\N	\N	\N
10012	Lara		\N	\N	122	\N	\N	\N
10013	Mérida		\N	\N	122	\N	\N	\N
10014	Miranda		\N	\N	122	\N	\N	\N
10015	Monagas		\N	\N	122	\N	\N	\N
10016	Nueva Esparta		\N	\N	122	\N	\N	\N
10017	Portuguesa		\N	\N	122	\N	\N	\N
10018	Sucre		\N	\N	122	\N	\N	\N
10019	Táchira		\N	\N	122	\N	\N	\N
8078	faArrowTurnDown		\N	\N	27	\N	8078	\N
8079	faArrowTurnUp		\N	\N	27	\N	8079	\N
8080	faArrowUp		\N	\N	27	\N	8080	\N
8081	faArrowUp19		\N	\N	27	\N	8081	\N
8082	faArrowUp91		\N	\N	27	\N	8082	\N
40	aaafaSquareBinary	\N	\N	\N	27	\N	40	\N
41	aaafaListCheck	\N	\N	\N	27	\N	41	\N
42	aaafaQuestion	\N	\N	\N	27	\N	42	\N
43	aaafaFemale		\N	\N	27	\N	43	\N
95	aaafaChalkboardUser		\N	\N	27	\N	95	\N
97	aaafaUserTie		\N	\N	27	\N	97	\N
10020	Trujillo		\N	\N	122	\N	\N	\N
10021	Vargas		\N	\N	122	\N	\N	\N
10022	Yaracuy		\N	\N	122	\N	\N	\N
10023	Zulia		\N	\N	122	\N	\N	\N
10024	Distrito Capital		\N	\N	122	\N	\N	\N
10025	Dependencias Federales		\N	\N	122	\N	\N	\N
30001	Alto Orinoco		\N	\N	123	10001	\N	\N
30002	Atabapo		\N	\N	123	10001	\N	\N
30003	Atures		\N	\N	123	10001	\N	\N
30004	Autana		\N	\N	123	10001	\N	\N
30005	Manapiare		\N	\N	123	10001	\N	\N
30006	Maroa		\N	\N	123	10001	\N	\N
30007	Río Negro		\N	\N	123	10001	\N	\N
30008	Anaco		\N	\N	123	10002	\N	\N
30009	Aragua		\N	\N	123	10002	\N	\N
30010	Manuel Ezequiel Bruzual		\N	\N	123	10002	\N	\N
30011	Diego Bautista Urbaneja		\N	\N	123	10002	\N	\N
30012	Fernando Peñalver		\N	\N	123	10002	\N	\N
30013	Francisco Del Carmen Carvajal		\N	\N	123	10002	\N	\N
30014	General Sir Arthur McGregor		\N	\N	123	10002	\N	\N
30015	Guanta		\N	\N	123	10002	\N	\N
30016	Independencia		\N	\N	123	10002	\N	\N
30017	José Gregorio Monagas		\N	\N	123	10002	\N	\N
30018	Juan Antonio Sotillo		\N	\N	123	10002	\N	\N
30019	Juan Manuel Cajigal		\N	\N	123	10002	\N	\N
30020	Libertad		\N	\N	123	10002	\N	\N
30021	Francisco de Miranda		\N	\N	123	10002	\N	\N
30022	Pedro María Freites		\N	\N	123	10002	\N	\N
30023	Píritu		\N	\N	123	10002	\N	\N
30024	San José de Guanipa		\N	\N	123	10002	\N	\N
30025	San Juan de Capistrano		\N	\N	123	10002	\N	\N
30026	Santa Ana		\N	\N	123	10002	\N	\N
30027	Simón Bolívar		\N	\N	123	10002	\N	\N
30028	Simón Rodríguez		\N	\N	123	10002	\N	\N
30029	Achaguas		\N	\N	123	10003	\N	\N
30030	Biruaca		\N	\N	123	10003	\N	\N
30031	Muñóz		\N	\N	123	10003	\N	\N
30032	Páez		\N	\N	123	10003	\N	\N
30033	Pedro Camejo		\N	\N	123	10003	\N	\N
30034	Rómulo Gallegos		\N	\N	123	10003	\N	\N
30035	San Fernando		\N	\N	123	10003	\N	\N
30036	Atanasio Girardot		\N	\N	123	10004	\N	\N
30037	Bolívar		\N	\N	123	10004	\N	\N
30038	Camatagua		\N	\N	123	10004	\N	\N
30039	Francisco Linares Alcántara		\N	\N	123	10004	\N	\N
30040	José Ángel Lamas		\N	\N	123	10004	\N	\N
30041	José Félix Ribas		\N	\N	123	10004	\N	\N
30042	José Rafael Revenga		\N	\N	123	10004	\N	\N
30043	Libertador		\N	\N	123	10004	\N	\N
30044	Mario Briceño Iragorry		\N	\N	123	10004	\N	\N
30045	Ocumare de la Costa de Oro		\N	\N	123	10004	\N	\N
30046	San Casimiro		\N	\N	123	10004	\N	\N
30047	San Sebastián		\N	\N	123	10004	\N	\N
30048	Santiago Mariño		\N	\N	123	10004	\N	\N
30049	Santos Michelena		\N	\N	123	10004	\N	\N
30050	Sucre		\N	\N	123	10004	\N	\N
30051	Tovar		\N	\N	123	10004	\N	\N
30052	Urdaneta		\N	\N	123	10004	\N	\N
30053	Zamora		\N	\N	123	10004	\N	\N
30054	Alberto Arvelo Torrealba		\N	\N	123	10005	\N	\N
30055	Andrés Eloy Blanco		\N	\N	123	10005	\N	\N
30056	Antonio José de Sucre		\N	\N	123	10005	\N	\N
30057	Arismendi		\N	\N	123	10005	\N	\N
30058	Barinas		\N	\N	123	10005	\N	\N
30059	Bolívar		\N	\N	123	10005	\N	\N
30060	Cruz Paredes		\N	\N	123	10005	\N	\N
30061	Ezequiel Zamora		\N	\N	123	10005	\N	\N
30062	Obispos		\N	\N	123	10005	\N	\N
30063	Pedraza		\N	\N	123	10005	\N	\N
30064	Rojas		\N	\N	123	10005	\N	\N
30065	Sosa		\N	\N	123	10005	\N	\N
30066	Caroní		\N	\N	123	10006	\N	\N
30067	Cedeño		\N	\N	123	10006	\N	\N
30068	El Callao		\N	\N	123	10006	\N	\N
30069	Gran Sabana		\N	\N	123	10006	\N	\N
30070	Heres		\N	\N	123	10006	\N	\N
30071	Piar		\N	\N	123	10006	\N	\N
30072	Angostura Raúl Leoni		\N	\N	123	10006	\N	\N
30073	Roscio		\N	\N	123	10006	\N	\N
30074	Sifontes		\N	\N	123	10006	\N	\N
30075	Sucre		\N	\N	123	10006	\N	\N
30076	Padre Pedro Chien		\N	\N	123	10006	\N	\N
30077	Bejuma		\N	\N	123	10007	\N	\N
30078	Carlos Arvelo		\N	\N	123	10007	\N	\N
30079	Diego Ibarra		\N	\N	123	10007	\N	\N
30080	Guacara		\N	\N	123	10007	\N	\N
30081	Juan José Mora		\N	\N	123	10007	\N	\N
30082	Libertador		\N	\N	123	10007	\N	\N
30083	Los Guayos		\N	\N	123	10007	\N	\N
30084	Miranda		\N	\N	123	10007	\N	\N
30085	Montalbán		\N	\N	123	10007	\N	\N
30086	Naguanagua		\N	\N	123	10007	\N	\N
30087	Puerto Cabello		\N	\N	123	10007	\N	\N
30088	San Diego		\N	\N	123	10007	\N	\N
30089	San Joaquín		\N	\N	123	10007	\N	\N
30090	Valencia		\N	\N	123	10007	\N	\N
30091	Anzoátegui		\N	\N	123	10008	\N	\N
30092	Tinaquillo		\N	\N	123	10008	\N	\N
30093	Girardot		\N	\N	123	10008	\N	\N
30094	Lima Blanco		\N	\N	123	10008	\N	\N
30095	Pao de San Juan Bautista		\N	\N	123	10008	\N	\N
30096	Ricaurte		\N	\N	123	10008	\N	\N
30097	Rómulo Gallegos		\N	\N	123	10008	\N	\N
30098	San Carlos		\N	\N	123	10008	\N	\N
30099	Tinaco		\N	\N	123	10008	\N	\N
30100	Antonio Díaz		\N	\N	123	10009	\N	\N
30101	Casacoima		\N	\N	123	10009	\N	\N
30102	Pedernales		\N	\N	123	10009	\N	\N
30103	Tucupita		\N	\N	123	10009	\N	\N
30104	Acosta		\N	\N	123	10010	\N	\N
30105	Bolívar		\N	\N	123	10010	\N	\N
30106	Buchivacoa		\N	\N	123	10010	\N	\N
30107	Cacique Manaure		\N	\N	123	10010	\N	\N
30108	Carirubana		\N	\N	123	10010	\N	\N
30109	Colina		\N	\N	123	10010	\N	\N
30110	Dabajuro		\N	\N	123	10010	\N	\N
30111	Democracia		\N	\N	123	10010	\N	\N
30112	Falcón		\N	\N	123	10010	\N	\N
30113	Federación		\N	\N	123	10010	\N	\N
30114	Jacura		\N	\N	123	10010	\N	\N
30115	José Laurencio Silva		\N	\N	123	10010	\N	\N
30116	Los Taques		\N	\N	123	10010	\N	\N
30117	Mauroa		\N	\N	123	10010	\N	\N
30118	Miranda		\N	\N	123	10010	\N	\N
30119	Monseñor Iturriza		\N	\N	123	10010	\N	\N
30120	Palmasola		\N	\N	123	10010	\N	\N
30121	Petit		\N	\N	123	10010	\N	\N
30122	Píritu		\N	\N	123	10010	\N	\N
30123	San Francisco		\N	\N	123	10010	\N	\N
30124	Sucre		\N	\N	123	10010	\N	\N
30125	Tocópero		\N	\N	123	10010	\N	\N
30126	Unión		\N	\N	123	10010	\N	\N
30127	Urumaco		\N	\N	123	10010	\N	\N
30128	Zamora		\N	\N	123	10010	\N	\N
30129	Camaguán		\N	\N	123	10011	\N	\N
30130	Chaguaramas		\N	\N	123	10011	\N	\N
30131	El Socorro		\N	\N	123	10011	\N	\N
30132	José Félix Ribas		\N	\N	123	10011	\N	\N
30133	José Tadeo Monagas		\N	\N	123	10011	\N	\N
30134	Juan Germán Roscio		\N	\N	123	10011	\N	\N
30135	Julián Mellado		\N	\N	123	10011	\N	\N
30136	Las Mercedes		\N	\N	123	10011	\N	\N
30137	Leonardo Infante		\N	\N	123	10011	\N	\N
30138	Pedro Zaraza		\N	\N	123	10011	\N	\N
30139	Ortíz		\N	\N	123	10011	\N	\N
30140	San Gerónimo de Guayabal		\N	\N	123	10011	\N	\N
30141	San José de Guaribe		\N	\N	123	10011	\N	\N
30142	Santa María de Ipire		\N	\N	123	10011	\N	\N
30143	Sebastián Francisco de Miranda		\N	\N	123	10011	\N	\N
30144	Andrés Eloy Blanco		\N	\N	123	10012	\N	\N
30145	Crespo		\N	\N	123	10012	\N	\N
30146	Iribarren		\N	\N	123	10012	\N	\N
30147	Jiménez		\N	\N	123	10012	\N	\N
30148	Morán		\N	\N	123	10012	\N	\N
30149	Palavecino		\N	\N	123	10012	\N	\N
30150	Simón Planas		\N	\N	123	10012	\N	\N
30151	Torres		\N	\N	123	10012	\N	\N
30152	Urdaneta		\N	\N	123	10012	\N	\N
30179	Alberto Adriani		\N	\N	123	10013	\N	\N
30180	Andrés Bello		\N	\N	123	10013	\N	\N
30181	Antonio Pinto Salinas		\N	\N	123	10013	\N	\N
30182	Aricagua		\N	\N	123	10013	\N	\N
30183	Arzobispo Chacón		\N	\N	123	10013	\N	\N
30184	Campo Elías		\N	\N	123	10013	\N	\N
30185	Caracciolo Parra Olmedo		\N	\N	123	10013	\N	\N
30186	Cardenal Quintero		\N	\N	123	10013	\N	\N
30187	Guaraque		\N	\N	123	10013	\N	\N
30188	Julio César Salas		\N	\N	123	10013	\N	\N
30189	Justo Briceño		\N	\N	123	10013	\N	\N
30190	Libertador		\N	\N	123	10013	\N	\N
30191	Miranda		\N	\N	123	10013	\N	\N
30192	Obispo Ramos de Lora		\N	\N	123	10013	\N	\N
30193	Padre Noguera		\N	\N	123	10013	\N	\N
30194	Pueblo Llano		\N	\N	123	10013	\N	\N
30195	Rangel		\N	\N	123	10013	\N	\N
30196	Rivas Dávila		\N	\N	123	10013	\N	\N
30197	Santos Marquina		\N	\N	123	10013	\N	\N
30198	Sucre		\N	\N	123	10013	\N	\N
30199	Tovar		\N	\N	123	10013	\N	\N
30200	Tulio Febres Cordero		\N	\N	123	10013	\N	\N
30201	Zea		\N	\N	123	10013	\N	\N
30223	Acevedo		\N	\N	123	10014	\N	\N
30224	Andrés Bello		\N	\N	123	10014	\N	\N
30225	Baruta		\N	\N	123	10014	\N	\N
30226	Brión		\N	\N	123	10014	\N	\N
30227	Buroz		\N	\N	123	10014	\N	\N
30228	Carrizal		\N	\N	123	10014	\N	\N
30229	Chacao		\N	\N	123	10014	\N	\N
30230	Cristóbal Rojas		\N	\N	123	10014	\N	\N
30231	El Hatillo		\N	\N	123	10014	\N	\N
30232	Guaicaipuro		\N	\N	123	10014	\N	\N
30233	Independencia		\N	\N	123	10014	\N	\N
30234	Lander		\N	\N	123	10014	\N	\N
30235	Los Salias		\N	\N	123	10014	\N	\N
30236	Páez		\N	\N	123	10014	\N	\N
30237	Paz Castillo		\N	\N	123	10014	\N	\N
30238	Pedro Gual		\N	\N	123	10014	\N	\N
30239	Plaza		\N	\N	123	10014	\N	\N
30240	Simón Bolívar		\N	\N	123	10014	\N	\N
30241	Sucre		\N	\N	123	10014	\N	\N
30242	Urdaneta		\N	\N	123	10014	\N	\N
30243	Zamora		\N	\N	123	10014	\N	\N
30258	Acosta		\N	\N	123	10015	\N	\N
30259	Aguasay		\N	\N	123	10015	\N	\N
30260	Bolívar		\N	\N	123	10015	\N	\N
30261	Caripe		\N	\N	123	10015	\N	\N
30262	Cedeño		\N	\N	123	10015	\N	\N
30263	Ezequiel Zamora		\N	\N	123	10015	\N	\N
30264	Libertador		\N	\N	123	10015	\N	\N
30265	Maturín		\N	\N	123	10015	\N	\N
30266	Piar		\N	\N	123	10015	\N	\N
30267	Punceres		\N	\N	123	10015	\N	\N
30268	Santa Bárbara		\N	\N	123	10015	\N	\N
30269	Sotillo		\N	\N	123	10015	\N	\N
30270	Uracoa		\N	\N	123	10015	\N	\N
30271	Antolín del Campo		\N	\N	123	10016	\N	\N
30272	Arismendi		\N	\N	123	10016	\N	\N
30273	García		\N	\N	123	10016	\N	\N
30274	Gómez		\N	\N	123	10016	\N	\N
30275	Maneiro		\N	\N	123	10016	\N	\N
30276	Marcano		\N	\N	123	10016	\N	\N
30277	Mariño		\N	\N	123	10016	\N	\N
30278	Península de Macanao		\N	\N	123	10016	\N	\N
30279	Tubores		\N	\N	123	10016	\N	\N
30280	Villalba		\N	\N	123	10016	\N	\N
30281	Díaz		\N	\N	123	10016	\N	\N
30282	Agua Blanca		\N	\N	123	10017	\N	\N
30283	Araure		\N	\N	123	10017	\N	\N
30284	Esteller		\N	\N	123	10017	\N	\N
30285	Guanare		\N	\N	123	10017	\N	\N
30286	Guanarito		\N	\N	123	10017	\N	\N
30287	Monseñor José Vicente de Unda		\N	\N	123	10017	\N	\N
30288	Ospino		\N	\N	123	10017	\N	\N
30289	Páez		\N	\N	123	10017	\N	\N
30290	Papelón		\N	\N	123	10017	\N	\N
30291	San Genaro de Boconoíto		\N	\N	123	10017	\N	\N
30292	San Rafael de Onoto		\N	\N	123	10017	\N	\N
30293	Santa Rosalía		\N	\N	123	10017	\N	\N
30294	Sucre		\N	\N	123	10017	\N	\N
30295	Turén		\N	\N	123	10017	\N	\N
30296	Andrés Eloy Blanco		\N	\N	123	10018	\N	\N
30297	Andrés Mata		\N	\N	123	10018	\N	\N
30298	Arismendi		\N	\N	123	10018	\N	\N
30299	Benítez		\N	\N	123	10018	\N	\N
30300	Bermúdez		\N	\N	123	10018	\N	\N
30301	Bolívar		\N	\N	123	10018	\N	\N
30302	Cajigal		\N	\N	123	10018	\N	\N
30303	Cruz Salmerón Acosta		\N	\N	123	10018	\N	\N
30304	Libertador		\N	\N	123	10018	\N	\N
30305	Mariño		\N	\N	123	10018	\N	\N
30306	Mejía		\N	\N	123	10018	\N	\N
30307	Montes		\N	\N	123	10018	\N	\N
30308	Ribero		\N	\N	123	10018	\N	\N
30309	Sucre		\N	\N	123	10018	\N	\N
30310	Valdéz		\N	\N	123	10018	\N	\N
30341	Andrés Bello		\N	\N	123	10019	\N	\N
30342	Antonio Rómulo Costa		\N	\N	123	10019	\N	\N
30343	Ayacucho		\N	\N	123	10019	\N	\N
30344	Bolívar		\N	\N	123	10019	\N	\N
30345	Cárdenas		\N	\N	123	10019	\N	\N
30346	Córdoba		\N	\N	123	10019	\N	\N
30347	Fernández Feo		\N	\N	123	10019	\N	\N
30348	Francisco de Miranda		\N	\N	123	10019	\N	\N
30349	García de Hevia		\N	\N	123	10019	\N	\N
30350	Guásimos		\N	\N	123	10019	\N	\N
30351	Independencia		\N	\N	123	10019	\N	\N
30352	Jáuregui		\N	\N	123	10019	\N	\N
30353	José María Vargas		\N	\N	123	10019	\N	\N
30354	Junín		\N	\N	123	10019	\N	\N
30355	Libertad		\N	\N	123	10019	\N	\N
30356	Libertador		\N	\N	123	10019	\N	\N
30357	Lobatera		\N	\N	123	10019	\N	\N
30358	Michelena		\N	\N	123	10019	\N	\N
30359	Panamericano		\N	\N	123	10019	\N	\N
30360	Pedro María Ureña		\N	\N	123	10019	\N	\N
30361	Rafael Urdaneta		\N	\N	123	10019	\N	\N
30362	Samuel Darío Maldonado		\N	\N	123	10019	\N	\N
30363	San Cristóbal		\N	\N	123	10019	\N	\N
30364	Seboruco		\N	\N	123	10019	\N	\N
30365	Simón Rodríguez		\N	\N	123	10019	\N	\N
30366	Sucre		\N	\N	123	10019	\N	\N
30367	Torbes		\N	\N	123	10019	\N	\N
30368	Uribante		\N	\N	123	10019	\N	\N
30369	San Judas Tadeo		\N	\N	123	10019	\N	\N
30370	Andrés Bello		\N	\N	123	10020	\N	\N
30371	Boconó		\N	\N	123	10020	\N	\N
30372	Bolívar		\N	\N	123	10020	\N	\N
30373	Candelaria		\N	\N	123	10020	\N	\N
30374	Carache		\N	\N	123	10020	\N	\N
30375	Escuque		\N	\N	123	10020	\N	\N
30376	José Felipe Márquez Cañizalez		\N	\N	123	10020	\N	\N
30377	Juan Vicente Campos Elías		\N	\N	123	10020	\N	\N
30378	La Ceiba		\N	\N	123	10020	\N	\N
30379	Miranda		\N	\N	123	10020	\N	\N
30380	Monte Carmelo		\N	\N	123	10020	\N	\N
30381	Motatán		\N	\N	123	10020	\N	\N
30382	Pampán		\N	\N	123	10020	\N	\N
30383	Pampanito		\N	\N	123	10020	\N	\N
30384	Rafael Rangel		\N	\N	123	10020	\N	\N
30385	San Rafael de Carvajal		\N	\N	123	10020	\N	\N
30386	Sucre		\N	\N	123	10020	\N	\N
30387	Trujillo		\N	\N	123	10020	\N	\N
30388	Urdaneta		\N	\N	123	10020	\N	\N
30389	Valera		\N	\N	123	10020	\N	\N
30390	Vargas		\N	\N	123	10021	\N	\N
30391	Arístides Bastidas		\N	\N	123	10022	\N	\N
30392	Bolívar		\N	\N	123	10022	\N	\N
30407	Bruzual		\N	\N	123	10022	\N	\N
30408	Cocorote		\N	\N	123	10022	\N	\N
30409	Independencia		\N	\N	123	10022	\N	\N
30410	José Antonio Páez		\N	\N	123	10022	\N	\N
30411	La Trinidad		\N	\N	123	10022	\N	\N
30412	Manuel Monge		\N	\N	123	10022	\N	\N
30413	Nirgua		\N	\N	123	10022	\N	\N
30414	Peña		\N	\N	123	10022	\N	\N
30415	San Felipe		\N	\N	123	10022	\N	\N
30416	Sucre		\N	\N	123	10022	\N	\N
30417	Urachiche		\N	\N	123	10022	\N	\N
30418	José Joaquín Veroes		\N	\N	123	10022	\N	\N
30441	Almirante Padilla		\N	\N	123	10023	\N	\N
30442	Baralt		\N	\N	123	10023	\N	\N
30443	Cabimas		\N	\N	123	10023	\N	\N
30444	Catatumbo		\N	\N	123	10023	\N	\N
30445	Colón		\N	\N	123	10023	\N	\N
30446	Francisco Javier Pulgar		\N	\N	123	10023	\N	\N
30447	Páez		\N	\N	123	10023	\N	\N
30448	Jesús Enrique Losada		\N	\N	123	10023	\N	\N
30449	Jesús María Semprún		\N	\N	123	10023	\N	\N
30450	La Cañada de Urdaneta		\N	\N	123	10023	\N	\N
30451	Lagunillas		\N	\N	123	10023	\N	\N
30452	Machiques de Perijá		\N	\N	123	10023	\N	\N
30453	Mara		\N	\N	123	10023	\N	\N
30454	Maracaibo		\N	\N	123	10023	\N	\N
30455	Miranda		\N	\N	123	10023	\N	\N
30456	Rosario de Perijá		\N	\N	123	10023	\N	\N
30457	San Francisco		\N	\N	123	10023	\N	\N
30458	Santa Rita		\N	\N	123	10023	\N	\N
30459	Simón Bolívar		\N	\N	123	10023	\N	\N
30460	Sucre		\N	\N	123	10023	\N	\N
30461	Valmore Rodríguez		\N	\N	123	10023	\N	\N
30462	Libertador		\N	\N	123	10024	\N	\N
40001	Alto Orinoco		\N	\N	124	30001	\N	\N
40002	Huachamacare Acanaña		\N	\N	124	30001	\N	\N
40003	Marawaka Toky Shamanaña		\N	\N	124	30001	\N	\N
40004	Mavaka Mavaka		\N	\N	124	30001	\N	\N
40005	Sierra Parima Parimabé		\N	\N	124	30001	\N	\N
40006	Ucata Laja Lisa		\N	\N	124	30002	\N	\N
40007	Yapacana Macuruco		\N	\N	124	30002	\N	\N
40008	Caname Guarinuma		\N	\N	124	30002	\N	\N
40009	Fernando Girón Tovar		\N	\N	124	30003	\N	\N
40010	Luis Alberto Gómez		\N	\N	124	30003	\N	\N
40011	Pahueña Limón de Parhueña		\N	\N	124	30003	\N	\N
40012	Platanillal Platanillal		\N	\N	124	30003	\N	\N
40013	Samariapo		\N	\N	124	30004	\N	\N
40014	Sipapo		\N	\N	124	30004	\N	\N
40015	Munduapo		\N	\N	124	30004	\N	\N
40016	Guayapo		\N	\N	124	30004	\N	\N
40017	Alto Ventuari		\N	\N	124	30005	\N	\N
40018	Medio Ventuari		\N	\N	124	30005	\N	\N
40019	Bajo Ventuari		\N	\N	124	30005	\N	\N
40020	Victorino		\N	\N	124	30006	\N	\N
40021	Comunidad		\N	\N	124	30006	\N	\N
40022	Casiquiare		\N	\N	124	30007	\N	\N
40023	Cocuy		\N	\N	124	30007	\N	\N
40024	San Carlos de Río Negro		\N	\N	124	30007	\N	\N
40025	Solano		\N	\N	124	30007	\N	\N
40026	Anaco		\N	\N	124	30008	\N	\N
40027	San Joaquín		\N	\N	124	30008	\N	\N
40028	Cachipo		\N	\N	124	30009	\N	\N
40029	Aragua de Barcelona		\N	\N	124	30009	\N	\N
40030	Lechería		\N	\N	124	30011	\N	\N
40031	El Morro		\N	\N	124	30011	\N	\N
40032	Puerto Píritu		\N	\N	124	30012	\N	\N
40033	San Miguel		\N	\N	124	30012	\N	\N
40034	Sucre		\N	\N	124	30012	\N	\N
40035	Valle de Guanape		\N	\N	124	30013	\N	\N
40036	Santa Bárbara		\N	\N	124	30013	\N	\N
40037	El Chaparro		\N	\N	124	30014	\N	\N
40038	Tomás Alfaro		\N	\N	124	30014	\N	\N
40039	Calatrava		\N	\N	124	30014	\N	\N
40040	Guanta		\N	\N	124	30015	\N	\N
40041	Chorrerón		\N	\N	124	30015	\N	\N
40042	Mamo		\N	\N	124	30016	\N	\N
40043	Soledad		\N	\N	124	30016	\N	\N
40044	Mapire		\N	\N	124	30017	\N	\N
40045	Piar		\N	\N	124	30017	\N	\N
40046	Santa Clara		\N	\N	124	30017	\N	\N
40047	San Diego de Cabrutica		\N	\N	124	30017	\N	\N
40048	Uverito		\N	\N	124	30017	\N	\N
40049	Zuata		\N	\N	124	30017	\N	\N
40050	Puerto La Cruz		\N	\N	124	30018	\N	\N
40051	Pozuelos		\N	\N	124	30018	\N	\N
40052	Onoto		\N	\N	124	30019	\N	\N
40053	San Pablo		\N	\N	124	30019	\N	\N
40054	San Mateo		\N	\N	124	30020	\N	\N
40055	El Carito		\N	\N	124	30020	\N	\N
40056	Santa Inés		\N	\N	124	30020	\N	\N
40057	La Romereña		\N	\N	124	30020	\N	\N
40058	Atapirire		\N	\N	124	30021	\N	\N
40059	Boca del Pao		\N	\N	124	30021	\N	\N
40060	El Pao		\N	\N	124	30021	\N	\N
40061	Pariaguán		\N	\N	124	30021	\N	\N
40062	Cantaura		\N	\N	124	30022	\N	\N
40063	Libertador		\N	\N	124	30022	\N	\N
40064	Santa Rosa		\N	\N	124	30022	\N	\N
40065	Urica		\N	\N	124	30022	\N	\N
40066	Píritu		\N	\N	124	30023	\N	\N
40067	San Francisco		\N	\N	124	30023	\N	\N
40068	San José de Guanipa		\N	\N	124	30024	\N	\N
40069	Boca de Uchire		\N	\N	124	30025	\N	\N
40070	Boca de Chávez		\N	\N	124	30025	\N	\N
40071	Pueblo Nuevo		\N	\N	124	30026	\N	\N
40072	Santa Ana		\N	\N	124	30026	\N	\N
40073	Bergantín		\N	\N	124	30027	\N	\N
40074	Caigua		\N	\N	124	30027	\N	\N
40075	El Carmen		\N	\N	124	30027	\N	\N
40076	El Pilar		\N	\N	124	30027	\N	\N
40077	Naricual		\N	\N	124	30027	\N	\N
40078	San Crsitóbal		\N	\N	124	30027	\N	\N
40079	Edmundo Barrios		\N	\N	124	30028	\N	\N
40080	Miguel Otero Silva		\N	\N	124	30028	\N	\N
40081	Achaguas		\N	\N	124	30029	\N	\N
40082	Apurito		\N	\N	124	30029	\N	\N
40083	El Yagual		\N	\N	124	30029	\N	\N
40084	Guachara		\N	\N	124	30029	\N	\N
40085	Mucuritas		\N	\N	124	30029	\N	\N
40086	Queseras del medio		\N	\N	124	30029	\N	\N
40087	Biruaca		\N	\N	124	30030	\N	\N
40088	Bruzual		\N	\N	124	30031	\N	\N
40089	Mantecal		\N	\N	124	30031	\N	\N
40090	Quintero		\N	\N	124	30031	\N	\N
40091	Rincón Hondo		\N	\N	124	30031	\N	\N
40092	San Vicente		\N	\N	124	30031	\N	\N
40093	Guasdualito		\N	\N	124	30032	\N	\N
40094	Aramendi		\N	\N	124	30032	\N	\N
40095	El Amparo		\N	\N	124	30032	\N	\N
40096	San Camilo		\N	\N	124	30032	\N	\N
40097	Urdaneta		\N	\N	124	30032	\N	\N
40098	San Juan de Payara		\N	\N	124	30033	\N	\N
40099	Codazzi		\N	\N	124	30033	\N	\N
40100	Cunaviche		\N	\N	124	30033	\N	\N
40101	Elorza		\N	\N	124	30034	\N	\N
40102	La Trinidad		\N	\N	124	30034	\N	\N
40103	San Fernando		\N	\N	124	30035	\N	\N
40104	El Recreo		\N	\N	124	30035	\N	\N
40105	Peñalver		\N	\N	124	30035	\N	\N
40106	San Rafael de Atamaica		\N	\N	124	30035	\N	\N
40107	Pedro José Ovalles		\N	\N	124	30036	\N	\N
40108	Joaquín Crespo		\N	\N	124	30036	\N	\N
40109	José Casanova Godoy		\N	\N	124	30036	\N	\N
40110	Madre María de San José		\N	\N	124	30036	\N	\N
40111	Andrés Eloy Blanco		\N	\N	124	30036	\N	\N
40112	Los Tacarigua		\N	\N	124	30036	\N	\N
40113	Las Delicias		\N	\N	124	30036	\N	\N
40114	Choroní		\N	\N	124	30036	\N	\N
40115	Bolívar		\N	\N	124	30037	\N	\N
40116	Camatagua		\N	\N	124	30038	\N	\N
40117	Carmen de Cura		\N	\N	124	30038	\N	\N
40118	Santa Rita		\N	\N	124	30039	\N	\N
40119	Francisco de Miranda		\N	\N	124	30039	\N	\N
40120	Moseñor Feliciano González		\N	\N	124	30039	\N	\N
40121	Santa Cruz		\N	\N	124	30040	\N	\N
40122	José Félix Ribas		\N	\N	124	30041	\N	\N
40123	Castor Nieves Ríos		\N	\N	124	30041	\N	\N
40124	Las Guacamayas		\N	\N	124	30041	\N	\N
40125	Pao de Zárate		\N	\N	124	30041	\N	\N
40126	Zuata		\N	\N	124	30041	\N	\N
40127	José Rafael Revenga		\N	\N	124	30042	\N	\N
40128	Palo Negro		\N	\N	124	30043	\N	\N
40129	San Martín de Porres		\N	\N	124	30043	\N	\N
40130	El Limón		\N	\N	124	30044	\N	\N
40131	Caña de Azúcar		\N	\N	124	30044	\N	\N
40132	Ocumare de la Costa		\N	\N	124	30045	\N	\N
40133	San Casimiro		\N	\N	124	30046	\N	\N
40134	Güiripa		\N	\N	124	30046	\N	\N
40135	Ollas de Caramacate		\N	\N	124	30046	\N	\N
40136	Valle Morín		\N	\N	124	30046	\N	\N
40137	San Sebastían		\N	\N	124	30047	\N	\N
40138	Turmero		\N	\N	124	30048	\N	\N
40139	Arevalo Aponte		\N	\N	124	30048	\N	\N
40140	Chuao		\N	\N	124	30048	\N	\N
40141	Samán de Güere		\N	\N	124	30048	\N	\N
40142	Alfredo Pacheco Miranda		\N	\N	124	30048	\N	\N
40143	Santos Michelena		\N	\N	124	30049	\N	\N
40144	Tiara		\N	\N	124	30049	\N	\N
40145	Cagua		\N	\N	124	30050	\N	\N
40146	Bella Vista		\N	\N	124	30050	\N	\N
40147	Tovar		\N	\N	124	30051	\N	\N
40148	Urdaneta		\N	\N	124	30052	\N	\N
40149	Las Peñitas		\N	\N	124	30052	\N	\N
40150	San Francisco de Cara		\N	\N	124	30052	\N	\N
40151	Taguay		\N	\N	124	30052	\N	\N
40152	Zamora		\N	\N	124	30053	\N	\N
40153	Magdaleno		\N	\N	124	30053	\N	\N
40154	San Francisco de Asís		\N	\N	124	30053	\N	\N
40155	Valles de Tucutunemo		\N	\N	124	30053	\N	\N
40156	Augusto Mijares		\N	\N	124	30053	\N	\N
40157	Sabaneta		\N	\N	124	30054	\N	\N
40158	Juan Antonio Rodríguez Domínguez		\N	\N	124	30054	\N	\N
40159	El Cantón		\N	\N	124	30055	\N	\N
40160	Santa Cruz de Guacas		\N	\N	124	30055	\N	\N
40161	Puerto Vivas		\N	\N	124	30055	\N	\N
40162	Ticoporo		\N	\N	124	30056	\N	\N
40163	Nicolás Pulido		\N	\N	124	30056	\N	\N
40164	Andrés Bello		\N	\N	124	30056	\N	\N
40165	Arismendi		\N	\N	124	30057	\N	\N
40166	Guadarrama		\N	\N	124	30057	\N	\N
40167	La Unión		\N	\N	124	30057	\N	\N
40168	San Antonio		\N	\N	124	30057	\N	\N
40169	Barinas		\N	\N	124	30058	\N	\N
40170	Alberto Arvelo Larriva		\N	\N	124	30058	\N	\N
40171	San Silvestre		\N	\N	124	30058	\N	\N
40172	Santa Inés		\N	\N	124	30058	\N	\N
40173	Santa Lucía		\N	\N	124	30058	\N	\N
40174	Torumos		\N	\N	124	30058	\N	\N
40175	El Carmen		\N	\N	124	30058	\N	\N
40176	Rómulo Betancourt		\N	\N	124	30058	\N	\N
40177	Corazón de Jesús		\N	\N	124	30058	\N	\N
40178	Ramón Ignacio Méndez		\N	\N	124	30058	\N	\N
40179	Alto Barinas		\N	\N	124	30058	\N	\N
40180	Manuel Palacio Fajardo		\N	\N	124	30058	\N	\N
40181	Juan Antonio Rodríguez Domínguez		\N	\N	124	30058	\N	\N
40182	Dominga Ortiz de Páez		\N	\N	124	30058	\N	\N
40183	Barinitas		\N	\N	124	30059	\N	\N
40184	Altamira de Cáceres		\N	\N	124	30059	\N	\N
40185	Calderas		\N	\N	124	30059	\N	\N
40186	Barrancas		\N	\N	124	30060	\N	\N
40187	El Socorro		\N	\N	124	30060	\N	\N
40188	Mazparrito		\N	\N	124	30060	\N	\N
40189	Santa Bárbara		\N	\N	124	30061	\N	\N
40190	Pedro Briceño Méndez		\N	\N	124	30061	\N	\N
40191	Ramón Ignacio Méndez		\N	\N	124	30061	\N	\N
40192	José Ignacio del Pumar		\N	\N	124	30061	\N	\N
40193	Obispos		\N	\N	124	30062	\N	\N
40194	Guasimitos		\N	\N	124	30062	\N	\N
40195	El Real		\N	\N	124	30062	\N	\N
40196	La Luz		\N	\N	124	30062	\N	\N
40197	Ciudad Bolívia		\N	\N	124	30063	\N	\N
40198	José Ignacio Briceño		\N	\N	124	30063	\N	\N
40199	José Félix Ribas		\N	\N	124	30063	\N	\N
40200	Páez		\N	\N	124	30063	\N	\N
40201	Libertad		\N	\N	124	30064	\N	\N
40202	Dolores		\N	\N	124	30064	\N	\N
40203	Santa Rosa		\N	\N	124	30064	\N	\N
40204	Palacio Fajardo		\N	\N	124	30064	\N	\N
40205	Ciudad de Nutrias		\N	\N	124	30065	\N	\N
40206	El Regalo		\N	\N	124	30065	\N	\N
40207	Puerto Nutrias		\N	\N	124	30065	\N	\N
40208	Santa Catalina		\N	\N	124	30065	\N	\N
40209	Cachamay		\N	\N	124	30066	\N	\N
40210	Chirica		\N	\N	124	30066	\N	\N
40211	Dalla Costa		\N	\N	124	30066	\N	\N
40212	Once de Abril		\N	\N	124	30066	\N	\N
40213	Simón Bolívar		\N	\N	124	30066	\N	\N
40214	Unare		\N	\N	124	30066	\N	\N
40215	Universidad		\N	\N	124	30066	\N	\N
40216	Vista al Sol		\N	\N	124	30066	\N	\N
40217	Pozo Verde		\N	\N	124	30066	\N	\N
40218	Yocoima		\N	\N	124	30066	\N	\N
40219	5 de Julio		\N	\N	124	30066	\N	\N
40220	Cedeño		\N	\N	124	30067	\N	\N
40221	Altagracia		\N	\N	124	30067	\N	\N
40222	Ascensión Farreras		\N	\N	124	30067	\N	\N
40223	Guaniamo		\N	\N	124	30067	\N	\N
40224	La Urbana		\N	\N	124	30067	\N	\N
40225	Pijiguaos		\N	\N	124	30067	\N	\N
40226	El Callao		\N	\N	124	30068	\N	\N
40227	Gran Sabana		\N	\N	124	30069	\N	\N
40228	Ikabarú		\N	\N	124	30069	\N	\N
40229	Catedral		\N	\N	124	30070	\N	\N
40230	Zea		\N	\N	124	30070	\N	\N
40231	Orinoco		\N	\N	124	30070	\N	\N
40232	José Antonio Páez		\N	\N	124	30070	\N	\N
40233	Marhuanta		\N	\N	124	30070	\N	\N
40234	Agua Salada		\N	\N	124	30070	\N	\N
40235	Vista Hermosa		\N	\N	124	30070	\N	\N
40236	La Sabanita		\N	\N	124	30070	\N	\N
40237	Panapana		\N	\N	124	30070	\N	\N
40238	Andrés Eloy Blanco		\N	\N	124	30071	\N	\N
40239	Pedro Cova		\N	\N	124	30071	\N	\N
40240	Raúl Leoni		\N	\N	124	30072	\N	\N
40241	Barceloneta		\N	\N	124	30072	\N	\N
40242	Santa Bárbara		\N	\N	124	30072	\N	\N
40243	San Francisco		\N	\N	124	30072	\N	\N
40244	Roscio		\N	\N	124	30073	\N	\N
40245	Salóm		\N	\N	124	30073	\N	\N
40246	Sifontes		\N	\N	124	30074	\N	\N
40247	Dalla Costa		\N	\N	124	30074	\N	\N
40248	San Isidro		\N	\N	124	30074	\N	\N
40249	Sucre		\N	\N	124	30075	\N	\N
40250	Aripao		\N	\N	124	30075	\N	\N
40251	Guarataro		\N	\N	124	30075	\N	\N
40252	Las Majadas		\N	\N	124	30075	\N	\N
40253	Moitaco		\N	\N	124	30075	\N	\N
40254	Padre Pedro Chien		\N	\N	124	30076	\N	\N
40255	Río Grande		\N	\N	124	30076	\N	\N
40256	Bejuma		\N	\N	124	30077	\N	\N
40257	Canoabo		\N	\N	124	30077	\N	\N
40258	Simón Bolívar		\N	\N	124	30077	\N	\N
40259	Güigüe		\N	\N	124	30078	\N	\N
40260	Carabobo		\N	\N	124	30078	\N	\N
40261	Tacarigua		\N	\N	124	30078	\N	\N
40262	Mariara		\N	\N	124	30079	\N	\N
40263	Aguas Calientes		\N	\N	124	30079	\N	\N
40264	Ciudad Alianza		\N	\N	124	30080	\N	\N
40265	Guacara		\N	\N	124	30080	\N	\N
40266	Yagua		\N	\N	124	30080	\N	\N
40267	Morón		\N	\N	124	30081	\N	\N
40268	Yagua		\N	\N	124	30081	\N	\N
40269	Tocuyito		\N	\N	124	30082	\N	\N
40270	Independencia		\N	\N	124	30082	\N	\N
40271	Los Guayos		\N	\N	124	30083	\N	\N
40272	Miranda		\N	\N	124	30084	\N	\N
40273	Montalbán		\N	\N	124	30085	\N	\N
40274	Naguanagua		\N	\N	124	30086	\N	\N
40275	Bartolomé Salóm		\N	\N	124	30087	\N	\N
40276	Democracia		\N	\N	124	30087	\N	\N
40277	Fraternidad		\N	\N	124	30087	\N	\N
40278	Goaigoaza		\N	\N	124	30087	\N	\N
40279	Juan José Flores		\N	\N	124	30087	\N	\N
40280	Unión		\N	\N	124	30087	\N	\N
40281	Borburata		\N	\N	124	30087	\N	\N
40282	Patanemo		\N	\N	124	30087	\N	\N
40283	San Diego		\N	\N	124	30088	\N	\N
40284	San Joaquín		\N	\N	124	30089	\N	\N
40285	Candelaria		\N	\N	124	30090	\N	\N
40286	Catedral		\N	\N	124	30090	\N	\N
40287	El Socorro		\N	\N	124	30090	\N	\N
40288	Miguel Peña		\N	\N	124	30090	\N	\N
40289	Rafael Urdaneta		\N	\N	124	30090	\N	\N
40290	San Blas		\N	\N	124	30090	\N	\N
40291	San José		\N	\N	124	30090	\N	\N
40292	Santa Rosa		\N	\N	124	30090	\N	\N
40293	Negro Primero		\N	\N	124	30090	\N	\N
40294	Cojedes		\N	\N	124	30091	\N	\N
40295	Juan de Mata Suárez		\N	\N	124	30091	\N	\N
40296	Tinaquillo		\N	\N	124	30092	\N	\N
40297	El Baúl		\N	\N	124	30093	\N	\N
40298	Sucre		\N	\N	124	30093	\N	\N
40299	La Aguadita		\N	\N	124	30094	\N	\N
40300	Macapo		\N	\N	124	30094	\N	\N
40301	El Pao		\N	\N	124	30095	\N	\N
40302	El Amparo		\N	\N	124	30096	\N	\N
40303	Libertad de Cojedes		\N	\N	124	30096	\N	\N
40304	Rómulo Gallegos		\N	\N	124	30097	\N	\N
40305	San Carlos de Austria		\N	\N	124	30098	\N	\N
40306	Juan Ángel Bravo		\N	\N	124	30098	\N	\N
40307	Manuel Manrique		\N	\N	124	30098	\N	\N
40308	General en Jefe José Laurencio Silva		\N	\N	124	30099	\N	\N
40309	Curiapo		\N	\N	124	30100	\N	\N
40310	Almirante Luis Brión		\N	\N	124	30100	\N	\N
40311	Francisco Aniceto Lugo		\N	\N	124	30100	\N	\N
40312	Manuel Renaud		\N	\N	124	30100	\N	\N
40313	Padre Barral		\N	\N	124	30100	\N	\N
40314	Santos de Abelgas		\N	\N	124	30100	\N	\N
40315	Imataca		\N	\N	124	30101	\N	\N
40316	Cinco de Julio		\N	\N	124	30101	\N	\N
40317	Juan Bautista Arismendi		\N	\N	124	30101	\N	\N
40318	Manuel Piar		\N	\N	124	30101	\N	\N
40319	Rómulo Gallegos		\N	\N	124	30101	\N	\N
40320	Pedernales		\N	\N	124	30102	\N	\N
40321	Luis Beltrán Prieto Figueroa		\N	\N	124	30102	\N	\N
40322	San José Delta Amacuro)		\N	\N	124	30103	\N	\N
40323	José Vidal Marcano		\N	\N	124	30103	\N	\N
40324	Juan Millán		\N	\N	124	30103	\N	\N
40325	Leonardo Ruíz Pineda		\N	\N	124	30103	\N	\N
40326	Mariscal Antonio José de Sucre		\N	\N	124	30103	\N	\N
40327	Monseñor Argimiro García		\N	\N	124	30103	\N	\N
40328	San Rafael Delta Amacuro)		\N	\N	124	30103	\N	\N
40329	Virgen del Valle		\N	\N	124	30103	\N	\N
40330	Clarines		\N	\N	124	30010	\N	\N
40331	Guanape		\N	\N	124	30010	\N	\N
40332	Sabana de Uchire		\N	\N	124	30010	\N	\N
40333	Capadare		\N	\N	124	30104	\N	\N
40334	La Pastora		\N	\N	124	30104	\N	\N
40335	Libertador		\N	\N	124	30104	\N	\N
40336	San Juan de los Cayos		\N	\N	124	30104	\N	\N
40337	Aracua		\N	\N	124	30105	\N	\N
40338	La Peña		\N	\N	124	30105	\N	\N
40339	San Luis		\N	\N	124	30105	\N	\N
40340	Bariro		\N	\N	124	30106	\N	\N
40341	Borojó		\N	\N	124	30106	\N	\N
40342	Capatárida		\N	\N	124	30106	\N	\N
40343	Guajiro		\N	\N	124	30106	\N	\N
40344	Seque		\N	\N	124	30106	\N	\N
40345	Zazárida		\N	\N	124	30106	\N	\N
40346	Valle de Eroa		\N	\N	124	30106	\N	\N
40347	Cacique Manaure		\N	\N	124	30107	\N	\N
40348	Norte		\N	\N	124	30108	\N	\N
40349	Carirubana		\N	\N	124	30108	\N	\N
40350	Santa Ana		\N	\N	124	30108	\N	\N
40351	Urbana Punta Cardón		\N	\N	124	30108	\N	\N
40352	La Vela de Coro		\N	\N	124	30109	\N	\N
40353	Acurigua		\N	\N	124	30109	\N	\N
40354	Guaibacoa		\N	\N	124	30109	\N	\N
40355	Las Calderas		\N	\N	124	30109	\N	\N
40356	Macoruca		\N	\N	124	30109	\N	\N
40357	Dabajuro		\N	\N	124	30110	\N	\N
40358	Agua Clara		\N	\N	124	30111	\N	\N
40359	Avaria		\N	\N	124	30111	\N	\N
40360	Pedregal		\N	\N	124	30111	\N	\N
40361	Piedra Grande		\N	\N	124	30111	\N	\N
40362	Purureche		\N	\N	124	30111	\N	\N
40363	Adaure		\N	\N	124	30112	\N	\N
40364	Adícora		\N	\N	124	30112	\N	\N
40365	Baraived		\N	\N	124	30112	\N	\N
40366	Buena Vista		\N	\N	124	30112	\N	\N
40367	Jadacaquiva		\N	\N	124	30112	\N	\N
40368	El Vínculo		\N	\N	124	30112	\N	\N
40369	El Hato		\N	\N	124	30112	\N	\N
40370	Moruy		\N	\N	124	30112	\N	\N
40371	Pueblo Nuevo		\N	\N	124	30112	\N	\N
40372	Agua Larga		\N	\N	124	30113	\N	\N
40373	El Paují		\N	\N	124	30113	\N	\N
40374	Independencia		\N	\N	124	30113	\N	\N
40375	Mapararí		\N	\N	124	30113	\N	\N
40376	Agua Linda		\N	\N	124	30114	\N	\N
40377	Araurima		\N	\N	124	30114	\N	\N
40378	Jacura		\N	\N	124	30114	\N	\N
40379	Tucacas		\N	\N	124	30115	\N	\N
40380	Boca de Aroa		\N	\N	124	30115	\N	\N
40381	Los Taques		\N	\N	124	30116	\N	\N
40382	Judibana		\N	\N	124	30116	\N	\N
40383	Mene de Mauroa		\N	\N	124	30117	\N	\N
40384	San Félix		\N	\N	124	30117	\N	\N
40385	Casigua		\N	\N	124	30117	\N	\N
40386	Guzmán Guillermo		\N	\N	124	30118	\N	\N
40387	Mitare		\N	\N	124	30118	\N	\N
40388	Río Seco		\N	\N	124	30118	\N	\N
40389	Sabaneta		\N	\N	124	30118	\N	\N
40390	San Antonio		\N	\N	124	30118	\N	\N
40391	San Gabriel		\N	\N	124	30118	\N	\N
40392	Santa Ana		\N	\N	124	30118	\N	\N
40393	Boca del Tocuyo		\N	\N	124	30119	\N	\N
40394	Chichiriviche		\N	\N	124	30119	\N	\N
40395	Tocuyo de la Costa		\N	\N	124	30119	\N	\N
40396	Palmasola		\N	\N	124	30120	\N	\N
40397	Cabure		\N	\N	124	30121	\N	\N
40398	Colina		\N	\N	124	30121	\N	\N
40399	Curimagua		\N	\N	124	30121	\N	\N
40400	San José de la Costa		\N	\N	124	30122	\N	\N
40401	Píritu		\N	\N	124	30122	\N	\N
40402	San Francisco		\N	\N	124	30123	\N	\N
40403	Sucre		\N	\N	124	30124	\N	\N
40404	Pecaya		\N	\N	124	30124	\N	\N
40405	Tocópero		\N	\N	124	30125	\N	\N
40406	El Charal		\N	\N	124	30126	\N	\N
40407	Las Vegas del Tuy		\N	\N	124	30126	\N	\N
40408	Santa Cruz de Bucaral		\N	\N	124	30126	\N	\N
40409	Bruzual		\N	\N	124	30127	\N	\N
40410	Urumaco		\N	\N	124	30127	\N	\N
40411	Puerto Cumarebo		\N	\N	124	30128	\N	\N
40412	La Ciénaga		\N	\N	124	30128	\N	\N
40413	La Soledad		\N	\N	124	30128	\N	\N
40414	Pueblo Cumarebo		\N	\N	124	30128	\N	\N
40415	Zazárida		\N	\N	124	30128	\N	\N
40416	Churuguara		\N	\N	124	30113	\N	\N
40417	Camaguán		\N	\N	124	30129	\N	\N
40418	Puerto Miranda		\N	\N	124	30129	\N	\N
40419	Uverito		\N	\N	124	30129	\N	\N
40420	Chaguaramas		\N	\N	124	30130	\N	\N
40421	El Socorro		\N	\N	124	30131	\N	\N
40422	Tucupido		\N	\N	124	30132	\N	\N
40423	San Rafael de Laya		\N	\N	124	30132	\N	\N
40424	Altagracia de Orituco		\N	\N	124	30133	\N	\N
40425	San Rafael de Orituco		\N	\N	124	30133	\N	\N
40426	San Francisco Javier de Lezama		\N	\N	124	30133	\N	\N
40427	Paso Real de Macaira		\N	\N	124	30133	\N	\N
40428	Carlos Soublette		\N	\N	124	30133	\N	\N
40429	San Francisco de Macaira		\N	\N	124	30133	\N	\N
40430	Libertad de Orituco		\N	\N	124	30133	\N	\N
40431	Cantaclaro		\N	\N	124	30134	\N	\N
40432	San Juan de los Morros		\N	\N	124	30134	\N	\N
40433	Parapara		\N	\N	124	30134	\N	\N
40434	El Sombrero		\N	\N	124	30135	\N	\N
40435	Sosa		\N	\N	124	30135	\N	\N
40436	Las Mercedes		\N	\N	124	30136	\N	\N
40437	Cabruta		\N	\N	124	30136	\N	\N
40438	Santa Rita de Manapire		\N	\N	124	30136	\N	\N
40439	Valle de la Pascua		\N	\N	124	30137	\N	\N
40440	Espino		\N	\N	124	30137	\N	\N
40441	San José de Unare		\N	\N	124	30138	\N	\N
40442	Zaraza		\N	\N	124	30138	\N	\N
40443	San José de Tiznados		\N	\N	124	30139	\N	\N
40444	San Francisco de Tiznados		\N	\N	124	30139	\N	\N
40445	San Lorenzo de Tiznados		\N	\N	124	30139	\N	\N
40446	Ortiz		\N	\N	124	30139	\N	\N
40447	Guayabal		\N	\N	124	30140	\N	\N
40448	Cazorla		\N	\N	124	30140	\N	\N
40449	San José de Guaribe		\N	\N	124	30141	\N	\N
40450	Uveral		\N	\N	124	30141	\N	\N
40451	Santa María de Ipire		\N	\N	124	30142	\N	\N
40452	Altamira		\N	\N	124	30142	\N	\N
40453	El Calvario		\N	\N	124	30143	\N	\N
40454	El Rastro		\N	\N	124	30143	\N	\N
40455	Guardatinajas		\N	\N	124	30143	\N	\N
40456	Capital Urbana Calabozo		\N	\N	124	30143	\N	\N
40457	Quebrada Honda de Guache		\N	\N	124	30144	\N	\N
40458	Pío Tamayo		\N	\N	124	30144	\N	\N
40459	Yacambú		\N	\N	124	30144	\N	\N
40460	Fréitez		\N	\N	124	30145	\N	\N
40461	José María Blanco		\N	\N	124	30145	\N	\N
40462	Catedral		\N	\N	124	30146	\N	\N
40463	Concepción		\N	\N	124	30146	\N	\N
40464	El Cují		\N	\N	124	30146	\N	\N
40465	Juan de Villegas		\N	\N	124	30146	\N	\N
40466	Santa Rosa		\N	\N	124	30146	\N	\N
40467	Tamaca		\N	\N	124	30146	\N	\N
40468	Unión		\N	\N	124	30146	\N	\N
40469	Aguedo Felipe Alvarado		\N	\N	124	30146	\N	\N
40470	Buena Vista		\N	\N	124	30146	\N	\N
40471	Juárez		\N	\N	124	30146	\N	\N
40472	Juan Bautista Rodríguez		\N	\N	124	30147	\N	\N
40473	Cuara		\N	\N	124	30147	\N	\N
40474	Diego de Lozada		\N	\N	124	30147	\N	\N
40475	Paraíso de San José		\N	\N	124	30147	\N	\N
40476	San Miguel		\N	\N	124	30147	\N	\N
40477	Tintorero		\N	\N	124	30147	\N	\N
40478	José Bernardo Dorante		\N	\N	124	30147	\N	\N
40479	Coronel Mariano Peraza		\N	\N	124	30147	\N	\N
40480	Bolívar		\N	\N	124	30148	\N	\N
40481	Anzoátegui		\N	\N	124	30148	\N	\N
40482	Guarico		\N	\N	124	30148	\N	\N
40483	Hilario Luna y Luna		\N	\N	124	30148	\N	\N
40484	Humocaro Alto		\N	\N	124	30148	\N	\N
40485	Humocaro Bajo		\N	\N	124	30148	\N	\N
40486	La Candelaria		\N	\N	124	30148	\N	\N
40487	Morán		\N	\N	124	30148	\N	\N
40488	Cabudare		\N	\N	124	30149	\N	\N
40489	José Gregorio Bastidas		\N	\N	124	30149	\N	\N
40490	Agua Viva		\N	\N	124	30149	\N	\N
40491	Sarare		\N	\N	124	30150	\N	\N
40492	Buría		\N	\N	124	30150	\N	\N
40493	Gustavo Vegas León		\N	\N	124	30150	\N	\N
40494	Trinidad Samuel		\N	\N	124	30151	\N	\N
40495	Antonio Díaz		\N	\N	124	30151	\N	\N
40496	Camacaro		\N	\N	124	30151	\N	\N
40497	Castañeda		\N	\N	124	30151	\N	\N
40498	Cecilio Zubillaga		\N	\N	124	30151	\N	\N
40499	Chiquinquirá		\N	\N	124	30151	\N	\N
40500	El Blanco		\N	\N	124	30151	\N	\N
40501	Espinoza de los Monteros		\N	\N	124	30151	\N	\N
40502	Lara		\N	\N	124	30151	\N	\N
40503	Las Mercedes		\N	\N	124	30151	\N	\N
40504	Manuel Morillo		\N	\N	124	30151	\N	\N
40505	Montaña Verde		\N	\N	124	30151	\N	\N
40506	Montes de Oca		\N	\N	124	30151	\N	\N
40507	Torres		\N	\N	124	30151	\N	\N
40508	Heriberto Arroyo		\N	\N	124	30151	\N	\N
40509	Reyes Vargas		\N	\N	124	30151	\N	\N
40510	Altagracia		\N	\N	124	30151	\N	\N
40511	Siquisique		\N	\N	124	30152	\N	\N
40512	Moroturo		\N	\N	124	30152	\N	\N
40513	San Miguel		\N	\N	124	30152	\N	\N
40514	Xaguas		\N	\N	124	30152	\N	\N
40515	Presidente Betancourt		\N	\N	124	30179	\N	\N
40516	Presidente Páez		\N	\N	124	30179	\N	\N
40517	Presidente Rómulo Gallegos		\N	\N	124	30179	\N	\N
40518	Gabriel Picón González		\N	\N	124	30179	\N	\N
40519	Héctor Amable Mora		\N	\N	124	30179	\N	\N
40520	José Nucete Sardi		\N	\N	124	30179	\N	\N
40521	Pulido Méndez		\N	\N	124	30179	\N	\N
40522	La Azulita		\N	\N	124	30180	\N	\N
40523	Santa Cruz de Mora		\N	\N	124	30181	\N	\N
40524	Mesa Bolívar		\N	\N	124	30181	\N	\N
40525	Mesa de Las Palmas		\N	\N	124	30181	\N	\N
40526	Aricagua		\N	\N	124	30182	\N	\N
40527	San Antonio		\N	\N	124	30182	\N	\N
40528	Canagua		\N	\N	124	30183	\N	\N
40529	Capurí		\N	\N	124	30183	\N	\N
40530	Chacantá		\N	\N	124	30183	\N	\N
40531	El Molino		\N	\N	124	30183	\N	\N
40532	Guaimaral		\N	\N	124	30183	\N	\N
40533	Mucutuy		\N	\N	124	30183	\N	\N
40534	Mucuchachí		\N	\N	124	30183	\N	\N
40535	Fernández Peña		\N	\N	124	30184	\N	\N
40536	Matriz		\N	\N	124	30184	\N	\N
40537	Montalbán		\N	\N	124	30184	\N	\N
40538	Acequias		\N	\N	124	30184	\N	\N
40539	Jají		\N	\N	124	30184	\N	\N
40540	La Mesa		\N	\N	124	30184	\N	\N
40541	San José del Sur		\N	\N	124	30184	\N	\N
40542	Tucaní		\N	\N	124	30185	\N	\N
40543	Florencio Ramírez		\N	\N	124	30185	\N	\N
40544	Santo Domingo		\N	\N	124	30186	\N	\N
40545	Las Piedras		\N	\N	124	30186	\N	\N
40546	Guaraque		\N	\N	124	30187	\N	\N
40547	Mesa de Quintero		\N	\N	124	30187	\N	\N
40548	Río Negro		\N	\N	124	30187	\N	\N
40549	Arapuey		\N	\N	124	30188	\N	\N
40550	Palmira		\N	\N	124	30188	\N	\N
40551	San Cristóbal de Torondoy		\N	\N	124	30189	\N	\N
40552	Torondoy		\N	\N	124	30189	\N	\N
40553	Antonio Spinetti Dini		\N	\N	124	30190	\N	\N
40554	Arias		\N	\N	124	30190	\N	\N
40555	Caracciolo Parra Pérez		\N	\N	124	30190	\N	\N
40556	Domingo Peña		\N	\N	124	30190	\N	\N
40557	El Llano		\N	\N	124	30190	\N	\N
40558	Gonzalo Picón Febres		\N	\N	124	30190	\N	\N
40559	Jacinto Plaza		\N	\N	124	30190	\N	\N
40560	Juan Rodríguez Suárez		\N	\N	124	30190	\N	\N
40561	Lasso de la Vega		\N	\N	124	30190	\N	\N
40562	Mariano Picón Salas		\N	\N	124	30190	\N	\N
40563	Milla		\N	\N	124	30190	\N	\N
40564	Osuna Rodríguez		\N	\N	124	30190	\N	\N
40565	Sagrario		\N	\N	124	30190	\N	\N
40566	El Morro		\N	\N	124	30190	\N	\N
40567	Los Nevados		\N	\N	124	30190	\N	\N
40568	Andrés Eloy Blanco		\N	\N	124	30191	\N	\N
40569	La Venta		\N	\N	124	30191	\N	\N
40570	Piñango		\N	\N	124	30191	\N	\N
40571	Timotes		\N	\N	124	30191	\N	\N
40572	Eloy Paredes		\N	\N	124	30192	\N	\N
40573	San Rafael de Alcázar		\N	\N	124	30192	\N	\N
40574	Santa Elena de Arenales		\N	\N	124	30192	\N	\N
40575	Santa María de Caparo		\N	\N	124	30193	\N	\N
40576	Pueblo Llano		\N	\N	124	30194	\N	\N
40577	Cacute		\N	\N	124	30195	\N	\N
40578	La Toma		\N	\N	124	30195	\N	\N
40579	Mucuchíes		\N	\N	124	30195	\N	\N
40580	Mucurubá		\N	\N	124	30195	\N	\N
40581	San Rafael		\N	\N	124	30195	\N	\N
40582	Gerónimo Maldonado		\N	\N	124	30196	\N	\N
40583	Bailadores		\N	\N	124	30196	\N	\N
40584	Tabay		\N	\N	124	30197	\N	\N
40585	Chiguará		\N	\N	124	30198	\N	\N
40586	Estánquez		\N	\N	124	30198	\N	\N
40587	Lagunillas		\N	\N	124	30198	\N	\N
40588	La Trampa		\N	\N	124	30198	\N	\N
40589	Pueblo Nuevo del Sur		\N	\N	124	30198	\N	\N
40590	San Juan		\N	\N	124	30198	\N	\N
40591	El Amparo		\N	\N	124	30199	\N	\N
40592	El Llano		\N	\N	124	30199	\N	\N
40593	San Francisco		\N	\N	124	30199	\N	\N
40594	Tovar		\N	\N	124	30199	\N	\N
40595	Independencia		\N	\N	124	30200	\N	\N
40596	María de la Concepción Palacios Blanco		\N	\N	124	30200	\N	\N
40597	Nueva Bolivia		\N	\N	124	30200	\N	\N
40598	Santa Apolonia		\N	\N	124	30200	\N	\N
40599	Caño El Tigre		\N	\N	124	30201	\N	\N
40600	Zea		\N	\N	124	30201	\N	\N
40601	Aragüita		\N	\N	124	30223	\N	\N
40602	Arévalo González		\N	\N	124	30223	\N	\N
40603	Capaya		\N	\N	124	30223	\N	\N
40604	Caucagua		\N	\N	124	30223	\N	\N
40605	Panaquire		\N	\N	124	30223	\N	\N
40606	Ribas		\N	\N	124	30223	\N	\N
40607	El Café		\N	\N	124	30223	\N	\N
40608	Marizapa		\N	\N	124	30223	\N	\N
40609	Cumbo		\N	\N	124	30224	\N	\N
40610	San José de Barlovento		\N	\N	124	30224	\N	\N
40611	El Cafetal		\N	\N	124	30225	\N	\N
40612	Las Minas		\N	\N	124	30225	\N	\N
40613	Nuestra Señora del Rosario		\N	\N	124	30225	\N	\N
40614	Higuerote		\N	\N	124	30226	\N	\N
40615	Curiepe		\N	\N	124	30226	\N	\N
40616	Tacarigua de Brión		\N	\N	124	30226	\N	\N
40617	Mamporal		\N	\N	124	30227	\N	\N
40618	Carrizal		\N	\N	124	30228	\N	\N
40619	Chacao		\N	\N	124	30229	\N	\N
40620	Charallave		\N	\N	124	30230	\N	\N
40621	Las Brisas		\N	\N	124	30230	\N	\N
40622	El Hatillo		\N	\N	124	30231	\N	\N
40623	Altagracia de la Montaña		\N	\N	124	30232	\N	\N
40624	Cecilio Acosta		\N	\N	124	30232	\N	\N
40625	Los Teques		\N	\N	124	30232	\N	\N
40626	El Jarillo		\N	\N	124	30232	\N	\N
40627	San Pedro		\N	\N	124	30232	\N	\N
40628	Tácata		\N	\N	124	30232	\N	\N
40629	Paracotos		\N	\N	124	30232	\N	\N
40630	Cartanal		\N	\N	124	30233	\N	\N
40631	Santa Teresa del Tuy		\N	\N	124	30233	\N	\N
40632	La Democracia		\N	\N	124	30234	\N	\N
40633	Ocumare del Tuy		\N	\N	124	30234	\N	\N
40634	Santa Bárbara		\N	\N	124	30234	\N	\N
40635	San Antonio de los Altos		\N	\N	124	30235	\N	\N
40636	Río Chico		\N	\N	124	30236	\N	\N
40637	El Guapo		\N	\N	124	30236	\N	\N
40638	Tacarigua de la Laguna		\N	\N	124	30236	\N	\N
40639	Paparo		\N	\N	124	30236	\N	\N
40640	San Fernando del Guapo		\N	\N	124	30236	\N	\N
40641	Santa Lucía del Tuy		\N	\N	124	30237	\N	\N
40642	Cúpira		\N	\N	124	30238	\N	\N
40643	Machurucuto		\N	\N	124	30238	\N	\N
40644	Guarenas		\N	\N	124	30239	\N	\N
40645	San Antonio de Yare		\N	\N	124	30240	\N	\N
40646	San Francisco de Yare		\N	\N	124	30240	\N	\N
40647	Leoncio Martínez		\N	\N	124	30241	\N	\N
40648	Petare		\N	\N	124	30241	\N	\N
40649	Caucagüita		\N	\N	124	30241	\N	\N
40650	Filas de Mariche		\N	\N	124	30241	\N	\N
40651	La Dolorita		\N	\N	124	30241	\N	\N
40652	Cúa		\N	\N	124	30242	\N	\N
40653	Nueva Cúa		\N	\N	124	30242	\N	\N
40654	Guatire		\N	\N	124	30243	\N	\N
40655	Bolívar		\N	\N	124	30243	\N	\N
40656	San Antonio de Maturín		\N	\N	124	30258	\N	\N
40657	San Francisco de Maturín		\N	\N	124	30258	\N	\N
40658	Aguasay		\N	\N	124	30259	\N	\N
40659	Caripito		\N	\N	124	30260	\N	\N
40660	El Guácharo		\N	\N	124	30261	\N	\N
40661	La Guanota		\N	\N	124	30261	\N	\N
40662	Sabana de Piedra		\N	\N	124	30261	\N	\N
40663	San Agustín		\N	\N	124	30261	\N	\N
40664	Teresen		\N	\N	124	30261	\N	\N
40665	Caripe		\N	\N	124	30261	\N	\N
40666	Areo		\N	\N	124	30262	\N	\N
40667	Capital Cedeño		\N	\N	124	30262	\N	\N
40668	San Félix de Cantalicio		\N	\N	124	30262	\N	\N
40669	Viento Fresco		\N	\N	124	30262	\N	\N
40670	El Tejero		\N	\N	124	30263	\N	\N
40671	Punta de Mata		\N	\N	124	30263	\N	\N
40672	Chaguaramas		\N	\N	124	30264	\N	\N
40673	Las Alhuacas		\N	\N	124	30264	\N	\N
40674	Tabasca		\N	\N	124	30264	\N	\N
40675	Temblador		\N	\N	124	30264	\N	\N
40676	Alto de los Godos		\N	\N	124	30265	\N	\N
40677	Boquerón		\N	\N	124	30265	\N	\N
40678	Las Cocuizas		\N	\N	124	30265	\N	\N
40679	La Cruz		\N	\N	124	30265	\N	\N
40680	San Simón		\N	\N	124	30265	\N	\N
40681	El Corozo		\N	\N	124	30265	\N	\N
40682	El Furrial		\N	\N	124	30265	\N	\N
40683	Jusepín		\N	\N	124	30265	\N	\N
40684	La Pica		\N	\N	124	30265	\N	\N
40685	San Vicente		\N	\N	124	30265	\N	\N
40686	Aparicio		\N	\N	124	30266	\N	\N
40687	Aragua de Maturín		\N	\N	124	30266	\N	\N
40688	Chaguamal		\N	\N	124	30266	\N	\N
40689	El Pinto		\N	\N	124	30266	\N	\N
40690	Guanaguana		\N	\N	124	30266	\N	\N
40691	La Toscana		\N	\N	124	30266	\N	\N
40692	Taguaya		\N	\N	124	30266	\N	\N
40693	Cachipo		\N	\N	124	30267	\N	\N
40694	Quiriquire		\N	\N	124	30267	\N	\N
40695	Santa Bárbara		\N	\N	124	30268	\N	\N
40696	Barrancas		\N	\N	124	30269	\N	\N
40697	Los Barrancos de Fajardo		\N	\N	124	30269	\N	\N
40698	Uracoa		\N	\N	124	30270	\N	\N
40699	Antolín del Campo		\N	\N	124	30271	\N	\N
40700	Arismendi		\N	\N	124	30272	\N	\N
40701	García		\N	\N	124	30273	\N	\N
40702	Francisco Fajardo		\N	\N	124	30273	\N	\N
40703	Bolívar		\N	\N	124	30274	\N	\N
40704	Guevara		\N	\N	124	30274	\N	\N
40705	Matasiete		\N	\N	124	30274	\N	\N
40706	Santa Ana		\N	\N	124	30274	\N	\N
40707	Sucre		\N	\N	124	30274	\N	\N
40708	Aguirre		\N	\N	124	30275	\N	\N
40709	Maneiro		\N	\N	124	30275	\N	\N
40710	Adrián		\N	\N	124	30276	\N	\N
40711	Juan Griego		\N	\N	124	30276	\N	\N
40712	Yaguaraparo		\N	\N	124	30276	\N	\N
40713	Porlamar		\N	\N	124	30277	\N	\N
40714	San Francisco de Macanao		\N	\N	124	30278	\N	\N
40715	Boca de Río		\N	\N	124	30278	\N	\N
40716	Tubores		\N	\N	124	30279	\N	\N
40717	Los Baleales		\N	\N	124	30279	\N	\N
40718	Vicente Fuentes		\N	\N	124	30280	\N	\N
40719	Villalba		\N	\N	124	30280	\N	\N
40720	San Juan Bautista		\N	\N	124	30281	\N	\N
40721	Zabala		\N	\N	124	30281	\N	\N
40722	Capital Araure		\N	\N	124	30283	\N	\N
40723	Río Acarigua		\N	\N	124	30283	\N	\N
40724	Capital Esteller		\N	\N	124	30284	\N	\N
40725	Uveral		\N	\N	124	30284	\N	\N
40726	Guanare		\N	\N	124	30285	\N	\N
40727	Córdoba		\N	\N	124	30285	\N	\N
40728	San José de la Montaña		\N	\N	124	30285	\N	\N
40729	San Juan de Guanaguanare		\N	\N	124	30285	\N	\N
40730	Virgen de la Coromoto		\N	\N	124	30285	\N	\N
40731	Guanarito		\N	\N	124	30286	\N	\N
40732	Trinidad de la Capilla		\N	\N	124	30286	\N	\N
40733	Divina Pastora		\N	\N	124	30286	\N	\N
40734	Monseñor José Vicente de Unda		\N	\N	124	30287	\N	\N
40735	Peña Blanca		\N	\N	124	30287	\N	\N
40736	Capital Ospino		\N	\N	124	30288	\N	\N
40737	Aparición		\N	\N	124	30288	\N	\N
40738	La Estación		\N	\N	124	30288	\N	\N
40739	Páez		\N	\N	124	30289	\N	\N
40740	Payara		\N	\N	124	30289	\N	\N
40741	Pimpinela		\N	\N	124	30289	\N	\N
40742	Ramón Peraza		\N	\N	124	30289	\N	\N
40743	Papelón		\N	\N	124	30290	\N	\N
40744	Caño Delgadito		\N	\N	124	30290	\N	\N
40745	San Genaro de Boconoito		\N	\N	124	30291	\N	\N
40746	Antolín Tovar		\N	\N	124	30291	\N	\N
40747	San Rafael de Onoto		\N	\N	124	30292	\N	\N
40748	Santa Fe		\N	\N	124	30292	\N	\N
40749	Thermo Morles		\N	\N	124	30292	\N	\N
40750	Santa Rosalía		\N	\N	124	30293	\N	\N
40751	Florida		\N	\N	124	30293	\N	\N
40752	Sucre		\N	\N	124	30294	\N	\N
40753	Concepción		\N	\N	124	30294	\N	\N
40754	San Rafael de Palo Alzado		\N	\N	124	30294	\N	\N
40755	Uvencio Antonio Velásquez		\N	\N	124	30294	\N	\N
40756	San José de Saguaz		\N	\N	124	30294	\N	\N
40757	Villa Rosa		\N	\N	124	30294	\N	\N
40758	Turén		\N	\N	124	30295	\N	\N
40759	Canelones		\N	\N	124	30295	\N	\N
40760	Santa Cruz		\N	\N	124	30295	\N	\N
40761	San Isidro Labrador		\N	\N	124	30295	\N	\N
40762	Mariño		\N	\N	124	30296	\N	\N
40763	Rómulo Gallegos		\N	\N	124	30296	\N	\N
40764	San José de Aerocuar		\N	\N	124	30297	\N	\N
40765	Tavera Acosta		\N	\N	124	30297	\N	\N
40766	Río Caribe		\N	\N	124	30298	\N	\N
40767	Antonio José de Sucre		\N	\N	124	30298	\N	\N
40768	El Morro de Puerto Santo		\N	\N	124	30298	\N	\N
40769	Puerto Santo		\N	\N	124	30298	\N	\N
40770	San Juan de las Galdonas		\N	\N	124	30298	\N	\N
40771	El Pilar		\N	\N	124	30299	\N	\N
40772	El Rincón		\N	\N	124	30299	\N	\N
40773	General Francisco Antonio Váquez		\N	\N	124	30299	\N	\N
40774	Guaraúnos		\N	\N	124	30299	\N	\N
40775	Tunapuicito		\N	\N	124	30299	\N	\N
40776	Unión		\N	\N	124	30299	\N	\N
40777	Santa Catalina		\N	\N	124	30300	\N	\N
40778	Santa Rosa		\N	\N	124	30300	\N	\N
40779	Santa Teresa		\N	\N	124	30300	\N	\N
40780	Bolívar		\N	\N	124	30300	\N	\N
40781	Maracapana		\N	\N	124	30300	\N	\N
40782	Libertad		\N	\N	124	30302	\N	\N
40783	El Paujil		\N	\N	124	30302	\N	\N
40784	Yaguaraparo		\N	\N	124	30302	\N	\N
40785	Cruz Salmerón Acosta		\N	\N	124	30303	\N	\N
40786	Chacopata		\N	\N	124	30303	\N	\N
40787	Manicuare		\N	\N	124	30303	\N	\N
40788	Tunapuy		\N	\N	124	30304	\N	\N
40789	Campo Elías		\N	\N	124	30304	\N	\N
40790	Irapa		\N	\N	124	30305	\N	\N
40791	Campo Claro		\N	\N	124	30305	\N	\N
40792	Maraval		\N	\N	124	30305	\N	\N
40793	San Antonio de Irapa		\N	\N	124	30305	\N	\N
40794	Soro		\N	\N	124	30305	\N	\N
40795	Mejía		\N	\N	124	30306	\N	\N
40796	Cumanacoa		\N	\N	124	30307	\N	\N
40797	Arenas		\N	\N	124	30307	\N	\N
40798	Aricagua		\N	\N	124	30307	\N	\N
40799	Cogollar		\N	\N	124	30307	\N	\N
40800	San Fernando		\N	\N	124	30307	\N	\N
40801	San Lorenzo		\N	\N	124	30307	\N	\N
40802	Villa Frontado Muelle de Cariaco)		\N	\N	124	30308	\N	\N
40803	Catuaro		\N	\N	124	30308	\N	\N
40804	Rendón		\N	\N	124	30308	\N	\N
40805	San Cruz		\N	\N	124	30308	\N	\N
40806	Santa María		\N	\N	124	30308	\N	\N
40807	Altagracia		\N	\N	124	30309	\N	\N
40808	Santa Inés		\N	\N	124	30309	\N	\N
40809	Valentín Valiente		\N	\N	124	30309	\N	\N
40810	Ayacucho		\N	\N	124	30309	\N	\N
40811	San Juan		\N	\N	124	30309	\N	\N
40812	Raúl Leoni		\N	\N	124	30309	\N	\N
40813	Gran Mariscal		\N	\N	124	30309	\N	\N
40814	Cristóbal Colón		\N	\N	124	30310	\N	\N
40815	Bideau		\N	\N	124	30310	\N	\N
40816	Punta de Piedras		\N	\N	124	30310	\N	\N
40817	Güiria		\N	\N	124	30310	\N	\N
40818	Andrés Bello		\N	\N	124	30341	\N	\N
40819	Antonio Rómulo Costa		\N	\N	124	30342	\N	\N
40820	Ayacucho		\N	\N	124	30343	\N	\N
40821	Rivas Berti		\N	\N	124	30343	\N	\N
40822	San Pedro del Río		\N	\N	124	30343	\N	\N
40823	Bolívar		\N	\N	124	30344	\N	\N
40824	Palotal		\N	\N	124	30344	\N	\N
40825	General Juan Vicente Gómez		\N	\N	124	30344	\N	\N
40826	Isaías Medina Angarita		\N	\N	124	30344	\N	\N
40827	Cárdenas		\N	\N	124	30345	\N	\N
40828	Amenodoro Ángel Lamus		\N	\N	124	30345	\N	\N
40829	La Florida		\N	\N	124	30345	\N	\N
40830	Córdoba		\N	\N	124	30346	\N	\N
40831	Fernández Feo		\N	\N	124	30347	\N	\N
40832	Alberto Adriani		\N	\N	124	30347	\N	\N
40833	Santo Domingo		\N	\N	124	30347	\N	\N
40834	Francisco de Miranda		\N	\N	124	30348	\N	\N
40835	García de Hevia		\N	\N	124	30349	\N	\N
40836	Boca de Grita		\N	\N	124	30349	\N	\N
40837	José Antonio Páez		\N	\N	124	30349	\N	\N
40838	Guásimos		\N	\N	124	30350	\N	\N
40839	Independencia		\N	\N	124	30351	\N	\N
40840	Juan Germán Roscio		\N	\N	124	30351	\N	\N
40841	Román Cárdenas		\N	\N	124	30351	\N	\N
40842	Jáuregui		\N	\N	124	30352	\N	\N
40843	Emilio Constantino Guerrero		\N	\N	124	30352	\N	\N
40844	Monseñor Miguel Antonio Salas		\N	\N	124	30352	\N	\N
40845	José María Vargas		\N	\N	124	30353	\N	\N
40846	Junín		\N	\N	124	30354	\N	\N
40847	La Petrólea		\N	\N	124	30354	\N	\N
40848	Quinimarí		\N	\N	124	30354	\N	\N
40849	Bramón		\N	\N	124	30354	\N	\N
40850	Libertad		\N	\N	124	30355	\N	\N
40851	Cipriano Castro		\N	\N	124	30355	\N	\N
40852	Manuel Felipe Rugeles		\N	\N	124	30355	\N	\N
40853	Libertador		\N	\N	124	30356	\N	\N
40854	Doradas		\N	\N	124	30356	\N	\N
40855	Emeterio Ochoa		\N	\N	124	30356	\N	\N
40856	San Joaquín de Navay		\N	\N	124	30356	\N	\N
40857	Lobatera		\N	\N	124	30357	\N	\N
40858	Constitución		\N	\N	124	30357	\N	\N
40859	Michelena		\N	\N	124	30358	\N	\N
40860	Panamericano		\N	\N	124	30359	\N	\N
40861	La Palmita		\N	\N	124	30359	\N	\N
40862	Pedro María Ureña		\N	\N	124	30360	\N	\N
40863	Nueva Arcadia		\N	\N	124	30360	\N	\N
40864	Delicias		\N	\N	124	30361	\N	\N
40865	Pecaya		\N	\N	124	30361	\N	\N
40866	Samuel Darío Maldonado		\N	\N	124	30362	\N	\N
40867	Boconó		\N	\N	124	30362	\N	\N
40868	Hernández		\N	\N	124	30362	\N	\N
40869	La Concordia		\N	\N	124	30363	\N	\N
40870	San Juan Bautista		\N	\N	124	30363	\N	\N
40871	Pedro María Morantes		\N	\N	124	30363	\N	\N
40872	San Sebastián		\N	\N	124	30363	\N	\N
40873	Dr. Francisco Romero Lobo		\N	\N	124	30363	\N	\N
40874	Seboruco		\N	\N	124	30364	\N	\N
40875	Simón Rodríguez		\N	\N	124	30365	\N	\N
40876	Sucre		\N	\N	124	30366	\N	\N
40877	Eleazar López Contreras		\N	\N	124	30366	\N	\N
40878	San Pablo		\N	\N	124	30366	\N	\N
40879	Torbes		\N	\N	124	30367	\N	\N
40880	Uribante		\N	\N	124	30368	\N	\N
40881	Cárdenas		\N	\N	124	30368	\N	\N
40882	Juan Pablo Peñalosa		\N	\N	124	30368	\N	\N
40883	Potosí		\N	\N	124	30368	\N	\N
40884	San Judas Tadeo		\N	\N	124	30369	\N	\N
40885	Araguaney		\N	\N	124	30370	\N	\N
40886	El Jaguito		\N	\N	124	30370	\N	\N
40887	La Esperanza		\N	\N	124	30370	\N	\N
40888	Santa Isabel		\N	\N	124	30370	\N	\N
40889	Boconó		\N	\N	124	30371	\N	\N
40890	El Carmen		\N	\N	124	30371	\N	\N
40891	Mosquey		\N	\N	124	30371	\N	\N
40892	Ayacucho		\N	\N	124	30371	\N	\N
40893	Burbusay		\N	\N	124	30371	\N	\N
40894	General Ribas		\N	\N	124	30371	\N	\N
40895	Guaramacal		\N	\N	124	30371	\N	\N
40896	Vega de Guaramacal		\N	\N	124	30371	\N	\N
40897	Monseñor Jáuregui		\N	\N	124	30371	\N	\N
40898	Rafael Rangel		\N	\N	124	30371	\N	\N
40899	San Miguel		\N	\N	124	30371	\N	\N
40900	San José		\N	\N	124	30371	\N	\N
40901	Sabana Grande		\N	\N	124	30372	\N	\N
40902	Cheregüé		\N	\N	124	30372	\N	\N
40903	Granados		\N	\N	124	30372	\N	\N
40904	Arnoldo Gabaldón		\N	\N	124	30373	\N	\N
40905	Bolivia		\N	\N	124	30373	\N	\N
40906	Carrillo		\N	\N	124	30373	\N	\N
40907	Cegarra		\N	\N	124	30373	\N	\N
40908	Chejendé		\N	\N	124	30373	\N	\N
40909	Manuel Salvador Ulloa		\N	\N	124	30373	\N	\N
40910	San José		\N	\N	124	30373	\N	\N
40911	Carache		\N	\N	124	30374	\N	\N
40912	La Concepción		\N	\N	124	30374	\N	\N
40913	Cuicas		\N	\N	124	30374	\N	\N
40914	Panamericana		\N	\N	124	30374	\N	\N
40915	Santa Cruz		\N	\N	124	30374	\N	\N
40916	Escuque		\N	\N	124	30375	\N	\N
40917	La Unión		\N	\N	124	30375	\N	\N
40918	Santa Rita		\N	\N	124	30375	\N	\N
40919	Sabana Libre		\N	\N	124	30375	\N	\N
40920	El Socorro		\N	\N	124	30376	\N	\N
40921	Los Caprichos		\N	\N	124	30376	\N	\N
40922	Antonio José de Sucre		\N	\N	124	30376	\N	\N
40923	Campo Elías		\N	\N	124	30377	\N	\N
40924	Arnoldo Gabaldón		\N	\N	124	30377	\N	\N
40925	Santa Apolonia		\N	\N	124	30378	\N	\N
40926	El Progreso		\N	\N	124	30378	\N	\N
40927	La Ceiba		\N	\N	124	30378	\N	\N
40928	Tres de Febrero		\N	\N	124	30378	\N	\N
40929	El Dividive		\N	\N	124	30379	\N	\N
40930	Agua Santa		\N	\N	124	30379	\N	\N
40931	Agua Caliente		\N	\N	124	30379	\N	\N
40932	El Cenizo		\N	\N	124	30379	\N	\N
40933	Valerita		\N	\N	124	30379	\N	\N
40934	Monte Carmelo		\N	\N	124	30380	\N	\N
40935	Buena Vista		\N	\N	124	30380	\N	\N
40936	Santa María del Horcón		\N	\N	124	30380	\N	\N
40937	Motatán		\N	\N	124	30381	\N	\N
40938	El Baño		\N	\N	124	30381	\N	\N
40939	Jalisco		\N	\N	124	30381	\N	\N
40940	Pampán		\N	\N	124	30382	\N	\N
40941	Flor de Patria		\N	\N	124	30382	\N	\N
40942	La Paz		\N	\N	124	30382	\N	\N
40943	Santa Ana		\N	\N	124	30382	\N	\N
40944	Pampanito		\N	\N	124	30383	\N	\N
40945	La Concepción		\N	\N	124	30383	\N	\N
40946	Pampanito II		\N	\N	124	30383	\N	\N
40947	Betijoque		\N	\N	124	30384	\N	\N
40948	José Gregorio Hernández		\N	\N	124	30384	\N	\N
40949	La Pueblita		\N	\N	124	30384	\N	\N
40950	Los Cedros		\N	\N	124	30384	\N	\N
40951	Carvajal		\N	\N	124	30385	\N	\N
40952	Campo Alegre		\N	\N	124	30385	\N	\N
40953	Antonio Nicolás Briceño		\N	\N	124	30385	\N	\N
40954	José Leonardo Suárez		\N	\N	124	30385	\N	\N
40955	Sabana de Mendoza		\N	\N	124	30386	\N	\N
40956	Junín		\N	\N	124	30386	\N	\N
40957	Valmore Rodríguez		\N	\N	124	30386	\N	\N
40958	El Paraíso		\N	\N	124	30386	\N	\N
40959	Andrés Linares		\N	\N	124	30387	\N	\N
40960	Chiquinquirá		\N	\N	124	30387	\N	\N
40961	Cristóbal Mendoza		\N	\N	124	30387	\N	\N
40962	Cruz Carrillo		\N	\N	124	30387	\N	\N
40963	Matriz		\N	\N	124	30387	\N	\N
40964	Monseñor Carrillo		\N	\N	124	30387	\N	\N
40965	Tres Esquinas		\N	\N	124	30387	\N	\N
40966	Cabimbú		\N	\N	124	30388	\N	\N
40967	Jajó		\N	\N	124	30388	\N	\N
40968	La Mesa de Esnujaque		\N	\N	124	30388	\N	\N
40969	Santiago		\N	\N	124	30388	\N	\N
40970	Tuñame		\N	\N	124	30388	\N	\N
40971	La Quebrada		\N	\N	124	30388	\N	\N
40972	Juan Ignacio Montilla		\N	\N	124	30389	\N	\N
40973	La Beatriz		\N	\N	124	30389	\N	\N
40974	La Puerta		\N	\N	124	30389	\N	\N
40975	Mendoza del Valle de Momboy		\N	\N	124	30389	\N	\N
40976	Mercedes Díaz		\N	\N	124	30389	\N	\N
40977	San Luis		\N	\N	124	30389	\N	\N
40978	Caraballeda		\N	\N	124	30390	\N	\N
40979	Carayaca		\N	\N	124	30390	\N	\N
40980	Carlos Soublette		\N	\N	124	30390	\N	\N
40981	Caruao Chuspa		\N	\N	124	30390	\N	\N
40982	Catia La Mar		\N	\N	124	30390	\N	\N
40983	El Junko		\N	\N	124	30390	\N	\N
40984	La Guaira		\N	\N	124	30390	\N	\N
40985	Macuto		\N	\N	124	30390	\N	\N
40986	Maiquetía		\N	\N	124	30390	\N	\N
40987	Naiguatá		\N	\N	124	30390	\N	\N
40988	Urimare		\N	\N	124	30390	\N	\N
40989	Arístides Bastidas		\N	\N	124	30391	\N	\N
40990	Bolívar		\N	\N	124	30392	\N	\N
40991	Chivacoa		\N	\N	124	30407	\N	\N
40992	Campo Elías		\N	\N	124	30407	\N	\N
40993	Cocorote		\N	\N	124	30408	\N	\N
40994	Independencia		\N	\N	124	30409	\N	\N
40995	José Antonio Páez		\N	\N	124	30410	\N	\N
40996	La Trinidad		\N	\N	124	30411	\N	\N
40997	Manuel Monge		\N	\N	124	30412	\N	\N
40998	Salóm		\N	\N	124	30413	\N	\N
40999	Temerla		\N	\N	124	30413	\N	\N
41000	Nirgua		\N	\N	124	30413	\N	\N
41001	San Andrés		\N	\N	124	30414	\N	\N
41002	Yaritagua		\N	\N	124	30414	\N	\N
41003	San Javier		\N	\N	124	30415	\N	\N
41004	Albarico		\N	\N	124	30415	\N	\N
41005	San Felipe		\N	\N	124	30415	\N	\N
41006	Sucre		\N	\N	124	30416	\N	\N
41007	Urachiche		\N	\N	124	30417	\N	\N
41008	El Guayabo		\N	\N	124	30418	\N	\N
41009	Farriar		\N	\N	124	30418	\N	\N
41010	Isla de Toas		\N	\N	124	30441	\N	\N
41011	Monagas		\N	\N	124	30441	\N	\N
41012	San Timoteo		\N	\N	124	30442	\N	\N
41013	General Urdaneta		\N	\N	124	30442	\N	\N
41014	Libertador		\N	\N	124	30442	\N	\N
41015	Marcelino Briceño		\N	\N	124	30442	\N	\N
41016	Pueblo Nuevo		\N	\N	124	30442	\N	\N
41017	Manuel Guanipa Matos		\N	\N	124	30442	\N	\N
41018	Ambrosio		\N	\N	124	30443	\N	\N
41019	Carmen Herrera		\N	\N	124	30443	\N	\N
41020	La Rosa		\N	\N	124	30443	\N	\N
41021	Germán Ríos Linares		\N	\N	124	30443	\N	\N
41022	San Benito		\N	\N	124	30443	\N	\N
41023	Rómulo Betancourt		\N	\N	124	30443	\N	\N
41024	Jorge Hernández		\N	\N	124	30443	\N	\N
41025	Punta Gorda		\N	\N	124	30443	\N	\N
41026	Arístides Calvani		\N	\N	124	30443	\N	\N
41027	Encontrados		\N	\N	124	30444	\N	\N
41028	Udón Pérez		\N	\N	124	30444	\N	\N
41029	Moralito		\N	\N	124	30445	\N	\N
41030	San Carlos del Zulia		\N	\N	124	30445	\N	\N
41031	Santa Cruz del Zulia		\N	\N	124	30445	\N	\N
41032	Santa Bárbara		\N	\N	124	30445	\N	\N
41033	Urribarrí		\N	\N	124	30445	\N	\N
41034	Carlos Quevedo		\N	\N	124	30446	\N	\N
41035	Francisco Javier Pulgar		\N	\N	124	30446	\N	\N
41036	Simón Rodríguez		\N	\N	124	30446	\N	\N
41037	Guamo-Gavilanes		\N	\N	124	30446	\N	\N
41038	La Concepción		\N	\N	124	30448	\N	\N
41039	San José		\N	\N	124	30448	\N	\N
41040	Mariano Parra León		\N	\N	124	30448	\N	\N
41041	José Ramón Yépez		\N	\N	124	30448	\N	\N
41042	Jesús María Semprún		\N	\N	124	30449	\N	\N
41043	Barí		\N	\N	124	30449	\N	\N
41044	Concepción		\N	\N	124	30450	\N	\N
41045	Andrés Bello		\N	\N	124	30450	\N	\N
41046	Chiquinquirá		\N	\N	124	30450	\N	\N
41047	El Carmelo		\N	\N	124	30450	\N	\N
41048	Potreritos		\N	\N	124	30450	\N	\N
41049	Libertad		\N	\N	124	30451	\N	\N
41050	Alonso de Ojeda		\N	\N	124	30451	\N	\N
41051	Venezuela		\N	\N	124	30451	\N	\N
41052	Eleazar López Contreras		\N	\N	124	30451	\N	\N
41053	Campo Lara		\N	\N	124	30451	\N	\N
41054	Bartolomé de las Casas		\N	\N	124	30452	\N	\N
41055	Libertad		\N	\N	124	30452	\N	\N
41056	Río Negro		\N	\N	124	30452	\N	\N
41057	San José de Perijá		\N	\N	124	30452	\N	\N
41058	San Rafael		\N	\N	124	30453	\N	\N
41059	La Sierrita		\N	\N	124	30453	\N	\N
41060	Las Parcelas		\N	\N	124	30453	\N	\N
41061	Luis de Vicente		\N	\N	124	30453	\N	\N
41062	Monseñor Marcos Sergio Godoy		\N	\N	124	30453	\N	\N
41063	Ricaurte		\N	\N	124	30453	\N	\N
41064	Tamare		\N	\N	124	30453	\N	\N
41065	Antonio Borjas Romero		\N	\N	124	30454	\N	\N
41066	Bolívar		\N	\N	124	30454	\N	\N
41067	Cacique Mara		\N	\N	124	30454	\N	\N
41068	Carracciolo Parra Pérez		\N	\N	124	30454	\N	\N
41069	Cecilio Acosta		\N	\N	124	30454	\N	\N
41070	Cristo de Aranza		\N	\N	124	30454	\N	\N
41071	Coquivacoa		\N	\N	124	30454	\N	\N
41072	Chiquinquirá		\N	\N	124	30454	\N	\N
41073	Francisco Eugenio Bustamante		\N	\N	124	30454	\N	\N
41074	Idelfonzo Vásquez		\N	\N	124	30454	\N	\N
41075	Juana de Ávila		\N	\N	124	30454	\N	\N
41076	Luis Hurtado Higuera		\N	\N	124	30454	\N	\N
41077	Manuel Dagnino		\N	\N	124	30454	\N	\N
41078	Olegario Villalobos		\N	\N	124	30454	\N	\N
41079	Raúl Leoni		\N	\N	124	30454	\N	\N
41080	Santa Lucía		\N	\N	124	30454	\N	\N
41081	Venancio Pulgar		\N	\N	124	30454	\N	\N
41082	San Isidro		\N	\N	124	30454	\N	\N
41083	Altagracia		\N	\N	124	30455	\N	\N
41084	Faría		\N	\N	124	30455	\N	\N
41085	Ana María Campos		\N	\N	124	30455	\N	\N
41086	San Antonio		\N	\N	124	30455	\N	\N
41087	San José		\N	\N	124	30455	\N	\N
41088	Donaldo García		\N	\N	124	30456	\N	\N
41089	El Rosario		\N	\N	124	30456	\N	\N
41090	Sixto Zambrano		\N	\N	124	30456	\N	\N
41091	San Francisco		\N	\N	124	30457	\N	\N
41092	El Bajo		\N	\N	124	30457	\N	\N
41093	Domitila Flores		\N	\N	124	30457	\N	\N
41094	Francisco Ochoa		\N	\N	124	30457	\N	\N
41095	Los Cortijos		\N	\N	124	30457	\N	\N
41096	Marcial Hernández		\N	\N	124	30457	\N	\N
41097	Santa Rita		\N	\N	124	30458	\N	\N
41098	El Mene		\N	\N	124	30458	\N	\N
41099	Pedro Lucas Urribarrí		\N	\N	124	30458	\N	\N
41100	José Cenobio Urribarrí		\N	\N	124	30458	\N	\N
41101	Rafael Maria Baralt		\N	\N	124	30459	\N	\N
41102	Manuel Manrique		\N	\N	124	30459	\N	\N
41103	Rafael Urdaneta		\N	\N	124	30459	\N	\N
41104	Bobures		\N	\N	124	30460	\N	\N
41105	Gibraltar		\N	\N	124	30460	\N	\N
41106	Heras		\N	\N	124	30460	\N	\N
41107	Monseñor Arturo Álvarez		\N	\N	124	30460	\N	\N
41108	Rómulo Gallegos		\N	\N	124	30460	\N	\N
41109	El Batey		\N	\N	124	30460	\N	\N
41110	Rafael Urdaneta		\N	\N	124	30461	\N	\N
41111	La Victoria		\N	\N	124	30461	\N	\N
41112	Raúl Cuenca		\N	\N	124	30461	\N	\N
41113	Sinamaica		\N	\N	124	30447	\N	\N
41114	Alta Guajira		\N	\N	124	30447	\N	\N
41115	Elías Sánchez Rubio		\N	\N	124	30447	\N	\N
41116	Guajira		\N	\N	124	30447	\N	\N
41117	Altagracia		\N	\N	124	30462	\N	\N
41118	Antímano		\N	\N	124	30462	\N	\N
41119	Caricuao		\N	\N	124	30462	\N	\N
41120	Catedral		\N	\N	124	30462	\N	\N
41121	Coche		\N	\N	124	30462	\N	\N
41122	El Junquito		\N	\N	124	30462	\N	\N
41123	El Paraíso		\N	\N	124	30462	\N	\N
41124	El Recreo		\N	\N	124	30462	\N	\N
41125	El Valle		\N	\N	124	30462	\N	\N
41126	La Candelaria		\N	\N	124	30462	\N	\N
41127	La Pastora		\N	\N	124	30462	\N	\N
41128	La Vega		\N	\N	124	30462	\N	\N
41129	Macarao		\N	\N	124	30462	\N	\N
41130	San Agustín		\N	\N	124	30462	\N	\N
41131	San Bernardino		\N	\N	124	30462	\N	\N
41132	San José		\N	\N	124	30462	\N	\N
41133	San Juan		\N	\N	124	30462	\N	\N
41134	San Pedro		\N	\N	124	30462	\N	\N
41135	Santa Rosalía		\N	\N	124	30462	\N	\N
41136	Santa Teresa		\N	\N	124	30462	\N	\N
41137	Sucre (Catia)		\N	\N	124	30462	\N	\N
100003	faImage	x	\N	0	27	\N	\N	\N
100005	faMap	s	\N	\N	27	\N	100005	\N
99	aaafaUserSecret		\N	\N	27	\N	99	\N
101	aaafaVenus		\N	\N	27	\N	101	\N
102	aaafaComputer		\N	\N	27	\N	102	\N
8000	fa0		\N	\N	27	\N	8000	\N
8001	fa1		\N	\N	27	\N	8001	\N
8002	fa2		\N	\N	27	\N	8002	\N
8003	fa3		\N	\N	27	\N	8003	\N
8004	fa4		\N	\N	27	\N	8004	\N
8005	fa5		\N	\N	27	\N	8005	\N
8006	fa6		\N	\N	27	\N	8006	\N
8007	fa7		\N	\N	27	\N	8007	\N
8008	fa8		\N	\N	27	\N	8008	\N
8009	fa9		\N	\N	27	\N	8009	\N
8010	fa42Group		\N	\N	27	\N	8010	\N
8011	fa500px		\N	\N	27	\N	8011	\N
8012	faA		\N	\N	27	\N	8012	\N
8013	faAccessibleIcon		\N	\N	27	\N	8013	\N
8014	faAccusoft		\N	\N	27	\N	8014	\N
8015	faAddressBook		\N	\N	27	\N	8015	\N
8016	faAddressCard		\N	\N	27	\N	8016	\N
8017	faAdn		\N	\N	27	\N	8017	\N
8018	faAdversal		\N	\N	27	\N	8018	\N
8019	faAffiliatetheme		\N	\N	27	\N	8019	\N
8021	faAlgolia		\N	\N	27	\N	8021	\N
8022	faAlignCenter		\N	\N	27	\N	8022	\N
8023	faAlignJustify		\N	\N	27	\N	8023	\N
8024	faAlignLeft		\N	\N	27	\N	8024	\N
8025	faAlignRight		\N	\N	27	\N	8025	\N
8026	faAlipay		\N	\N	27	\N	8026	\N
8027	faAmazon		\N	\N	27	\N	8027	\N
8028	faAmazonPay		\N	\N	27	\N	8028	\N
8029	faAmilia		\N	\N	27	\N	8029	\N
8030	faAnchor		\N	\N	27	\N	8030	\N
8031	faAnchorCircleCheck		\N	\N	27	\N	8031	\N
8032	faAnchorCircleExclamation		\N	\N	27	\N	8032	\N
8033	faAnchorCircleXmark		\N	\N	27	\N	8033	\N
8034	faAnchorLock		\N	\N	27	\N	8034	\N
8035	faAndroid		\N	\N	27	\N	8035	\N
8036	faAngellist		\N	\N	27	\N	8036	\N
8037	faAngleDown		\N	\N	27	\N	8037	\N
8038	faAngleLeft		\N	\N	27	\N	8038	\N
8039	faAngleRight		\N	\N	27	\N	8039	\N
8040	faAngleUp		\N	\N	27	\N	8040	\N
8041	faAnglesDown		\N	\N	27	\N	8041	\N
8042	faAnglesLeft		\N	\N	27	\N	8042	\N
8043	faAnglesRight		\N	\N	27	\N	8043	\N
8044	faAnglesUp		\N	\N	27	\N	8044	\N
8045	faAngrycreative		\N	\N	27	\N	8045	\N
8046	faAngular		\N	\N	27	\N	8046	\N
8047	faAnkh		\N	\N	27	\N	8047	\N
8048	faAppStore		\N	\N	27	\N	8048	\N
8049	faAppStoreIos		\N	\N	27	\N	8049	\N
8050	faApper		\N	\N	27	\N	8050	\N
8051	faApple		\N	\N	27	\N	8051	\N
8052	faApplePay		\N	\N	27	\N	8052	\N
8053	faAppleWhole		\N	\N	27	\N	8053	\N
8054	faArchway		\N	\N	27	\N	8054	\N
8055	faArrowDown		\N	\N	27	\N	8055	\N
8056	faArrowDown19		\N	\N	27	\N	8056	\N
8057	faArrowDown91		\N	\N	27	\N	8057	\N
8058	faArrowDownAZ		\N	\N	27	\N	8058	\N
8059	faArrowDownLong		\N	\N	27	\N	8059	\N
8060	faArrowDownShortWide		\N	\N	27	\N	8060	\N
8061	faArrowDownUpAcrossLine		\N	\N	27	\N	8061	\N
8062	faArrowDownUpLock		\N	\N	27	\N	8062	\N
8063	faArrowDownWideShort		\N	\N	27	\N	8063	\N
8064	faArrowDownZA		\N	\N	27	\N	8064	\N
8020	faAirbnb		\N	\N	27	\N	8020	\N
41138	23 de enero		\N	\N	124	30462	100004	\N
100028	Divisas en efectivo ( directamente en caja principal)		\N	\N	100026	100026	\N	\N
8083	faArrowUpAZ		\N	\N	27	\N	8083	\N
8084	faArrowUpFromBracket		\N	\N	27	\N	8084	\N
8085	faArrowUpFromGroundWater		\N	\N	27	\N	8085	\N
8086	faArrowUpFromWaterPump		\N	\N	27	\N	8086	\N
8087	faArrowUpLong		\N	\N	27	\N	8087	\N
8088	faArrowUpRightDots		\N	\N	27	\N	8088	\N
8089	faArrowUpRightFromSquare		\N	\N	27	\N	8089	\N
8090	faArrowUpShortWide		\N	\N	27	\N	8090	\N
8091	faArrowUpWideShort		\N	\N	27	\N	8091	\N
8092	faArrowUpZA		\N	\N	27	\N	8092	\N
8093	faArrowsDownToLine		\N	\N	27	\N	8093	\N
8094	faArrowsDownToPeople		\N	\N	27	\N	8094	\N
8095	faArrowsLeftRight		\N	\N	27	\N	8095	\N
8096	faArrowsLeftRightToLine		\N	\N	27	\N	8096	\N
8097	faArrowsRotate		\N	\N	27	\N	8097	\N
8098	faArrowsSpin		\N	\N	27	\N	8098	\N
8099	faArrowsSplitUpAndLeft		\N	\N	27	\N	8099	\N
8100	faArrowsToCircle		\N	\N	27	\N	8100	\N
8101	faArrowsToDot		\N	\N	27	\N	8101	\N
8102	faArrowsToEye		\N	\N	27	\N	8102	\N
8103	faArrowsTurnRight		\N	\N	27	\N	8103	\N
8104	faArrowsTurnToDots		\N	\N	27	\N	8104	\N
8105	faArrowsUpDown		\N	\N	27	\N	8105	\N
8106	faArrowsUpDownLeftRight		\N	\N	27	\N	8106	\N
8107	faArrowsUpToLine		\N	\N	27	\N	8107	\N
8108	faArtstation		\N	\N	27	\N	8108	\N
8109	faAsterisk		\N	\N	27	\N	8109	\N
8110	faAsymmetrik		\N	\N	27	\N	8110	\N
8111	faAt		\N	\N	27	\N	8111	\N
8112	faAtlassian		\N	\N	27	\N	8112	\N
8113	faAtom		\N	\N	27	\N	8113	\N
8114	faAudible		\N	\N	27	\N	8114	\N
8115	faAudioDescription		\N	\N	27	\N	8115	\N
8116	faAustralSign		\N	\N	27	\N	8116	\N
8117	faAutoprefixer		\N	\N	27	\N	8117	\N
8118	faAvianex		\N	\N	27	\N	8118	\N
8119	faAviato		\N	\N	27	\N	8119	\N
8120	faAward		\N	\N	27	\N	8120	\N
8121	faAws		\N	\N	27	\N	8121	\N
8122	faB		\N	\N	27	\N	8122	\N
8123	faBaby		\N	\N	27	\N	8123	\N
8124	faBabyCarriage		\N	\N	27	\N	8124	\N
8125	faBackward		\N	\N	27	\N	8125	\N
8126	faBackwardFast		\N	\N	27	\N	8126	\N
8127	faBackwardStep		\N	\N	27	\N	8127	\N
8128	faBacon		\N	\N	27	\N	8128	\N
8129	faBacteria		\N	\N	27	\N	8129	\N
8130	faBacterium		\N	\N	27	\N	8130	\N
8131	faBagShopping		\N	\N	27	\N	8131	\N
8132	faBahai		\N	\N	27	\N	8132	\N
8133	faBahtSign		\N	\N	27	\N	8133	\N
8134	faBan		\N	\N	27	\N	8134	\N
8135	faBanSmoking		\N	\N	27	\N	8135	\N
8136	faBandage		\N	\N	27	\N	8136	\N
8137	faBandcamp		\N	\N	27	\N	8137	\N
8138	faBangladeshiTakaSign		\N	\N	27	\N	8138	\N
8139	faBarcode		\N	\N	27	\N	8139	\N
8140	faBars		\N	\N	27	\N	8140	\N
8141	faBarsProgress		\N	\N	27	\N	8141	\N
8142	faBarsStaggered		\N	\N	27	\N	8142	\N
8143	faBaseball		\N	\N	27	\N	8143	\N
8144	faBaseballBatBall		\N	\N	27	\N	8144	\N
8145	faBasketShopping		\N	\N	27	\N	8145	\N
8146	faBasketball		\N	\N	27	\N	8146	\N
8147	faBath		\N	\N	27	\N	8147	\N
8148	faBatteryEmpty		\N	\N	27	\N	8148	\N
8149	faBatteryFull		\N	\N	27	\N	8149	\N
8150	faBatteryHalf		\N	\N	27	\N	8150	\N
8151	faBatteryQuarter		\N	\N	27	\N	8151	\N
8152	faBatteryThreeQuarters		\N	\N	27	\N	8152	\N
8153	faBattleNet		\N	\N	27	\N	8153	\N
8154	faBed		\N	\N	27	\N	8154	\N
8155	faBedPulse		\N	\N	27	\N	8155	\N
8156	faBeerMugEmpty		\N	\N	27	\N	8156	\N
8157	faBehance		\N	\N	27	\N	8157	\N
8158	faBell		\N	\N	27	\N	8158	\N
8159	faBellConcierge		\N	\N	27	\N	8159	\N
8160	faBellSlash		\N	\N	27	\N	8160	\N
8161	faBezierCurve		\N	\N	27	\N	8161	\N
8162	faBicycle		\N	\N	27	\N	8162	\N
8163	faBilibili		\N	\N	27	\N	8163	\N
8164	faBimobject		\N	\N	27	\N	8164	\N
8165	faBinoculars		\N	\N	27	\N	8165	\N
8166	faBiohazard		\N	\N	27	\N	8166	\N
8167	faBitbucket		\N	\N	27	\N	8167	\N
8168	faBitcoin		\N	\N	27	\N	8168	\N
8169	faBitcoinSign		\N	\N	27	\N	8169	\N
8170	faBity		\N	\N	27	\N	8170	\N
8171	faBlackTie		\N	\N	27	\N	8171	\N
8172	faBlackberry		\N	\N	27	\N	8172	\N
8173	faBlender		\N	\N	27	\N	8173	\N
8174	faBlenderPhone		\N	\N	27	\N	8174	\N
8175	faBlog		\N	\N	27	\N	8175	\N
8176	faBlogger		\N	\N	27	\N	8176	\N
8177	faBloggerB		\N	\N	27	\N	8177	\N
8178	faBluesky		\N	\N	27	\N	8178	\N
8179	faBluetooth		\N	\N	27	\N	8179	\N
8180	faBluetoothB		\N	\N	27	\N	8180	\N
8181	faBold		\N	\N	27	\N	8181	\N
8182	faBolt		\N	\N	27	\N	8182	\N
8183	faBoltLightning		\N	\N	27	\N	8183	\N
8184	faBomb		\N	\N	27	\N	8184	\N
8185	faBone		\N	\N	27	\N	8185	\N
8186	faBong		\N	\N	27	\N	8186	\N
8187	faBook		\N	\N	27	\N	8187	\N
8188	faBookAtlas		\N	\N	27	\N	8188	\N
8189	faBookBible		\N	\N	27	\N	8189	\N
8190	faBookBookmark		\N	\N	27	\N	8190	\N
8191	faBookJournalWhills		\N	\N	27	\N	8191	\N
8192	faBookMedical		\N	\N	27	\N	8192	\N
8193	faBookOpen		\N	\N	27	\N	8193	\N
8194	faBookOpenReader		\N	\N	27	\N	8194	\N
8195	faBookQuran		\N	\N	27	\N	8195	\N
8196	faBookSkull		\N	\N	27	\N	8196	\N
8197	faBookTanakh		\N	\N	27	\N	8197	\N
8198	faBookmark		\N	\N	27	\N	8198	\N
8199	faBootstrap		\N	\N	27	\N	8199	\N
8200	faBorderAll		\N	\N	27	\N	8200	\N
8201	faBorderNone		\N	\N	27	\N	8201	\N
8202	faBorderTopLeft		\N	\N	27	\N	8202	\N
8203	faBoreHole		\N	\N	27	\N	8203	\N
8204	faBots		\N	\N	27	\N	8204	\N
8205	faBottleDroplet		\N	\N	27	\N	8205	\N
8206	faBottleWater		\N	\N	27	\N	8206	\N
8207	faBowlFood		\N	\N	27	\N	8207	\N
8208	faBowlRice		\N	\N	27	\N	8208	\N
8209	faBowlingBall		\N	\N	27	\N	8209	\N
8210	faBox		\N	\N	27	\N	8210	\N
8211	faBoxArchive		\N	\N	27	\N	8211	\N
8212	faBoxOpen		\N	\N	27	\N	8212	\N
8213	faBoxTissue		\N	\N	27	\N	8213	\N
8214	faBoxesPacking		\N	\N	27	\N	8214	\N
8215	faBoxesStacked		\N	\N	27	\N	8215	\N
8216	faBraille		\N	\N	27	\N	8216	\N
8217	faBrain		\N	\N	27	\N	8217	\N
8218	faBrave		\N	\N	27	\N	8218	\N
8219	faBraveReverse		\N	\N	27	\N	8219	\N
8220	faBrazilianRealSign		\N	\N	27	\N	8220	\N
8221	faBreadSlice		\N	\N	27	\N	8221	\N
8222	faBridge		\N	\N	27	\N	8222	\N
8223	faBridgeCircleCheck		\N	\N	27	\N	8223	\N
8224	faBridgeCircleExclamation		\N	\N	27	\N	8224	\N
8225	faBridgeCircleXmark		\N	\N	27	\N	8225	\N
8226	faBridgeLock		\N	\N	27	\N	8226	\N
8227	faBridgeWater		\N	\N	27	\N	8227	\N
8228	faBriefcase		\N	\N	27	\N	8228	\N
8229	faBriefcaseMedical		\N	\N	27	\N	8229	\N
8230	faBroom		\N	\N	27	\N	8230	\N
8231	faBroomBall		\N	\N	27	\N	8231	\N
8232	faBrush		\N	\N	27	\N	8232	\N
8233	faBtc		\N	\N	27	\N	8233	\N
8234	faBucket		\N	\N	27	\N	8234	\N
8235	faBuffer		\N	\N	27	\N	8235	\N
8236	faBug		\N	\N	27	\N	8236	\N
8237	faBugSlash		\N	\N	27	\N	8237	\N
8238	faBugs		\N	\N	27	\N	8238	\N
8239	faBuilding		\N	\N	27	\N	8239	\N
8240	faBuildingCircleArrowRight		\N	\N	27	\N	8240	\N
8241	faBuildingCircleCheck		\N	\N	27	\N	8241	\N
8242	faBuildingCircleExclamation		\N	\N	27	\N	8242	\N
8243	faBuildingCircleXmark		\N	\N	27	\N	8243	\N
8244	faBuildingColumns		\N	\N	27	\N	8244	\N
8245	faBuildingFlag		\N	\N	27	\N	8245	\N
8246	faBuildingLock		\N	\N	27	\N	8246	\N
8247	faBuildingNgo		\N	\N	27	\N	8247	\N
8248	faBuildingShield		\N	\N	27	\N	8248	\N
8249	faBuildingUn		\N	\N	27	\N	8249	\N
8250	faBuildingUser		\N	\N	27	\N	8250	\N
8251	faBuildingWheat		\N	\N	27	\N	8251	\N
8252	faBullhorn		\N	\N	27	\N	8252	\N
8253	faBullseye		\N	\N	27	\N	8253	\N
8254	faBurger		\N	\N	27	\N	8254	\N
8255	faBuromobelexperte		\N	\N	27	\N	8255	\N
8256	faBurst		\N	\N	27	\N	8256	\N
8257	faBus		\N	\N	27	\N	8257	\N
8258	faBusSimple		\N	\N	27	\N	8258	\N
8259	faBusinessTime		\N	\N	27	\N	8259	\N
8260	faBuyNLarge		\N	\N	27	\N	8260	\N
8261	faBuysellads		\N	\N	27	\N	8261	\N
8262	faC		\N	\N	27	\N	8262	\N
8263	faCableCar		\N	\N	27	\N	8263	\N
8264	faCakeCandles		\N	\N	27	\N	8264	\N
8265	faCalculator		\N	\N	27	\N	8265	\N
8266	faCalendar		\N	\N	27	\N	8266	\N
8267	faCalendarCheck		\N	\N	27	\N	8267	\N
8268	faCalendarDay		\N	\N	27	\N	8268	\N
8269	faCalendarDays		\N	\N	27	\N	8269	\N
8270	faCalendarMinus		\N	\N	27	\N	8270	\N
8271	faCalendarPlus		\N	\N	27	\N	8271	\N
8272	faCalendarWeek		\N	\N	27	\N	8272	\N
8273	faCalendarXmark		\N	\N	27	\N	8273	\N
8274	faCamera		\N	\N	27	\N	8274	\N
8275	faCameraRetro		\N	\N	27	\N	8275	\N
8276	faCameraRotate		\N	\N	27	\N	8276	\N
8277	faCampground		\N	\N	27	\N	8277	\N
8278	faCanadianMapleLeaf		\N	\N	27	\N	8278	\N
8279	faCandyCane		\N	\N	27	\N	8279	\N
8280	faCannabis		\N	\N	27	\N	8280	\N
8281	faCapsules		\N	\N	27	\N	8281	\N
8282	faCar		\N	\N	27	\N	8282	\N
8283	faCarBattery		\N	\N	27	\N	8283	\N
8284	faCarBurst		\N	\N	27	\N	8284	\N
8285	faCarOn		\N	\N	27	\N	8285	\N
8286	faCarRear		\N	\N	27	\N	8286	\N
8287	faCarSide		\N	\N	27	\N	8287	\N
8288	faCarTunnel		\N	\N	27	\N	8288	\N
8289	faCaravan		\N	\N	27	\N	8289	\N
8290	faCaretDown		\N	\N	27	\N	8290	\N
8291	faCaretLeft		\N	\N	27	\N	8291	\N
8292	faCaretRight		\N	\N	27	\N	8292	\N
8293	faCaretUp		\N	\N	27	\N	8293	\N
8294	faCarrot		\N	\N	27	\N	8294	\N
8295	faCartArrowDown		\N	\N	27	\N	8295	\N
8296	faCartFlatbed		\N	\N	27	\N	8296	\N
8297	faCartFlatbedSuitcase		\N	\N	27	\N	8297	\N
8298	faCartPlus		\N	\N	27	\N	8298	\N
8299	faCartShopping		\N	\N	27	\N	8299	\N
8300	faCashRegister		\N	\N	27	\N	8300	\N
8301	faCat		\N	\N	27	\N	8301	\N
8302	faCcAmazonPay		\N	\N	27	\N	8302	\N
8303	faCcAmex		\N	\N	27	\N	8303	\N
8304	faCcApplePay		\N	\N	27	\N	8304	\N
8305	faCcDinersClub		\N	\N	27	\N	8305	\N
8306	faCcDiscover		\N	\N	27	\N	8306	\N
8307	faCcJcb		\N	\N	27	\N	8307	\N
8308	faCcMastercard		\N	\N	27	\N	8308	\N
8309	faCcPaypal		\N	\N	27	\N	8309	\N
8310	faCcStripe		\N	\N	27	\N	8310	\N
8311	faCcVisa		\N	\N	27	\N	8311	\N
8312	faCediSign		\N	\N	27	\N	8312	\N
8313	faCentSign		\N	\N	27	\N	8313	\N
8314	faCentercode		\N	\N	27	\N	8314	\N
8315	faCentos		\N	\N	27	\N	8315	\N
8316	faCertificate		\N	\N	27	\N	8316	\N
8317	faChair		\N	\N	27	\N	8317	\N
8318	faChalkboard		\N	\N	27	\N	8318	\N
8319	faChalkboardUser		\N	\N	27	\N	8319	\N
8320	faChampagneGlasses		\N	\N	27	\N	8320	\N
8321	faChargingStation		\N	\N	27	\N	8321	\N
8322	faChartArea		\N	\N	27	\N	8322	\N
8323	faChartBar		\N	\N	27	\N	8323	\N
8324	faChartColumn		\N	\N	27	\N	8324	\N
8325	faChartDiagram		\N	\N	27	\N	8325	\N
8326	faChartGantt		\N	\N	27	\N	8326	\N
8327	faChartLine		\N	\N	27	\N	8327	\N
8328	faChartPie		\N	\N	27	\N	8328	\N
8329	faChartSimple		\N	\N	27	\N	8329	\N
8330	faCheck		\N	\N	27	\N	8330	\N
8331	faCheckDouble		\N	\N	27	\N	8331	\N
8332	faCheckToSlot		\N	\N	27	\N	8332	\N
8333	faCheese		\N	\N	27	\N	8333	\N
8334	faChess		\N	\N	27	\N	8334	\N
8335	faChessBishop		\N	\N	27	\N	8335	\N
8336	faChessBoard		\N	\N	27	\N	8336	\N
8337	faChessKing		\N	\N	27	\N	8337	\N
8338	faChessKnight		\N	\N	27	\N	8338	\N
8339	faChessPawn		\N	\N	27	\N	8339	\N
8340	faChessQueen		\N	\N	27	\N	8340	\N
8341	faChessRook		\N	\N	27	\N	8341	\N
8342	faChevronDown		\N	\N	27	\N	8342	\N
8343	faChevronLeft		\N	\N	27	\N	8343	\N
8344	faChevronRight		\N	\N	27	\N	8344	\N
8345	faChevronUp		\N	\N	27	\N	8345	\N
8346	faChild		\N	\N	27	\N	8346	\N
8347	faChildCombatant		\N	\N	27	\N	8347	\N
8348	faChildDress		\N	\N	27	\N	8348	\N
8349	faChildReaching		\N	\N	27	\N	8349	\N
8350	faChildren		\N	\N	27	\N	8350	\N
8351	faChrome		\N	\N	27	\N	8351	\N
8352	faChromecast		\N	\N	27	\N	8352	\N
8353	faChurch		\N	\N	27	\N	8353	\N
8354	faCircle		\N	\N	27	\N	8354	\N
8355	faCircleArrowDown		\N	\N	27	\N	8355	\N
8356	faCircleArrowLeft		\N	\N	27	\N	8356	\N
8357	faCircleArrowRight		\N	\N	27	\N	8357	\N
8358	faCircleArrowUp		\N	\N	27	\N	8358	\N
8359	faCircleCheck		\N	\N	27	\N	8359	\N
8360	faCircleChevronDown		\N	\N	27	\N	8360	\N
8361	faCircleChevronLeft		\N	\N	27	\N	8361	\N
8362	faCircleChevronRight		\N	\N	27	\N	8362	\N
8363	faCircleChevronUp		\N	\N	27	\N	8363	\N
8364	faCircleDollarToSlot		\N	\N	27	\N	8364	\N
8365	faCircleDot		\N	\N	27	\N	8365	\N
8366	faCircleDown		\N	\N	27	\N	8366	\N
8367	faCircleExclamation		\N	\N	27	\N	8367	\N
8368	faCircleH		\N	\N	27	\N	8368	\N
8369	faCircleHalfStroke		\N	\N	27	\N	8369	\N
8370	faCircleInfo		\N	\N	27	\N	8370	\N
8371	faCircleLeft		\N	\N	27	\N	8371	\N
8372	faCircleMinus		\N	\N	27	\N	8372	\N
8373	faCircleNodes		\N	\N	27	\N	8373	\N
8374	faCircleNotch		\N	\N	27	\N	8374	\N
8375	faCirclePause		\N	\N	27	\N	8375	\N
8376	faCirclePlay		\N	\N	27	\N	8376	\N
8377	faCirclePlus		\N	\N	27	\N	8377	\N
8378	faCircleQuestion		\N	\N	27	\N	8378	\N
8379	faCircleRadiation		\N	\N	27	\N	8379	\N
8380	faCircleRight		\N	\N	27	\N	8380	\N
8381	faCircleStop		\N	\N	27	\N	8381	\N
8382	faCircleUp		\N	\N	27	\N	8382	\N
8383	faCircleUser		\N	\N	27	\N	8383	\N
8384	faCircleXmark		\N	\N	27	\N	8384	\N
8385	faCity		\N	\N	27	\N	8385	\N
8386	faClapperboard		\N	\N	27	\N	8386	\N
8387	faClipboard		\N	\N	27	\N	8387	\N
8388	faClipboardCheck		\N	\N	27	\N	8388	\N
8389	faClipboardList		\N	\N	27	\N	8389	\N
8390	faClipboardQuestion		\N	\N	27	\N	8390	\N
8391	faClipboardUser		\N	\N	27	\N	8391	\N
8392	faClock		\N	\N	27	\N	8392	\N
8393	faClockRotateLeft		\N	\N	27	\N	8393	\N
8394	faClone		\N	\N	27	\N	8394	\N
8395	faClosedCaptioning		\N	\N	27	\N	8395	\N
8396	faCloud		\N	\N	27	\N	8396	\N
8397	faCloudArrowDown		\N	\N	27	\N	8397	\N
8398	faCloudArrowUp		\N	\N	27	\N	8398	\N
8399	faCloudBolt		\N	\N	27	\N	8399	\N
8400	faCloudMeatball		\N	\N	27	\N	8400	\N
8401	faCloudMoon		\N	\N	27	\N	8401	\N
8402	faCloudMoonRain		\N	\N	27	\N	8402	\N
8403	faCloudRain		\N	\N	27	\N	8403	\N
8404	faCloudShowersHeavy		\N	\N	27	\N	8404	\N
8405	faCloudShowersWater		\N	\N	27	\N	8405	\N
8406	faCloudSun		\N	\N	27	\N	8406	\N
8407	faCloudSunRain		\N	\N	27	\N	8407	\N
8408	faCloudflare		\N	\N	27	\N	8408	\N
8409	faCloudscale		\N	\N	27	\N	8409	\N
8410	faCloudsmith		\N	\N	27	\N	8410	\N
8411	faCloudversify		\N	\N	27	\N	8411	\N
8412	faClover		\N	\N	27	\N	8412	\N
8413	faCmplid		\N	\N	27	\N	8413	\N
8414	faCode		\N	\N	27	\N	8414	\N
8415	faCodeBranch		\N	\N	27	\N	8415	\N
8416	faCodeCommit		\N	\N	27	\N	8416	\N
8417	faCodeCompare		\N	\N	27	\N	8417	\N
8418	faCodeFork		\N	\N	27	\N	8418	\N
8419	faCodeMerge		\N	\N	27	\N	8419	\N
8420	faCodePullRequest		\N	\N	27	\N	8420	\N
8421	faCodepen		\N	\N	27	\N	8421	\N
8422	faCodiepie		\N	\N	27	\N	8422	\N
8423	faCoins		\N	\N	27	\N	8423	\N
8424	faColonSign		\N	\N	27	\N	8424	\N
8425	faComment		\N	\N	27	\N	8425	\N
8426	faCommentDollar		\N	\N	27	\N	8426	\N
8427	faCommentDots		\N	\N	27	\N	8427	\N
8428	faCommentMedical		\N	\N	27	\N	8428	\N
8429	faCommentNodes		\N	\N	27	\N	8429	\N
8430	faCommentSlash		\N	\N	27	\N	8430	\N
8431	faCommentSms		\N	\N	27	\N	8431	\N
8432	faComments		\N	\N	27	\N	8432	\N
8433	faCommentsDollar		\N	\N	27	\N	8433	\N
8434	faCompactDisc		\N	\N	27	\N	8434	\N
8435	faCompass		\N	\N	27	\N	8435	\N
8436	faCompassDrafting		\N	\N	27	\N	8436	\N
8437	faCompress		\N	\N	27	\N	8437	\N
8438	faComputer		\N	\N	27	\N	8438	\N
8439	faComputerMouse		\N	\N	27	\N	8439	\N
8440	faConfluence		\N	\N	27	\N	8440	\N
8441	faConnectdevelop		\N	\N	27	\N	8441	\N
8442	faContao		\N	\N	27	\N	8442	\N
8443	faCookie		\N	\N	27	\N	8443	\N
8444	faCookieBite		\N	\N	27	\N	8444	\N
8445	faCopy		\N	\N	27	\N	8445	\N
8446	faCopyright		\N	\N	27	\N	8446	\N
8447	faCottonBureau		\N	\N	27	\N	8447	\N
8448	faCouch		\N	\N	27	\N	8448	\N
8449	faCow		\N	\N	27	\N	8449	\N
8450	faCpanel		\N	\N	27	\N	8450	\N
8451	faCreativeCommons		\N	\N	27	\N	8451	\N
8452	faCreativeCommonsBy		\N	\N	27	\N	8452	\N
8453	faCreativeCommonsNc		\N	\N	27	\N	8453	\N
8454	faCreativeCommonsNcEu		\N	\N	27	\N	8454	\N
8455	faCreativeCommonsNcJp		\N	\N	27	\N	8455	\N
8456	faCreativeCommonsNd		\N	\N	27	\N	8456	\N
8457	faCreativeCommonsPd		\N	\N	27	\N	8457	\N
8458	faCreativeCommonsPdAlt		\N	\N	27	\N	8458	\N
8459	faCreativeCommonsRemix		\N	\N	27	\N	8459	\N
8460	faCreativeCommonsSa		\N	\N	27	\N	8460	\N
8461	faCreativeCommonsSampling		\N	\N	27	\N	8461	\N
8462	faCreativeCommonsSamplingPlus		\N	\N	27	\N	8462	\N
8463	faCreativeCommonsShare		\N	\N	27	\N	8463	\N
8464	faCreativeCommonsZero		\N	\N	27	\N	8464	\N
8465	faCreditCard		\N	\N	27	\N	8465	\N
8466	faCriticalRole		\N	\N	27	\N	8466	\N
8467	faCrop		\N	\N	27	\N	8467	\N
8468	faCropSimple		\N	\N	27	\N	8468	\N
8469	faCross		\N	\N	27	\N	8469	\N
8470	faCrosshairs		\N	\N	27	\N	8470	\N
8471	faCrow		\N	\N	27	\N	8471	\N
8472	faCrown		\N	\N	27	\N	8472	\N
8473	faCrutch		\N	\N	27	\N	8473	\N
8474	faCruzeiroSign		\N	\N	27	\N	8474	\N
8475	faCss		\N	\N	27	\N	8475	\N
8476	faCss3		\N	\N	27	\N	8476	\N
8477	faCss3Alt		\N	\N	27	\N	8477	\N
8478	faCube		\N	\N	27	\N	8478	\N
8479	faCubes		\N	\N	27	\N	8479	\N
8480	faCubesStacked		\N	\N	27	\N	8480	\N
8481	faCuttlefish		\N	\N	27	\N	8481	\N
8482	faD		\N	\N	27	\N	8482	\N
8483	faDAndD		\N	\N	27	\N	8483	\N
8484	faDAndDBeyond		\N	\N	27	\N	8484	\N
8485	faDailymotion		\N	\N	27	\N	8485	\N
8486	faDartLang		\N	\N	27	\N	8486	\N
8487	faDashcube		\N	\N	27	\N	8487	\N
8488	faDatabase		\N	\N	27	\N	8488	\N
8489	faDebian		\N	\N	27	\N	8489	\N
8490	faDeezer		\N	\N	27	\N	8490	\N
8491	faDeleteLeft		\N	\N	27	\N	8491	\N
8492	faDelicious		\N	\N	27	\N	8492	\N
8493	faDemocrat		\N	\N	27	\N	8493	\N
8494	faDeploydog		\N	\N	27	\N	8494	\N
8495	faDeskpro		\N	\N	27	\N	8495	\N
8496	faDesktop		\N	\N	27	\N	8496	\N
8497	faDev		\N	\N	27	\N	8497	\N
8498	faDeviantart		\N	\N	27	\N	8498	\N
8499	faDharmachakra		\N	\N	27	\N	8499	\N
8500	faDhl		\N	\N	27	\N	8500	\N
8501	faDiagramNext		\N	\N	27	\N	8501	\N
8502	faDiagramPredecessor		\N	\N	27	\N	8502	\N
8503	faDiagramProject		\N	\N	27	\N	8503	\N
8504	faDiagramSuccessor		\N	\N	27	\N	8504	\N
8505	faDiamond		\N	\N	27	\N	8505	\N
8506	faDiamondTurnRight		\N	\N	27	\N	8506	\N
8507	faDiaspora		\N	\N	27	\N	8507	\N
8508	faDice		\N	\N	27	\N	8508	\N
8509	faDiceD20		\N	\N	27	\N	8509	\N
8510	faDiceD6		\N	\N	27	\N	8510	\N
8511	faDiceFive		\N	\N	27	\N	8511	\N
8512	faDiceFour		\N	\N	27	\N	8512	\N
8513	faDiceOne		\N	\N	27	\N	8513	\N
8514	faDiceSix		\N	\N	27	\N	8514	\N
8515	faDiceThree		\N	\N	27	\N	8515	\N
8516	faDiceTwo		\N	\N	27	\N	8516	\N
8517	faDigg		\N	\N	27	\N	8517	\N
8518	faDigitalOcean		\N	\N	27	\N	8518	\N
8519	faDiscord		\N	\N	27	\N	8519	\N
8520	faDiscourse		\N	\N	27	\N	8520	\N
8521	faDisease		\N	\N	27	\N	8521	\N
8522	faDisplay		\N	\N	27	\N	8522	\N
8523	faDivide		\N	\N	27	\N	8523	\N
8524	faDna		\N	\N	27	\N	8524	\N
8525	faDochub		\N	\N	27	\N	8525	\N
8526	faDocker		\N	\N	27	\N	8526	\N
8527	faDog		\N	\N	27	\N	8527	\N
8528	faDollarSign		\N	\N	27	\N	8528	\N
8529	faDolly		\N	\N	27	\N	8529	\N
8530	faDongSign		\N	\N	27	\N	8530	\N
8531	faDoorClosed		\N	\N	27	\N	8531	\N
8532	faDoorOpen		\N	\N	27	\N	8532	\N
8533	faDove		\N	\N	27	\N	8533	\N
8534	faDownLeftAndUpRightToCenter		\N	\N	27	\N	8534	\N
8535	faDownLong		\N	\N	27	\N	8535	\N
8536	faDownload		\N	\N	27	\N	8536	\N
8537	faDraft2digital		\N	\N	27	\N	8537	\N
8538	faDragon		\N	\N	27	\N	8538	\N
8539	faDrawPolygon		\N	\N	27	\N	8539	\N
8540	faDribbble		\N	\N	27	\N	8540	\N
8541	faDropbox		\N	\N	27	\N	8541	\N
8542	faDroplet		\N	\N	27	\N	8542	\N
8543	faDropletSlash		\N	\N	27	\N	8543	\N
8544	faDrum		\N	\N	27	\N	8544	\N
8545	faDrumSteelpan		\N	\N	27	\N	8545	\N
8546	faDrumstickBite		\N	\N	27	\N	8546	\N
8547	faDrupal		\N	\N	27	\N	8547	\N
8548	faDumbbell		\N	\N	27	\N	8548	\N
8549	faDumpster		\N	\N	27	\N	8549	\N
8550	faDumpsterFire		\N	\N	27	\N	8550	\N
8551	faDungeon		\N	\N	27	\N	8551	\N
8552	faDyalog		\N	\N	27	\N	8552	\N
8553	faE		\N	\N	27	\N	8553	\N
8554	faEarDeaf		\N	\N	27	\N	8554	\N
8555	faEarListen		\N	\N	27	\N	8555	\N
8556	faEarlybirds		\N	\N	27	\N	8556	\N
8557	faEarthAfrica		\N	\N	27	\N	8557	\N
8558	faEarthAmericas		\N	\N	27	\N	8558	\N
8559	faEarthAsia		\N	\N	27	\N	8559	\N
8560	faEarthEurope		\N	\N	27	\N	8560	\N
8561	faEarthOceania		\N	\N	27	\N	8561	\N
8562	faEbay		\N	\N	27	\N	8562	\N
8563	faEdge		\N	\N	27	\N	8563	\N
8564	faEdgeLegacy		\N	\N	27	\N	8564	\N
8565	faEgg		\N	\N	27	\N	8565	\N
8566	faEject		\N	\N	27	\N	8566	\N
8567	faElementor		\N	\N	27	\N	8567	\N
8568	faElevator		\N	\N	27	\N	8568	\N
8569	faEllipsis		\N	\N	27	\N	8569	\N
8570	faEllipsisVertical		\N	\N	27	\N	8570	\N
8571	faEllo		\N	\N	27	\N	8571	\N
8572	faEmber		\N	\N	27	\N	8572	\N
8573	faEmpire		\N	\N	27	\N	8573	\N
8574	faEnvelope		\N	\N	27	\N	8574	\N
8575	faEnvelopeCircleCheck		\N	\N	27	\N	8575	\N
8576	faEnvelopeOpen		\N	\N	27	\N	8576	\N
8577	faEnvelopeOpenText		\N	\N	27	\N	8577	\N
8578	faEnvelopesBulk		\N	\N	27	\N	8578	\N
8579	faEnvira		\N	\N	27	\N	8579	\N
8580	faEquals		\N	\N	27	\N	8580	\N
8581	faEraser		\N	\N	27	\N	8581	\N
8582	faErlang		\N	\N	27	\N	8582	\N
8583	faEthereum		\N	\N	27	\N	8583	\N
8584	faEthernet		\N	\N	27	\N	8584	\N
8585	faEtsy		\N	\N	27	\N	8585	\N
8586	faEuroSign		\N	\N	27	\N	8586	\N
8587	faEvernote		\N	\N	27	\N	8587	\N
8588	faExclamation		\N	\N	27	\N	8588	\N
8589	faExpand		\N	\N	27	\N	8589	\N
8590	faExpeditedssl		\N	\N	27	\N	8590	\N
8591	faExplosion		\N	\N	27	\N	8591	\N
8592	faEye		\N	\N	27	\N	8592	\N
8593	faEyeDropper		\N	\N	27	\N	8593	\N
8594	faEyeLowVision		\N	\N	27	\N	8594	\N
8595	faEyeSlash		\N	\N	27	\N	8595	\N
8596	faF		\N	\N	27	\N	8596	\N
8597	faFaceAngry		\N	\N	27	\N	8597	\N
8598	faFaceDizzy		\N	\N	27	\N	8598	\N
8599	faFaceFlushed		\N	\N	27	\N	8599	\N
8600	faFaceFrown		\N	\N	27	\N	8600	\N
8601	faFaceFrownOpen		\N	\N	27	\N	8601	\N
8602	faFaceGrimace		\N	\N	27	\N	8602	\N
8603	faFaceGrin		\N	\N	27	\N	8603	\N
8604	faFaceGrinBeam		\N	\N	27	\N	8604	\N
8605	faFaceGrinBeamSweat		\N	\N	27	\N	8605	\N
8606	faFaceGrinHearts		\N	\N	27	\N	8606	\N
8607	faFaceGrinSquint		\N	\N	27	\N	8607	\N
8608	faFaceGrinSquintTears		\N	\N	27	\N	8608	\N
8609	faFaceGrinStars		\N	\N	27	\N	8609	\N
8610	faFaceGrinTears		\N	\N	27	\N	8610	\N
8611	faFaceGrinTongue		\N	\N	27	\N	8611	\N
8612	faFaceGrinTongueSquint		\N	\N	27	\N	8612	\N
8613	faFaceGrinTongueWink		\N	\N	27	\N	8613	\N
8614	faFaceGrinWide		\N	\N	27	\N	8614	\N
8615	faFaceGrinWink		\N	\N	27	\N	8615	\N
8616	faFaceKiss		\N	\N	27	\N	8616	\N
8617	faFaceKissBeam		\N	\N	27	\N	8617	\N
8618	faFaceKissWinkHeart		\N	\N	27	\N	8618	\N
8619	faFaceLaugh		\N	\N	27	\N	8619	\N
8620	faFaceLaughBeam		\N	\N	27	\N	8620	\N
8621	faFaceLaughSquint		\N	\N	27	\N	8621	\N
8622	faFaceLaughWink		\N	\N	27	\N	8622	\N
8623	faFaceMeh		\N	\N	27	\N	8623	\N
8624	faFaceMehBlank		\N	\N	27	\N	8624	\N
8625	faFaceRollingEyes		\N	\N	27	\N	8625	\N
8626	faFaceSadCry		\N	\N	27	\N	8626	\N
8627	faFaceSadTear		\N	\N	27	\N	8627	\N
8628	faFaceSmile		\N	\N	27	\N	8628	\N
8629	faFaceSmileBeam		\N	\N	27	\N	8629	\N
8630	faFaceSmileWink		\N	\N	27	\N	8630	\N
8631	faFaceSurprise		\N	\N	27	\N	8631	\N
8632	faFaceTired		\N	\N	27	\N	8632	\N
8633	faFacebook		\N	\N	27	\N	8633	\N
8745	faGear		\N	\N	27	\N	8745	\N
8634	faFacebookF		\N	\N	27	\N	8634	\N
8635	faFacebookMessenger		\N	\N	27	\N	8635	\N
8636	faFan		\N	\N	27	\N	8636	\N
8637	faFantasyFlightGames		\N	\N	27	\N	8637	\N
8638	faFaucet		\N	\N	27	\N	8638	\N
8639	faFaucetDrip		\N	\N	27	\N	8639	\N
8640	faFax		\N	\N	27	\N	8640	\N
8641	faFeather		\N	\N	27	\N	8641	\N
8642	faFeatherPointed		\N	\N	27	\N	8642	\N
8643	faFedex		\N	\N	27	\N	8643	\N
8644	faFedora		\N	\N	27	\N	8644	\N
8645	faFerry		\N	\N	27	\N	8645	\N
8646	faFigma		\N	\N	27	\N	8646	\N
8647	faFile		\N	\N	27	\N	8647	\N
8648	faFileArrowDown		\N	\N	27	\N	8648	\N
8649	faFileArrowUp		\N	\N	27	\N	8649	\N
8650	faFileAudio		\N	\N	27	\N	8650	\N
8651	faFileCircleCheck		\N	\N	27	\N	8651	\N
8652	faFileCircleExclamation		\N	\N	27	\N	8652	\N
8653	faFileCircleMinus		\N	\N	27	\N	8653	\N
8654	faFileCirclePlus		\N	\N	27	\N	8654	\N
8655	faFileCircleQuestion		\N	\N	27	\N	8655	\N
8656	faFileCircleXmark		\N	\N	27	\N	8656	\N
8657	faFileCode		\N	\N	27	\N	8657	\N
8658	faFileContract		\N	\N	27	\N	8658	\N
8659	faFileCsv		\N	\N	27	\N	8659	\N
8660	faFileExcel		\N	\N	27	\N	8660	\N
8661	faFileExport		\N	\N	27	\N	8661	\N
8662	faFileFragment		\N	\N	27	\N	8662	\N
8663	faFileHalfDashed		\N	\N	27	\N	8663	\N
8664	faFileImage		\N	\N	27	\N	8664	\N
8665	faFileImport		\N	\N	27	\N	8665	\N
8666	faFileInvoice		\N	\N	27	\N	8666	\N
8667	faFileInvoiceDollar		\N	\N	27	\N	8667	\N
8668	faFileLines		\N	\N	27	\N	8668	\N
8669	faFileMedical		\N	\N	27	\N	8669	\N
8670	faFilePdf		\N	\N	27	\N	8670	\N
8671	faFilePen		\N	\N	27	\N	8671	\N
8672	faFilePowerpoint		\N	\N	27	\N	8672	\N
8673	faFilePrescription		\N	\N	27	\N	8673	\N
8674	faFileShield		\N	\N	27	\N	8674	\N
8675	faFileSignature		\N	\N	27	\N	8675	\N
8676	faFileVideo		\N	\N	27	\N	8676	\N
8677	faFileWaveform		\N	\N	27	\N	8677	\N
8678	faFileWord		\N	\N	27	\N	8678	\N
8679	faFileZipper		\N	\N	27	\N	8679	\N
8680	faFilesPinwheel		\N	\N	27	\N	8680	\N
8681	faFill		\N	\N	27	\N	8681	\N
8682	faFillDrip		\N	\N	27	\N	8682	\N
8683	faFilm		\N	\N	27	\N	8683	\N
8684	faFilter		\N	\N	27	\N	8684	\N
8685	faFilterCircleDollar		\N	\N	27	\N	8685	\N
8686	faFilterCircleXmark		\N	\N	27	\N	8686	\N
8687	faFingerprint		\N	\N	27	\N	8687	\N
8688	faFire		\N	\N	27	\N	8688	\N
8689	faFireBurner		\N	\N	27	\N	8689	\N
8690	faFireExtinguisher		\N	\N	27	\N	8690	\N
8691	faFireFlameCurved		\N	\N	27	\N	8691	\N
8692	faFireFlameSimple		\N	\N	27	\N	8692	\N
8693	faFirefox		\N	\N	27	\N	8693	\N
8694	faFirefoxBrowser		\N	\N	27	\N	8694	\N
8695	faFirstOrder		\N	\N	27	\N	8695	\N
8696	faFirstOrderAlt		\N	\N	27	\N	8696	\N
8697	faFirstdraft		\N	\N	27	\N	8697	\N
8698	faFish		\N	\N	27	\N	8698	\N
8699	faFishFins		\N	\N	27	\N	8699	\N
8700	faFlag		\N	\N	27	\N	8700	\N
8701	faFlagCheckered		\N	\N	27	\N	8701	\N
8702	faFlagUsa		\N	\N	27	\N	8702	\N
8703	faFlask		\N	\N	27	\N	8703	\N
8704	faFlaskVial		\N	\N	27	\N	8704	\N
8705	faFlickr		\N	\N	27	\N	8705	\N
8706	faFlipboard		\N	\N	27	\N	8706	\N
8707	faFloppyDisk		\N	\N	27	\N	8707	\N
8708	faFlorinSign		\N	\N	27	\N	8708	\N
8709	faFlutter		\N	\N	27	\N	8709	\N
8710	faFly		\N	\N	27	\N	8710	\N
8711	faFolder		\N	\N	27	\N	8711	\N
8712	faFolderClosed		\N	\N	27	\N	8712	\N
8713	faFolderMinus		\N	\N	27	\N	8713	\N
8714	faFolderOpen		\N	\N	27	\N	8714	\N
8715	faFolderPlus		\N	\N	27	\N	8715	\N
8716	faFolderTree		\N	\N	27	\N	8716	\N
8717	faFont		\N	\N	27	\N	8717	\N
8718	faFontAwesome		\N	\N	27	\N	8718	\N
8719	faFonticons		\N	\N	27	\N	8719	\N
8720	faFonticonsFi		\N	\N	27	\N	8720	\N
8721	faFootball		\N	\N	27	\N	8721	\N
8722	faFortAwesome		\N	\N	27	\N	8722	\N
8723	faFortAwesomeAlt		\N	\N	27	\N	8723	\N
8724	faForumbee		\N	\N	27	\N	8724	\N
8725	faForward		\N	\N	27	\N	8725	\N
8726	faForwardFast		\N	\N	27	\N	8726	\N
8727	faForwardStep		\N	\N	27	\N	8727	\N
8728	faFoursquare		\N	\N	27	\N	8728	\N
8729	faFrancSign		\N	\N	27	\N	8729	\N
8730	faFreeCodeCamp		\N	\N	27	\N	8730	\N
8731	faFreebsd		\N	\N	27	\N	8731	\N
8732	faFrog		\N	\N	27	\N	8732	\N
8733	faFulcrum		\N	\N	27	\N	8733	\N
8734	faFutbol		\N	\N	27	\N	8734	\N
8735	faG		\N	\N	27	\N	8735	\N
8736	faGalacticRepublic		\N	\N	27	\N	8736	\N
8737	faGalacticSenate		\N	\N	27	\N	8737	\N
8738	faGamepad		\N	\N	27	\N	8738	\N
8739	faGasPump		\N	\N	27	\N	8739	\N
8740	faGauge		\N	\N	27	\N	8740	\N
8741	faGaugeHigh		\N	\N	27	\N	8741	\N
8742	faGaugeSimple		\N	\N	27	\N	8742	\N
8743	faGaugeSimpleHigh		\N	\N	27	\N	8743	\N
8744	faGavel		\N	\N	27	\N	8744	\N
8746	faGears		\N	\N	27	\N	8746	\N
8747	faGem		\N	\N	27	\N	8747	\N
8748	faGenderless		\N	\N	27	\N	8748	\N
8749	faGetPocket		\N	\N	27	\N	8749	\N
8750	faGg		\N	\N	27	\N	8750	\N
8751	faGgCircle		\N	\N	27	\N	8751	\N
8752	faGhost		\N	\N	27	\N	8752	\N
8753	faGift		\N	\N	27	\N	8753	\N
8754	faGifts		\N	\N	27	\N	8754	\N
8755	faGit		\N	\N	27	\N	8755	\N
8756	faGitAlt		\N	\N	27	\N	8756	\N
8757	faGithub		\N	\N	27	\N	8757	\N
8758	faGithubAlt		\N	\N	27	\N	8758	\N
8759	faGitkraken		\N	\N	27	\N	8759	\N
8760	faGitlab		\N	\N	27	\N	8760	\N
8761	faGitter		\N	\N	27	\N	8761	\N
8762	faGlassWater		\N	\N	27	\N	8762	\N
8763	faGlassWaterDroplet		\N	\N	27	\N	8763	\N
8764	faGlasses		\N	\N	27	\N	8764	\N
8765	faGlide		\N	\N	27	\N	8765	\N
8766	faGlideG		\N	\N	27	\N	8766	\N
8767	faGlobe		\N	\N	27	\N	8767	\N
8768	faGofore		\N	\N	27	\N	8768	\N
8769	faGolang		\N	\N	27	\N	8769	\N
8770	faGolfBallTee		\N	\N	27	\N	8770	\N
8771	faGoodreads		\N	\N	27	\N	8771	\N
8772	faGoodreadsG		\N	\N	27	\N	8772	\N
8773	faGoogle		\N	\N	27	\N	8773	\N
8774	faGoogleDrive		\N	\N	27	\N	8774	\N
8775	faGooglePay		\N	\N	27	\N	8775	\N
8776	faGooglePlay		\N	\N	27	\N	8776	\N
8777	faGooglePlus		\N	\N	27	\N	8777	\N
8778	faGooglePlusG		\N	\N	27	\N	8778	\N
8779	faGoogleScholar		\N	\N	27	\N	8779	\N
8780	faGoogleWallet		\N	\N	27	\N	8780	\N
8781	faGopuram		\N	\N	27	\N	8781	\N
8782	faGraduationCap		\N	\N	27	\N	8782	\N
8783	faGratipay		\N	\N	27	\N	8783	\N
8784	faGrav		\N	\N	27	\N	8784	\N
8785	faGreaterThan		\N	\N	27	\N	8785	\N
8786	faGreaterThanEqual		\N	\N	27	\N	8786	\N
8787	faGrip		\N	\N	27	\N	8787	\N
8788	faGripLines		\N	\N	27	\N	8788	\N
8789	faGripLinesVertical		\N	\N	27	\N	8789	\N
8790	faGripVertical		\N	\N	27	\N	8790	\N
8791	faGripfire		\N	\N	27	\N	8791	\N
8792	faGroupArrowsRotate		\N	\N	27	\N	8792	\N
8793	faGrunt		\N	\N	27	\N	8793	\N
8794	faGuaraniSign		\N	\N	27	\N	8794	\N
8795	faGuilded		\N	\N	27	\N	8795	\N
8796	faGuitar		\N	\N	27	\N	8796	\N
8797	faGulp		\N	\N	27	\N	8797	\N
8798	faGun		\N	\N	27	\N	8798	\N
8799	faH		\N	\N	27	\N	8799	\N
8800	faHackerNews		\N	\N	27	\N	8800	\N
8801	faHackerrank		\N	\N	27	\N	8801	\N
8802	faHammer		\N	\N	27	\N	8802	\N
8803	faHamsa		\N	\N	27	\N	8803	\N
8804	faHand		\N	\N	27	\N	8804	\N
8805	faHandBackFist		\N	\N	27	\N	8805	\N
8806	faHandDots		\N	\N	27	\N	8806	\N
8807	faHandFist		\N	\N	27	\N	8807	\N
8808	faHandHolding		\N	\N	27	\N	8808	\N
8809	faHandHoldingDollar		\N	\N	27	\N	8809	\N
8810	faHandHoldingDroplet		\N	\N	27	\N	8810	\N
8811	faHandHoldingHand		\N	\N	27	\N	8811	\N
8812	faHandHoldingHeart		\N	\N	27	\N	8812	\N
8813	faHandHoldingMedical		\N	\N	27	\N	8813	\N
8814	faHandLizard		\N	\N	27	\N	8814	\N
8815	faHandMiddleFinger		\N	\N	27	\N	8815	\N
8816	faHandPeace		\N	\N	27	\N	8816	\N
8817	faHandPointDown		\N	\N	27	\N	8817	\N
8818	faHandPointLeft		\N	\N	27	\N	8818	\N
8819	faHandPointRight		\N	\N	27	\N	8819	\N
8820	faHandPointUp		\N	\N	27	\N	8820	\N
8821	faHandPointer		\N	\N	27	\N	8821	\N
8822	faHandScissors		\N	\N	27	\N	8822	\N
8823	faHandSparkles		\N	\N	27	\N	8823	\N
8824	faHandSpock		\N	\N	27	\N	8824	\N
8825	faHandcuffs		\N	\N	27	\N	8825	\N
8826	faHands		\N	\N	27	\N	8826	\N
8827	faHandsAslInterpreting		\N	\N	27	\N	8827	\N
8828	faHandsBound		\N	\N	27	\N	8828	\N
8829	faHandsBubbles		\N	\N	27	\N	8829	\N
8830	faHandsClapping		\N	\N	27	\N	8830	\N
8831	faHandsHolding		\N	\N	27	\N	8831	\N
8832	faHandsHoldingChild		\N	\N	27	\N	8832	\N
8833	faHandsHoldingCircle		\N	\N	27	\N	8833	\N
8834	faHandsPraying		\N	\N	27	\N	8834	\N
8835	faHandshake		\N	\N	27	\N	8835	\N
8836	faHandshakeAngle		\N	\N	27	\N	8836	\N
8837	faHandshakeSimple		\N	\N	27	\N	8837	\N
8838	faHandshakeSimpleSlash		\N	\N	27	\N	8838	\N
8839	faHandshakeSlash		\N	\N	27	\N	8839	\N
8840	faHanukiah		\N	\N	27	\N	8840	\N
8841	faHardDrive		\N	\N	27	\N	8841	\N
8842	faHashnode		\N	\N	27	\N	8842	\N
8843	faHashtag		\N	\N	27	\N	8843	\N
8844	faHatCowboy		\N	\N	27	\N	8844	\N
8845	faHatCowboySide		\N	\N	27	\N	8845	\N
8846	faHatWizard		\N	\N	27	\N	8846	\N
8847	faHeadSideCough		\N	\N	27	\N	8847	\N
8848	faHeadSideCoughSlash		\N	\N	27	\N	8848	\N
8849	faHeadSideMask		\N	\N	27	\N	8849	\N
8850	faHeadSideVirus		\N	\N	27	\N	8850	\N
8851	faHeading		\N	\N	27	\N	8851	\N
8852	faHeadphones		\N	\N	27	\N	8852	\N
8853	faHeadphonesSimple		\N	\N	27	\N	8853	\N
8854	faHeadset		\N	\N	27	\N	8854	\N
8855	faHeart		\N	\N	27	\N	8855	\N
8856	faHeartCircleBolt		\N	\N	27	\N	8856	\N
8857	faHeartCircleCheck		\N	\N	27	\N	8857	\N
8858	faHeartCircleExclamation		\N	\N	27	\N	8858	\N
8859	faHeartCircleMinus		\N	\N	27	\N	8859	\N
8860	faHeartCirclePlus		\N	\N	27	\N	8860	\N
8861	faHeartCircleXmark		\N	\N	27	\N	8861	\N
8862	faHeartCrack		\N	\N	27	\N	8862	\N
8863	faHeartPulse		\N	\N	27	\N	8863	\N
8864	faHelicopter		\N	\N	27	\N	8864	\N
8865	faHelicopterSymbol		\N	\N	27	\N	8865	\N
8866	faHelmetSafety		\N	\N	27	\N	8866	\N
8867	faHelmetUn		\N	\N	27	\N	8867	\N
8868	faHexagonNodes		\N	\N	27	\N	8868	\N
8869	faHexagonNodesBolt		\N	\N	27	\N	8869	\N
8870	faHighlighter		\N	\N	27	\N	8870	\N
8871	faHillAvalanche		\N	\N	27	\N	8871	\N
8872	faHillRockslide		\N	\N	27	\N	8872	\N
8873	faHippo		\N	\N	27	\N	8873	\N
8874	faHips		\N	\N	27	\N	8874	\N
8875	faHireAHelper		\N	\N	27	\N	8875	\N
8876	faHive		\N	\N	27	\N	8876	\N
8877	faHockeyPuck		\N	\N	27	\N	8877	\N
8878	faHollyBerry		\N	\N	27	\N	8878	\N
8879	faHooli		\N	\N	27	\N	8879	\N
8880	faHornbill		\N	\N	27	\N	8880	\N
8881	faHorse		\N	\N	27	\N	8881	\N
8882	faHorseHead		\N	\N	27	\N	8882	\N
8883	faHospital		\N	\N	27	\N	8883	\N
8884	faHospitalUser		\N	\N	27	\N	8884	\N
8885	faHotTubPerson		\N	\N	27	\N	8885	\N
8886	faHotdog		\N	\N	27	\N	8886	\N
8887	faHotel		\N	\N	27	\N	8887	\N
8888	faHotjar		\N	\N	27	\N	8888	\N
8889	faHourglass		\N	\N	27	\N	8889	\N
8890	faHourglassEnd		\N	\N	27	\N	8890	\N
8891	faHourglassHalf		\N	\N	27	\N	8891	\N
8892	faHourglassStart		\N	\N	27	\N	8892	\N
8893	faHouse		\N	\N	27	\N	8893	\N
8894	faHouseChimney		\N	\N	27	\N	8894	\N
8895	faHouseChimneyCrack		\N	\N	27	\N	8895	\N
8896	faHouseChimneyMedical		\N	\N	27	\N	8896	\N
8897	faHouseChimneyUser		\N	\N	27	\N	8897	\N
8898	faHouseChimneyWindow		\N	\N	27	\N	8898	\N
8899	faHouseCircleCheck		\N	\N	27	\N	8899	\N
8900	faHouseCircleExclamation		\N	\N	27	\N	8900	\N
8901	faHouseCircleXmark		\N	\N	27	\N	8901	\N
8902	faHouseCrack		\N	\N	27	\N	8902	\N
8903	faHouseFire		\N	\N	27	\N	8903	\N
8904	faHouseFlag		\N	\N	27	\N	8904	\N
8905	faHouseFloodWater		\N	\N	27	\N	8905	\N
8906	faHouseFloodWaterCircleArrowRight		\N	\N	27	\N	8906	\N
8907	faHouseLaptop		\N	\N	27	\N	8907	\N
8908	faHouseLock		\N	\N	27	\N	8908	\N
8909	faHouseMedical		\N	\N	27	\N	8909	\N
8910	faHouseMedicalCircleCheck		\N	\N	27	\N	8910	\N
8911	faHouseMedicalCircleExclamation		\N	\N	27	\N	8911	\N
8912	faHouseMedicalCircleXmark		\N	\N	27	\N	8912	\N
8913	faHouseMedicalFlag		\N	\N	27	\N	8913	\N
8914	faHouseSignal		\N	\N	27	\N	8914	\N
8915	faHouseTsunami		\N	\N	27	\N	8915	\N
8916	faHouseUser		\N	\N	27	\N	8916	\N
8917	faHouzz		\N	\N	27	\N	8917	\N
8918	faHryvniaSign		\N	\N	27	\N	8918	\N
8919	faHtml5		\N	\N	27	\N	8919	\N
8920	faHubspot		\N	\N	27	\N	8920	\N
8921	faHurricane		\N	\N	27	\N	8921	\N
8922	faI		\N	\N	27	\N	8922	\N
8923	faICursor		\N	\N	27	\N	8923	\N
8924	faIceCream		\N	\N	27	\N	8924	\N
8925	faIcicles		\N	\N	27	\N	8925	\N
8926	faIcons		\N	\N	27	\N	8926	\N
8927	faIdBadge		\N	\N	27	\N	8927	\N
8928	faIdCard		\N	\N	27	\N	8928	\N
8929	faIdCardClip		\N	\N	27	\N	8929	\N
8930	faIdeal		\N	\N	27	\N	8930	\N
8931	faIgloo		\N	\N	27	\N	8931	\N
8932	faImage		\N	\N	27	\N	8932	\N
8933	faImagePortrait		\N	\N	27	\N	8933	\N
8934	faImages		\N	\N	27	\N	8934	\N
8935	faImdb		\N	\N	27	\N	8935	\N
8936	faInbox		\N	\N	27	\N	8936	\N
8937	faIndent		\N	\N	27	\N	8937	\N
8938	faIndianRupeeSign		\N	\N	27	\N	8938	\N
8939	faIndustry		\N	\N	27	\N	8939	\N
8940	faInfinity		\N	\N	27	\N	8940	\N
8941	faInfo		\N	\N	27	\N	8941	\N
8942	faInstagram		\N	\N	27	\N	8942	\N
8943	faInstalod		\N	\N	27	\N	8943	\N
8944	faIntercom		\N	\N	27	\N	8944	\N
8945	faInternetExplorer		\N	\N	27	\N	8945	\N
8946	faInvision		\N	\N	27	\N	8946	\N
8947	faIoxhost		\N	\N	27	\N	8947	\N
8948	faItalic		\N	\N	27	\N	8948	\N
8949	faItchIo		\N	\N	27	\N	8949	\N
8950	faItunes		\N	\N	27	\N	8950	\N
8951	faItunesNote		\N	\N	27	\N	8951	\N
8952	faJ		\N	\N	27	\N	8952	\N
8953	faJar		\N	\N	27	\N	8953	\N
8954	faJarWheat		\N	\N	27	\N	8954	\N
8955	faJava		\N	\N	27	\N	8955	\N
8956	faJedi		\N	\N	27	\N	8956	\N
8957	faJediOrder		\N	\N	27	\N	8957	\N
8958	faJenkins		\N	\N	27	\N	8958	\N
8959	faJetFighter		\N	\N	27	\N	8959	\N
8960	faJetFighterUp		\N	\N	27	\N	8960	\N
8961	faJira		\N	\N	27	\N	8961	\N
8962	faJoget		\N	\N	27	\N	8962	\N
8963	faJoint		\N	\N	27	\N	8963	\N
8964	faJoomla		\N	\N	27	\N	8964	\N
8965	faJs		\N	\N	27	\N	8965	\N
8966	faJsfiddle		\N	\N	27	\N	8966	\N
8967	faJugDetergent		\N	\N	27	\N	8967	\N
8968	faJxl		\N	\N	27	\N	8968	\N
8969	faK		\N	\N	27	\N	8969	\N
8970	faKaaba		\N	\N	27	\N	8970	\N
8971	faKaggle		\N	\N	27	\N	8971	\N
8972	faKey		\N	\N	27	\N	8972	\N
8973	faKeybase		\N	\N	27	\N	8973	\N
8974	faKeyboard		\N	\N	27	\N	8974	\N
8975	faKeycdn		\N	\N	27	\N	8975	\N
8976	faKhanda		\N	\N	27	\N	8976	\N
8977	faKickstarter		\N	\N	27	\N	8977	\N
8978	faKickstarterK		\N	\N	27	\N	8978	\N
8979	faKipSign		\N	\N	27	\N	8979	\N
8980	faKitMedical		\N	\N	27	\N	8980	\N
8981	faKitchenSet		\N	\N	27	\N	8981	\N
8982	faKiwiBird		\N	\N	27	\N	8982	\N
8983	faKorvue		\N	\N	27	\N	8983	\N
8984	faL		\N	\N	27	\N	8984	\N
8985	faLandMineOn		\N	\N	27	\N	8985	\N
8986	faLandmark		\N	\N	27	\N	8986	\N
8987	faLandmarkDome		\N	\N	27	\N	8987	\N
8988	faLandmarkFlag		\N	\N	27	\N	8988	\N
8989	faLanguage		\N	\N	27	\N	8989	\N
8990	faLaptop		\N	\N	27	\N	8990	\N
8991	faLaptopCode		\N	\N	27	\N	8991	\N
8992	faLaptopFile		\N	\N	27	\N	8992	\N
8993	faLaptopMedical		\N	\N	27	\N	8993	\N
8994	faLaravel		\N	\N	27	\N	8994	\N
8995	faLariSign		\N	\N	27	\N	8995	\N
8996	faLastfm		\N	\N	27	\N	8996	\N
8997	faLayerGroup		\N	\N	27	\N	8997	\N
8998	faLeaf		\N	\N	27	\N	8998	\N
8999	faLeanpub		\N	\N	27	\N	8999	\N
9000	faLeftLong		\N	\N	27	\N	9000	\N
9001	faLeftRight		\N	\N	27	\N	9001	\N
9002	faLemon		\N	\N	27	\N	9002	\N
9003	faLess		\N	\N	27	\N	9003	\N
9004	faLessThan		\N	\N	27	\N	9004	\N
9005	faLessThanEqual		\N	\N	27	\N	9005	\N
9006	faLetterboxd		\N	\N	27	\N	9006	\N
9007	faLifeRing		\N	\N	27	\N	9007	\N
9008	faLightbulb		\N	\N	27	\N	9008	\N
9009	faLine		\N	\N	27	\N	9009	\N
9010	faLinesLeaning		\N	\N	27	\N	9010	\N
9011	faLink		\N	\N	27	\N	9011	\N
9012	faLinkSlash		\N	\N	27	\N	9012	\N
9013	faLinkedin		\N	\N	27	\N	9013	\N
9014	faLinkedinIn		\N	\N	27	\N	9014	\N
9015	faLinode		\N	\N	27	\N	9015	\N
9016	faLinux		\N	\N	27	\N	9016	\N
9017	faLiraSign		\N	\N	27	\N	9017	\N
9018	faList		\N	\N	27	\N	9018	\N
9019	faListCheck		\N	\N	27	\N	9019	\N
9020	faListOl		\N	\N	27	\N	9020	\N
9021	faListUl		\N	\N	27	\N	9021	\N
9022	faLitecoinSign		\N	\N	27	\N	9022	\N
9023	faLocationArrow		\N	\N	27	\N	9023	\N
9024	faLocationCrosshairs		\N	\N	27	\N	9024	\N
9025	faLocationDot		\N	\N	27	\N	9025	\N
9026	faLocationPin		\N	\N	27	\N	9026	\N
9027	faLocationPinLock		\N	\N	27	\N	9027	\N
9028	faLock		\N	\N	27	\N	9028	\N
9029	faLockOpen		\N	\N	27	\N	9029	\N
9030	faLocust		\N	\N	27	\N	9030	\N
9031	faLungs		\N	\N	27	\N	9031	\N
9032	faLungsVirus		\N	\N	27	\N	9032	\N
9033	faLyft		\N	\N	27	\N	9033	\N
9034	faM		\N	\N	27	\N	9034	\N
9035	faMagento		\N	\N	27	\N	9035	\N
9036	faMagnet		\N	\N	27	\N	9036	\N
9037	faMagnifyingGlass		\N	\N	27	\N	9037	\N
9038	faMagnifyingGlassArrowRight		\N	\N	27	\N	9038	\N
9039	faMagnifyingGlassChart		\N	\N	27	\N	9039	\N
9040	faMagnifyingGlassDollar		\N	\N	27	\N	9040	\N
9041	faMagnifyingGlassLocation		\N	\N	27	\N	9041	\N
9042	faMagnifyingGlassMinus		\N	\N	27	\N	9042	\N
9043	faMagnifyingGlassPlus		\N	\N	27	\N	9043	\N
9044	faMailchimp		\N	\N	27	\N	9044	\N
9045	faManatSign		\N	\N	27	\N	9045	\N
9046	faMandalorian		\N	\N	27	\N	9046	\N
9047	faMap		\N	\N	27	\N	9047	\N
9048	faMapLocation		\N	\N	27	\N	9048	\N
9049	faMapLocationDot		\N	\N	27	\N	9049	\N
9050	faMapPin		\N	\N	27	\N	9050	\N
9051	faMarkdown		\N	\N	27	\N	9051	\N
9052	faMarker		\N	\N	27	\N	9052	\N
9053	faMars		\N	\N	27	\N	9053	\N
9054	faMarsAndVenus		\N	\N	27	\N	9054	\N
9055	faMarsAndVenusBurst		\N	\N	27	\N	9055	\N
9056	faMarsDouble		\N	\N	27	\N	9056	\N
9057	faMarsStroke		\N	\N	27	\N	9057	\N
9058	faMarsStrokeRight		\N	\N	27	\N	9058	\N
9059	faMarsStrokeUp		\N	\N	27	\N	9059	\N
9060	faMartiniGlass		\N	\N	27	\N	9060	\N
9061	faMartiniGlassCitrus		\N	\N	27	\N	9061	\N
9062	faMartiniGlassEmpty		\N	\N	27	\N	9062	\N
9063	faMask		\N	\N	27	\N	9063	\N
9064	faMaskFace		\N	\N	27	\N	9064	\N
9065	faMaskVentilator		\N	\N	27	\N	9065	\N
9066	faMasksTheater		\N	\N	27	\N	9066	\N
9067	faMastodon		\N	\N	27	\N	9067	\N
9068	faMattressPillow		\N	\N	27	\N	9068	\N
9069	faMaxcdn		\N	\N	27	\N	9069	\N
9070	faMaximize		\N	\N	27	\N	9070	\N
9071	faMdb		\N	\N	27	\N	9071	\N
9072	faMedal		\N	\N	27	\N	9072	\N
9073	faMedapps		\N	\N	27	\N	9073	\N
9074	faMedium		\N	\N	27	\N	9074	\N
9075	faMedrt		\N	\N	27	\N	9075	\N
9076	faMeetup		\N	\N	27	\N	9076	\N
9077	faMegaport		\N	\N	27	\N	9077	\N
9078	faMemory		\N	\N	27	\N	9078	\N
9079	faMendeley		\N	\N	27	\N	9079	\N
9080	faMenorah		\N	\N	27	\N	9080	\N
9081	faMercury		\N	\N	27	\N	9081	\N
9082	faMessage		\N	\N	27	\N	9082	\N
9083	faMeta		\N	\N	27	\N	9083	\N
9084	faMeteor		\N	\N	27	\N	9084	\N
9085	faMicroblog		\N	\N	27	\N	9085	\N
9086	faMicrochip		\N	\N	27	\N	9086	\N
9087	faMicrophone		\N	\N	27	\N	9087	\N
9088	faMicrophoneLines		\N	\N	27	\N	9088	\N
9089	faMicrophoneLinesSlash		\N	\N	27	\N	9089	\N
9090	faMicrophoneSlash		\N	\N	27	\N	9090	\N
9091	faMicroscope		\N	\N	27	\N	9091	\N
9092	faMicrosoft		\N	\N	27	\N	9092	\N
9093	faMillSign		\N	\N	27	\N	9093	\N
9094	faMinimize		\N	\N	27	\N	9094	\N
9095	faMintbit		\N	\N	27	\N	9095	\N
9096	faMinus		\N	\N	27	\N	9096	\N
9097	faMitten		\N	\N	27	\N	9097	\N
9098	faMix		\N	\N	27	\N	9098	\N
9099	faMixcloud		\N	\N	27	\N	9099	\N
9100	faMixer		\N	\N	27	\N	9100	\N
9101	faMizuni		\N	\N	27	\N	9101	\N
9102	faMobile		\N	\N	27	\N	9102	\N
9103	faMobileButton		\N	\N	27	\N	9103	\N
9104	faMobileRetro		\N	\N	27	\N	9104	\N
9105	faMobileScreen		\N	\N	27	\N	9105	\N
9106	faMobileScreenButton		\N	\N	27	\N	9106	\N
9107	faModx		\N	\N	27	\N	9107	\N
9108	faMonero		\N	\N	27	\N	9108	\N
9109	faMoneyBill		\N	\N	27	\N	9109	\N
9110	faMoneyBill1		\N	\N	27	\N	9110	\N
9111	faMoneyBill1Wave		\N	\N	27	\N	9111	\N
9112	faMoneyBillTransfer		\N	\N	27	\N	9112	\N
9113	faMoneyBillTrendUp		\N	\N	27	\N	9113	\N
9114	faMoneyBillWave		\N	\N	27	\N	9114	\N
9115	faMoneyBillWheat		\N	\N	27	\N	9115	\N
9116	faMoneyBills		\N	\N	27	\N	9116	\N
9117	faMoneyCheck		\N	\N	27	\N	9117	\N
9118	faMoneyCheckDollar		\N	\N	27	\N	9118	\N
9119	faMonument		\N	\N	27	\N	9119	\N
9120	faMoon		\N	\N	27	\N	9120	\N
9121	faMortarPestle		\N	\N	27	\N	9121	\N
9122	faMosque		\N	\N	27	\N	9122	\N
9123	faMosquito		\N	\N	27	\N	9123	\N
9124	faMosquitoNet		\N	\N	27	\N	9124	\N
9125	faMotorcycle		\N	\N	27	\N	9125	\N
9126	faMound		\N	\N	27	\N	9126	\N
9127	faMountain		\N	\N	27	\N	9127	\N
9128	faMountainCity		\N	\N	27	\N	9128	\N
9129	faMountainSun		\N	\N	27	\N	9129	\N
9130	faMugHot		\N	\N	27	\N	9130	\N
9131	faMugSaucer		\N	\N	27	\N	9131	\N
9132	faMusic		\N	\N	27	\N	9132	\N
9133	faN		\N	\N	27	\N	9133	\N
9134	faNairaSign		\N	\N	27	\N	9134	\N
9135	faNapster		\N	\N	27	\N	9135	\N
9136	faNeos		\N	\N	27	\N	9136	\N
9137	faNetworkWired		\N	\N	27	\N	9137	\N
9138	faNeuter		\N	\N	27	\N	9138	\N
9139	faNewspaper		\N	\N	27	\N	9139	\N
9140	faNfcDirectional		\N	\N	27	\N	9140	\N
9141	faNfcSymbol		\N	\N	27	\N	9141	\N
9142	faNimblr		\N	\N	27	\N	9142	\N
9143	faNode		\N	\N	27	\N	9143	\N
9144	faNodeJs		\N	\N	27	\N	9144	\N
9145	faNotEqual		\N	\N	27	\N	9145	\N
9146	faNotdef		\N	\N	27	\N	9146	\N
9147	faNoteSticky		\N	\N	27	\N	9147	\N
9148	faNotesMedical		\N	\N	27	\N	9148	\N
9149	faNpm		\N	\N	27	\N	9149	\N
9150	faNs8		\N	\N	27	\N	9150	\N
9151	faNutritionix		\N	\N	27	\N	9151	\N
9152	faO		\N	\N	27	\N	9152	\N
9153	faObjectGroup		\N	\N	27	\N	9153	\N
9154	faObjectUngroup		\N	\N	27	\N	9154	\N
9155	faOctopusDeploy		\N	\N	27	\N	9155	\N
9156	faOdnoklassniki		\N	\N	27	\N	9156	\N
9157	faOdysee		\N	\N	27	\N	9157	\N
9158	faOilCan		\N	\N	27	\N	9158	\N
9159	faOilWell		\N	\N	27	\N	9159	\N
9160	faOldRepublic		\N	\N	27	\N	9160	\N
9161	faOm		\N	\N	27	\N	9161	\N
9162	faOpencart		\N	\N	27	\N	9162	\N
9163	faOpenid		\N	\N	27	\N	9163	\N
9164	faOpensuse		\N	\N	27	\N	9164	\N
9165	faOpera		\N	\N	27	\N	9165	\N
9166	faOptinMonster		\N	\N	27	\N	9166	\N
9167	faOrcid		\N	\N	27	\N	9167	\N
9168	faOsi		\N	\N	27	\N	9168	\N
9169	faOtter		\N	\N	27	\N	9169	\N
9170	faOutdent		\N	\N	27	\N	9170	\N
9171	faP		\N	\N	27	\N	9171	\N
9172	faPadlet		\N	\N	27	\N	9172	\N
9173	faPage4		\N	\N	27	\N	9173	\N
9174	faPagelines		\N	\N	27	\N	9174	\N
9175	faPager		\N	\N	27	\N	9175	\N
9176	faPaintRoller		\N	\N	27	\N	9176	\N
9177	faPaintbrush		\N	\N	27	\N	9177	\N
9178	faPalette		\N	\N	27	\N	9178	\N
9179	faPalfed		\N	\N	27	\N	9179	\N
9180	faPallet		\N	\N	27	\N	9180	\N
9181	faPanorama		\N	\N	27	\N	9181	\N
9182	faPaperPlane		\N	\N	27	\N	9182	\N
9183	faPaperclip		\N	\N	27	\N	9183	\N
9184	faParachuteBox		\N	\N	27	\N	9184	\N
9185	faParagraph		\N	\N	27	\N	9185	\N
9186	faPassport		\N	\N	27	\N	9186	\N
9187	faPaste		\N	\N	27	\N	9187	\N
9188	faPatreon		\N	\N	27	\N	9188	\N
9189	faPause		\N	\N	27	\N	9189	\N
9190	faPaw		\N	\N	27	\N	9190	\N
9191	faPaypal		\N	\N	27	\N	9191	\N
9192	faPeace		\N	\N	27	\N	9192	\N
9193	faPen		\N	\N	27	\N	9193	\N
9194	faPenClip		\N	\N	27	\N	9194	\N
9195	faPenFancy		\N	\N	27	\N	9195	\N
9196	faPenNib		\N	\N	27	\N	9196	\N
9197	faPenRuler		\N	\N	27	\N	9197	\N
9198	faPenToSquare		\N	\N	27	\N	9198	\N
9199	faPencil		\N	\N	27	\N	9199	\N
9200	faPeopleArrows		\N	\N	27	\N	9200	\N
9201	faPeopleCarryBox		\N	\N	27	\N	9201	\N
9202	faPeopleGroup		\N	\N	27	\N	9202	\N
9203	faPeopleLine		\N	\N	27	\N	9203	\N
9204	faPeoplePulling		\N	\N	27	\N	9204	\N
9205	faPeopleRobbery		\N	\N	27	\N	9205	\N
9206	faPeopleRoof		\N	\N	27	\N	9206	\N
9207	faPepperHot		\N	\N	27	\N	9207	\N
9208	faPerbyte		\N	\N	27	\N	9208	\N
9209	faPercent		\N	\N	27	\N	9209	\N
9210	faPeriscope		\N	\N	27	\N	9210	\N
9211	faPerson		\N	\N	27	\N	9211	\N
9212	faPersonArrowDownToLine		\N	\N	27	\N	9212	\N
9213	faPersonArrowUpFromLine		\N	\N	27	\N	9213	\N
9214	faPersonBiking		\N	\N	27	\N	9214	\N
9215	faPersonBooth		\N	\N	27	\N	9215	\N
9216	faPersonBreastfeeding		\N	\N	27	\N	9216	\N
9217	faPersonBurst		\N	\N	27	\N	9217	\N
9218	faPersonCane		\N	\N	27	\N	9218	\N
9219	faPersonChalkboard		\N	\N	27	\N	9219	\N
9220	faPersonCircleCheck		\N	\N	27	\N	9220	\N
9221	faPersonCircleExclamation		\N	\N	27	\N	9221	\N
9222	faPersonCircleMinus		\N	\N	27	\N	9222	\N
9223	faPersonCirclePlus		\N	\N	27	\N	9223	\N
9224	faPersonCircleQuestion		\N	\N	27	\N	9224	\N
9225	faPersonCircleXmark		\N	\N	27	\N	9225	\N
9226	faPersonDigging		\N	\N	27	\N	9226	\N
9227	faPersonDotsFromLine		\N	\N	27	\N	9227	\N
9228	faPersonDress		\N	\N	27	\N	9228	\N
9229	faPersonDressBurst		\N	\N	27	\N	9229	\N
9230	faPersonDrowning		\N	\N	27	\N	9230	\N
9231	faPersonFalling		\N	\N	27	\N	9231	\N
9232	faPersonFallingBurst		\N	\N	27	\N	9232	\N
9233	faPersonHalfDress		\N	\N	27	\N	9233	\N
9234	faPersonHarassing		\N	\N	27	\N	9234	\N
9235	faPersonHiking		\N	\N	27	\N	9235	\N
9236	faPersonMilitaryPointing		\N	\N	27	\N	9236	\N
9237	faPersonMilitaryRifle		\N	\N	27	\N	9237	\N
9238	faPersonMilitaryToPerson		\N	\N	27	\N	9238	\N
9239	faPersonPraying		\N	\N	27	\N	9239	\N
9240	faPersonPregnant		\N	\N	27	\N	9240	\N
9241	faPersonRays		\N	\N	27	\N	9241	\N
9242	faPersonRifle		\N	\N	27	\N	9242	\N
9243	faPersonRunning		\N	\N	27	\N	9243	\N
9244	faPersonShelter		\N	\N	27	\N	9244	\N
9245	faPersonSkating		\N	\N	27	\N	9245	\N
9246	faPersonSkiing		\N	\N	27	\N	9246	\N
9247	faPersonSkiingNordic		\N	\N	27	\N	9247	\N
9248	faPersonSnowboarding		\N	\N	27	\N	9248	\N
9249	faPersonSwimming		\N	\N	27	\N	9249	\N
9250	faPersonThroughWindow		\N	\N	27	\N	9250	\N
9251	faPersonWalking		\N	\N	27	\N	9251	\N
9252	faPersonWalkingArrowLoopLeft		\N	\N	27	\N	9252	\N
9253	faPersonWalkingArrowRight		\N	\N	27	\N	9253	\N
9254	faPersonWalkingDashedLineArrowRight		\N	\N	27	\N	9254	\N
9255	faPersonWalkingLuggage		\N	\N	27	\N	9255	\N
9256	faPersonWalkingWithCane		\N	\N	27	\N	9256	\N
9257	faPesetaSign		\N	\N	27	\N	9257	\N
9258	faPesoSign		\N	\N	27	\N	9258	\N
9259	faPhabricator		\N	\N	27	\N	9259	\N
9260	faPhoenixFramework		\N	\N	27	\N	9260	\N
9261	faPhoenixSquadron		\N	\N	27	\N	9261	\N
9262	faPhone		\N	\N	27	\N	9262	\N
9263	faPhoneFlip		\N	\N	27	\N	9263	\N
9264	faPhoneSlash		\N	\N	27	\N	9264	\N
9265	faPhoneVolume		\N	\N	27	\N	9265	\N
9266	faPhotoFilm		\N	\N	27	\N	9266	\N
9267	faPhp		\N	\N	27	\N	9267	\N
9268	faPiedPiper		\N	\N	27	\N	9268	\N
9269	faPiedPiperAlt		\N	\N	27	\N	9269	\N
9270	faPiedPiperHat		\N	\N	27	\N	9270	\N
9271	faPiedPiperPp		\N	\N	27	\N	9271	\N
9272	faPiggyBank		\N	\N	27	\N	9272	\N
9273	faPills		\N	\N	27	\N	9273	\N
9274	faPinterest		\N	\N	27	\N	9274	\N
9275	faPinterestP		\N	\N	27	\N	9275	\N
9276	faPix		\N	\N	27	\N	9276	\N
9277	faPixiv		\N	\N	27	\N	9277	\N
9278	faPizzaSlice		\N	\N	27	\N	9278	\N
9279	faPlaceOfWorship		\N	\N	27	\N	9279	\N
9280	faPlane		\N	\N	27	\N	9280	\N
9281	faPlaneArrival		\N	\N	27	\N	9281	\N
9282	faPlaneCircleCheck		\N	\N	27	\N	9282	\N
9283	faPlaneCircleExclamation		\N	\N	27	\N	9283	\N
9284	faPlaneCircleXmark		\N	\N	27	\N	9284	\N
9285	faPlaneDeparture		\N	\N	27	\N	9285	\N
9286	faPlaneLock		\N	\N	27	\N	9286	\N
9287	faPlaneSlash		\N	\N	27	\N	9287	\N
9288	faPlaneUp		\N	\N	27	\N	9288	\N
9289	faPlantWilt		\N	\N	27	\N	9289	\N
9290	faPlateWheat		\N	\N	27	\N	9290	\N
9291	faPlay		\N	\N	27	\N	9291	\N
9292	faPlaystation		\N	\N	27	\N	9292	\N
9293	faPlug		\N	\N	27	\N	9293	\N
9294	faPlugCircleBolt		\N	\N	27	\N	9294	\N
9295	faPlugCircleCheck		\N	\N	27	\N	9295	\N
9296	faPlugCircleExclamation		\N	\N	27	\N	9296	\N
9297	faPlugCircleMinus		\N	\N	27	\N	9297	\N
9298	faPlugCirclePlus		\N	\N	27	\N	9298	\N
9299	faPlugCircleXmark		\N	\N	27	\N	9299	\N
9300	faPlus		\N	\N	27	\N	9300	\N
9301	faPlusMinus		\N	\N	27	\N	9301	\N
9302	faPodcast		\N	\N	27	\N	9302	\N
9303	faPoo		\N	\N	27	\N	9303	\N
9304	faPooStorm		\N	\N	27	\N	9304	\N
9305	faPoop		\N	\N	27	\N	9305	\N
9306	faPowerOff		\N	\N	27	\N	9306	\N
9307	faPrescription		\N	\N	27	\N	9307	\N
9308	faPrescriptionBottle		\N	\N	27	\N	9308	\N
9309	faPrescriptionBottleMedical		\N	\N	27	\N	9309	\N
9310	faPrint		\N	\N	27	\N	9310	\N
9311	faProductHunt		\N	\N	27	\N	9311	\N
9312	faPumpMedical		\N	\N	27	\N	9312	\N
9313	faPumpSoap		\N	\N	27	\N	9313	\N
9314	faPushed		\N	\N	27	\N	9314	\N
9315	faPuzzlePiece		\N	\N	27	\N	9315	\N
9316	faPython		\N	\N	27	\N	9316	\N
9317	faQ		\N	\N	27	\N	9317	\N
9318	faQq		\N	\N	27	\N	9318	\N
9319	faQrcode		\N	\N	27	\N	9319	\N
9320	faQuestion		\N	\N	27	\N	9320	\N
9321	faQuinscape		\N	\N	27	\N	9321	\N
9322	faQuora		\N	\N	27	\N	9322	\N
9323	faQuoteLeft		\N	\N	27	\N	9323	\N
9324	faQuoteRight		\N	\N	27	\N	9324	\N
9325	faR		\N	\N	27	\N	9325	\N
9326	faRProject		\N	\N	27	\N	9326	\N
9327	faRadiation		\N	\N	27	\N	9327	\N
9328	faRadio		\N	\N	27	\N	9328	\N
9329	faRainbow		\N	\N	27	\N	9329	\N
9330	faRankingStar		\N	\N	27	\N	9330	\N
9331	faRaspberryPi		\N	\N	27	\N	9331	\N
9332	faRavelry		\N	\N	27	\N	9332	\N
9333	faReact		\N	\N	27	\N	9333	\N
9334	faReacteurope		\N	\N	27	\N	9334	\N
9335	faReadme		\N	\N	27	\N	9335	\N
9336	faRebel		\N	\N	27	\N	9336	\N
9337	faReceipt		\N	\N	27	\N	9337	\N
9338	faRecordVinyl		\N	\N	27	\N	9338	\N
9339	faRectangleAd		\N	\N	27	\N	9339	\N
9340	faRectangleList		\N	\N	27	\N	9340	\N
9341	faRectangleXmark		\N	\N	27	\N	9341	\N
9342	faRecycle		\N	\N	27	\N	9342	\N
9343	faRedRiver		\N	\N	27	\N	9343	\N
9344	faReddit		\N	\N	27	\N	9344	\N
9345	faRedditAlien		\N	\N	27	\N	9345	\N
9346	faRedhat		\N	\N	27	\N	9346	\N
9347	faRegistered		\N	\N	27	\N	9347	\N
9348	faRenren		\N	\N	27	\N	9348	\N
9349	faRepeat		\N	\N	27	\N	9349	\N
9350	faReply		\N	\N	27	\N	9350	\N
9351	faReplyAll		\N	\N	27	\N	9351	\N
9352	faReplyd		\N	\N	27	\N	9352	\N
9353	faRepublican		\N	\N	27	\N	9353	\N
9354	faResearchgate		\N	\N	27	\N	9354	\N
9355	faResolving		\N	\N	27	\N	9355	\N
9356	faRestroom		\N	\N	27	\N	9356	\N
9357	faRetweet		\N	\N	27	\N	9357	\N
9358	faRev		\N	\N	27	\N	9358	\N
9359	faRibbon		\N	\N	27	\N	9359	\N
9360	faRightFromBracket		\N	\N	27	\N	9360	\N
9361	faRightLeft		\N	\N	27	\N	9361	\N
9362	faRightLong		\N	\N	27	\N	9362	\N
9363	faRightToBracket		\N	\N	27	\N	9363	\N
9364	faRing		\N	\N	27	\N	9364	\N
9365	faRoad		\N	\N	27	\N	9365	\N
9366	faRoadBarrier		\N	\N	27	\N	9366	\N
9367	faRoadBridge		\N	\N	27	\N	9367	\N
9368	faRoadCircleCheck		\N	\N	27	\N	9368	\N
9369	faRoadCircleExclamation		\N	\N	27	\N	9369	\N
9370	faRoadCircleXmark		\N	\N	27	\N	9370	\N
9371	faRoadLock		\N	\N	27	\N	9371	\N
9372	faRoadSpikes		\N	\N	27	\N	9372	\N
9373	faRobot		\N	\N	27	\N	9373	\N
9374	faRocket		\N	\N	27	\N	9374	\N
9375	faRocketchat		\N	\N	27	\N	9375	\N
9376	faRockrms		\N	\N	27	\N	9376	\N
9377	faRotate		\N	\N	27	\N	9377	\N
9378	faRotateLeft		\N	\N	27	\N	9378	\N
9379	faRotateRight		\N	\N	27	\N	9379	\N
9380	faRoute		\N	\N	27	\N	9380	\N
9381	faRss		\N	\N	27	\N	9381	\N
9382	faRubleSign		\N	\N	27	\N	9382	\N
9383	faRug		\N	\N	27	\N	9383	\N
9384	faRuler		\N	\N	27	\N	9384	\N
9385	faRulerCombined		\N	\N	27	\N	9385	\N
9386	faRulerHorizontal		\N	\N	27	\N	9386	\N
9387	faRulerVertical		\N	\N	27	\N	9387	\N
9388	faRupeeSign		\N	\N	27	\N	9388	\N
9389	faRupiahSign		\N	\N	27	\N	9389	\N
9390	faRust		\N	\N	27	\N	9390	\N
9391	faS		\N	\N	27	\N	9391	\N
9392	faSackDollar		\N	\N	27	\N	9392	\N
9393	faSackXmark		\N	\N	27	\N	9393	\N
9394	faSafari		\N	\N	27	\N	9394	\N
9395	faSailboat		\N	\N	27	\N	9395	\N
9396	faSalesforce		\N	\N	27	\N	9396	\N
9397	faSass		\N	\N	27	\N	9397	\N
9398	faSatellite		\N	\N	27	\N	9398	\N
9399	faSatelliteDish		\N	\N	27	\N	9399	\N
9400	faScaleBalanced		\N	\N	27	\N	9400	\N
9401	faScaleUnbalanced		\N	\N	27	\N	9401	\N
9402	faScaleUnbalancedFlip		\N	\N	27	\N	9402	\N
9403	faSchlix		\N	\N	27	\N	9403	\N
9404	faSchool		\N	\N	27	\N	9404	\N
9405	faSchoolCircleCheck		\N	\N	27	\N	9405	\N
9406	faSchoolCircleExclamation		\N	\N	27	\N	9406	\N
9407	faSchoolCircleXmark		\N	\N	27	\N	9407	\N
9408	faSchoolFlag		\N	\N	27	\N	9408	\N
9409	faSchoolLock		\N	\N	27	\N	9409	\N
9410	faScissors		\N	\N	27	\N	9410	\N
9411	faScreenpal		\N	\N	27	\N	9411	\N
9412	faScrewdriver		\N	\N	27	\N	9412	\N
9413	faScrewdriverWrench		\N	\N	27	\N	9413	\N
9414	faScribd		\N	\N	27	\N	9414	\N
9415	faScroll		\N	\N	27	\N	9415	\N
9416	faScrollTorah		\N	\N	27	\N	9416	\N
9417	faSdCard		\N	\N	27	\N	9417	\N
9418	faSearchengin		\N	\N	27	\N	9418	\N
9419	faSection		\N	\N	27	\N	9419	\N
9420	faSeedling		\N	\N	27	\N	9420	\N
9421	faSellcast		\N	\N	27	\N	9421	\N
9422	faSellsy		\N	\N	27	\N	9422	\N
9423	faServer		\N	\N	27	\N	9423	\N
9424	faServicestack		\N	\N	27	\N	9424	\N
9425	faShapes		\N	\N	27	\N	9425	\N
9426	faShare		\N	\N	27	\N	9426	\N
9427	faShareFromSquare		\N	\N	27	\N	9427	\N
9428	faShareNodes		\N	\N	27	\N	9428	\N
9429	faSheetPlastic		\N	\N	27	\N	9429	\N
9430	faShekelSign		\N	\N	27	\N	9430	\N
9431	faShield		\N	\N	27	\N	9431	\N
9432	faShieldCat		\N	\N	27	\N	9432	\N
9433	faShieldDog		\N	\N	27	\N	9433	\N
9434	faShieldHalved		\N	\N	27	\N	9434	\N
9435	faShieldHeart		\N	\N	27	\N	9435	\N
9436	faShieldVirus		\N	\N	27	\N	9436	\N
9437	faShip		\N	\N	27	\N	9437	\N
9438	faShirt		\N	\N	27	\N	9438	\N
9439	faShirtsinbulk		\N	\N	27	\N	9439	\N
9440	faShoePrints		\N	\N	27	\N	9440	\N
9441	faShoelace		\N	\N	27	\N	9441	\N
9442	faShop		\N	\N	27	\N	9442	\N
9443	faShopLock		\N	\N	27	\N	9443	\N
9444	faShopSlash		\N	\N	27	\N	9444	\N
9445	faShopify		\N	\N	27	\N	9445	\N
9446	faShopware		\N	\N	27	\N	9446	\N
9447	faShower		\N	\N	27	\N	9447	\N
9448	faShrimp		\N	\N	27	\N	9448	\N
9449	faShuffle		\N	\N	27	\N	9449	\N
9450	faShuttleSpace		\N	\N	27	\N	9450	\N
9451	faSignHanging		\N	\N	27	\N	9451	\N
9452	faSignal		\N	\N	27	\N	9452	\N
9453	faSignalMessenger		\N	\N	27	\N	9453	\N
9454	faSignature		\N	\N	27	\N	9454	\N
9455	faSignsPost		\N	\N	27	\N	9455	\N
9456	faSimCard		\N	\N	27	\N	9456	\N
9457	faSimplybuilt		\N	\N	27	\N	9457	\N
9458	faSink		\N	\N	27	\N	9458	\N
9459	faSistrix		\N	\N	27	\N	9459	\N
9460	faSitemap		\N	\N	27	\N	9460	\N
9461	faSith		\N	\N	27	\N	9461	\N
9462	faSitrox		\N	\N	27	\N	9462	\N
9463	faSketch		\N	\N	27	\N	9463	\N
9464	faSkull		\N	\N	27	\N	9464	\N
9465	faSkullCrossbones		\N	\N	27	\N	9465	\N
9466	faSkyatlas		\N	\N	27	\N	9466	\N
9467	faSkype		\N	\N	27	\N	9467	\N
9468	faSlack		\N	\N	27	\N	9468	\N
9469	faSlash		\N	\N	27	\N	9469	\N
9470	faSleigh		\N	\N	27	\N	9470	\N
9471	faSliders		\N	\N	27	\N	9471	\N
9472	faSlideshare		\N	\N	27	\N	9472	\N
9473	faSmog		\N	\N	27	\N	9473	\N
9474	faSmoking		\N	\N	27	\N	9474	\N
9475	faSnapchat		\N	\N	27	\N	9475	\N
9476	faSnowflake		\N	\N	27	\N	9476	\N
9477	faSnowman		\N	\N	27	\N	9477	\N
9478	faSnowplow		\N	\N	27	\N	9478	\N
9479	faSoap		\N	\N	27	\N	9479	\N
9480	faSocks		\N	\N	27	\N	9480	\N
9481	faSolarPanel		\N	\N	27	\N	9481	\N
9482	faSort		\N	\N	27	\N	9482	\N
9483	faSortDown		\N	\N	27	\N	9483	\N
9484	faSortUp		\N	\N	27	\N	9484	\N
9485	faSoundcloud		\N	\N	27	\N	9485	\N
9486	faSourcetree		\N	\N	27	\N	9486	\N
9487	faSpa		\N	\N	27	\N	9487	\N
9488	faSpaceAwesome		\N	\N	27	\N	9488	\N
9489	faSpaghettiMonsterFlying		\N	\N	27	\N	9489	\N
9490	faSpeakap		\N	\N	27	\N	9490	\N
9491	faSpeakerDeck		\N	\N	27	\N	9491	\N
9492	faSpellCheck		\N	\N	27	\N	9492	\N
9493	faSpider		\N	\N	27	\N	9493	\N
9494	faSpinner		\N	\N	27	\N	9494	\N
9495	faSplotch		\N	\N	27	\N	9495	\N
9496	faSpoon		\N	\N	27	\N	9496	\N
9497	faSpotify		\N	\N	27	\N	9497	\N
9498	faSprayCan		\N	\N	27	\N	9498	\N
9499	faSprayCanSparkles		\N	\N	27	\N	9499	\N
9500	faSquare		\N	\N	27	\N	9500	\N
9501	faSquareArrowUpRight		\N	\N	27	\N	9501	\N
9502	faSquareBehance		\N	\N	27	\N	9502	\N
9503	faSquareBinary		\N	\N	27	\N	9503	\N
9504	faSquareBluesky		\N	\N	27	\N	9504	\N
9505	faSquareCaretDown		\N	\N	27	\N	9505	\N
9506	faSquareCaretLeft		\N	\N	27	\N	9506	\N
9507	faSquareCaretRight		\N	\N	27	\N	9507	\N
9508	faSquareCaretUp		\N	\N	27	\N	9508	\N
9509	faSquareCheck		\N	\N	27	\N	9509	\N
9510	faSquareDribbble		\N	\N	27	\N	9510	\N
9511	faSquareEnvelope		\N	\N	27	\N	9511	\N
9512	faSquareFacebook		\N	\N	27	\N	9512	\N
9513	faSquareFontAwesome		\N	\N	27	\N	9513	\N
9514	faSquareFontAwesomeStroke		\N	\N	27	\N	9514	\N
9515	faSquareFull		\N	\N	27	\N	9515	\N
9516	faSquareGit		\N	\N	27	\N	9516	\N
9517	faSquareGithub		\N	\N	27	\N	9517	\N
9518	faSquareGitlab		\N	\N	27	\N	9518	\N
9519	faSquareGooglePlus		\N	\N	27	\N	9519	\N
9520	faSquareH		\N	\N	27	\N	9520	\N
9521	faSquareHackerNews		\N	\N	27	\N	9521	\N
9522	faSquareInstagram		\N	\N	27	\N	9522	\N
9523	faSquareJs		\N	\N	27	\N	9523	\N
9524	faSquareLastfm		\N	\N	27	\N	9524	\N
9525	faSquareLetterboxd		\N	\N	27	\N	9525	\N
9526	faSquareMinus		\N	\N	27	\N	9526	\N
9527	faSquareNfi		\N	\N	27	\N	9527	\N
9528	faSquareOdnoklassniki		\N	\N	27	\N	9528	\N
9529	faSquareParking		\N	\N	27	\N	9529	\N
9530	faSquarePen		\N	\N	27	\N	9530	\N
9531	faSquarePersonConfined		\N	\N	27	\N	9531	\N
9532	faSquarePhone		\N	\N	27	\N	9532	\N
9533	faSquarePhoneFlip		\N	\N	27	\N	9533	\N
9534	faSquarePiedPiper		\N	\N	27	\N	9534	\N
9535	faSquarePinterest		\N	\N	27	\N	9535	\N
9536	faSquarePlus		\N	\N	27	\N	9536	\N
9537	faSquarePollHorizontal		\N	\N	27	\N	9537	\N
9538	faSquarePollVertical		\N	\N	27	\N	9538	\N
9539	faSquareReddit		\N	\N	27	\N	9539	\N
9540	faSquareRootVariable		\N	\N	27	\N	9540	\N
9541	faSquareRss		\N	\N	27	\N	9541	\N
9542	faSquareShareNodes		\N	\N	27	\N	9542	\N
9543	faSquareSnapchat		\N	\N	27	\N	9543	\N
9544	faSquareSteam		\N	\N	27	\N	9544	\N
9545	faSquareThreads		\N	\N	27	\N	9545	\N
9546	faSquareTumblr		\N	\N	27	\N	9546	\N
9547	faSquareTwitter		\N	\N	27	\N	9547	\N
9548	faSquareUpRight		\N	\N	27	\N	9548	\N
9549	faSquareUpwork		\N	\N	27	\N	9549	\N
9550	faSquareViadeo		\N	\N	27	\N	9550	\N
9551	faSquareVimeo		\N	\N	27	\N	9551	\N
9552	faSquareVirus		\N	\N	27	\N	9552	\N
9553	faSquareWebAwesome		\N	\N	27	\N	9553	\N
9554	faSquareWebAwesomeStroke		\N	\N	27	\N	9554	\N
9555	faSquareWhatsapp		\N	\N	27	\N	9555	\N
9556	faSquareXTwitter		\N	\N	27	\N	9556	\N
9557	faSquareXing		\N	\N	27	\N	9557	\N
9558	faSquareXmark		\N	\N	27	\N	9558	\N
9559	faSquareYoutube		\N	\N	27	\N	9559	\N
9560	faSquarespace		\N	\N	27	\N	9560	\N
9561	faStackExchange		\N	\N	27	\N	9561	\N
9562	faStackOverflow		\N	\N	27	\N	9562	\N
9563	faStackpath		\N	\N	27	\N	9563	\N
9564	faStaffSnake		\N	\N	27	\N	9564	\N
9565	faStairs		\N	\N	27	\N	9565	\N
9566	faStamp		\N	\N	27	\N	9566	\N
9567	faStapler		\N	\N	27	\N	9567	\N
9568	faStar		\N	\N	27	\N	9568	\N
9569	faStarAndCrescent		\N	\N	27	\N	9569	\N
9570	faStarHalf		\N	\N	27	\N	9570	\N
9571	faStarHalfStroke		\N	\N	27	\N	9571	\N
9572	faStarOfDavid		\N	\N	27	\N	9572	\N
9573	faStarOfLife		\N	\N	27	\N	9573	\N
9574	faStaylinked		\N	\N	27	\N	9574	\N
9575	faSteam		\N	\N	27	\N	9575	\N
9576	faSteamSymbol		\N	\N	27	\N	9576	\N
9577	faSterlingSign		\N	\N	27	\N	9577	\N
9578	faStethoscope		\N	\N	27	\N	9578	\N
9579	faStickerMule		\N	\N	27	\N	9579	\N
9580	faStop		\N	\N	27	\N	9580	\N
9581	faStopwatch		\N	\N	27	\N	9581	\N
9582	faStopwatch20		\N	\N	27	\N	9582	\N
9583	faStore		\N	\N	27	\N	9583	\N
9584	faStoreSlash		\N	\N	27	\N	9584	\N
9585	faStrava		\N	\N	27	\N	9585	\N
9586	faStreetView		\N	\N	27	\N	9586	\N
9587	faStrikethrough		\N	\N	27	\N	9587	\N
9588	faStripe		\N	\N	27	\N	9588	\N
9589	faStripeS		\N	\N	27	\N	9589	\N
9590	faStroopwafel		\N	\N	27	\N	9590	\N
9591	faStubber		\N	\N	27	\N	9591	\N
9592	faStudiovinari		\N	\N	27	\N	9592	\N
9593	faStumbleupon		\N	\N	27	\N	9593	\N
9594	faStumbleuponCircle		\N	\N	27	\N	9594	\N
9595	faSubscript		\N	\N	27	\N	9595	\N
9596	faSuitcase		\N	\N	27	\N	9596	\N
9597	faSuitcaseMedical		\N	\N	27	\N	9597	\N
9598	faSuitcaseRolling		\N	\N	27	\N	9598	\N
9599	faSun		\N	\N	27	\N	9599	\N
9600	faSunPlantWilt		\N	\N	27	\N	9600	\N
9601	faSuperpowers		\N	\N	27	\N	9601	\N
9602	faSuperscript		\N	\N	27	\N	9602	\N
9603	faSupple		\N	\N	27	\N	9603	\N
9604	faSuse		\N	\N	27	\N	9604	\N
9605	faSwatchbook		\N	\N	27	\N	9605	\N
9606	faSwift		\N	\N	27	\N	9606	\N
9607	faSymfony		\N	\N	27	\N	9607	\N
9608	faSynagogue		\N	\N	27	\N	9608	\N
9609	faSyringe		\N	\N	27	\N	9609	\N
9610	faT		\N	\N	27	\N	9610	\N
9611	faTable		\N	\N	27	\N	9611	\N
9612	faTableCells		\N	\N	27	\N	9612	\N
9613	faTableCellsColumnLock		\N	\N	27	\N	9613	\N
9614	faTableCellsLarge		\N	\N	27	\N	9614	\N
9615	faTableCellsRowLock		\N	\N	27	\N	9615	\N
9616	faTableCellsRowUnlock		\N	\N	27	\N	9616	\N
9617	faTableColumns		\N	\N	27	\N	9617	\N
9618	faTableList		\N	\N	27	\N	9618	\N
9619	faTableTennisPaddleBall		\N	\N	27	\N	9619	\N
9620	faTablet		\N	\N	27	\N	9620	\N
9621	faTabletButton		\N	\N	27	\N	9621	\N
9622	faTabletScreenButton		\N	\N	27	\N	9622	\N
9623	faTablets		\N	\N	27	\N	9623	\N
9624	faTachographDigital		\N	\N	27	\N	9624	\N
9625	faTag		\N	\N	27	\N	9625	\N
9626	faTags		\N	\N	27	\N	9626	\N
9627	faTape		\N	\N	27	\N	9627	\N
9628	faTarp		\N	\N	27	\N	9628	\N
9629	faTarpDroplet		\N	\N	27	\N	9629	\N
9630	faTaxi		\N	\N	27	\N	9630	\N
9631	faTeamspeak		\N	\N	27	\N	9631	\N
9632	faTeeth		\N	\N	27	\N	9632	\N
9633	faTeethOpen		\N	\N	27	\N	9633	\N
9634	faTelegram		\N	\N	27	\N	9634	\N
9635	faTemperatureArrowDown		\N	\N	27	\N	9635	\N
9636	faTemperatureArrowUp		\N	\N	27	\N	9636	\N
9637	faTemperatureEmpty		\N	\N	27	\N	9637	\N
9638	faTemperatureFull		\N	\N	27	\N	9638	\N
9639	faTemperatureHalf		\N	\N	27	\N	9639	\N
9640	faTemperatureHigh		\N	\N	27	\N	9640	\N
9641	faTemperatureLow		\N	\N	27	\N	9641	\N
9642	faTemperatureQuarter		\N	\N	27	\N	9642	\N
9643	faTemperatureThreeQuarters		\N	\N	27	\N	9643	\N
9644	faTencentWeibo		\N	\N	27	\N	9644	\N
9645	faTengeSign		\N	\N	27	\N	9645	\N
9646	faTent		\N	\N	27	\N	9646	\N
9647	faTentArrowDownToLine		\N	\N	27	\N	9647	\N
9648	faTentArrowLeftRight		\N	\N	27	\N	9648	\N
9649	faTentArrowTurnLeft		\N	\N	27	\N	9649	\N
9650	faTentArrowsDown		\N	\N	27	\N	9650	\N
9651	faTents		\N	\N	27	\N	9651	\N
9652	faTerminal		\N	\N	27	\N	9652	\N
9653	faTextHeight		\N	\N	27	\N	9653	\N
9654	faTextSlash		\N	\N	27	\N	9654	\N
9655	faTextWidth		\N	\N	27	\N	9655	\N
9656	faTheRedYeti		\N	\N	27	\N	9656	\N
9657	faThemeco		\N	\N	27	\N	9657	\N
9658	faThemeisle		\N	\N	27	\N	9658	\N
9659	faThermometer		\N	\N	27	\N	9659	\N
9660	faThinkPeaks		\N	\N	27	\N	9660	\N
9661	faThreads		\N	\N	27	\N	9661	\N
9662	faThumbsDown		\N	\N	27	\N	9662	\N
9663	faThumbsUp		\N	\N	27	\N	9663	\N
9664	faThumbtack		\N	\N	27	\N	9664	\N
9665	faThumbtackSlash		\N	\N	27	\N	9665	\N
9666	faTicket		\N	\N	27	\N	9666	\N
9667	faTicketSimple		\N	\N	27	\N	9667	\N
9668	faTiktok		\N	\N	27	\N	9668	\N
9669	faTimeline		\N	\N	27	\N	9669	\N
9670	faToggleOff		\N	\N	27	\N	9670	\N
9671	faToggleOn		\N	\N	27	\N	9671	\N
9672	faToilet		\N	\N	27	\N	9672	\N
9673	faToiletPaper		\N	\N	27	\N	9673	\N
9674	faToiletPaperSlash		\N	\N	27	\N	9674	\N
9675	faToiletPortable		\N	\N	27	\N	9675	\N
9676	faToiletsPortable		\N	\N	27	\N	9676	\N
9677	faToolbox		\N	\N	27	\N	9677	\N
9678	faTooth		\N	\N	27	\N	9678	\N
9679	faToriiGate		\N	\N	27	\N	9679	\N
9680	faTornado		\N	\N	27	\N	9680	\N
9681	faTowerBroadcast		\N	\N	27	\N	9681	\N
9682	faTowerCell		\N	\N	27	\N	9682	\N
9683	faTowerObservation		\N	\N	27	\N	9683	\N
9684	faTractor		\N	\N	27	\N	9684	\N
9685	faTradeFederation		\N	\N	27	\N	9685	\N
9686	faTrademark		\N	\N	27	\N	9686	\N
9687	faTrafficLight		\N	\N	27	\N	9687	\N
9688	faTrailer		\N	\N	27	\N	9688	\N
9689	faTrain		\N	\N	27	\N	9689	\N
9690	faTrainSubway		\N	\N	27	\N	9690	\N
9691	faTrainTram		\N	\N	27	\N	9691	\N
9692	faTransgender		\N	\N	27	\N	9692	\N
9693	faTrash		\N	\N	27	\N	9693	\N
9694	faTrashArrowUp		\N	\N	27	\N	9694	\N
9695	faTrashCan		\N	\N	27	\N	9695	\N
9696	faTrashCanArrowUp		\N	\N	27	\N	9696	\N
9697	faTree		\N	\N	27	\N	9697	\N
9698	faTreeCity		\N	\N	27	\N	9698	\N
9699	faTrello		\N	\N	27	\N	9699	\N
9700	faTriangleExclamation		\N	\N	27	\N	9700	\N
9701	faTrophy		\N	\N	27	\N	9701	\N
9702	faTrowel		\N	\N	27	\N	9702	\N
9703	faTrowelBricks		\N	\N	27	\N	9703	\N
9704	faTruck		\N	\N	27	\N	9704	\N
9705	faTruckArrowRight		\N	\N	27	\N	9705	\N
9706	faTruckDroplet		\N	\N	27	\N	9706	\N
9707	faTruckFast		\N	\N	27	\N	9707	\N
9708	faTruckField		\N	\N	27	\N	9708	\N
9709	faTruckFieldUn		\N	\N	27	\N	9709	\N
9710	faTruckFront		\N	\N	27	\N	9710	\N
9711	faTruckMedical		\N	\N	27	\N	9711	\N
9712	faTruckMonster		\N	\N	27	\N	9712	\N
9713	faTruckMoving		\N	\N	27	\N	9713	\N
9714	faTruckPickup		\N	\N	27	\N	9714	\N
9715	faTruckPlane		\N	\N	27	\N	9715	\N
9716	faTruckRampBox		\N	\N	27	\N	9716	\N
9717	faTty		\N	\N	27	\N	9717	\N
9718	faTumblr		\N	\N	27	\N	9718	\N
9719	faTurkishLiraSign		\N	\N	27	\N	9719	\N
9720	faTurnDown		\N	\N	27	\N	9720	\N
9721	faTurnUp		\N	\N	27	\N	9721	\N
9722	faTv		\N	\N	27	\N	9722	\N
9723	faTwitch		\N	\N	27	\N	9723	\N
9724	faTwitter		\N	\N	27	\N	9724	\N
9725	faTypo3		\N	\N	27	\N	9725	\N
9726	faU		\N	\N	27	\N	9726	\N
9727	faUber		\N	\N	27	\N	9727	\N
9728	faUbuntu		\N	\N	27	\N	9728	\N
9729	faUikit		\N	\N	27	\N	9729	\N
9730	faUmbraco		\N	\N	27	\N	9730	\N
9731	faUmbrella		\N	\N	27	\N	9731	\N
9732	faUmbrellaBeach		\N	\N	27	\N	9732	\N
9733	faUncharted		\N	\N	27	\N	9733	\N
9734	faUnderline		\N	\N	27	\N	9734	\N
9735	faUniregistry		\N	\N	27	\N	9735	\N
9736	faUnity		\N	\N	27	\N	9736	\N
9737	faUniversalAccess		\N	\N	27	\N	9737	\N
9738	faUnlock		\N	\N	27	\N	9738	\N
9739	faUnlockKeyhole		\N	\N	27	\N	9739	\N
9740	faUnsplash		\N	\N	27	\N	9740	\N
9741	faUntappd		\N	\N	27	\N	9741	\N
9742	faUpDown		\N	\N	27	\N	9742	\N
9743	faUpDownLeftRight		\N	\N	27	\N	9743	\N
9744	faUpLong		\N	\N	27	\N	9744	\N
9745	faUpRightAndDownLeftFromCenter		\N	\N	27	\N	9745	\N
9746	faUpRightFromSquare		\N	\N	27	\N	9746	\N
9747	faUpload		\N	\N	27	\N	9747	\N
9748	faUps		\N	\N	27	\N	9748	\N
9749	faUpwork		\N	\N	27	\N	9749	\N
9750	faUsb		\N	\N	27	\N	9750	\N
9751	faUser		\N	\N	27	\N	9751	\N
9752	faUserAstronaut		\N	\N	27	\N	9752	\N
9753	faUserCheck		\N	\N	27	\N	9753	\N
9754	faUserClock		\N	\N	27	\N	9754	\N
9755	faUserDoctor		\N	\N	27	\N	9755	\N
9756	faUserGear		\N	\N	27	\N	9756	\N
9757	faUserGraduate		\N	\N	27	\N	9757	\N
9758	faUserGroup		\N	\N	27	\N	9758	\N
9759	faUserInjured		\N	\N	27	\N	9759	\N
9760	faUserLarge		\N	\N	27	\N	9760	\N
9761	faUserLargeSlash		\N	\N	27	\N	9761	\N
9762	faUserLock		\N	\N	27	\N	9762	\N
9763	faUserMinus		\N	\N	27	\N	9763	\N
9764	faUserNinja		\N	\N	27	\N	9764	\N
9765	faUserNurse		\N	\N	27	\N	9765	\N
9766	faUserPen		\N	\N	27	\N	9766	\N
9767	faUserPlus		\N	\N	27	\N	9767	\N
9768	faUserSecret		\N	\N	27	\N	9768	\N
9769	faUserShield		\N	\N	27	\N	9769	\N
9770	faUserSlash		\N	\N	27	\N	9770	\N
9771	faUserTag		\N	\N	27	\N	9771	\N
9772	faUserTie		\N	\N	27	\N	9772	\N
9773	faUserXmark		\N	\N	27	\N	9773	\N
9774	faUsers		\N	\N	27	\N	9774	\N
9775	faUsersBetweenLines		\N	\N	27	\N	9775	\N
9776	faUsersGear		\N	\N	27	\N	9776	\N
9777	faUsersLine		\N	\N	27	\N	9777	\N
9778	faUsersRays		\N	\N	27	\N	9778	\N
9779	faUsersRectangle		\N	\N	27	\N	9779	\N
9780	faUsersSlash		\N	\N	27	\N	9780	\N
9781	faUsersViewfinder		\N	\N	27	\N	9781	\N
9782	faUsps		\N	\N	27	\N	9782	\N
9783	faUssunnah		\N	\N	27	\N	9783	\N
9784	faUtensils		\N	\N	27	\N	9784	\N
9785	faV		\N	\N	27	\N	9785	\N
9786	faVaadin		\N	\N	27	\N	9786	\N
9787	faVanShuttle		\N	\N	27	\N	9787	\N
9788	faVault		\N	\N	27	\N	9788	\N
9789	faVectorSquare		\N	\N	27	\N	9789	\N
9790	faVenus		\N	\N	27	\N	9790	\N
9791	faVenusDouble		\N	\N	27	\N	9791	\N
9792	faVenusMars		\N	\N	27	\N	9792	\N
9793	faVest		\N	\N	27	\N	9793	\N
9794	faVestPatches		\N	\N	27	\N	9794	\N
9795	faViacoin		\N	\N	27	\N	9795	\N
9796	faViadeo		\N	\N	27	\N	9796	\N
9797	faVial		\N	\N	27	\N	9797	\N
9798	faVialCircleCheck		\N	\N	27	\N	9798	\N
9799	faVialVirus		\N	\N	27	\N	9799	\N
9800	faVials		\N	\N	27	\N	9800	\N
9801	faViber		\N	\N	27	\N	9801	\N
9802	faVideo		\N	\N	27	\N	9802	\N
9803	faVideoSlash		\N	\N	27	\N	9803	\N
9804	faVihara		\N	\N	27	\N	9804	\N
9805	faVimeo		\N	\N	27	\N	9805	\N
9806	faVimeoV		\N	\N	27	\N	9806	\N
9807	faVine		\N	\N	27	\N	9807	\N
9808	faVirus		\N	\N	27	\N	9808	\N
9809	faVirusCovid		\N	\N	27	\N	9809	\N
9810	faVirusCovidSlash		\N	\N	27	\N	9810	\N
9811	faVirusSlash		\N	\N	27	\N	9811	\N
9812	faViruses		\N	\N	27	\N	9812	\N
9813	faVk		\N	\N	27	\N	9813	\N
9814	faVnv		\N	\N	27	\N	9814	\N
9815	faVoicemail		\N	\N	27	\N	9815	\N
9816	faVolcano		\N	\N	27	\N	9816	\N
9817	faVolleyball		\N	\N	27	\N	9817	\N
9818	faVolumeHigh		\N	\N	27	\N	9818	\N
9819	faVolumeLow		\N	\N	27	\N	9819	\N
9820	faVolumeOff		\N	\N	27	\N	9820	\N
9821	faVolumeXmark		\N	\N	27	\N	9821	\N
9822	faVrCardboard		\N	\N	27	\N	9822	\N
9823	faVuejs		\N	\N	27	\N	9823	\N
9824	faW		\N	\N	27	\N	9824	\N
9825	faWalkieTalkie		\N	\N	27	\N	9825	\N
9826	faWallet		\N	\N	27	\N	9826	\N
9827	faWandMagic		\N	\N	27	\N	9827	\N
9828	faWandMagicSparkles		\N	\N	27	\N	9828	\N
9829	faWandSparkles		\N	\N	27	\N	9829	\N
9830	faWarehouse		\N	\N	27	\N	9830	\N
9831	faWatchmanMonitoring		\N	\N	27	\N	9831	\N
9832	faWater		\N	\N	27	\N	9832	\N
9833	faWaterLadder		\N	\N	27	\N	9833	\N
9834	faWaveSquare		\N	\N	27	\N	9834	\N
9835	faWaze		\N	\N	27	\N	9835	\N
9836	faWebAwesome		\N	\N	27	\N	9836	\N
9837	faWebflow		\N	\N	27	\N	9837	\N
9838	faWeebly		\N	\N	27	\N	9838	\N
9839	faWeibo		\N	\N	27	\N	9839	\N
9840	faWeightHanging		\N	\N	27	\N	9840	\N
9841	faWeightScale		\N	\N	27	\N	9841	\N
9842	faWeixin		\N	\N	27	\N	9842	\N
9843	faWhatsapp		\N	\N	27	\N	9843	\N
9844	faWheatAwn		\N	\N	27	\N	9844	\N
9845	faWheatAwnCircleExclamation		\N	\N	27	\N	9845	\N
9846	faWheelchair		\N	\N	27	\N	9846	\N
9847	faWheelchairMove		\N	\N	27	\N	9847	\N
9848	faWhiskeyGlass		\N	\N	27	\N	9848	\N
9849	faWhmcs		\N	\N	27	\N	9849	\N
9850	faWifi		\N	\N	27	\N	9850	\N
9851	faWikipediaW		\N	\N	27	\N	9851	\N
9852	faWind		\N	\N	27	\N	9852	\N
9853	faWindowMaximize		\N	\N	27	\N	9853	\N
9854	faWindowMinimize		\N	\N	27	\N	9854	\N
9855	faWindowRestore		\N	\N	27	\N	9855	\N
9856	faWindows		\N	\N	27	\N	9856	\N
9857	faWineBottle		\N	\N	27	\N	9857	\N
9858	faWineGlass		\N	\N	27	\N	9858	\N
9859	faWineGlassEmpty		\N	\N	27	\N	9859	\N
9860	faWirsindhandwerk		\N	\N	27	\N	9860	\N
9861	faWix		\N	\N	27	\N	9861	\N
9862	faWizardsOfTheCoast		\N	\N	27	\N	9862	\N
9863	faWodu		\N	\N	27	\N	9863	\N
9864	faWolfPackBattalion		\N	\N	27	\N	9864	\N
9865	faWonSign		\N	\N	27	\N	9865	\N
9866	faWordpress		\N	\N	27	\N	9866	\N
9867	faWordpressSimple		\N	\N	27	\N	9867	\N
9868	faWorm		\N	\N	27	\N	9868	\N
9869	faWpbeginner		\N	\N	27	\N	9869	\N
9870	faWpexplorer		\N	\N	27	\N	9870	\N
9871	faWpforms		\N	\N	27	\N	9871	\N
9872	faWpressr		\N	\N	27	\N	9872	\N
9873	faWrench		\N	\N	27	\N	9873	\N
9874	faX		\N	\N	27	\N	9874	\N
9875	faXRay		\N	\N	27	\N	9875	\N
9876	faXTwitter		\N	\N	27	\N	9876	\N
9877	faXbox		\N	\N	27	\N	9877	\N
9878	faXing		\N	\N	27	\N	9878	\N
9879	faXmark		\N	\N	27	\N	9879	\N
9880	faXmarksLines		\N	\N	27	\N	9880	\N
9881	faY		\N	\N	27	\N	9881	\N
9882	faYCombinator		\N	\N	27	\N	9882	\N
9883	faYahoo		\N	\N	27	\N	9883	\N
9884	faYammer		\N	\N	27	\N	9884	\N
9885	faYandex		\N	\N	27	\N	9885	\N
9886	faYandexInternational		\N	\N	27	\N	9886	\N
9887	faYarn		\N	\N	27	\N	9887	\N
9888	faYelp		\N	\N	27	\N	9888	\N
9889	faYenSign		\N	\N	27	\N	9889	\N
9890	faYinYang		\N	\N	27	\N	9890	\N
9891	faYoast		\N	\N	27	\N	9891	\N
9892	faYoutube		\N	\N	27	\N	9892	\N
9893	faZ		\N	\N	27	\N	9893	\N
9894	faZhihu		\N	\N	27	\N	9894	\N
100026	Forma de pago	pagos de los cursos	\N	\N	\N	\N	8809	\N
100050	Modalidad		\N	\N	\N	\N	8266	\N
100052	Presencial / Sabatino		\N	\N	100050	\N	\N	\N
100053	On line		\N	\N	100050	\N	\N	\N
100051	Ninguna		\N	\N	110	\N	\N	\N
100027	Transferencia Bancaria		\N	\N	100026	100026	\N	\N
100055	Bolívares en efectivo ( directamente en caja principal)		\N	\N	100026	\N	\N	\N
100056	Débito / Punto de Venta (directamente en caja principal)		\N	\N	100026	\N	\N	\N
100057	Financiamiento		\N	\N	100026	\N	\N	\N
100058	Cancelar el día de Inicio del Curso		\N	\N	100026	\N	\N	\N
100059	Status		\N	\N	\N	\N	8330	\N
100060	Activo		\N	\N	100059	\N	\N	\N
100061	Inactivo		\N	\N	100059	\N	\N	\N
100062	Cancelado		\N	\N	100059	\N	\N	\N
100066	Menú de Cursos		\N	\N	73	\N	\N	\N
100067	Configuración Géneros		\N	\N	73	\N	\N	\N
100068	Configuración Íconos		\N	\N	73	73	\N	\N
\.


--
-- TOC entry 4856 (class 0 OID 91643)
-- Dependencies: 221
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id_curso, id_nombre, id_type, id_status, duracion, descripcion_corto, descripcion_html, costo, codigo, id_facilitador, id_foto, id_modalidad, id_forma_pago, fecha_hora_inicio, fecha_hora_fin, color) FROM stdin;
3	108	\N	100060	\N	Curso de ejemplo	\N	100	CURS123	\N	\N	100052	\N	2025-06-01 10:00:00	2025-06-10 18:00:00	#ffcc00
4	107	\N	100060	\N	xd	\N	15	CEP-01	\N	\N	100052	\N	2025-05-22 04:00:00	2025-05-29 01:00:00	#FFA07A
\.


--
-- TOC entry 4858 (class 0 OID 91649)
-- Dependencies: 223
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos (id_documento, id_tipo, fecha_hora, url, descripcion) FROM stdin;
\.


--
-- TOC entry 4862 (class 0 OID 91783)
-- Dependencies: 227
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (id_curso, fecha_hora_inicio, fecha_hora_fin, "observación") FROM stdin;
\.


--
-- TOC entry 4860 (class 0 OID 91655)
-- Dependencies: 225
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (id_persona, nombre, apellido, telefono, "contraseña", id_genero, id_pregunta, cedula, gmail, id_foto, id_status, respuesta, id_rol) FROM stdin;
5	Isaac	Cattoni	04143173920	$2b$10$Q9qlT/W8BsNftjep/HNj/uABpSGCVth40Z6hKK5kHG8e4QVnVecRC	6	9	30551898	iujo@gmail.com	\N	\N	$2b$10$HW/3Qwc7wZKocPnk4itWv.zbKAy9QFuzdElvbcL/YtKZ2V5AWb5xC	{"id_rol": [12]}
6	Isaac	Cattoni	04143173920	$2b$10$N5lYkLxjUwzVQkgmBqiGyOgKLyEAXEisiZcAn76fOquvxc/s/70ii	6	9	30551897	isaac1@gmail.com	\N	\N	$2b$10$rgiSV9/3B0wAI1BH7GqwquJMhfFQHL4rDy/UzSPKvNVSDf/ryJeou	{"id_rol": [14]}
7	Isaac	xd	04143173920	$2b$10$ul33ZYSU99li06.Ug2e/2e6YhGhn/LabFkkRCYlf1a4j.uyoPr6ii	6	9	12344566	isaac13@gmail.com	\N	\N	$2b$10$8ThTD4NIjqb67ivoxAQLtuhSBvAlkpszj3fOPx0yq9TyUaDnJctuC	{"id_rol": [13]}
8	javier	trujillo	041421492126	$2b$10$ZS82Roz4eNC8QLndn7MOd.SecqIfb9I7iqWt.3M6r6tI1pSv/fEQ6	6	9	30123123	trujillo@gmail.com	\N	\N	$2b$10$LS8vR4lJF89amEYnQ9Z98uxoDbO8fPq4BVTqck4thD9g5C5okiwna	{"id_rol": [14,96]}
9	Isaac	Cattoni	04143173920	$2b$10$eIJOhMBycFYniSEvao/Zp.TXUUCJp5PuGnTO7p3hh/wIN71a5XScu	6	9	1234567	xd@gmail.com	\N	\N	$2b$10$JgexyWZVyAmexZUeqo8i/uSDOOnKvI2QEajW2.y8Df7jXbThdQrRC	{"id_rol": [98,96]}
10	Isaac	Cattoni	04143173920	$2b$10$sS9cqXJUo5HfwL4ZiU57LuDQJYsWduQG46XSl2g1rwUjuLbyRKrri	6	9	1	isaac12@gmail.com	\N	\N	$2b$10$qJAnfDIuB.XrPd70JYKFdeNS.B2GNPlALHDjQlZ1TxeaSVgwilHfO	{"id_rol": [15]}
11	isaac	Cattoni	04143173920	$2b$10$CasPanDwLlaWeJfFSvwzBOkVWvhVK7a/ZEmouJwzNOFy4p1o1WWEi	6	9	30551892	isaac123@gmail.com	\N	\N	$2b$10$Gj0yKBv9.Hzy8Ft1A/4gJOMieqe3wpNcokRq2XophUABNQ/BNrC8y	{"id_rol": [96]}
1	Victor	Gainza	1234567890	$2b$10$/Z0dUmPJqTKSZa1uctJSAeH2g/KH2xSIiiRDyT1HQ/ZP6xnYz5r0W	6	9	1234567890	superadmin@empresa.com	\N	\N	$2b$10$zhsw9kAZbVtOfk40DbyIneyr6xahazAuKjuD86iIeQBAI8UVY4ylK	{"id_rol": [15,96,11]}
12	david	perez	04143173924	$2b$10$DMCSm3oX2Em69m4tXrW8aOELx/aWZcNTeU4bL8XbWtucF2ZWC9Dju	6	57	30551890	isaac10@gmail.com	\N	\N	$2b$10$Oqjpmhkwk9yasPfcV/VWM.5qYBLoxxXOEWnmnXfSRM3B5BYAIS0w6	13
13	victor	apellido	04143173923	$2b$10$HAcI9rHMmLbPWQOUdq6PeezB8zTZdmXp79Si3ZeThytN1sJNOstjG	6	84	30551298	isa2ac1@gmail.com	\N	\N	$2b$10$tWJAr8Do353Nv5mTRHJplu57ijXTRujtrfvCg/2RGvDrgQjRKWsmW	{"id_rol":["14"]}
\.


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 218
-- Name: auditorias_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditorias_id_auditoria_seq', 1, false);


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 220
-- Name: clasificacion_id_clasificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clasificacion_id_clasificacion_seq', 100069, true);


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 222
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 4, true);


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 224
-- Name: documentos_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_id_documento_seq', 2, true);


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 226
-- Name: personas_id_persona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personas_id_persona_seq', 13, true);


--
-- TOC entry 4673 (class 2606 OID 91667)
-- Name: auditorias auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_pkey PRIMARY KEY (id_auditoria);


--
-- TOC entry 4675 (class 2606 OID 91669)
-- Name: clasificacion clasificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_pkey PRIMARY KEY (id_clasificacion);


--
-- TOC entry 4677 (class 2606 OID 91671)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- TOC entry 4679 (class 2606 OID 91673)
-- Name: documentos documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id_documento);


--
-- TOC entry 4687 (class 2606 OID 91806)
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id_curso, fecha_hora_inicio, fecha_hora_fin) INCLUDE (id_curso, fecha_hora_inicio, fecha_hora_fin);


--
-- TOC entry 4681 (class 2606 OID 91675)
-- Name: personas personas_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_cedula_key UNIQUE (cedula);


--
-- TOC entry 4683 (class 2606 OID 91677)
-- Name: personas personas_gmail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_gmail_key UNIQUE (gmail);


--
-- TOC entry 4685 (class 2606 OID 91679)
-- Name: personas personas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 4706 (class 2620 OID 91808)
-- Name: horarios tr_check_fechas_horarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_check_fechas_horarios BEFORE INSERT OR UPDATE ON public.horarios FOR EACH ROW EXECUTE FUNCTION public.check_fechas_horarios();


--
-- TOC entry 4688 (class 2606 OID 91680)
-- Name: auditorias auditorias_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4689 (class 2606 OID 91685)
-- Name: auditorias auditorias_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4690 (class 2606 OID 91690)
-- Name: clasificacion clasificacion_id_icono_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_id_icono_fkey FOREIGN KEY (id_icono) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4691 (class 2606 OID 91695)
-- Name: clasificacion clasificacion_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4692 (class 2606 OID 91700)
-- Name: clasificacion clasificacion_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4693 (class 2606 OID 91705)
-- Name: cursos cursos_id_facilitador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_facilitador_fkey FOREIGN KEY (id_facilitador) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4694 (class 2606 OID 91710)
-- Name: cursos cursos_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4695 (class 2606 OID 91715)
-- Name: cursos cursos_id_foto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_foto_fkey FOREIGN KEY (id_foto) REFERENCES public.documentos(id_documento) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4696 (class 2606 OID 91725)
-- Name: cursos cursos_id_modalidad_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_modalidad_fkey1 FOREIGN KEY (id_modalidad) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4697 (class 2606 OID 91730)
-- Name: cursos cursos_id_nombre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_nombre_fkey FOREIGN KEY (id_nombre) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4698 (class 2606 OID 91735)
-- Name: cursos cursos_id_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4699 (class 2606 OID 91740)
-- Name: cursos cursos_id_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_type_fkey FOREIGN KEY (id_type) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4700 (class 2606 OID 91745)
-- Name: documentos documentos_id_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_id_tipo_fkey FOREIGN KEY (id_tipo) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4705 (class 2606 OID 91790)
-- Name: horarios horarios_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.cursos(id_curso) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4701 (class 2606 OID 91750)
-- Name: personas personas_id_foto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_foto_fkey FOREIGN KEY (id_foto) REFERENCES public.documentos(id_documento) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4702 (class 2606 OID 91755)
-- Name: personas personas_id_genero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_genero_fkey FOREIGN KEY (id_genero) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4703 (class 2606 OID 91765)
-- Name: personas personas_id_pregunta_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_pregunta_fkey1 FOREIGN KEY (id_pregunta) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4704 (class 2606 OID 91775)
-- Name: personas personas_id_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2025-05-25 16:06:22

--
-- PostgreSQL database dump complete
--

