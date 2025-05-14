--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-14 10:41:46

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
-- TOC entry 4858 (class 0 OID 0)
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
    id_icono bigint
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
-- TOC entry 4859 (class 0 OID 0)
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
    id_type bigint NOT NULL,
    id_status bigint,
    duracion double precision,
    descripcion_corto character varying,
    descripcion_html character varying,
    costo double precision NOT NULL,
    codigo character varying NOT NULL,
    id_facilitador bigint NOT NULL,
    id_foto bigint,
    id_modalidad bigint NOT NULL,
    id_forma_pago bigint NOT NULL
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
-- TOC entry 4860 (class 0 OID 0)
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
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 224
-- Name: documentos_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_id_documento_seq OWNED BY public.documentos.id_documento;


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
    id_rol bigint NOT NULL,
    id_pregunta bigint NOT NULL,
    cedula character varying NOT NULL,
    gmail character varying NOT NULL,
    id_foto bigint,
    id_status bigint,
    respuesta character varying NOT NULL
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
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 226
-- Name: personas_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personas_id_persona_seq OWNED BY public.personas.id_persona;


--
-- TOC entry 4661 (class 2604 OID 91661)
-- Name: auditorias id_auditoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_id_auditoria_seq'::regclass);


--
-- TOC entry 4662 (class 2604 OID 91662)
-- Name: clasificacion id_clasificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion ALTER COLUMN id_clasificacion SET DEFAULT nextval('public.clasificacion_id_clasificacion_seq'::regclass);


--
-- TOC entry 4663 (class 2604 OID 91663)
-- Name: cursos id_curso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id_curso SET DEFAULT nextval('public.cursos_id_curso_seq'::regclass);


--
-- TOC entry 4664 (class 2604 OID 91664)
-- Name: documentos id_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id_documento SET DEFAULT nextval('public.documentos_id_documento_seq'::regclass);


--
-- TOC entry 4665 (class 2604 OID 91665)
-- Name: personas id_persona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas ALTER COLUMN id_persona SET DEFAULT nextval('public.personas_id_persona_seq'::regclass);


--
-- TOC entry 4843 (class 0 OID 91631)
-- Dependencies: 217
-- Data for Name: auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditorias (id_auditoria, fecha_hora, ip, descripcion, id_persona, id_evento) FROM stdin;
\.


--
-- TOC entry 4845 (class 0 OID 91637)
-- Dependencies: 219
-- Data for Name: clasificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clasificacion (id_clasificacion, nombre, descripcion, imagen, orden, type_id, parent_id, id_icono) FROM stdin;
53	aaafaWifi		\N	\N	27	\N	53
56	aaafaMars		\N	\N	27	\N	56
13	Participante Externo	\N	\N	\N	3	15	\N
110	Carreras		\N	\N	\N	\N	9503
28	aaafaVenusMars	\N	\N	\N	27	\N	28
8	Preguntas		\N	\N	\N	\N	9320
14	Personal IUJO	\N	\N	\N	3	11	\N
107	Aprende a programar en Python desde cero, con VSCode		\N	\N	5	\N	102
100004	faMapLocationDot	xx	\N	\N	27	\N	100004
108	Desarrollo web creativo: HTML, CSS y JAVASCRIPT		\N	\N	5	\N	102
11	Participante 	Tiene acceso solo a participar a los cursos \n	\N	\N	3	\N	9503
54	Cisco Academy 		\N	\N	4	\N	53
109	Mantenimiento y Reparación de PC		\N	0	5	\N	102
84	Cual es tu comida favorita?		\N	\N	8	\N	\N
111	Informatica		\N	0	110	\N	102
57	Cual es tu pelicula favorita?		\N	\N	8	\N	\N
113	Contaduria		\N	0	110	\N	102
114	Electronica		\N	0	110	\N	102
115	Electrotecnia		\N	0	110	\N	102
112	 Administración 		\N	\N	110	\N	102
122	Estado	Lista de Estados de Venezuela	\N	\N	\N	\N	100004
124	Parroquias	Lista de Parroquias de Venezuela	\N	\N	\N	\N	100005
29	aaafaUser	\N	\N	\N	27	\N	29
100006	CCNA	CCNA	\N	\N	5	54	\N
30	aaafaUncharted	\N	\N	\N	27	\N	30
100009	CCNA 3	ccna3	\N	0	5	100006	\N
3	Rol		\N	\N	\N	\N	9751
4	Programas		\N	\N	\N	\N	9503
5	Cursos	\N	\N	\N	\N	4	9019
6	Masculino	sexo masculino	\N	\N	1	\N	9053
7	Femenino	sexo femenino	\N	\N	1	\N	9790
12	Estudiante IUJO	\N	\N	\N	3	11	9772
8065	faArrowLeft		\N	\N	27	\N	8065
8066	faArrowLeftLong		\N	\N	27	\N	8066
27	Íconos		\N	\N	\N	\N	8926
123	Municipios	Lista de Municipios de Venezuela	\N	\N	\N	\N	9048
1	Géneros		\N	\N	\N	\N	9792
73	Permisos		\N	\N	\N	\N	9768
8067	faArrowPointer		\N	\N	27	\N	8067
8068	faArrowRight		\N	\N	27	\N	8068
15	Super Administrador	Tiene acceso a todo el sistema	\N	\N	3	\N	97
98	Administrador	Tiene acceso a los programas y cursos	\N	\N	3	\N	\N
33	aaafaGraduationCap	\N	\N	\N	27	\N	33
9	Cual es tu Animal favorito?		\N	\N	8	\N	\N
96	Facilitador	Tiene acceso a ver los cursos que da	\N	\N	3	\N	95
8069	faArrowRightArrowLeft		\N	\N	27	\N	8069
8070	faArrowRightFromBracket		\N	\N	27	\N	8070
8071	faArrowRightLong		\N	\N	27	\N	8071
8072	faArrowRightToBracket		\N	\N	27	\N	8072
120	Borrar	xd	\N	0	73	\N	\N
8073	faArrowRightToCity		\N	\N	27	\N	8073
100	Editar		\N	0	73	\N	\N
8074	faArrowRotateLeft		\N	\N	27	\N	8074
8075	faArrowRotateRight		\N	\N	27	\N	8075
8076	faArrowTrendDown		\N	\N	27	\N	8076
34	aaafaMapLocation	\N	\N	\N	27	\N	34
35	aaafaIcons	\N	\N	\N	27	\N	35
61	Informatica	estos son progrmas	\N	\N	4	\N	102
10001	Amazonas		\N	\N	122	\N	\N
10002	Anzoátegui		\N	\N	122	\N	\N
10003	Apure		\N	\N	122	\N	\N
8077	faArrowTrendUp		\N	\N	27	\N	8077
10004	Aragua		\N	\N	122	\N	\N
10005	Barinas		\N	\N	122	\N	\N
10006	Bolívar		\N	\N	122	\N	\N
10007	Carabobo		\N	\N	122	\N	\N
10008	Cojedes		\N	\N	122	\N	\N
10009	Delta Amacuro		\N	\N	122	\N	\N
10010	Falcón		\N	\N	122	\N	\N
10011	Guárico		\N	\N	122	\N	\N
10012	Lara		\N	\N	122	\N	\N
10013	Mérida		\N	\N	122	\N	\N
10014	Miranda		\N	\N	122	\N	\N
10015	Monagas		\N	\N	122	\N	\N
10016	Nueva Esparta		\N	\N	122	\N	\N
10017	Portuguesa		\N	\N	122	\N	\N
10018	Sucre		\N	\N	122	\N	\N
10019	Táchira		\N	\N	122	\N	\N
8078	faArrowTurnDown		\N	\N	27	\N	8078
8079	faArrowTurnUp		\N	\N	27	\N	8079
8080	faArrowUp		\N	\N	27	\N	8080
8081	faArrowUp19		\N	\N	27	\N	8081
8082	faArrowUp91		\N	\N	27	\N	8082
40	aaafaSquareBinary	\N	\N	\N	27	\N	40
41	aaafaListCheck	\N	\N	\N	27	\N	41
42	aaafaQuestion	\N	\N	\N	27	\N	42
43	aaafaFemale		\N	\N	27	\N	43
95	aaafaChalkboardUser		\N	\N	27	\N	95
97	aaafaUserTie		\N	\N	27	\N	97
10020	Trujillo		\N	\N	122	\N	\N
10021	Vargas		\N	\N	122	\N	\N
10022	Yaracuy		\N	\N	122	\N	\N
10023	Zulia		\N	\N	122	\N	\N
10024	Distrito Capital		\N	\N	122	\N	\N
10025	Dependencias Federales		\N	\N	122	\N	\N
30001	Alto Orinoco		\N	\N	123	10001	\N
30002	Atabapo		\N	\N	123	10001	\N
30003	Atures		\N	\N	123	10001	\N
30004	Autana		\N	\N	123	10001	\N
30005	Manapiare		\N	\N	123	10001	\N
30006	Maroa		\N	\N	123	10001	\N
30007	Río Negro		\N	\N	123	10001	\N
30008	Anaco		\N	\N	123	10002	\N
30009	Aragua		\N	\N	123	10002	\N
30010	Manuel Ezequiel Bruzual		\N	\N	123	10002	\N
30011	Diego Bautista Urbaneja		\N	\N	123	10002	\N
30012	Fernando Peñalver		\N	\N	123	10002	\N
30013	Francisco Del Carmen Carvajal		\N	\N	123	10002	\N
30014	General Sir Arthur McGregor		\N	\N	123	10002	\N
30015	Guanta		\N	\N	123	10002	\N
30016	Independencia		\N	\N	123	10002	\N
30017	José Gregorio Monagas		\N	\N	123	10002	\N
30018	Juan Antonio Sotillo		\N	\N	123	10002	\N
30019	Juan Manuel Cajigal		\N	\N	123	10002	\N
30020	Libertad		\N	\N	123	10002	\N
30021	Francisco de Miranda		\N	\N	123	10002	\N
30022	Pedro María Freites		\N	\N	123	10002	\N
30023	Píritu		\N	\N	123	10002	\N
30024	San José de Guanipa		\N	\N	123	10002	\N
30025	San Juan de Capistrano		\N	\N	123	10002	\N
30026	Santa Ana		\N	\N	123	10002	\N
30027	Simón Bolívar		\N	\N	123	10002	\N
30028	Simón Rodríguez		\N	\N	123	10002	\N
30029	Achaguas		\N	\N	123	10003	\N
30030	Biruaca		\N	\N	123	10003	\N
30031	Muñóz		\N	\N	123	10003	\N
30032	Páez		\N	\N	123	10003	\N
30033	Pedro Camejo		\N	\N	123	10003	\N
30034	Rómulo Gallegos		\N	\N	123	10003	\N
30035	San Fernando		\N	\N	123	10003	\N
30036	Atanasio Girardot		\N	\N	123	10004	\N
30037	Bolívar		\N	\N	123	10004	\N
30038	Camatagua		\N	\N	123	10004	\N
30039	Francisco Linares Alcántara		\N	\N	123	10004	\N
30040	José Ángel Lamas		\N	\N	123	10004	\N
30041	José Félix Ribas		\N	\N	123	10004	\N
30042	José Rafael Revenga		\N	\N	123	10004	\N
30043	Libertador		\N	\N	123	10004	\N
30044	Mario Briceño Iragorry		\N	\N	123	10004	\N
30045	Ocumare de la Costa de Oro		\N	\N	123	10004	\N
30046	San Casimiro		\N	\N	123	10004	\N
30047	San Sebastián		\N	\N	123	10004	\N
30048	Santiago Mariño		\N	\N	123	10004	\N
30049	Santos Michelena		\N	\N	123	10004	\N
30050	Sucre		\N	\N	123	10004	\N
30051	Tovar		\N	\N	123	10004	\N
30052	Urdaneta		\N	\N	123	10004	\N
30053	Zamora		\N	\N	123	10004	\N
30054	Alberto Arvelo Torrealba		\N	\N	123	10005	\N
30055	Andrés Eloy Blanco		\N	\N	123	10005	\N
30056	Antonio José de Sucre		\N	\N	123	10005	\N
30057	Arismendi		\N	\N	123	10005	\N
30058	Barinas		\N	\N	123	10005	\N
30059	Bolívar		\N	\N	123	10005	\N
30060	Cruz Paredes		\N	\N	123	10005	\N
30061	Ezequiel Zamora		\N	\N	123	10005	\N
30062	Obispos		\N	\N	123	10005	\N
30063	Pedraza		\N	\N	123	10005	\N
30064	Rojas		\N	\N	123	10005	\N
30065	Sosa		\N	\N	123	10005	\N
30066	Caroní		\N	\N	123	10006	\N
30067	Cedeño		\N	\N	123	10006	\N
30068	El Callao		\N	\N	123	10006	\N
30069	Gran Sabana		\N	\N	123	10006	\N
30070	Heres		\N	\N	123	10006	\N
30071	Piar		\N	\N	123	10006	\N
30072	Angostura Raúl Leoni		\N	\N	123	10006	\N
30073	Roscio		\N	\N	123	10006	\N
30074	Sifontes		\N	\N	123	10006	\N
30075	Sucre		\N	\N	123	10006	\N
30076	Padre Pedro Chien		\N	\N	123	10006	\N
30077	Bejuma		\N	\N	123	10007	\N
30078	Carlos Arvelo		\N	\N	123	10007	\N
30079	Diego Ibarra		\N	\N	123	10007	\N
30080	Guacara		\N	\N	123	10007	\N
30081	Juan José Mora		\N	\N	123	10007	\N
30082	Libertador		\N	\N	123	10007	\N
30083	Los Guayos		\N	\N	123	10007	\N
30084	Miranda		\N	\N	123	10007	\N
30085	Montalbán		\N	\N	123	10007	\N
30086	Naguanagua		\N	\N	123	10007	\N
30087	Puerto Cabello		\N	\N	123	10007	\N
30088	San Diego		\N	\N	123	10007	\N
30089	San Joaquín		\N	\N	123	10007	\N
30090	Valencia		\N	\N	123	10007	\N
30091	Anzoátegui		\N	\N	123	10008	\N
30092	Tinaquillo		\N	\N	123	10008	\N
30093	Girardot		\N	\N	123	10008	\N
30094	Lima Blanco		\N	\N	123	10008	\N
30095	Pao de San Juan Bautista		\N	\N	123	10008	\N
30096	Ricaurte		\N	\N	123	10008	\N
30097	Rómulo Gallegos		\N	\N	123	10008	\N
30098	San Carlos		\N	\N	123	10008	\N
30099	Tinaco		\N	\N	123	10008	\N
30100	Antonio Díaz		\N	\N	123	10009	\N
30101	Casacoima		\N	\N	123	10009	\N
30102	Pedernales		\N	\N	123	10009	\N
30103	Tucupita		\N	\N	123	10009	\N
30104	Acosta		\N	\N	123	10010	\N
30105	Bolívar		\N	\N	123	10010	\N
30106	Buchivacoa		\N	\N	123	10010	\N
30107	Cacique Manaure		\N	\N	123	10010	\N
30108	Carirubana		\N	\N	123	10010	\N
30109	Colina		\N	\N	123	10010	\N
30110	Dabajuro		\N	\N	123	10010	\N
30111	Democracia		\N	\N	123	10010	\N
30112	Falcón		\N	\N	123	10010	\N
30113	Federación		\N	\N	123	10010	\N
30114	Jacura		\N	\N	123	10010	\N
30115	José Laurencio Silva		\N	\N	123	10010	\N
30116	Los Taques		\N	\N	123	10010	\N
30117	Mauroa		\N	\N	123	10010	\N
30118	Miranda		\N	\N	123	10010	\N
30119	Monseñor Iturriza		\N	\N	123	10010	\N
30120	Palmasola		\N	\N	123	10010	\N
30121	Petit		\N	\N	123	10010	\N
30122	Píritu		\N	\N	123	10010	\N
30123	San Francisco		\N	\N	123	10010	\N
30124	Sucre		\N	\N	123	10010	\N
30125	Tocópero		\N	\N	123	10010	\N
30126	Unión		\N	\N	123	10010	\N
30127	Urumaco		\N	\N	123	10010	\N
30128	Zamora		\N	\N	123	10010	\N
30129	Camaguán		\N	\N	123	10011	\N
30130	Chaguaramas		\N	\N	123	10011	\N
30131	El Socorro		\N	\N	123	10011	\N
30132	José Félix Ribas		\N	\N	123	10011	\N
30133	José Tadeo Monagas		\N	\N	123	10011	\N
30134	Juan Germán Roscio		\N	\N	123	10011	\N
30135	Julián Mellado		\N	\N	123	10011	\N
30136	Las Mercedes		\N	\N	123	10011	\N
30137	Leonardo Infante		\N	\N	123	10011	\N
30138	Pedro Zaraza		\N	\N	123	10011	\N
30139	Ortíz		\N	\N	123	10011	\N
30140	San Gerónimo de Guayabal		\N	\N	123	10011	\N
30141	San José de Guaribe		\N	\N	123	10011	\N
30142	Santa María de Ipire		\N	\N	123	10011	\N
30143	Sebastián Francisco de Miranda		\N	\N	123	10011	\N
30144	Andrés Eloy Blanco		\N	\N	123	10012	\N
30145	Crespo		\N	\N	123	10012	\N
30146	Iribarren		\N	\N	123	10012	\N
30147	Jiménez		\N	\N	123	10012	\N
30148	Morán		\N	\N	123	10012	\N
30149	Palavecino		\N	\N	123	10012	\N
30150	Simón Planas		\N	\N	123	10012	\N
30151	Torres		\N	\N	123	10012	\N
30152	Urdaneta		\N	\N	123	10012	\N
30179	Alberto Adriani		\N	\N	123	10013	\N
30180	Andrés Bello		\N	\N	123	10013	\N
30181	Antonio Pinto Salinas		\N	\N	123	10013	\N
30182	Aricagua		\N	\N	123	10013	\N
30183	Arzobispo Chacón		\N	\N	123	10013	\N
30184	Campo Elías		\N	\N	123	10013	\N
30185	Caracciolo Parra Olmedo		\N	\N	123	10013	\N
30186	Cardenal Quintero		\N	\N	123	10013	\N
30187	Guaraque		\N	\N	123	10013	\N
30188	Julio César Salas		\N	\N	123	10013	\N
30189	Justo Briceño		\N	\N	123	10013	\N
30190	Libertador		\N	\N	123	10013	\N
30191	Miranda		\N	\N	123	10013	\N
30192	Obispo Ramos de Lora		\N	\N	123	10013	\N
30193	Padre Noguera		\N	\N	123	10013	\N
30194	Pueblo Llano		\N	\N	123	10013	\N
30195	Rangel		\N	\N	123	10013	\N
30196	Rivas Dávila		\N	\N	123	10013	\N
30197	Santos Marquina		\N	\N	123	10013	\N
30198	Sucre		\N	\N	123	10013	\N
30199	Tovar		\N	\N	123	10013	\N
30200	Tulio Febres Cordero		\N	\N	123	10013	\N
30201	Zea		\N	\N	123	10013	\N
30223	Acevedo		\N	\N	123	10014	\N
30224	Andrés Bello		\N	\N	123	10014	\N
30225	Baruta		\N	\N	123	10014	\N
30226	Brión		\N	\N	123	10014	\N
30227	Buroz		\N	\N	123	10014	\N
30228	Carrizal		\N	\N	123	10014	\N
30229	Chacao		\N	\N	123	10014	\N
30230	Cristóbal Rojas		\N	\N	123	10014	\N
30231	El Hatillo		\N	\N	123	10014	\N
30232	Guaicaipuro		\N	\N	123	10014	\N
30233	Independencia		\N	\N	123	10014	\N
30234	Lander		\N	\N	123	10014	\N
30235	Los Salias		\N	\N	123	10014	\N
30236	Páez		\N	\N	123	10014	\N
30237	Paz Castillo		\N	\N	123	10014	\N
30238	Pedro Gual		\N	\N	123	10014	\N
30239	Plaza		\N	\N	123	10014	\N
30240	Simón Bolívar		\N	\N	123	10014	\N
30241	Sucre		\N	\N	123	10014	\N
30242	Urdaneta		\N	\N	123	10014	\N
30243	Zamora		\N	\N	123	10014	\N
30258	Acosta		\N	\N	123	10015	\N
30259	Aguasay		\N	\N	123	10015	\N
30260	Bolívar		\N	\N	123	10015	\N
30261	Caripe		\N	\N	123	10015	\N
30262	Cedeño		\N	\N	123	10015	\N
30263	Ezequiel Zamora		\N	\N	123	10015	\N
30264	Libertador		\N	\N	123	10015	\N
30265	Maturín		\N	\N	123	10015	\N
30266	Piar		\N	\N	123	10015	\N
30267	Punceres		\N	\N	123	10015	\N
30268	Santa Bárbara		\N	\N	123	10015	\N
30269	Sotillo		\N	\N	123	10015	\N
30270	Uracoa		\N	\N	123	10015	\N
30271	Antolín del Campo		\N	\N	123	10016	\N
30272	Arismendi		\N	\N	123	10016	\N
30273	García		\N	\N	123	10016	\N
30274	Gómez		\N	\N	123	10016	\N
30275	Maneiro		\N	\N	123	10016	\N
30276	Marcano		\N	\N	123	10016	\N
30277	Mariño		\N	\N	123	10016	\N
30278	Península de Macanao		\N	\N	123	10016	\N
30279	Tubores		\N	\N	123	10016	\N
30280	Villalba		\N	\N	123	10016	\N
30281	Díaz		\N	\N	123	10016	\N
30282	Agua Blanca		\N	\N	123	10017	\N
30283	Araure		\N	\N	123	10017	\N
30284	Esteller		\N	\N	123	10017	\N
30285	Guanare		\N	\N	123	10017	\N
30286	Guanarito		\N	\N	123	10017	\N
30287	Monseñor José Vicente de Unda		\N	\N	123	10017	\N
30288	Ospino		\N	\N	123	10017	\N
30289	Páez		\N	\N	123	10017	\N
30290	Papelón		\N	\N	123	10017	\N
30291	San Genaro de Boconoíto		\N	\N	123	10017	\N
30292	San Rafael de Onoto		\N	\N	123	10017	\N
30293	Santa Rosalía		\N	\N	123	10017	\N
30294	Sucre		\N	\N	123	10017	\N
30295	Turén		\N	\N	123	10017	\N
30296	Andrés Eloy Blanco		\N	\N	123	10018	\N
30297	Andrés Mata		\N	\N	123	10018	\N
30298	Arismendi		\N	\N	123	10018	\N
30299	Benítez		\N	\N	123	10018	\N
30300	Bermúdez		\N	\N	123	10018	\N
30301	Bolívar		\N	\N	123	10018	\N
30302	Cajigal		\N	\N	123	10018	\N
30303	Cruz Salmerón Acosta		\N	\N	123	10018	\N
30304	Libertador		\N	\N	123	10018	\N
30305	Mariño		\N	\N	123	10018	\N
30306	Mejía		\N	\N	123	10018	\N
30307	Montes		\N	\N	123	10018	\N
30308	Ribero		\N	\N	123	10018	\N
30309	Sucre		\N	\N	123	10018	\N
30310	Valdéz		\N	\N	123	10018	\N
30341	Andrés Bello		\N	\N	123	10019	\N
30342	Antonio Rómulo Costa		\N	\N	123	10019	\N
30343	Ayacucho		\N	\N	123	10019	\N
30344	Bolívar		\N	\N	123	10019	\N
30345	Cárdenas		\N	\N	123	10019	\N
30346	Córdoba		\N	\N	123	10019	\N
30347	Fernández Feo		\N	\N	123	10019	\N
30348	Francisco de Miranda		\N	\N	123	10019	\N
30349	García de Hevia		\N	\N	123	10019	\N
30350	Guásimos		\N	\N	123	10019	\N
30351	Independencia		\N	\N	123	10019	\N
30352	Jáuregui		\N	\N	123	10019	\N
30353	José María Vargas		\N	\N	123	10019	\N
30354	Junín		\N	\N	123	10019	\N
30355	Libertad		\N	\N	123	10019	\N
30356	Libertador		\N	\N	123	10019	\N
30357	Lobatera		\N	\N	123	10019	\N
30358	Michelena		\N	\N	123	10019	\N
30359	Panamericano		\N	\N	123	10019	\N
30360	Pedro María Ureña		\N	\N	123	10019	\N
30361	Rafael Urdaneta		\N	\N	123	10019	\N
30362	Samuel Darío Maldonado		\N	\N	123	10019	\N
30363	San Cristóbal		\N	\N	123	10019	\N
30364	Seboruco		\N	\N	123	10019	\N
30365	Simón Rodríguez		\N	\N	123	10019	\N
30366	Sucre		\N	\N	123	10019	\N
30367	Torbes		\N	\N	123	10019	\N
30368	Uribante		\N	\N	123	10019	\N
30369	San Judas Tadeo		\N	\N	123	10019	\N
30370	Andrés Bello		\N	\N	123	10020	\N
30371	Boconó		\N	\N	123	10020	\N
30372	Bolívar		\N	\N	123	10020	\N
30373	Candelaria		\N	\N	123	10020	\N
30374	Carache		\N	\N	123	10020	\N
30375	Escuque		\N	\N	123	10020	\N
30376	José Felipe Márquez Cañizalez		\N	\N	123	10020	\N
30377	Juan Vicente Campos Elías		\N	\N	123	10020	\N
30378	La Ceiba		\N	\N	123	10020	\N
30379	Miranda		\N	\N	123	10020	\N
30380	Monte Carmelo		\N	\N	123	10020	\N
30381	Motatán		\N	\N	123	10020	\N
30382	Pampán		\N	\N	123	10020	\N
30383	Pampanito		\N	\N	123	10020	\N
30384	Rafael Rangel		\N	\N	123	10020	\N
30385	San Rafael de Carvajal		\N	\N	123	10020	\N
30386	Sucre		\N	\N	123	10020	\N
30387	Trujillo		\N	\N	123	10020	\N
30388	Urdaneta		\N	\N	123	10020	\N
30389	Valera		\N	\N	123	10020	\N
30390	Vargas		\N	\N	123	10021	\N
30391	Arístides Bastidas		\N	\N	123	10022	\N
30392	Bolívar		\N	\N	123	10022	\N
30407	Bruzual		\N	\N	123	10022	\N
30408	Cocorote		\N	\N	123	10022	\N
30409	Independencia		\N	\N	123	10022	\N
30410	José Antonio Páez		\N	\N	123	10022	\N
30411	La Trinidad		\N	\N	123	10022	\N
30412	Manuel Monge		\N	\N	123	10022	\N
30413	Nirgua		\N	\N	123	10022	\N
30414	Peña		\N	\N	123	10022	\N
30415	San Felipe		\N	\N	123	10022	\N
30416	Sucre		\N	\N	123	10022	\N
30417	Urachiche		\N	\N	123	10022	\N
30418	José Joaquín Veroes		\N	\N	123	10022	\N
30441	Almirante Padilla		\N	\N	123	10023	\N
30442	Baralt		\N	\N	123	10023	\N
30443	Cabimas		\N	\N	123	10023	\N
30444	Catatumbo		\N	\N	123	10023	\N
30445	Colón		\N	\N	123	10023	\N
30446	Francisco Javier Pulgar		\N	\N	123	10023	\N
30447	Páez		\N	\N	123	10023	\N
30448	Jesús Enrique Losada		\N	\N	123	10023	\N
30449	Jesús María Semprún		\N	\N	123	10023	\N
30450	La Cañada de Urdaneta		\N	\N	123	10023	\N
30451	Lagunillas		\N	\N	123	10023	\N
30452	Machiques de Perijá		\N	\N	123	10023	\N
30453	Mara		\N	\N	123	10023	\N
30454	Maracaibo		\N	\N	123	10023	\N
30455	Miranda		\N	\N	123	10023	\N
30456	Rosario de Perijá		\N	\N	123	10023	\N
30457	San Francisco		\N	\N	123	10023	\N
30458	Santa Rita		\N	\N	123	10023	\N
30459	Simón Bolívar		\N	\N	123	10023	\N
30460	Sucre		\N	\N	123	10023	\N
30461	Valmore Rodríguez		\N	\N	123	10023	\N
30462	Libertador		\N	\N	123	10024	\N
40001	Alto Orinoco		\N	\N	124	30001	\N
40002	Huachamacare Acanaña		\N	\N	124	30001	\N
40003	Marawaka Toky Shamanaña		\N	\N	124	30001	\N
40004	Mavaka Mavaka		\N	\N	124	30001	\N
40005	Sierra Parima Parimabé		\N	\N	124	30001	\N
40006	Ucata Laja Lisa		\N	\N	124	30002	\N
40007	Yapacana Macuruco		\N	\N	124	30002	\N
40008	Caname Guarinuma		\N	\N	124	30002	\N
40009	Fernando Girón Tovar		\N	\N	124	30003	\N
40010	Luis Alberto Gómez		\N	\N	124	30003	\N
40011	Pahueña Limón de Parhueña		\N	\N	124	30003	\N
40012	Platanillal Platanillal		\N	\N	124	30003	\N
40013	Samariapo		\N	\N	124	30004	\N
40014	Sipapo		\N	\N	124	30004	\N
40015	Munduapo		\N	\N	124	30004	\N
40016	Guayapo		\N	\N	124	30004	\N
40017	Alto Ventuari		\N	\N	124	30005	\N
40018	Medio Ventuari		\N	\N	124	30005	\N
40019	Bajo Ventuari		\N	\N	124	30005	\N
40020	Victorino		\N	\N	124	30006	\N
40021	Comunidad		\N	\N	124	30006	\N
40022	Casiquiare		\N	\N	124	30007	\N
40023	Cocuy		\N	\N	124	30007	\N
40024	San Carlos de Río Negro		\N	\N	124	30007	\N
40025	Solano		\N	\N	124	30007	\N
40026	Anaco		\N	\N	124	30008	\N
40027	San Joaquín		\N	\N	124	30008	\N
40028	Cachipo		\N	\N	124	30009	\N
40029	Aragua de Barcelona		\N	\N	124	30009	\N
40030	Lechería		\N	\N	124	30011	\N
40031	El Morro		\N	\N	124	30011	\N
40032	Puerto Píritu		\N	\N	124	30012	\N
40033	San Miguel		\N	\N	124	30012	\N
40034	Sucre		\N	\N	124	30012	\N
40035	Valle de Guanape		\N	\N	124	30013	\N
40036	Santa Bárbara		\N	\N	124	30013	\N
40037	El Chaparro		\N	\N	124	30014	\N
40038	Tomás Alfaro		\N	\N	124	30014	\N
40039	Calatrava		\N	\N	124	30014	\N
40040	Guanta		\N	\N	124	30015	\N
40041	Chorrerón		\N	\N	124	30015	\N
40042	Mamo		\N	\N	124	30016	\N
40043	Soledad		\N	\N	124	30016	\N
40044	Mapire		\N	\N	124	30017	\N
40045	Piar		\N	\N	124	30017	\N
40046	Santa Clara		\N	\N	124	30017	\N
40047	San Diego de Cabrutica		\N	\N	124	30017	\N
40048	Uverito		\N	\N	124	30017	\N
40049	Zuata		\N	\N	124	30017	\N
40050	Puerto La Cruz		\N	\N	124	30018	\N
40051	Pozuelos		\N	\N	124	30018	\N
40052	Onoto		\N	\N	124	30019	\N
40053	San Pablo		\N	\N	124	30019	\N
40054	San Mateo		\N	\N	124	30020	\N
40055	El Carito		\N	\N	124	30020	\N
40056	Santa Inés		\N	\N	124	30020	\N
40057	La Romereña		\N	\N	124	30020	\N
40058	Atapirire		\N	\N	124	30021	\N
40059	Boca del Pao		\N	\N	124	30021	\N
40060	El Pao		\N	\N	124	30021	\N
40061	Pariaguán		\N	\N	124	30021	\N
40062	Cantaura		\N	\N	124	30022	\N
40063	Libertador		\N	\N	124	30022	\N
40064	Santa Rosa		\N	\N	124	30022	\N
40065	Urica		\N	\N	124	30022	\N
40066	Píritu		\N	\N	124	30023	\N
40067	San Francisco		\N	\N	124	30023	\N
40068	San José de Guanipa		\N	\N	124	30024	\N
40069	Boca de Uchire		\N	\N	124	30025	\N
40070	Boca de Chávez		\N	\N	124	30025	\N
40071	Pueblo Nuevo		\N	\N	124	30026	\N
40072	Santa Ana		\N	\N	124	30026	\N
40073	Bergantín		\N	\N	124	30027	\N
40074	Caigua		\N	\N	124	30027	\N
40075	El Carmen		\N	\N	124	30027	\N
40076	El Pilar		\N	\N	124	30027	\N
40077	Naricual		\N	\N	124	30027	\N
40078	San Crsitóbal		\N	\N	124	30027	\N
40079	Edmundo Barrios		\N	\N	124	30028	\N
40080	Miguel Otero Silva		\N	\N	124	30028	\N
40081	Achaguas		\N	\N	124	30029	\N
40082	Apurito		\N	\N	124	30029	\N
40083	El Yagual		\N	\N	124	30029	\N
40084	Guachara		\N	\N	124	30029	\N
40085	Mucuritas		\N	\N	124	30029	\N
40086	Queseras del medio		\N	\N	124	30029	\N
40087	Biruaca		\N	\N	124	30030	\N
40088	Bruzual		\N	\N	124	30031	\N
40089	Mantecal		\N	\N	124	30031	\N
40090	Quintero		\N	\N	124	30031	\N
40091	Rincón Hondo		\N	\N	124	30031	\N
40092	San Vicente		\N	\N	124	30031	\N
40093	Guasdualito		\N	\N	124	30032	\N
40094	Aramendi		\N	\N	124	30032	\N
40095	El Amparo		\N	\N	124	30032	\N
40096	San Camilo		\N	\N	124	30032	\N
40097	Urdaneta		\N	\N	124	30032	\N
40098	San Juan de Payara		\N	\N	124	30033	\N
40099	Codazzi		\N	\N	124	30033	\N
40100	Cunaviche		\N	\N	124	30033	\N
40101	Elorza		\N	\N	124	30034	\N
40102	La Trinidad		\N	\N	124	30034	\N
40103	San Fernando		\N	\N	124	30035	\N
40104	El Recreo		\N	\N	124	30035	\N
40105	Peñalver		\N	\N	124	30035	\N
40106	San Rafael de Atamaica		\N	\N	124	30035	\N
40107	Pedro José Ovalles		\N	\N	124	30036	\N
40108	Joaquín Crespo		\N	\N	124	30036	\N
40109	José Casanova Godoy		\N	\N	124	30036	\N
40110	Madre María de San José		\N	\N	124	30036	\N
40111	Andrés Eloy Blanco		\N	\N	124	30036	\N
40112	Los Tacarigua		\N	\N	124	30036	\N
40113	Las Delicias		\N	\N	124	30036	\N
40114	Choroní		\N	\N	124	30036	\N
40115	Bolívar		\N	\N	124	30037	\N
40116	Camatagua		\N	\N	124	30038	\N
40117	Carmen de Cura		\N	\N	124	30038	\N
40118	Santa Rita		\N	\N	124	30039	\N
40119	Francisco de Miranda		\N	\N	124	30039	\N
40120	Moseñor Feliciano González		\N	\N	124	30039	\N
40121	Santa Cruz		\N	\N	124	30040	\N
40122	José Félix Ribas		\N	\N	124	30041	\N
40123	Castor Nieves Ríos		\N	\N	124	30041	\N
40124	Las Guacamayas		\N	\N	124	30041	\N
40125	Pao de Zárate		\N	\N	124	30041	\N
40126	Zuata		\N	\N	124	30041	\N
40127	José Rafael Revenga		\N	\N	124	30042	\N
40128	Palo Negro		\N	\N	124	30043	\N
40129	San Martín de Porres		\N	\N	124	30043	\N
40130	El Limón		\N	\N	124	30044	\N
40131	Caña de Azúcar		\N	\N	124	30044	\N
40132	Ocumare de la Costa		\N	\N	124	30045	\N
40133	San Casimiro		\N	\N	124	30046	\N
40134	Güiripa		\N	\N	124	30046	\N
40135	Ollas de Caramacate		\N	\N	124	30046	\N
40136	Valle Morín		\N	\N	124	30046	\N
40137	San Sebastían		\N	\N	124	30047	\N
40138	Turmero		\N	\N	124	30048	\N
40139	Arevalo Aponte		\N	\N	124	30048	\N
40140	Chuao		\N	\N	124	30048	\N
40141	Samán de Güere		\N	\N	124	30048	\N
40142	Alfredo Pacheco Miranda		\N	\N	124	30048	\N
40143	Santos Michelena		\N	\N	124	30049	\N
40144	Tiara		\N	\N	124	30049	\N
40145	Cagua		\N	\N	124	30050	\N
40146	Bella Vista		\N	\N	124	30050	\N
40147	Tovar		\N	\N	124	30051	\N
40148	Urdaneta		\N	\N	124	30052	\N
40149	Las Peñitas		\N	\N	124	30052	\N
40150	San Francisco de Cara		\N	\N	124	30052	\N
40151	Taguay		\N	\N	124	30052	\N
40152	Zamora		\N	\N	124	30053	\N
40153	Magdaleno		\N	\N	124	30053	\N
40154	San Francisco de Asís		\N	\N	124	30053	\N
40155	Valles de Tucutunemo		\N	\N	124	30053	\N
40156	Augusto Mijares		\N	\N	124	30053	\N
40157	Sabaneta		\N	\N	124	30054	\N
40158	Juan Antonio Rodríguez Domínguez		\N	\N	124	30054	\N
40159	El Cantón		\N	\N	124	30055	\N
40160	Santa Cruz de Guacas		\N	\N	124	30055	\N
40161	Puerto Vivas		\N	\N	124	30055	\N
40162	Ticoporo		\N	\N	124	30056	\N
40163	Nicolás Pulido		\N	\N	124	30056	\N
40164	Andrés Bello		\N	\N	124	30056	\N
40165	Arismendi		\N	\N	124	30057	\N
40166	Guadarrama		\N	\N	124	30057	\N
40167	La Unión		\N	\N	124	30057	\N
40168	San Antonio		\N	\N	124	30057	\N
40169	Barinas		\N	\N	124	30058	\N
40170	Alberto Arvelo Larriva		\N	\N	124	30058	\N
40171	San Silvestre		\N	\N	124	30058	\N
40172	Santa Inés		\N	\N	124	30058	\N
40173	Santa Lucía		\N	\N	124	30058	\N
40174	Torumos		\N	\N	124	30058	\N
40175	El Carmen		\N	\N	124	30058	\N
40176	Rómulo Betancourt		\N	\N	124	30058	\N
40177	Corazón de Jesús		\N	\N	124	30058	\N
40178	Ramón Ignacio Méndez		\N	\N	124	30058	\N
40179	Alto Barinas		\N	\N	124	30058	\N
40180	Manuel Palacio Fajardo		\N	\N	124	30058	\N
40181	Juan Antonio Rodríguez Domínguez		\N	\N	124	30058	\N
40182	Dominga Ortiz de Páez		\N	\N	124	30058	\N
40183	Barinitas		\N	\N	124	30059	\N
40184	Altamira de Cáceres		\N	\N	124	30059	\N
40185	Calderas		\N	\N	124	30059	\N
40186	Barrancas		\N	\N	124	30060	\N
40187	El Socorro		\N	\N	124	30060	\N
40188	Mazparrito		\N	\N	124	30060	\N
40189	Santa Bárbara		\N	\N	124	30061	\N
40190	Pedro Briceño Méndez		\N	\N	124	30061	\N
40191	Ramón Ignacio Méndez		\N	\N	124	30061	\N
40192	José Ignacio del Pumar		\N	\N	124	30061	\N
40193	Obispos		\N	\N	124	30062	\N
40194	Guasimitos		\N	\N	124	30062	\N
40195	El Real		\N	\N	124	30062	\N
40196	La Luz		\N	\N	124	30062	\N
40197	Ciudad Bolívia		\N	\N	124	30063	\N
40198	José Ignacio Briceño		\N	\N	124	30063	\N
40199	José Félix Ribas		\N	\N	124	30063	\N
40200	Páez		\N	\N	124	30063	\N
40201	Libertad		\N	\N	124	30064	\N
40202	Dolores		\N	\N	124	30064	\N
40203	Santa Rosa		\N	\N	124	30064	\N
40204	Palacio Fajardo		\N	\N	124	30064	\N
40205	Ciudad de Nutrias		\N	\N	124	30065	\N
40206	El Regalo		\N	\N	124	30065	\N
40207	Puerto Nutrias		\N	\N	124	30065	\N
40208	Santa Catalina		\N	\N	124	30065	\N
40209	Cachamay		\N	\N	124	30066	\N
40210	Chirica		\N	\N	124	30066	\N
40211	Dalla Costa		\N	\N	124	30066	\N
40212	Once de Abril		\N	\N	124	30066	\N
40213	Simón Bolívar		\N	\N	124	30066	\N
40214	Unare		\N	\N	124	30066	\N
40215	Universidad		\N	\N	124	30066	\N
40216	Vista al Sol		\N	\N	124	30066	\N
40217	Pozo Verde		\N	\N	124	30066	\N
40218	Yocoima		\N	\N	124	30066	\N
40219	5 de Julio		\N	\N	124	30066	\N
40220	Cedeño		\N	\N	124	30067	\N
40221	Altagracia		\N	\N	124	30067	\N
40222	Ascensión Farreras		\N	\N	124	30067	\N
40223	Guaniamo		\N	\N	124	30067	\N
40224	La Urbana		\N	\N	124	30067	\N
40225	Pijiguaos		\N	\N	124	30067	\N
40226	El Callao		\N	\N	124	30068	\N
40227	Gran Sabana		\N	\N	124	30069	\N
40228	Ikabarú		\N	\N	124	30069	\N
40229	Catedral		\N	\N	124	30070	\N
40230	Zea		\N	\N	124	30070	\N
40231	Orinoco		\N	\N	124	30070	\N
40232	José Antonio Páez		\N	\N	124	30070	\N
40233	Marhuanta		\N	\N	124	30070	\N
40234	Agua Salada		\N	\N	124	30070	\N
40235	Vista Hermosa		\N	\N	124	30070	\N
40236	La Sabanita		\N	\N	124	30070	\N
40237	Panapana		\N	\N	124	30070	\N
40238	Andrés Eloy Blanco		\N	\N	124	30071	\N
40239	Pedro Cova		\N	\N	124	30071	\N
40240	Raúl Leoni		\N	\N	124	30072	\N
40241	Barceloneta		\N	\N	124	30072	\N
40242	Santa Bárbara		\N	\N	124	30072	\N
40243	San Francisco		\N	\N	124	30072	\N
40244	Roscio		\N	\N	124	30073	\N
40245	Salóm		\N	\N	124	30073	\N
40246	Sifontes		\N	\N	124	30074	\N
40247	Dalla Costa		\N	\N	124	30074	\N
40248	San Isidro		\N	\N	124	30074	\N
40249	Sucre		\N	\N	124	30075	\N
40250	Aripao		\N	\N	124	30075	\N
40251	Guarataro		\N	\N	124	30075	\N
40252	Las Majadas		\N	\N	124	30075	\N
40253	Moitaco		\N	\N	124	30075	\N
40254	Padre Pedro Chien		\N	\N	124	30076	\N
40255	Río Grande		\N	\N	124	30076	\N
40256	Bejuma		\N	\N	124	30077	\N
40257	Canoabo		\N	\N	124	30077	\N
40258	Simón Bolívar		\N	\N	124	30077	\N
40259	Güigüe		\N	\N	124	30078	\N
40260	Carabobo		\N	\N	124	30078	\N
40261	Tacarigua		\N	\N	124	30078	\N
40262	Mariara		\N	\N	124	30079	\N
40263	Aguas Calientes		\N	\N	124	30079	\N
40264	Ciudad Alianza		\N	\N	124	30080	\N
40265	Guacara		\N	\N	124	30080	\N
40266	Yagua		\N	\N	124	30080	\N
40267	Morón		\N	\N	124	30081	\N
40268	Yagua		\N	\N	124	30081	\N
40269	Tocuyito		\N	\N	124	30082	\N
40270	Independencia		\N	\N	124	30082	\N
40271	Los Guayos		\N	\N	124	30083	\N
40272	Miranda		\N	\N	124	30084	\N
40273	Montalbán		\N	\N	124	30085	\N
40274	Naguanagua		\N	\N	124	30086	\N
40275	Bartolomé Salóm		\N	\N	124	30087	\N
40276	Democracia		\N	\N	124	30087	\N
40277	Fraternidad		\N	\N	124	30087	\N
40278	Goaigoaza		\N	\N	124	30087	\N
40279	Juan José Flores		\N	\N	124	30087	\N
40280	Unión		\N	\N	124	30087	\N
40281	Borburata		\N	\N	124	30087	\N
40282	Patanemo		\N	\N	124	30087	\N
40283	San Diego		\N	\N	124	30088	\N
40284	San Joaquín		\N	\N	124	30089	\N
40285	Candelaria		\N	\N	124	30090	\N
40286	Catedral		\N	\N	124	30090	\N
40287	El Socorro		\N	\N	124	30090	\N
40288	Miguel Peña		\N	\N	124	30090	\N
40289	Rafael Urdaneta		\N	\N	124	30090	\N
40290	San Blas		\N	\N	124	30090	\N
40291	San José		\N	\N	124	30090	\N
40292	Santa Rosa		\N	\N	124	30090	\N
40293	Negro Primero		\N	\N	124	30090	\N
40294	Cojedes		\N	\N	124	30091	\N
40295	Juan de Mata Suárez		\N	\N	124	30091	\N
40296	Tinaquillo		\N	\N	124	30092	\N
40297	El Baúl		\N	\N	124	30093	\N
40298	Sucre		\N	\N	124	30093	\N
40299	La Aguadita		\N	\N	124	30094	\N
40300	Macapo		\N	\N	124	30094	\N
40301	El Pao		\N	\N	124	30095	\N
40302	El Amparo		\N	\N	124	30096	\N
40303	Libertad de Cojedes		\N	\N	124	30096	\N
40304	Rómulo Gallegos		\N	\N	124	30097	\N
40305	San Carlos de Austria		\N	\N	124	30098	\N
40306	Juan Ángel Bravo		\N	\N	124	30098	\N
40307	Manuel Manrique		\N	\N	124	30098	\N
40308	General en Jefe José Laurencio Silva		\N	\N	124	30099	\N
40309	Curiapo		\N	\N	124	30100	\N
40310	Almirante Luis Brión		\N	\N	124	30100	\N
40311	Francisco Aniceto Lugo		\N	\N	124	30100	\N
40312	Manuel Renaud		\N	\N	124	30100	\N
40313	Padre Barral		\N	\N	124	30100	\N
40314	Santos de Abelgas		\N	\N	124	30100	\N
40315	Imataca		\N	\N	124	30101	\N
40316	Cinco de Julio		\N	\N	124	30101	\N
40317	Juan Bautista Arismendi		\N	\N	124	30101	\N
40318	Manuel Piar		\N	\N	124	30101	\N
40319	Rómulo Gallegos		\N	\N	124	30101	\N
40320	Pedernales		\N	\N	124	30102	\N
40321	Luis Beltrán Prieto Figueroa		\N	\N	124	30102	\N
40322	San José Delta Amacuro)		\N	\N	124	30103	\N
40323	José Vidal Marcano		\N	\N	124	30103	\N
40324	Juan Millán		\N	\N	124	30103	\N
40325	Leonardo Ruíz Pineda		\N	\N	124	30103	\N
40326	Mariscal Antonio José de Sucre		\N	\N	124	30103	\N
40327	Monseñor Argimiro García		\N	\N	124	30103	\N
40328	San Rafael Delta Amacuro)		\N	\N	124	30103	\N
40329	Virgen del Valle		\N	\N	124	30103	\N
40330	Clarines		\N	\N	124	30010	\N
40331	Guanape		\N	\N	124	30010	\N
40332	Sabana de Uchire		\N	\N	124	30010	\N
40333	Capadare		\N	\N	124	30104	\N
40334	La Pastora		\N	\N	124	30104	\N
40335	Libertador		\N	\N	124	30104	\N
40336	San Juan de los Cayos		\N	\N	124	30104	\N
40337	Aracua		\N	\N	124	30105	\N
40338	La Peña		\N	\N	124	30105	\N
40339	San Luis		\N	\N	124	30105	\N
40340	Bariro		\N	\N	124	30106	\N
40341	Borojó		\N	\N	124	30106	\N
40342	Capatárida		\N	\N	124	30106	\N
40343	Guajiro		\N	\N	124	30106	\N
40344	Seque		\N	\N	124	30106	\N
40345	Zazárida		\N	\N	124	30106	\N
40346	Valle de Eroa		\N	\N	124	30106	\N
40347	Cacique Manaure		\N	\N	124	30107	\N
40348	Norte		\N	\N	124	30108	\N
40349	Carirubana		\N	\N	124	30108	\N
40350	Santa Ana		\N	\N	124	30108	\N
40351	Urbana Punta Cardón		\N	\N	124	30108	\N
40352	La Vela de Coro		\N	\N	124	30109	\N
40353	Acurigua		\N	\N	124	30109	\N
40354	Guaibacoa		\N	\N	124	30109	\N
40355	Las Calderas		\N	\N	124	30109	\N
40356	Macoruca		\N	\N	124	30109	\N
40357	Dabajuro		\N	\N	124	30110	\N
40358	Agua Clara		\N	\N	124	30111	\N
40359	Avaria		\N	\N	124	30111	\N
40360	Pedregal		\N	\N	124	30111	\N
40361	Piedra Grande		\N	\N	124	30111	\N
40362	Purureche		\N	\N	124	30111	\N
40363	Adaure		\N	\N	124	30112	\N
40364	Adícora		\N	\N	124	30112	\N
40365	Baraived		\N	\N	124	30112	\N
40366	Buena Vista		\N	\N	124	30112	\N
40367	Jadacaquiva		\N	\N	124	30112	\N
40368	El Vínculo		\N	\N	124	30112	\N
40369	El Hato		\N	\N	124	30112	\N
40370	Moruy		\N	\N	124	30112	\N
40371	Pueblo Nuevo		\N	\N	124	30112	\N
40372	Agua Larga		\N	\N	124	30113	\N
40373	El Paují		\N	\N	124	30113	\N
40374	Independencia		\N	\N	124	30113	\N
40375	Mapararí		\N	\N	124	30113	\N
40376	Agua Linda		\N	\N	124	30114	\N
40377	Araurima		\N	\N	124	30114	\N
40378	Jacura		\N	\N	124	30114	\N
40379	Tucacas		\N	\N	124	30115	\N
40380	Boca de Aroa		\N	\N	124	30115	\N
40381	Los Taques		\N	\N	124	30116	\N
40382	Judibana		\N	\N	124	30116	\N
40383	Mene de Mauroa		\N	\N	124	30117	\N
40384	San Félix		\N	\N	124	30117	\N
40385	Casigua		\N	\N	124	30117	\N
40386	Guzmán Guillermo		\N	\N	124	30118	\N
40387	Mitare		\N	\N	124	30118	\N
40388	Río Seco		\N	\N	124	30118	\N
40389	Sabaneta		\N	\N	124	30118	\N
40390	San Antonio		\N	\N	124	30118	\N
40391	San Gabriel		\N	\N	124	30118	\N
40392	Santa Ana		\N	\N	124	30118	\N
40393	Boca del Tocuyo		\N	\N	124	30119	\N
40394	Chichiriviche		\N	\N	124	30119	\N
40395	Tocuyo de la Costa		\N	\N	124	30119	\N
40396	Palmasola		\N	\N	124	30120	\N
40397	Cabure		\N	\N	124	30121	\N
40398	Colina		\N	\N	124	30121	\N
40399	Curimagua		\N	\N	124	30121	\N
40400	San José de la Costa		\N	\N	124	30122	\N
40401	Píritu		\N	\N	124	30122	\N
40402	San Francisco		\N	\N	124	30123	\N
40403	Sucre		\N	\N	124	30124	\N
40404	Pecaya		\N	\N	124	30124	\N
40405	Tocópero		\N	\N	124	30125	\N
40406	El Charal		\N	\N	124	30126	\N
40407	Las Vegas del Tuy		\N	\N	124	30126	\N
40408	Santa Cruz de Bucaral		\N	\N	124	30126	\N
40409	Bruzual		\N	\N	124	30127	\N
40410	Urumaco		\N	\N	124	30127	\N
40411	Puerto Cumarebo		\N	\N	124	30128	\N
40412	La Ciénaga		\N	\N	124	30128	\N
40413	La Soledad		\N	\N	124	30128	\N
40414	Pueblo Cumarebo		\N	\N	124	30128	\N
40415	Zazárida		\N	\N	124	30128	\N
40416	Churuguara		\N	\N	124	30113	\N
40417	Camaguán		\N	\N	124	30129	\N
40418	Puerto Miranda		\N	\N	124	30129	\N
40419	Uverito		\N	\N	124	30129	\N
40420	Chaguaramas		\N	\N	124	30130	\N
40421	El Socorro		\N	\N	124	30131	\N
40422	Tucupido		\N	\N	124	30132	\N
40423	San Rafael de Laya		\N	\N	124	30132	\N
40424	Altagracia de Orituco		\N	\N	124	30133	\N
40425	San Rafael de Orituco		\N	\N	124	30133	\N
40426	San Francisco Javier de Lezama		\N	\N	124	30133	\N
40427	Paso Real de Macaira		\N	\N	124	30133	\N
40428	Carlos Soublette		\N	\N	124	30133	\N
40429	San Francisco de Macaira		\N	\N	124	30133	\N
40430	Libertad de Orituco		\N	\N	124	30133	\N
40431	Cantaclaro		\N	\N	124	30134	\N
40432	San Juan de los Morros		\N	\N	124	30134	\N
40433	Parapara		\N	\N	124	30134	\N
40434	El Sombrero		\N	\N	124	30135	\N
40435	Sosa		\N	\N	124	30135	\N
40436	Las Mercedes		\N	\N	124	30136	\N
40437	Cabruta		\N	\N	124	30136	\N
40438	Santa Rita de Manapire		\N	\N	124	30136	\N
40439	Valle de la Pascua		\N	\N	124	30137	\N
40440	Espino		\N	\N	124	30137	\N
40441	San José de Unare		\N	\N	124	30138	\N
40442	Zaraza		\N	\N	124	30138	\N
40443	San José de Tiznados		\N	\N	124	30139	\N
40444	San Francisco de Tiznados		\N	\N	124	30139	\N
40445	San Lorenzo de Tiznados		\N	\N	124	30139	\N
40446	Ortiz		\N	\N	124	30139	\N
40447	Guayabal		\N	\N	124	30140	\N
40448	Cazorla		\N	\N	124	30140	\N
40449	San José de Guaribe		\N	\N	124	30141	\N
40450	Uveral		\N	\N	124	30141	\N
40451	Santa María de Ipire		\N	\N	124	30142	\N
40452	Altamira		\N	\N	124	30142	\N
40453	El Calvario		\N	\N	124	30143	\N
40454	El Rastro		\N	\N	124	30143	\N
40455	Guardatinajas		\N	\N	124	30143	\N
40456	Capital Urbana Calabozo		\N	\N	124	30143	\N
40457	Quebrada Honda de Guache		\N	\N	124	30144	\N
40458	Pío Tamayo		\N	\N	124	30144	\N
40459	Yacambú		\N	\N	124	30144	\N
40460	Fréitez		\N	\N	124	30145	\N
40461	José María Blanco		\N	\N	124	30145	\N
40462	Catedral		\N	\N	124	30146	\N
40463	Concepción		\N	\N	124	30146	\N
40464	El Cují		\N	\N	124	30146	\N
40465	Juan de Villegas		\N	\N	124	30146	\N
40466	Santa Rosa		\N	\N	124	30146	\N
40467	Tamaca		\N	\N	124	30146	\N
40468	Unión		\N	\N	124	30146	\N
40469	Aguedo Felipe Alvarado		\N	\N	124	30146	\N
40470	Buena Vista		\N	\N	124	30146	\N
40471	Juárez		\N	\N	124	30146	\N
40472	Juan Bautista Rodríguez		\N	\N	124	30147	\N
40473	Cuara		\N	\N	124	30147	\N
40474	Diego de Lozada		\N	\N	124	30147	\N
40475	Paraíso de San José		\N	\N	124	30147	\N
40476	San Miguel		\N	\N	124	30147	\N
40477	Tintorero		\N	\N	124	30147	\N
40478	José Bernardo Dorante		\N	\N	124	30147	\N
40479	Coronel Mariano Peraza		\N	\N	124	30147	\N
40480	Bolívar		\N	\N	124	30148	\N
40481	Anzoátegui		\N	\N	124	30148	\N
40482	Guarico		\N	\N	124	30148	\N
40483	Hilario Luna y Luna		\N	\N	124	30148	\N
40484	Humocaro Alto		\N	\N	124	30148	\N
40485	Humocaro Bajo		\N	\N	124	30148	\N
40486	La Candelaria		\N	\N	124	30148	\N
40487	Morán		\N	\N	124	30148	\N
40488	Cabudare		\N	\N	124	30149	\N
40489	José Gregorio Bastidas		\N	\N	124	30149	\N
40490	Agua Viva		\N	\N	124	30149	\N
40491	Sarare		\N	\N	124	30150	\N
40492	Buría		\N	\N	124	30150	\N
40493	Gustavo Vegas León		\N	\N	124	30150	\N
40494	Trinidad Samuel		\N	\N	124	30151	\N
40495	Antonio Díaz		\N	\N	124	30151	\N
40496	Camacaro		\N	\N	124	30151	\N
40497	Castañeda		\N	\N	124	30151	\N
40498	Cecilio Zubillaga		\N	\N	124	30151	\N
40499	Chiquinquirá		\N	\N	124	30151	\N
40500	El Blanco		\N	\N	124	30151	\N
40501	Espinoza de los Monteros		\N	\N	124	30151	\N
40502	Lara		\N	\N	124	30151	\N
40503	Las Mercedes		\N	\N	124	30151	\N
40504	Manuel Morillo		\N	\N	124	30151	\N
40505	Montaña Verde		\N	\N	124	30151	\N
40506	Montes de Oca		\N	\N	124	30151	\N
40507	Torres		\N	\N	124	30151	\N
40508	Heriberto Arroyo		\N	\N	124	30151	\N
40509	Reyes Vargas		\N	\N	124	30151	\N
40510	Altagracia		\N	\N	124	30151	\N
40511	Siquisique		\N	\N	124	30152	\N
40512	Moroturo		\N	\N	124	30152	\N
40513	San Miguel		\N	\N	124	30152	\N
40514	Xaguas		\N	\N	124	30152	\N
40515	Presidente Betancourt		\N	\N	124	30179	\N
40516	Presidente Páez		\N	\N	124	30179	\N
40517	Presidente Rómulo Gallegos		\N	\N	124	30179	\N
40518	Gabriel Picón González		\N	\N	124	30179	\N
40519	Héctor Amable Mora		\N	\N	124	30179	\N
40520	José Nucete Sardi		\N	\N	124	30179	\N
40521	Pulido Méndez		\N	\N	124	30179	\N
40522	La Azulita		\N	\N	124	30180	\N
40523	Santa Cruz de Mora		\N	\N	124	30181	\N
40524	Mesa Bolívar		\N	\N	124	30181	\N
40525	Mesa de Las Palmas		\N	\N	124	30181	\N
40526	Aricagua		\N	\N	124	30182	\N
40527	San Antonio		\N	\N	124	30182	\N
40528	Canagua		\N	\N	124	30183	\N
40529	Capurí		\N	\N	124	30183	\N
40530	Chacantá		\N	\N	124	30183	\N
40531	El Molino		\N	\N	124	30183	\N
40532	Guaimaral		\N	\N	124	30183	\N
40533	Mucutuy		\N	\N	124	30183	\N
40534	Mucuchachí		\N	\N	124	30183	\N
40535	Fernández Peña		\N	\N	124	30184	\N
40536	Matriz		\N	\N	124	30184	\N
40537	Montalbán		\N	\N	124	30184	\N
40538	Acequias		\N	\N	124	30184	\N
40539	Jají		\N	\N	124	30184	\N
40540	La Mesa		\N	\N	124	30184	\N
40541	San José del Sur		\N	\N	124	30184	\N
40542	Tucaní		\N	\N	124	30185	\N
40543	Florencio Ramírez		\N	\N	124	30185	\N
40544	Santo Domingo		\N	\N	124	30186	\N
40545	Las Piedras		\N	\N	124	30186	\N
40546	Guaraque		\N	\N	124	30187	\N
40547	Mesa de Quintero		\N	\N	124	30187	\N
40548	Río Negro		\N	\N	124	30187	\N
40549	Arapuey		\N	\N	124	30188	\N
40550	Palmira		\N	\N	124	30188	\N
40551	San Cristóbal de Torondoy		\N	\N	124	30189	\N
40552	Torondoy		\N	\N	124	30189	\N
40553	Antonio Spinetti Dini		\N	\N	124	30190	\N
40554	Arias		\N	\N	124	30190	\N
40555	Caracciolo Parra Pérez		\N	\N	124	30190	\N
40556	Domingo Peña		\N	\N	124	30190	\N
40557	El Llano		\N	\N	124	30190	\N
40558	Gonzalo Picón Febres		\N	\N	124	30190	\N
40559	Jacinto Plaza		\N	\N	124	30190	\N
40560	Juan Rodríguez Suárez		\N	\N	124	30190	\N
40561	Lasso de la Vega		\N	\N	124	30190	\N
40562	Mariano Picón Salas		\N	\N	124	30190	\N
40563	Milla		\N	\N	124	30190	\N
40564	Osuna Rodríguez		\N	\N	124	30190	\N
40565	Sagrario		\N	\N	124	30190	\N
40566	El Morro		\N	\N	124	30190	\N
40567	Los Nevados		\N	\N	124	30190	\N
40568	Andrés Eloy Blanco		\N	\N	124	30191	\N
40569	La Venta		\N	\N	124	30191	\N
40570	Piñango		\N	\N	124	30191	\N
40571	Timotes		\N	\N	124	30191	\N
40572	Eloy Paredes		\N	\N	124	30192	\N
40573	San Rafael de Alcázar		\N	\N	124	30192	\N
40574	Santa Elena de Arenales		\N	\N	124	30192	\N
40575	Santa María de Caparo		\N	\N	124	30193	\N
40576	Pueblo Llano		\N	\N	124	30194	\N
40577	Cacute		\N	\N	124	30195	\N
40578	La Toma		\N	\N	124	30195	\N
40579	Mucuchíes		\N	\N	124	30195	\N
40580	Mucurubá		\N	\N	124	30195	\N
40581	San Rafael		\N	\N	124	30195	\N
40582	Gerónimo Maldonado		\N	\N	124	30196	\N
40583	Bailadores		\N	\N	124	30196	\N
40584	Tabay		\N	\N	124	30197	\N
40585	Chiguará		\N	\N	124	30198	\N
40586	Estánquez		\N	\N	124	30198	\N
40587	Lagunillas		\N	\N	124	30198	\N
40588	La Trampa		\N	\N	124	30198	\N
40589	Pueblo Nuevo del Sur		\N	\N	124	30198	\N
40590	San Juan		\N	\N	124	30198	\N
40591	El Amparo		\N	\N	124	30199	\N
40592	El Llano		\N	\N	124	30199	\N
40593	San Francisco		\N	\N	124	30199	\N
40594	Tovar		\N	\N	124	30199	\N
40595	Independencia		\N	\N	124	30200	\N
40596	María de la Concepción Palacios Blanco		\N	\N	124	30200	\N
40597	Nueva Bolivia		\N	\N	124	30200	\N
40598	Santa Apolonia		\N	\N	124	30200	\N
40599	Caño El Tigre		\N	\N	124	30201	\N
40600	Zea		\N	\N	124	30201	\N
40601	Aragüita		\N	\N	124	30223	\N
40602	Arévalo González		\N	\N	124	30223	\N
40603	Capaya		\N	\N	124	30223	\N
40604	Caucagua		\N	\N	124	30223	\N
40605	Panaquire		\N	\N	124	30223	\N
40606	Ribas		\N	\N	124	30223	\N
40607	El Café		\N	\N	124	30223	\N
40608	Marizapa		\N	\N	124	30223	\N
40609	Cumbo		\N	\N	124	30224	\N
40610	San José de Barlovento		\N	\N	124	30224	\N
40611	El Cafetal		\N	\N	124	30225	\N
40612	Las Minas		\N	\N	124	30225	\N
40613	Nuestra Señora del Rosario		\N	\N	124	30225	\N
40614	Higuerote		\N	\N	124	30226	\N
40615	Curiepe		\N	\N	124	30226	\N
40616	Tacarigua de Brión		\N	\N	124	30226	\N
40617	Mamporal		\N	\N	124	30227	\N
40618	Carrizal		\N	\N	124	30228	\N
40619	Chacao		\N	\N	124	30229	\N
40620	Charallave		\N	\N	124	30230	\N
40621	Las Brisas		\N	\N	124	30230	\N
40622	El Hatillo		\N	\N	124	30231	\N
40623	Altagracia de la Montaña		\N	\N	124	30232	\N
40624	Cecilio Acosta		\N	\N	124	30232	\N
40625	Los Teques		\N	\N	124	30232	\N
40626	El Jarillo		\N	\N	124	30232	\N
40627	San Pedro		\N	\N	124	30232	\N
40628	Tácata		\N	\N	124	30232	\N
40629	Paracotos		\N	\N	124	30232	\N
40630	Cartanal		\N	\N	124	30233	\N
40631	Santa Teresa del Tuy		\N	\N	124	30233	\N
40632	La Democracia		\N	\N	124	30234	\N
40633	Ocumare del Tuy		\N	\N	124	30234	\N
40634	Santa Bárbara		\N	\N	124	30234	\N
40635	San Antonio de los Altos		\N	\N	124	30235	\N
40636	Río Chico		\N	\N	124	30236	\N
40637	El Guapo		\N	\N	124	30236	\N
40638	Tacarigua de la Laguna		\N	\N	124	30236	\N
40639	Paparo		\N	\N	124	30236	\N
40640	San Fernando del Guapo		\N	\N	124	30236	\N
40641	Santa Lucía del Tuy		\N	\N	124	30237	\N
40642	Cúpira		\N	\N	124	30238	\N
40643	Machurucuto		\N	\N	124	30238	\N
40644	Guarenas		\N	\N	124	30239	\N
40645	San Antonio de Yare		\N	\N	124	30240	\N
40646	San Francisco de Yare		\N	\N	124	30240	\N
40647	Leoncio Martínez		\N	\N	124	30241	\N
40648	Petare		\N	\N	124	30241	\N
40649	Caucagüita		\N	\N	124	30241	\N
40650	Filas de Mariche		\N	\N	124	30241	\N
40651	La Dolorita		\N	\N	124	30241	\N
40652	Cúa		\N	\N	124	30242	\N
40653	Nueva Cúa		\N	\N	124	30242	\N
40654	Guatire		\N	\N	124	30243	\N
40655	Bolívar		\N	\N	124	30243	\N
40656	San Antonio de Maturín		\N	\N	124	30258	\N
40657	San Francisco de Maturín		\N	\N	124	30258	\N
40658	Aguasay		\N	\N	124	30259	\N
40659	Caripito		\N	\N	124	30260	\N
40660	El Guácharo		\N	\N	124	30261	\N
40661	La Guanota		\N	\N	124	30261	\N
40662	Sabana de Piedra		\N	\N	124	30261	\N
40663	San Agustín		\N	\N	124	30261	\N
40664	Teresen		\N	\N	124	30261	\N
40665	Caripe		\N	\N	124	30261	\N
40666	Areo		\N	\N	124	30262	\N
40667	Capital Cedeño		\N	\N	124	30262	\N
40668	San Félix de Cantalicio		\N	\N	124	30262	\N
40669	Viento Fresco		\N	\N	124	30262	\N
40670	El Tejero		\N	\N	124	30263	\N
40671	Punta de Mata		\N	\N	124	30263	\N
40672	Chaguaramas		\N	\N	124	30264	\N
40673	Las Alhuacas		\N	\N	124	30264	\N
40674	Tabasca		\N	\N	124	30264	\N
40675	Temblador		\N	\N	124	30264	\N
40676	Alto de los Godos		\N	\N	124	30265	\N
40677	Boquerón		\N	\N	124	30265	\N
40678	Las Cocuizas		\N	\N	124	30265	\N
40679	La Cruz		\N	\N	124	30265	\N
40680	San Simón		\N	\N	124	30265	\N
40681	El Corozo		\N	\N	124	30265	\N
40682	El Furrial		\N	\N	124	30265	\N
40683	Jusepín		\N	\N	124	30265	\N
40684	La Pica		\N	\N	124	30265	\N
40685	San Vicente		\N	\N	124	30265	\N
40686	Aparicio		\N	\N	124	30266	\N
40687	Aragua de Maturín		\N	\N	124	30266	\N
40688	Chaguamal		\N	\N	124	30266	\N
40689	El Pinto		\N	\N	124	30266	\N
40690	Guanaguana		\N	\N	124	30266	\N
40691	La Toscana		\N	\N	124	30266	\N
40692	Taguaya		\N	\N	124	30266	\N
40693	Cachipo		\N	\N	124	30267	\N
40694	Quiriquire		\N	\N	124	30267	\N
40695	Santa Bárbara		\N	\N	124	30268	\N
40696	Barrancas		\N	\N	124	30269	\N
40697	Los Barrancos de Fajardo		\N	\N	124	30269	\N
40698	Uracoa		\N	\N	124	30270	\N
40699	Antolín del Campo		\N	\N	124	30271	\N
40700	Arismendi		\N	\N	124	30272	\N
40701	García		\N	\N	124	30273	\N
40702	Francisco Fajardo		\N	\N	124	30273	\N
40703	Bolívar		\N	\N	124	30274	\N
40704	Guevara		\N	\N	124	30274	\N
40705	Matasiete		\N	\N	124	30274	\N
40706	Santa Ana		\N	\N	124	30274	\N
40707	Sucre		\N	\N	124	30274	\N
40708	Aguirre		\N	\N	124	30275	\N
40709	Maneiro		\N	\N	124	30275	\N
40710	Adrián		\N	\N	124	30276	\N
40711	Juan Griego		\N	\N	124	30276	\N
40712	Yaguaraparo		\N	\N	124	30276	\N
40713	Porlamar		\N	\N	124	30277	\N
40714	San Francisco de Macanao		\N	\N	124	30278	\N
40715	Boca de Río		\N	\N	124	30278	\N
40716	Tubores		\N	\N	124	30279	\N
40717	Los Baleales		\N	\N	124	30279	\N
40718	Vicente Fuentes		\N	\N	124	30280	\N
40719	Villalba		\N	\N	124	30280	\N
40720	San Juan Bautista		\N	\N	124	30281	\N
40721	Zabala		\N	\N	124	30281	\N
40722	Capital Araure		\N	\N	124	30283	\N
40723	Río Acarigua		\N	\N	124	30283	\N
40724	Capital Esteller		\N	\N	124	30284	\N
40725	Uveral		\N	\N	124	30284	\N
40726	Guanare		\N	\N	124	30285	\N
40727	Córdoba		\N	\N	124	30285	\N
40728	San José de la Montaña		\N	\N	124	30285	\N
40729	San Juan de Guanaguanare		\N	\N	124	30285	\N
40730	Virgen de la Coromoto		\N	\N	124	30285	\N
40731	Guanarito		\N	\N	124	30286	\N
40732	Trinidad de la Capilla		\N	\N	124	30286	\N
40733	Divina Pastora		\N	\N	124	30286	\N
40734	Monseñor José Vicente de Unda		\N	\N	124	30287	\N
40735	Peña Blanca		\N	\N	124	30287	\N
40736	Capital Ospino		\N	\N	124	30288	\N
40737	Aparición		\N	\N	124	30288	\N
40738	La Estación		\N	\N	124	30288	\N
40739	Páez		\N	\N	124	30289	\N
40740	Payara		\N	\N	124	30289	\N
40741	Pimpinela		\N	\N	124	30289	\N
40742	Ramón Peraza		\N	\N	124	30289	\N
40743	Papelón		\N	\N	124	30290	\N
40744	Caño Delgadito		\N	\N	124	30290	\N
40745	San Genaro de Boconoito		\N	\N	124	30291	\N
40746	Antolín Tovar		\N	\N	124	30291	\N
40747	San Rafael de Onoto		\N	\N	124	30292	\N
40748	Santa Fe		\N	\N	124	30292	\N
40749	Thermo Morles		\N	\N	124	30292	\N
40750	Santa Rosalía		\N	\N	124	30293	\N
40751	Florida		\N	\N	124	30293	\N
40752	Sucre		\N	\N	124	30294	\N
40753	Concepción		\N	\N	124	30294	\N
40754	San Rafael de Palo Alzado		\N	\N	124	30294	\N
40755	Uvencio Antonio Velásquez		\N	\N	124	30294	\N
40756	San José de Saguaz		\N	\N	124	30294	\N
40757	Villa Rosa		\N	\N	124	30294	\N
40758	Turén		\N	\N	124	30295	\N
40759	Canelones		\N	\N	124	30295	\N
40760	Santa Cruz		\N	\N	124	30295	\N
40761	San Isidro Labrador		\N	\N	124	30295	\N
40762	Mariño		\N	\N	124	30296	\N
40763	Rómulo Gallegos		\N	\N	124	30296	\N
40764	San José de Aerocuar		\N	\N	124	30297	\N
40765	Tavera Acosta		\N	\N	124	30297	\N
40766	Río Caribe		\N	\N	124	30298	\N
40767	Antonio José de Sucre		\N	\N	124	30298	\N
40768	El Morro de Puerto Santo		\N	\N	124	30298	\N
40769	Puerto Santo		\N	\N	124	30298	\N
40770	San Juan de las Galdonas		\N	\N	124	30298	\N
40771	El Pilar		\N	\N	124	30299	\N
40772	El Rincón		\N	\N	124	30299	\N
40773	General Francisco Antonio Váquez		\N	\N	124	30299	\N
40774	Guaraúnos		\N	\N	124	30299	\N
40775	Tunapuicito		\N	\N	124	30299	\N
40776	Unión		\N	\N	124	30299	\N
40777	Santa Catalina		\N	\N	124	30300	\N
40778	Santa Rosa		\N	\N	124	30300	\N
40779	Santa Teresa		\N	\N	124	30300	\N
40780	Bolívar		\N	\N	124	30300	\N
40781	Maracapana		\N	\N	124	30300	\N
40782	Libertad		\N	\N	124	30302	\N
40783	El Paujil		\N	\N	124	30302	\N
40784	Yaguaraparo		\N	\N	124	30302	\N
40785	Cruz Salmerón Acosta		\N	\N	124	30303	\N
40786	Chacopata		\N	\N	124	30303	\N
40787	Manicuare		\N	\N	124	30303	\N
40788	Tunapuy		\N	\N	124	30304	\N
40789	Campo Elías		\N	\N	124	30304	\N
40790	Irapa		\N	\N	124	30305	\N
40791	Campo Claro		\N	\N	124	30305	\N
40792	Maraval		\N	\N	124	30305	\N
40793	San Antonio de Irapa		\N	\N	124	30305	\N
40794	Soro		\N	\N	124	30305	\N
40795	Mejía		\N	\N	124	30306	\N
40796	Cumanacoa		\N	\N	124	30307	\N
40797	Arenas		\N	\N	124	30307	\N
40798	Aricagua		\N	\N	124	30307	\N
40799	Cogollar		\N	\N	124	30307	\N
40800	San Fernando		\N	\N	124	30307	\N
40801	San Lorenzo		\N	\N	124	30307	\N
40802	Villa Frontado Muelle de Cariaco)		\N	\N	124	30308	\N
40803	Catuaro		\N	\N	124	30308	\N
40804	Rendón		\N	\N	124	30308	\N
40805	San Cruz		\N	\N	124	30308	\N
40806	Santa María		\N	\N	124	30308	\N
40807	Altagracia		\N	\N	124	30309	\N
40808	Santa Inés		\N	\N	124	30309	\N
40809	Valentín Valiente		\N	\N	124	30309	\N
40810	Ayacucho		\N	\N	124	30309	\N
40811	San Juan		\N	\N	124	30309	\N
40812	Raúl Leoni		\N	\N	124	30309	\N
40813	Gran Mariscal		\N	\N	124	30309	\N
40814	Cristóbal Colón		\N	\N	124	30310	\N
40815	Bideau		\N	\N	124	30310	\N
40816	Punta de Piedras		\N	\N	124	30310	\N
40817	Güiria		\N	\N	124	30310	\N
40818	Andrés Bello		\N	\N	124	30341	\N
40819	Antonio Rómulo Costa		\N	\N	124	30342	\N
40820	Ayacucho		\N	\N	124	30343	\N
40821	Rivas Berti		\N	\N	124	30343	\N
40822	San Pedro del Río		\N	\N	124	30343	\N
40823	Bolívar		\N	\N	124	30344	\N
40824	Palotal		\N	\N	124	30344	\N
40825	General Juan Vicente Gómez		\N	\N	124	30344	\N
40826	Isaías Medina Angarita		\N	\N	124	30344	\N
40827	Cárdenas		\N	\N	124	30345	\N
40828	Amenodoro Ángel Lamus		\N	\N	124	30345	\N
40829	La Florida		\N	\N	124	30345	\N
40830	Córdoba		\N	\N	124	30346	\N
40831	Fernández Feo		\N	\N	124	30347	\N
40832	Alberto Adriani		\N	\N	124	30347	\N
40833	Santo Domingo		\N	\N	124	30347	\N
40834	Francisco de Miranda		\N	\N	124	30348	\N
40835	García de Hevia		\N	\N	124	30349	\N
40836	Boca de Grita		\N	\N	124	30349	\N
40837	José Antonio Páez		\N	\N	124	30349	\N
40838	Guásimos		\N	\N	124	30350	\N
40839	Independencia		\N	\N	124	30351	\N
40840	Juan Germán Roscio		\N	\N	124	30351	\N
40841	Román Cárdenas		\N	\N	124	30351	\N
40842	Jáuregui		\N	\N	124	30352	\N
40843	Emilio Constantino Guerrero		\N	\N	124	30352	\N
40844	Monseñor Miguel Antonio Salas		\N	\N	124	30352	\N
40845	José María Vargas		\N	\N	124	30353	\N
40846	Junín		\N	\N	124	30354	\N
40847	La Petrólea		\N	\N	124	30354	\N
40848	Quinimarí		\N	\N	124	30354	\N
40849	Bramón		\N	\N	124	30354	\N
40850	Libertad		\N	\N	124	30355	\N
40851	Cipriano Castro		\N	\N	124	30355	\N
40852	Manuel Felipe Rugeles		\N	\N	124	30355	\N
40853	Libertador		\N	\N	124	30356	\N
40854	Doradas		\N	\N	124	30356	\N
40855	Emeterio Ochoa		\N	\N	124	30356	\N
40856	San Joaquín de Navay		\N	\N	124	30356	\N
40857	Lobatera		\N	\N	124	30357	\N
40858	Constitución		\N	\N	124	30357	\N
40859	Michelena		\N	\N	124	30358	\N
40860	Panamericano		\N	\N	124	30359	\N
40861	La Palmita		\N	\N	124	30359	\N
40862	Pedro María Ureña		\N	\N	124	30360	\N
40863	Nueva Arcadia		\N	\N	124	30360	\N
40864	Delicias		\N	\N	124	30361	\N
40865	Pecaya		\N	\N	124	30361	\N
40866	Samuel Darío Maldonado		\N	\N	124	30362	\N
40867	Boconó		\N	\N	124	30362	\N
40868	Hernández		\N	\N	124	30362	\N
40869	La Concordia		\N	\N	124	30363	\N
40870	San Juan Bautista		\N	\N	124	30363	\N
40871	Pedro María Morantes		\N	\N	124	30363	\N
40872	San Sebastián		\N	\N	124	30363	\N
40873	Dr. Francisco Romero Lobo		\N	\N	124	30363	\N
40874	Seboruco		\N	\N	124	30364	\N
40875	Simón Rodríguez		\N	\N	124	30365	\N
40876	Sucre		\N	\N	124	30366	\N
40877	Eleazar López Contreras		\N	\N	124	30366	\N
40878	San Pablo		\N	\N	124	30366	\N
40879	Torbes		\N	\N	124	30367	\N
40880	Uribante		\N	\N	124	30368	\N
40881	Cárdenas		\N	\N	124	30368	\N
40882	Juan Pablo Peñalosa		\N	\N	124	30368	\N
40883	Potosí		\N	\N	124	30368	\N
40884	San Judas Tadeo		\N	\N	124	30369	\N
40885	Araguaney		\N	\N	124	30370	\N
40886	El Jaguito		\N	\N	124	30370	\N
40887	La Esperanza		\N	\N	124	30370	\N
40888	Santa Isabel		\N	\N	124	30370	\N
40889	Boconó		\N	\N	124	30371	\N
40890	El Carmen		\N	\N	124	30371	\N
40891	Mosquey		\N	\N	124	30371	\N
40892	Ayacucho		\N	\N	124	30371	\N
40893	Burbusay		\N	\N	124	30371	\N
40894	General Ribas		\N	\N	124	30371	\N
40895	Guaramacal		\N	\N	124	30371	\N
40896	Vega de Guaramacal		\N	\N	124	30371	\N
40897	Monseñor Jáuregui		\N	\N	124	30371	\N
40898	Rafael Rangel		\N	\N	124	30371	\N
40899	San Miguel		\N	\N	124	30371	\N
40900	San José		\N	\N	124	30371	\N
40901	Sabana Grande		\N	\N	124	30372	\N
40902	Cheregüé		\N	\N	124	30372	\N
40903	Granados		\N	\N	124	30372	\N
40904	Arnoldo Gabaldón		\N	\N	124	30373	\N
40905	Bolivia		\N	\N	124	30373	\N
40906	Carrillo		\N	\N	124	30373	\N
40907	Cegarra		\N	\N	124	30373	\N
40908	Chejendé		\N	\N	124	30373	\N
40909	Manuel Salvador Ulloa		\N	\N	124	30373	\N
40910	San José		\N	\N	124	30373	\N
40911	Carache		\N	\N	124	30374	\N
40912	La Concepción		\N	\N	124	30374	\N
40913	Cuicas		\N	\N	124	30374	\N
40914	Panamericana		\N	\N	124	30374	\N
40915	Santa Cruz		\N	\N	124	30374	\N
40916	Escuque		\N	\N	124	30375	\N
40917	La Unión		\N	\N	124	30375	\N
40918	Santa Rita		\N	\N	124	30375	\N
40919	Sabana Libre		\N	\N	124	30375	\N
40920	El Socorro		\N	\N	124	30376	\N
40921	Los Caprichos		\N	\N	124	30376	\N
40922	Antonio José de Sucre		\N	\N	124	30376	\N
40923	Campo Elías		\N	\N	124	30377	\N
40924	Arnoldo Gabaldón		\N	\N	124	30377	\N
40925	Santa Apolonia		\N	\N	124	30378	\N
40926	El Progreso		\N	\N	124	30378	\N
40927	La Ceiba		\N	\N	124	30378	\N
40928	Tres de Febrero		\N	\N	124	30378	\N
40929	El Dividive		\N	\N	124	30379	\N
40930	Agua Santa		\N	\N	124	30379	\N
40931	Agua Caliente		\N	\N	124	30379	\N
40932	El Cenizo		\N	\N	124	30379	\N
40933	Valerita		\N	\N	124	30379	\N
40934	Monte Carmelo		\N	\N	124	30380	\N
40935	Buena Vista		\N	\N	124	30380	\N
40936	Santa María del Horcón		\N	\N	124	30380	\N
40937	Motatán		\N	\N	124	30381	\N
40938	El Baño		\N	\N	124	30381	\N
40939	Jalisco		\N	\N	124	30381	\N
40940	Pampán		\N	\N	124	30382	\N
40941	Flor de Patria		\N	\N	124	30382	\N
40942	La Paz		\N	\N	124	30382	\N
40943	Santa Ana		\N	\N	124	30382	\N
40944	Pampanito		\N	\N	124	30383	\N
40945	La Concepción		\N	\N	124	30383	\N
40946	Pampanito II		\N	\N	124	30383	\N
40947	Betijoque		\N	\N	124	30384	\N
40948	José Gregorio Hernández		\N	\N	124	30384	\N
40949	La Pueblita		\N	\N	124	30384	\N
40950	Los Cedros		\N	\N	124	30384	\N
40951	Carvajal		\N	\N	124	30385	\N
40952	Campo Alegre		\N	\N	124	30385	\N
40953	Antonio Nicolás Briceño		\N	\N	124	30385	\N
40954	José Leonardo Suárez		\N	\N	124	30385	\N
40955	Sabana de Mendoza		\N	\N	124	30386	\N
40956	Junín		\N	\N	124	30386	\N
40957	Valmore Rodríguez		\N	\N	124	30386	\N
40958	El Paraíso		\N	\N	124	30386	\N
40959	Andrés Linares		\N	\N	124	30387	\N
40960	Chiquinquirá		\N	\N	124	30387	\N
40961	Cristóbal Mendoza		\N	\N	124	30387	\N
40962	Cruz Carrillo		\N	\N	124	30387	\N
40963	Matriz		\N	\N	124	30387	\N
40964	Monseñor Carrillo		\N	\N	124	30387	\N
40965	Tres Esquinas		\N	\N	124	30387	\N
40966	Cabimbú		\N	\N	124	30388	\N
40967	Jajó		\N	\N	124	30388	\N
40968	La Mesa de Esnujaque		\N	\N	124	30388	\N
40969	Santiago		\N	\N	124	30388	\N
40970	Tuñame		\N	\N	124	30388	\N
40971	La Quebrada		\N	\N	124	30388	\N
40972	Juan Ignacio Montilla		\N	\N	124	30389	\N
40973	La Beatriz		\N	\N	124	30389	\N
40974	La Puerta		\N	\N	124	30389	\N
40975	Mendoza del Valle de Momboy		\N	\N	124	30389	\N
40976	Mercedes Díaz		\N	\N	124	30389	\N
40977	San Luis		\N	\N	124	30389	\N
40978	Caraballeda		\N	\N	124	30390	\N
40979	Carayaca		\N	\N	124	30390	\N
40980	Carlos Soublette		\N	\N	124	30390	\N
40981	Caruao Chuspa		\N	\N	124	30390	\N
40982	Catia La Mar		\N	\N	124	30390	\N
40983	El Junko		\N	\N	124	30390	\N
40984	La Guaira		\N	\N	124	30390	\N
40985	Macuto		\N	\N	124	30390	\N
40986	Maiquetía		\N	\N	124	30390	\N
40987	Naiguatá		\N	\N	124	30390	\N
40988	Urimare		\N	\N	124	30390	\N
40989	Arístides Bastidas		\N	\N	124	30391	\N
40990	Bolívar		\N	\N	124	30392	\N
40991	Chivacoa		\N	\N	124	30407	\N
40992	Campo Elías		\N	\N	124	30407	\N
40993	Cocorote		\N	\N	124	30408	\N
40994	Independencia		\N	\N	124	30409	\N
40995	José Antonio Páez		\N	\N	124	30410	\N
40996	La Trinidad		\N	\N	124	30411	\N
40997	Manuel Monge		\N	\N	124	30412	\N
40998	Salóm		\N	\N	124	30413	\N
40999	Temerla		\N	\N	124	30413	\N
41000	Nirgua		\N	\N	124	30413	\N
41001	San Andrés		\N	\N	124	30414	\N
41002	Yaritagua		\N	\N	124	30414	\N
41003	San Javier		\N	\N	124	30415	\N
41004	Albarico		\N	\N	124	30415	\N
41005	San Felipe		\N	\N	124	30415	\N
41006	Sucre		\N	\N	124	30416	\N
41007	Urachiche		\N	\N	124	30417	\N
41008	El Guayabo		\N	\N	124	30418	\N
41009	Farriar		\N	\N	124	30418	\N
41010	Isla de Toas		\N	\N	124	30441	\N
41011	Monagas		\N	\N	124	30441	\N
41012	San Timoteo		\N	\N	124	30442	\N
41013	General Urdaneta		\N	\N	124	30442	\N
41014	Libertador		\N	\N	124	30442	\N
41015	Marcelino Briceño		\N	\N	124	30442	\N
41016	Pueblo Nuevo		\N	\N	124	30442	\N
41017	Manuel Guanipa Matos		\N	\N	124	30442	\N
41018	Ambrosio		\N	\N	124	30443	\N
41019	Carmen Herrera		\N	\N	124	30443	\N
41020	La Rosa		\N	\N	124	30443	\N
41021	Germán Ríos Linares		\N	\N	124	30443	\N
41022	San Benito		\N	\N	124	30443	\N
41023	Rómulo Betancourt		\N	\N	124	30443	\N
41024	Jorge Hernández		\N	\N	124	30443	\N
41025	Punta Gorda		\N	\N	124	30443	\N
41026	Arístides Calvani		\N	\N	124	30443	\N
41027	Encontrados		\N	\N	124	30444	\N
41028	Udón Pérez		\N	\N	124	30444	\N
41029	Moralito		\N	\N	124	30445	\N
41030	San Carlos del Zulia		\N	\N	124	30445	\N
41031	Santa Cruz del Zulia		\N	\N	124	30445	\N
41032	Santa Bárbara		\N	\N	124	30445	\N
41033	Urribarrí		\N	\N	124	30445	\N
41034	Carlos Quevedo		\N	\N	124	30446	\N
41035	Francisco Javier Pulgar		\N	\N	124	30446	\N
41036	Simón Rodríguez		\N	\N	124	30446	\N
41037	Guamo-Gavilanes		\N	\N	124	30446	\N
41038	La Concepción		\N	\N	124	30448	\N
41039	San José		\N	\N	124	30448	\N
41040	Mariano Parra León		\N	\N	124	30448	\N
41041	José Ramón Yépez		\N	\N	124	30448	\N
41042	Jesús María Semprún		\N	\N	124	30449	\N
41043	Barí		\N	\N	124	30449	\N
41044	Concepción		\N	\N	124	30450	\N
41045	Andrés Bello		\N	\N	124	30450	\N
41046	Chiquinquirá		\N	\N	124	30450	\N
41047	El Carmelo		\N	\N	124	30450	\N
41048	Potreritos		\N	\N	124	30450	\N
41049	Libertad		\N	\N	124	30451	\N
41050	Alonso de Ojeda		\N	\N	124	30451	\N
41051	Venezuela		\N	\N	124	30451	\N
41052	Eleazar López Contreras		\N	\N	124	30451	\N
41053	Campo Lara		\N	\N	124	30451	\N
41054	Bartolomé de las Casas		\N	\N	124	30452	\N
41055	Libertad		\N	\N	124	30452	\N
41056	Río Negro		\N	\N	124	30452	\N
41057	San José de Perijá		\N	\N	124	30452	\N
41058	San Rafael		\N	\N	124	30453	\N
41059	La Sierrita		\N	\N	124	30453	\N
41060	Las Parcelas		\N	\N	124	30453	\N
41061	Luis de Vicente		\N	\N	124	30453	\N
41062	Monseñor Marcos Sergio Godoy		\N	\N	124	30453	\N
41063	Ricaurte		\N	\N	124	30453	\N
41064	Tamare		\N	\N	124	30453	\N
41065	Antonio Borjas Romero		\N	\N	124	30454	\N
41066	Bolívar		\N	\N	124	30454	\N
41067	Cacique Mara		\N	\N	124	30454	\N
41068	Carracciolo Parra Pérez		\N	\N	124	30454	\N
41069	Cecilio Acosta		\N	\N	124	30454	\N
41070	Cristo de Aranza		\N	\N	124	30454	\N
41071	Coquivacoa		\N	\N	124	30454	\N
41072	Chiquinquirá		\N	\N	124	30454	\N
41073	Francisco Eugenio Bustamante		\N	\N	124	30454	\N
41074	Idelfonzo Vásquez		\N	\N	124	30454	\N
41075	Juana de Ávila		\N	\N	124	30454	\N
41076	Luis Hurtado Higuera		\N	\N	124	30454	\N
41077	Manuel Dagnino		\N	\N	124	30454	\N
41078	Olegario Villalobos		\N	\N	124	30454	\N
41079	Raúl Leoni		\N	\N	124	30454	\N
41080	Santa Lucía		\N	\N	124	30454	\N
41081	Venancio Pulgar		\N	\N	124	30454	\N
41082	San Isidro		\N	\N	124	30454	\N
41083	Altagracia		\N	\N	124	30455	\N
41084	Faría		\N	\N	124	30455	\N
41085	Ana María Campos		\N	\N	124	30455	\N
41086	San Antonio		\N	\N	124	30455	\N
41087	San José		\N	\N	124	30455	\N
41088	Donaldo García		\N	\N	124	30456	\N
41089	El Rosario		\N	\N	124	30456	\N
41090	Sixto Zambrano		\N	\N	124	30456	\N
41091	San Francisco		\N	\N	124	30457	\N
41092	El Bajo		\N	\N	124	30457	\N
41093	Domitila Flores		\N	\N	124	30457	\N
41094	Francisco Ochoa		\N	\N	124	30457	\N
41095	Los Cortijos		\N	\N	124	30457	\N
41096	Marcial Hernández		\N	\N	124	30457	\N
41097	Santa Rita		\N	\N	124	30458	\N
41098	El Mene		\N	\N	124	30458	\N
41099	Pedro Lucas Urribarrí		\N	\N	124	30458	\N
41100	José Cenobio Urribarrí		\N	\N	124	30458	\N
41101	Rafael Maria Baralt		\N	\N	124	30459	\N
41102	Manuel Manrique		\N	\N	124	30459	\N
41103	Rafael Urdaneta		\N	\N	124	30459	\N
41104	Bobures		\N	\N	124	30460	\N
41105	Gibraltar		\N	\N	124	30460	\N
41106	Heras		\N	\N	124	30460	\N
41107	Monseñor Arturo Álvarez		\N	\N	124	30460	\N
41108	Rómulo Gallegos		\N	\N	124	30460	\N
41109	El Batey		\N	\N	124	30460	\N
41110	Rafael Urdaneta		\N	\N	124	30461	\N
41111	La Victoria		\N	\N	124	30461	\N
41112	Raúl Cuenca		\N	\N	124	30461	\N
41113	Sinamaica		\N	\N	124	30447	\N
41114	Alta Guajira		\N	\N	124	30447	\N
41115	Elías Sánchez Rubio		\N	\N	124	30447	\N
41116	Guajira		\N	\N	124	30447	\N
41117	Altagracia		\N	\N	124	30462	\N
41118	Antímano		\N	\N	124	30462	\N
41119	Caricuao		\N	\N	124	30462	\N
41120	Catedral		\N	\N	124	30462	\N
41121	Coche		\N	\N	124	30462	\N
41122	El Junquito		\N	\N	124	30462	\N
41123	El Paraíso		\N	\N	124	30462	\N
41124	El Recreo		\N	\N	124	30462	\N
41125	El Valle		\N	\N	124	30462	\N
41126	La Candelaria		\N	\N	124	30462	\N
41127	La Pastora		\N	\N	124	30462	\N
41128	La Vega		\N	\N	124	30462	\N
41129	Macarao		\N	\N	124	30462	\N
41130	San Agustín		\N	\N	124	30462	\N
41131	San Bernardino		\N	\N	124	30462	\N
41132	San José		\N	\N	124	30462	\N
41133	San Juan		\N	\N	124	30462	\N
41134	San Pedro		\N	\N	124	30462	\N
41135	Santa Rosalía		\N	\N	124	30462	\N
41136	Santa Teresa		\N	\N	124	30462	\N
41137	Sucre (Catia)		\N	\N	124	30462	\N
100003	faImage	x	\N	0	27	\N	\N
100005	faMap	s	\N	\N	27	\N	100005
99	aaafaUserSecret		\N	\N	27	\N	99
101	aaafaVenus		\N	\N	27	\N	101
102	aaafaComputer		\N	\N	27	\N	102
100007	CCNA 1	ccna1	\N	0	5	100006	\N
100008	CCNA 2	ccna2	\N	0	5	100006	\N
100010	CCNA 4	ccna3	\N	0	5	100006	\N
8000	fa0		\N	\N	27	\N	8000
8001	fa1		\N	\N	27	\N	8001
8002	fa2		\N	\N	27	\N	8002
8003	fa3		\N	\N	27	\N	8003
8004	fa4		\N	\N	27	\N	8004
8005	fa5		\N	\N	27	\N	8005
8006	fa6		\N	\N	27	\N	8006
8007	fa7		\N	\N	27	\N	8007
8008	fa8		\N	\N	27	\N	8008
8009	fa9		\N	\N	27	\N	8009
8010	fa42Group		\N	\N	27	\N	8010
8011	fa500px		\N	\N	27	\N	8011
8012	faA		\N	\N	27	\N	8012
8013	faAccessibleIcon		\N	\N	27	\N	8013
8014	faAccusoft		\N	\N	27	\N	8014
8015	faAddressBook		\N	\N	27	\N	8015
8016	faAddressCard		\N	\N	27	\N	8016
8017	faAdn		\N	\N	27	\N	8017
8018	faAdversal		\N	\N	27	\N	8018
8019	faAffiliatetheme		\N	\N	27	\N	8019
8021	faAlgolia		\N	\N	27	\N	8021
8022	faAlignCenter		\N	\N	27	\N	8022
8023	faAlignJustify		\N	\N	27	\N	8023
8024	faAlignLeft		\N	\N	27	\N	8024
8025	faAlignRight		\N	\N	27	\N	8025
8026	faAlipay		\N	\N	27	\N	8026
8027	faAmazon		\N	\N	27	\N	8027
8028	faAmazonPay		\N	\N	27	\N	8028
8029	faAmilia		\N	\N	27	\N	8029
8030	faAnchor		\N	\N	27	\N	8030
8031	faAnchorCircleCheck		\N	\N	27	\N	8031
8032	faAnchorCircleExclamation		\N	\N	27	\N	8032
8033	faAnchorCircleXmark		\N	\N	27	\N	8033
8034	faAnchorLock		\N	\N	27	\N	8034
8035	faAndroid		\N	\N	27	\N	8035
8036	faAngellist		\N	\N	27	\N	8036
8037	faAngleDown		\N	\N	27	\N	8037
8038	faAngleLeft		\N	\N	27	\N	8038
8039	faAngleRight		\N	\N	27	\N	8039
8040	faAngleUp		\N	\N	27	\N	8040
8041	faAnglesDown		\N	\N	27	\N	8041
8042	faAnglesLeft		\N	\N	27	\N	8042
8043	faAnglesRight		\N	\N	27	\N	8043
8044	faAnglesUp		\N	\N	27	\N	8044
8045	faAngrycreative		\N	\N	27	\N	8045
8046	faAngular		\N	\N	27	\N	8046
8047	faAnkh		\N	\N	27	\N	8047
8048	faAppStore		\N	\N	27	\N	8048
8049	faAppStoreIos		\N	\N	27	\N	8049
8050	faApper		\N	\N	27	\N	8050
8051	faApple		\N	\N	27	\N	8051
8052	faApplePay		\N	\N	27	\N	8052
8053	faAppleWhole		\N	\N	27	\N	8053
8054	faArchway		\N	\N	27	\N	8054
8055	faArrowDown		\N	\N	27	\N	8055
8056	faArrowDown19		\N	\N	27	\N	8056
8057	faArrowDown91		\N	\N	27	\N	8057
8058	faArrowDownAZ		\N	\N	27	\N	8058
8059	faArrowDownLong		\N	\N	27	\N	8059
8060	faArrowDownShortWide		\N	\N	27	\N	8060
8061	faArrowDownUpAcrossLine		\N	\N	27	\N	8061
8062	faArrowDownUpLock		\N	\N	27	\N	8062
8063	faArrowDownWideShort		\N	\N	27	\N	8063
8064	faArrowDownZA		\N	\N	27	\N	8064
8020	faAirbnb		\N	\N	27	\N	8020
41138	23 de enero		\N	\N	124	30462	100004
100018	Isaac	xd	\N	0	5	\N	\N
100020	sexo	anal	\N	0	110	\N	\N
8083	faArrowUpAZ		\N	\N	27	\N	8083
8084	faArrowUpFromBracket		\N	\N	27	\N	8084
8085	faArrowUpFromGroundWater		\N	\N	27	\N	8085
8086	faArrowUpFromWaterPump		\N	\N	27	\N	8086
8087	faArrowUpLong		\N	\N	27	\N	8087
8088	faArrowUpRightDots		\N	\N	27	\N	8088
8089	faArrowUpRightFromSquare		\N	\N	27	\N	8089
8090	faArrowUpShortWide		\N	\N	27	\N	8090
8091	faArrowUpWideShort		\N	\N	27	\N	8091
8092	faArrowUpZA		\N	\N	27	\N	8092
8093	faArrowsDownToLine		\N	\N	27	\N	8093
8094	faArrowsDownToPeople		\N	\N	27	\N	8094
8095	faArrowsLeftRight		\N	\N	27	\N	8095
8096	faArrowsLeftRightToLine		\N	\N	27	\N	8096
8097	faArrowsRotate		\N	\N	27	\N	8097
8098	faArrowsSpin		\N	\N	27	\N	8098
8099	faArrowsSplitUpAndLeft		\N	\N	27	\N	8099
8100	faArrowsToCircle		\N	\N	27	\N	8100
8101	faArrowsToDot		\N	\N	27	\N	8101
8102	faArrowsToEye		\N	\N	27	\N	8102
8103	faArrowsTurnRight		\N	\N	27	\N	8103
8104	faArrowsTurnToDots		\N	\N	27	\N	8104
8105	faArrowsUpDown		\N	\N	27	\N	8105
8106	faArrowsUpDownLeftRight		\N	\N	27	\N	8106
8107	faArrowsUpToLine		\N	\N	27	\N	8107
8108	faArtstation		\N	\N	27	\N	8108
8109	faAsterisk		\N	\N	27	\N	8109
8110	faAsymmetrik		\N	\N	27	\N	8110
8111	faAt		\N	\N	27	\N	8111
8112	faAtlassian		\N	\N	27	\N	8112
8113	faAtom		\N	\N	27	\N	8113
8114	faAudible		\N	\N	27	\N	8114
8115	faAudioDescription		\N	\N	27	\N	8115
8116	faAustralSign		\N	\N	27	\N	8116
8117	faAutoprefixer		\N	\N	27	\N	8117
8118	faAvianex		\N	\N	27	\N	8118
8119	faAviato		\N	\N	27	\N	8119
8120	faAward		\N	\N	27	\N	8120
8121	faAws		\N	\N	27	\N	8121
8122	faB		\N	\N	27	\N	8122
8123	faBaby		\N	\N	27	\N	8123
8124	faBabyCarriage		\N	\N	27	\N	8124
8125	faBackward		\N	\N	27	\N	8125
8126	faBackwardFast		\N	\N	27	\N	8126
8127	faBackwardStep		\N	\N	27	\N	8127
8128	faBacon		\N	\N	27	\N	8128
8129	faBacteria		\N	\N	27	\N	8129
8130	faBacterium		\N	\N	27	\N	8130
8131	faBagShopping		\N	\N	27	\N	8131
8132	faBahai		\N	\N	27	\N	8132
8133	faBahtSign		\N	\N	27	\N	8133
8134	faBan		\N	\N	27	\N	8134
8135	faBanSmoking		\N	\N	27	\N	8135
8136	faBandage		\N	\N	27	\N	8136
8137	faBandcamp		\N	\N	27	\N	8137
8138	faBangladeshiTakaSign		\N	\N	27	\N	8138
8139	faBarcode		\N	\N	27	\N	8139
8140	faBars		\N	\N	27	\N	8140
8141	faBarsProgress		\N	\N	27	\N	8141
8142	faBarsStaggered		\N	\N	27	\N	8142
8143	faBaseball		\N	\N	27	\N	8143
8144	faBaseballBatBall		\N	\N	27	\N	8144
8145	faBasketShopping		\N	\N	27	\N	8145
8146	faBasketball		\N	\N	27	\N	8146
8147	faBath		\N	\N	27	\N	8147
8148	faBatteryEmpty		\N	\N	27	\N	8148
8149	faBatteryFull		\N	\N	27	\N	8149
8150	faBatteryHalf		\N	\N	27	\N	8150
8151	faBatteryQuarter		\N	\N	27	\N	8151
8152	faBatteryThreeQuarters		\N	\N	27	\N	8152
8153	faBattleNet		\N	\N	27	\N	8153
8154	faBed		\N	\N	27	\N	8154
8155	faBedPulse		\N	\N	27	\N	8155
8156	faBeerMugEmpty		\N	\N	27	\N	8156
8157	faBehance		\N	\N	27	\N	8157
8158	faBell		\N	\N	27	\N	8158
8159	faBellConcierge		\N	\N	27	\N	8159
8160	faBellSlash		\N	\N	27	\N	8160
8161	faBezierCurve		\N	\N	27	\N	8161
8162	faBicycle		\N	\N	27	\N	8162
8163	faBilibili		\N	\N	27	\N	8163
8164	faBimobject		\N	\N	27	\N	8164
8165	faBinoculars		\N	\N	27	\N	8165
8166	faBiohazard		\N	\N	27	\N	8166
8167	faBitbucket		\N	\N	27	\N	8167
8168	faBitcoin		\N	\N	27	\N	8168
8169	faBitcoinSign		\N	\N	27	\N	8169
8170	faBity		\N	\N	27	\N	8170
8171	faBlackTie		\N	\N	27	\N	8171
8172	faBlackberry		\N	\N	27	\N	8172
8173	faBlender		\N	\N	27	\N	8173
8174	faBlenderPhone		\N	\N	27	\N	8174
8175	faBlog		\N	\N	27	\N	8175
8176	faBlogger		\N	\N	27	\N	8176
8177	faBloggerB		\N	\N	27	\N	8177
8178	faBluesky		\N	\N	27	\N	8178
8179	faBluetooth		\N	\N	27	\N	8179
8180	faBluetoothB		\N	\N	27	\N	8180
8181	faBold		\N	\N	27	\N	8181
8182	faBolt		\N	\N	27	\N	8182
8183	faBoltLightning		\N	\N	27	\N	8183
8184	faBomb		\N	\N	27	\N	8184
8185	faBone		\N	\N	27	\N	8185
8186	faBong		\N	\N	27	\N	8186
8187	faBook		\N	\N	27	\N	8187
8188	faBookAtlas		\N	\N	27	\N	8188
8189	faBookBible		\N	\N	27	\N	8189
8190	faBookBookmark		\N	\N	27	\N	8190
8191	faBookJournalWhills		\N	\N	27	\N	8191
8192	faBookMedical		\N	\N	27	\N	8192
8193	faBookOpen		\N	\N	27	\N	8193
8194	faBookOpenReader		\N	\N	27	\N	8194
8195	faBookQuran		\N	\N	27	\N	8195
8196	faBookSkull		\N	\N	27	\N	8196
8197	faBookTanakh		\N	\N	27	\N	8197
8198	faBookmark		\N	\N	27	\N	8198
8199	faBootstrap		\N	\N	27	\N	8199
8200	faBorderAll		\N	\N	27	\N	8200
8201	faBorderNone		\N	\N	27	\N	8201
8202	faBorderTopLeft		\N	\N	27	\N	8202
8203	faBoreHole		\N	\N	27	\N	8203
8204	faBots		\N	\N	27	\N	8204
8205	faBottleDroplet		\N	\N	27	\N	8205
8206	faBottleWater		\N	\N	27	\N	8206
8207	faBowlFood		\N	\N	27	\N	8207
8208	faBowlRice		\N	\N	27	\N	8208
8209	faBowlingBall		\N	\N	27	\N	8209
8210	faBox		\N	\N	27	\N	8210
8211	faBoxArchive		\N	\N	27	\N	8211
8212	faBoxOpen		\N	\N	27	\N	8212
8213	faBoxTissue		\N	\N	27	\N	8213
8214	faBoxesPacking		\N	\N	27	\N	8214
8215	faBoxesStacked		\N	\N	27	\N	8215
8216	faBraille		\N	\N	27	\N	8216
8217	faBrain		\N	\N	27	\N	8217
8218	faBrave		\N	\N	27	\N	8218
8219	faBraveReverse		\N	\N	27	\N	8219
8220	faBrazilianRealSign		\N	\N	27	\N	8220
8221	faBreadSlice		\N	\N	27	\N	8221
8222	faBridge		\N	\N	27	\N	8222
8223	faBridgeCircleCheck		\N	\N	27	\N	8223
8224	faBridgeCircleExclamation		\N	\N	27	\N	8224
8225	faBridgeCircleXmark		\N	\N	27	\N	8225
8226	faBridgeLock		\N	\N	27	\N	8226
8227	faBridgeWater		\N	\N	27	\N	8227
8228	faBriefcase		\N	\N	27	\N	8228
8229	faBriefcaseMedical		\N	\N	27	\N	8229
8230	faBroom		\N	\N	27	\N	8230
8231	faBroomBall		\N	\N	27	\N	8231
8232	faBrush		\N	\N	27	\N	8232
8233	faBtc		\N	\N	27	\N	8233
8234	faBucket		\N	\N	27	\N	8234
8235	faBuffer		\N	\N	27	\N	8235
8236	faBug		\N	\N	27	\N	8236
8237	faBugSlash		\N	\N	27	\N	8237
8238	faBugs		\N	\N	27	\N	8238
8239	faBuilding		\N	\N	27	\N	8239
8240	faBuildingCircleArrowRight		\N	\N	27	\N	8240
8241	faBuildingCircleCheck		\N	\N	27	\N	8241
8242	faBuildingCircleExclamation		\N	\N	27	\N	8242
8243	faBuildingCircleXmark		\N	\N	27	\N	8243
8244	faBuildingColumns		\N	\N	27	\N	8244
8245	faBuildingFlag		\N	\N	27	\N	8245
8246	faBuildingLock		\N	\N	27	\N	8246
8247	faBuildingNgo		\N	\N	27	\N	8247
8248	faBuildingShield		\N	\N	27	\N	8248
8249	faBuildingUn		\N	\N	27	\N	8249
8250	faBuildingUser		\N	\N	27	\N	8250
8251	faBuildingWheat		\N	\N	27	\N	8251
8252	faBullhorn		\N	\N	27	\N	8252
8253	faBullseye		\N	\N	27	\N	8253
8254	faBurger		\N	\N	27	\N	8254
8255	faBuromobelexperte		\N	\N	27	\N	8255
8256	faBurst		\N	\N	27	\N	8256
8257	faBus		\N	\N	27	\N	8257
8258	faBusSimple		\N	\N	27	\N	8258
8259	faBusinessTime		\N	\N	27	\N	8259
8260	faBuyNLarge		\N	\N	27	\N	8260
8261	faBuysellads		\N	\N	27	\N	8261
8262	faC		\N	\N	27	\N	8262
8263	faCableCar		\N	\N	27	\N	8263
8264	faCakeCandles		\N	\N	27	\N	8264
8265	faCalculator		\N	\N	27	\N	8265
8266	faCalendar		\N	\N	27	\N	8266
8267	faCalendarCheck		\N	\N	27	\N	8267
8268	faCalendarDay		\N	\N	27	\N	8268
8269	faCalendarDays		\N	\N	27	\N	8269
8270	faCalendarMinus		\N	\N	27	\N	8270
8271	faCalendarPlus		\N	\N	27	\N	8271
8272	faCalendarWeek		\N	\N	27	\N	8272
8273	faCalendarXmark		\N	\N	27	\N	8273
8274	faCamera		\N	\N	27	\N	8274
8275	faCameraRetro		\N	\N	27	\N	8275
8276	faCameraRotate		\N	\N	27	\N	8276
8277	faCampground		\N	\N	27	\N	8277
8278	faCanadianMapleLeaf		\N	\N	27	\N	8278
8279	faCandyCane		\N	\N	27	\N	8279
8280	faCannabis		\N	\N	27	\N	8280
8281	faCapsules		\N	\N	27	\N	8281
8282	faCar		\N	\N	27	\N	8282
8283	faCarBattery		\N	\N	27	\N	8283
8284	faCarBurst		\N	\N	27	\N	8284
8285	faCarOn		\N	\N	27	\N	8285
8286	faCarRear		\N	\N	27	\N	8286
8287	faCarSide		\N	\N	27	\N	8287
8288	faCarTunnel		\N	\N	27	\N	8288
8289	faCaravan		\N	\N	27	\N	8289
8290	faCaretDown		\N	\N	27	\N	8290
8291	faCaretLeft		\N	\N	27	\N	8291
8292	faCaretRight		\N	\N	27	\N	8292
8293	faCaretUp		\N	\N	27	\N	8293
8294	faCarrot		\N	\N	27	\N	8294
8295	faCartArrowDown		\N	\N	27	\N	8295
8296	faCartFlatbed		\N	\N	27	\N	8296
8297	faCartFlatbedSuitcase		\N	\N	27	\N	8297
8298	faCartPlus		\N	\N	27	\N	8298
8299	faCartShopping		\N	\N	27	\N	8299
8300	faCashRegister		\N	\N	27	\N	8300
8301	faCat		\N	\N	27	\N	8301
8302	faCcAmazonPay		\N	\N	27	\N	8302
8303	faCcAmex		\N	\N	27	\N	8303
8304	faCcApplePay		\N	\N	27	\N	8304
8305	faCcDinersClub		\N	\N	27	\N	8305
8306	faCcDiscover		\N	\N	27	\N	8306
8307	faCcJcb		\N	\N	27	\N	8307
8308	faCcMastercard		\N	\N	27	\N	8308
8309	faCcPaypal		\N	\N	27	\N	8309
8310	faCcStripe		\N	\N	27	\N	8310
8311	faCcVisa		\N	\N	27	\N	8311
8312	faCediSign		\N	\N	27	\N	8312
8313	faCentSign		\N	\N	27	\N	8313
8314	faCentercode		\N	\N	27	\N	8314
8315	faCentos		\N	\N	27	\N	8315
8316	faCertificate		\N	\N	27	\N	8316
8317	faChair		\N	\N	27	\N	8317
8318	faChalkboard		\N	\N	27	\N	8318
8319	faChalkboardUser		\N	\N	27	\N	8319
8320	faChampagneGlasses		\N	\N	27	\N	8320
8321	faChargingStation		\N	\N	27	\N	8321
8322	faChartArea		\N	\N	27	\N	8322
8323	faChartBar		\N	\N	27	\N	8323
8324	faChartColumn		\N	\N	27	\N	8324
8325	faChartDiagram		\N	\N	27	\N	8325
8326	faChartGantt		\N	\N	27	\N	8326
8327	faChartLine		\N	\N	27	\N	8327
8328	faChartPie		\N	\N	27	\N	8328
8329	faChartSimple		\N	\N	27	\N	8329
8330	faCheck		\N	\N	27	\N	8330
8331	faCheckDouble		\N	\N	27	\N	8331
8332	faCheckToSlot		\N	\N	27	\N	8332
8333	faCheese		\N	\N	27	\N	8333
8334	faChess		\N	\N	27	\N	8334
8335	faChessBishop		\N	\N	27	\N	8335
8336	faChessBoard		\N	\N	27	\N	8336
8337	faChessKing		\N	\N	27	\N	8337
8338	faChessKnight		\N	\N	27	\N	8338
8339	faChessPawn		\N	\N	27	\N	8339
8340	faChessQueen		\N	\N	27	\N	8340
8341	faChessRook		\N	\N	27	\N	8341
8342	faChevronDown		\N	\N	27	\N	8342
8343	faChevronLeft		\N	\N	27	\N	8343
8344	faChevronRight		\N	\N	27	\N	8344
8345	faChevronUp		\N	\N	27	\N	8345
8346	faChild		\N	\N	27	\N	8346
8347	faChildCombatant		\N	\N	27	\N	8347
8348	faChildDress		\N	\N	27	\N	8348
8349	faChildReaching		\N	\N	27	\N	8349
8350	faChildren		\N	\N	27	\N	8350
8351	faChrome		\N	\N	27	\N	8351
8352	faChromecast		\N	\N	27	\N	8352
8353	faChurch		\N	\N	27	\N	8353
8354	faCircle		\N	\N	27	\N	8354
8355	faCircleArrowDown		\N	\N	27	\N	8355
8356	faCircleArrowLeft		\N	\N	27	\N	8356
8357	faCircleArrowRight		\N	\N	27	\N	8357
8358	faCircleArrowUp		\N	\N	27	\N	8358
8359	faCircleCheck		\N	\N	27	\N	8359
8360	faCircleChevronDown		\N	\N	27	\N	8360
8361	faCircleChevronLeft		\N	\N	27	\N	8361
8362	faCircleChevronRight		\N	\N	27	\N	8362
8363	faCircleChevronUp		\N	\N	27	\N	8363
8364	faCircleDollarToSlot		\N	\N	27	\N	8364
8365	faCircleDot		\N	\N	27	\N	8365
8366	faCircleDown		\N	\N	27	\N	8366
8367	faCircleExclamation		\N	\N	27	\N	8367
8368	faCircleH		\N	\N	27	\N	8368
8369	faCircleHalfStroke		\N	\N	27	\N	8369
8370	faCircleInfo		\N	\N	27	\N	8370
8371	faCircleLeft		\N	\N	27	\N	8371
8372	faCircleMinus		\N	\N	27	\N	8372
8373	faCircleNodes		\N	\N	27	\N	8373
8374	faCircleNotch		\N	\N	27	\N	8374
8375	faCirclePause		\N	\N	27	\N	8375
8376	faCirclePlay		\N	\N	27	\N	8376
8377	faCirclePlus		\N	\N	27	\N	8377
8378	faCircleQuestion		\N	\N	27	\N	8378
8379	faCircleRadiation		\N	\N	27	\N	8379
8380	faCircleRight		\N	\N	27	\N	8380
8381	faCircleStop		\N	\N	27	\N	8381
8382	faCircleUp		\N	\N	27	\N	8382
8383	faCircleUser		\N	\N	27	\N	8383
8384	faCircleXmark		\N	\N	27	\N	8384
8385	faCity		\N	\N	27	\N	8385
8386	faClapperboard		\N	\N	27	\N	8386
8387	faClipboard		\N	\N	27	\N	8387
8388	faClipboardCheck		\N	\N	27	\N	8388
8389	faClipboardList		\N	\N	27	\N	8389
8390	faClipboardQuestion		\N	\N	27	\N	8390
8391	faClipboardUser		\N	\N	27	\N	8391
8392	faClock		\N	\N	27	\N	8392
8393	faClockRotateLeft		\N	\N	27	\N	8393
8394	faClone		\N	\N	27	\N	8394
8395	faClosedCaptioning		\N	\N	27	\N	8395
8396	faCloud		\N	\N	27	\N	8396
8397	faCloudArrowDown		\N	\N	27	\N	8397
8398	faCloudArrowUp		\N	\N	27	\N	8398
8399	faCloudBolt		\N	\N	27	\N	8399
8400	faCloudMeatball		\N	\N	27	\N	8400
8401	faCloudMoon		\N	\N	27	\N	8401
8402	faCloudMoonRain		\N	\N	27	\N	8402
8403	faCloudRain		\N	\N	27	\N	8403
8404	faCloudShowersHeavy		\N	\N	27	\N	8404
8405	faCloudShowersWater		\N	\N	27	\N	8405
8406	faCloudSun		\N	\N	27	\N	8406
8407	faCloudSunRain		\N	\N	27	\N	8407
8408	faCloudflare		\N	\N	27	\N	8408
8409	faCloudscale		\N	\N	27	\N	8409
8410	faCloudsmith		\N	\N	27	\N	8410
8411	faCloudversify		\N	\N	27	\N	8411
8412	faClover		\N	\N	27	\N	8412
8413	faCmplid		\N	\N	27	\N	8413
8414	faCode		\N	\N	27	\N	8414
8415	faCodeBranch		\N	\N	27	\N	8415
8416	faCodeCommit		\N	\N	27	\N	8416
8417	faCodeCompare		\N	\N	27	\N	8417
8418	faCodeFork		\N	\N	27	\N	8418
8419	faCodeMerge		\N	\N	27	\N	8419
8420	faCodePullRequest		\N	\N	27	\N	8420
8421	faCodepen		\N	\N	27	\N	8421
8422	faCodiepie		\N	\N	27	\N	8422
8423	faCoins		\N	\N	27	\N	8423
8424	faColonSign		\N	\N	27	\N	8424
8425	faComment		\N	\N	27	\N	8425
8426	faCommentDollar		\N	\N	27	\N	8426
8427	faCommentDots		\N	\N	27	\N	8427
8428	faCommentMedical		\N	\N	27	\N	8428
8429	faCommentNodes		\N	\N	27	\N	8429
8430	faCommentSlash		\N	\N	27	\N	8430
8431	faCommentSms		\N	\N	27	\N	8431
8432	faComments		\N	\N	27	\N	8432
8433	faCommentsDollar		\N	\N	27	\N	8433
8434	faCompactDisc		\N	\N	27	\N	8434
8435	faCompass		\N	\N	27	\N	8435
8436	faCompassDrafting		\N	\N	27	\N	8436
8437	faCompress		\N	\N	27	\N	8437
8438	faComputer		\N	\N	27	\N	8438
8439	faComputerMouse		\N	\N	27	\N	8439
8440	faConfluence		\N	\N	27	\N	8440
8441	faConnectdevelop		\N	\N	27	\N	8441
8442	faContao		\N	\N	27	\N	8442
8443	faCookie		\N	\N	27	\N	8443
8444	faCookieBite		\N	\N	27	\N	8444
8445	faCopy		\N	\N	27	\N	8445
8446	faCopyright		\N	\N	27	\N	8446
8447	faCottonBureau		\N	\N	27	\N	8447
8448	faCouch		\N	\N	27	\N	8448
8449	faCow		\N	\N	27	\N	8449
8450	faCpanel		\N	\N	27	\N	8450
8451	faCreativeCommons		\N	\N	27	\N	8451
8452	faCreativeCommonsBy		\N	\N	27	\N	8452
8453	faCreativeCommonsNc		\N	\N	27	\N	8453
8454	faCreativeCommonsNcEu		\N	\N	27	\N	8454
8455	faCreativeCommonsNcJp		\N	\N	27	\N	8455
8456	faCreativeCommonsNd		\N	\N	27	\N	8456
8457	faCreativeCommonsPd		\N	\N	27	\N	8457
8458	faCreativeCommonsPdAlt		\N	\N	27	\N	8458
8459	faCreativeCommonsRemix		\N	\N	27	\N	8459
8460	faCreativeCommonsSa		\N	\N	27	\N	8460
8461	faCreativeCommonsSampling		\N	\N	27	\N	8461
8462	faCreativeCommonsSamplingPlus		\N	\N	27	\N	8462
8463	faCreativeCommonsShare		\N	\N	27	\N	8463
8464	faCreativeCommonsZero		\N	\N	27	\N	8464
8465	faCreditCard		\N	\N	27	\N	8465
8466	faCriticalRole		\N	\N	27	\N	8466
8467	faCrop		\N	\N	27	\N	8467
8468	faCropSimple		\N	\N	27	\N	8468
8469	faCross		\N	\N	27	\N	8469
8470	faCrosshairs		\N	\N	27	\N	8470
8471	faCrow		\N	\N	27	\N	8471
8472	faCrown		\N	\N	27	\N	8472
8473	faCrutch		\N	\N	27	\N	8473
8474	faCruzeiroSign		\N	\N	27	\N	8474
8475	faCss		\N	\N	27	\N	8475
8476	faCss3		\N	\N	27	\N	8476
8477	faCss3Alt		\N	\N	27	\N	8477
8478	faCube		\N	\N	27	\N	8478
8479	faCubes		\N	\N	27	\N	8479
8480	faCubesStacked		\N	\N	27	\N	8480
8481	faCuttlefish		\N	\N	27	\N	8481
8482	faD		\N	\N	27	\N	8482
8483	faDAndD		\N	\N	27	\N	8483
8484	faDAndDBeyond		\N	\N	27	\N	8484
8485	faDailymotion		\N	\N	27	\N	8485
8486	faDartLang		\N	\N	27	\N	8486
8487	faDashcube		\N	\N	27	\N	8487
8488	faDatabase		\N	\N	27	\N	8488
8489	faDebian		\N	\N	27	\N	8489
8490	faDeezer		\N	\N	27	\N	8490
8491	faDeleteLeft		\N	\N	27	\N	8491
8492	faDelicious		\N	\N	27	\N	8492
8493	faDemocrat		\N	\N	27	\N	8493
8494	faDeploydog		\N	\N	27	\N	8494
8495	faDeskpro		\N	\N	27	\N	8495
8496	faDesktop		\N	\N	27	\N	8496
8497	faDev		\N	\N	27	\N	8497
8498	faDeviantart		\N	\N	27	\N	8498
8499	faDharmachakra		\N	\N	27	\N	8499
8500	faDhl		\N	\N	27	\N	8500
8501	faDiagramNext		\N	\N	27	\N	8501
8502	faDiagramPredecessor		\N	\N	27	\N	8502
8503	faDiagramProject		\N	\N	27	\N	8503
8504	faDiagramSuccessor		\N	\N	27	\N	8504
8505	faDiamond		\N	\N	27	\N	8505
8506	faDiamondTurnRight		\N	\N	27	\N	8506
8507	faDiaspora		\N	\N	27	\N	8507
8508	faDice		\N	\N	27	\N	8508
8509	faDiceD20		\N	\N	27	\N	8509
8510	faDiceD6		\N	\N	27	\N	8510
8511	faDiceFive		\N	\N	27	\N	8511
8512	faDiceFour		\N	\N	27	\N	8512
8513	faDiceOne		\N	\N	27	\N	8513
8514	faDiceSix		\N	\N	27	\N	8514
8515	faDiceThree		\N	\N	27	\N	8515
8516	faDiceTwo		\N	\N	27	\N	8516
8517	faDigg		\N	\N	27	\N	8517
8518	faDigitalOcean		\N	\N	27	\N	8518
8519	faDiscord		\N	\N	27	\N	8519
8520	faDiscourse		\N	\N	27	\N	8520
8521	faDisease		\N	\N	27	\N	8521
8522	faDisplay		\N	\N	27	\N	8522
8523	faDivide		\N	\N	27	\N	8523
8524	faDna		\N	\N	27	\N	8524
8525	faDochub		\N	\N	27	\N	8525
8526	faDocker		\N	\N	27	\N	8526
8527	faDog		\N	\N	27	\N	8527
8528	faDollarSign		\N	\N	27	\N	8528
8529	faDolly		\N	\N	27	\N	8529
8530	faDongSign		\N	\N	27	\N	8530
8531	faDoorClosed		\N	\N	27	\N	8531
8532	faDoorOpen		\N	\N	27	\N	8532
8533	faDove		\N	\N	27	\N	8533
8534	faDownLeftAndUpRightToCenter		\N	\N	27	\N	8534
8535	faDownLong		\N	\N	27	\N	8535
8536	faDownload		\N	\N	27	\N	8536
8537	faDraft2digital		\N	\N	27	\N	8537
8538	faDragon		\N	\N	27	\N	8538
8539	faDrawPolygon		\N	\N	27	\N	8539
8540	faDribbble		\N	\N	27	\N	8540
8541	faDropbox		\N	\N	27	\N	8541
8542	faDroplet		\N	\N	27	\N	8542
8543	faDropletSlash		\N	\N	27	\N	8543
8544	faDrum		\N	\N	27	\N	8544
8545	faDrumSteelpan		\N	\N	27	\N	8545
8546	faDrumstickBite		\N	\N	27	\N	8546
8547	faDrupal		\N	\N	27	\N	8547
8548	faDumbbell		\N	\N	27	\N	8548
8549	faDumpster		\N	\N	27	\N	8549
8550	faDumpsterFire		\N	\N	27	\N	8550
8551	faDungeon		\N	\N	27	\N	8551
8552	faDyalog		\N	\N	27	\N	8552
8553	faE		\N	\N	27	\N	8553
8554	faEarDeaf		\N	\N	27	\N	8554
8555	faEarListen		\N	\N	27	\N	8555
8556	faEarlybirds		\N	\N	27	\N	8556
8557	faEarthAfrica		\N	\N	27	\N	8557
8558	faEarthAmericas		\N	\N	27	\N	8558
8559	faEarthAsia		\N	\N	27	\N	8559
8560	faEarthEurope		\N	\N	27	\N	8560
8561	faEarthOceania		\N	\N	27	\N	8561
8562	faEbay		\N	\N	27	\N	8562
8563	faEdge		\N	\N	27	\N	8563
8564	faEdgeLegacy		\N	\N	27	\N	8564
8565	faEgg		\N	\N	27	\N	8565
8566	faEject		\N	\N	27	\N	8566
8567	faElementor		\N	\N	27	\N	8567
8568	faElevator		\N	\N	27	\N	8568
8569	faEllipsis		\N	\N	27	\N	8569
8570	faEllipsisVertical		\N	\N	27	\N	8570
8571	faEllo		\N	\N	27	\N	8571
8572	faEmber		\N	\N	27	\N	8572
8573	faEmpire		\N	\N	27	\N	8573
8574	faEnvelope		\N	\N	27	\N	8574
8575	faEnvelopeCircleCheck		\N	\N	27	\N	8575
8576	faEnvelopeOpen		\N	\N	27	\N	8576
8577	faEnvelopeOpenText		\N	\N	27	\N	8577
8578	faEnvelopesBulk		\N	\N	27	\N	8578
8579	faEnvira		\N	\N	27	\N	8579
8580	faEquals		\N	\N	27	\N	8580
8581	faEraser		\N	\N	27	\N	8581
8582	faErlang		\N	\N	27	\N	8582
8583	faEthereum		\N	\N	27	\N	8583
8584	faEthernet		\N	\N	27	\N	8584
8585	faEtsy		\N	\N	27	\N	8585
8586	faEuroSign		\N	\N	27	\N	8586
8587	faEvernote		\N	\N	27	\N	8587
8588	faExclamation		\N	\N	27	\N	8588
8589	faExpand		\N	\N	27	\N	8589
8590	faExpeditedssl		\N	\N	27	\N	8590
8591	faExplosion		\N	\N	27	\N	8591
8592	faEye		\N	\N	27	\N	8592
8593	faEyeDropper		\N	\N	27	\N	8593
8594	faEyeLowVision		\N	\N	27	\N	8594
8595	faEyeSlash		\N	\N	27	\N	8595
8596	faF		\N	\N	27	\N	8596
8597	faFaceAngry		\N	\N	27	\N	8597
8598	faFaceDizzy		\N	\N	27	\N	8598
8599	faFaceFlushed		\N	\N	27	\N	8599
8600	faFaceFrown		\N	\N	27	\N	8600
8601	faFaceFrownOpen		\N	\N	27	\N	8601
8602	faFaceGrimace		\N	\N	27	\N	8602
8603	faFaceGrin		\N	\N	27	\N	8603
8604	faFaceGrinBeam		\N	\N	27	\N	8604
8605	faFaceGrinBeamSweat		\N	\N	27	\N	8605
8606	faFaceGrinHearts		\N	\N	27	\N	8606
8607	faFaceGrinSquint		\N	\N	27	\N	8607
8608	faFaceGrinSquintTears		\N	\N	27	\N	8608
8609	faFaceGrinStars		\N	\N	27	\N	8609
8610	faFaceGrinTears		\N	\N	27	\N	8610
8611	faFaceGrinTongue		\N	\N	27	\N	8611
8612	faFaceGrinTongueSquint		\N	\N	27	\N	8612
8613	faFaceGrinTongueWink		\N	\N	27	\N	8613
8614	faFaceGrinWide		\N	\N	27	\N	8614
8615	faFaceGrinWink		\N	\N	27	\N	8615
8616	faFaceKiss		\N	\N	27	\N	8616
8617	faFaceKissBeam		\N	\N	27	\N	8617
8618	faFaceKissWinkHeart		\N	\N	27	\N	8618
8619	faFaceLaugh		\N	\N	27	\N	8619
8620	faFaceLaughBeam		\N	\N	27	\N	8620
8621	faFaceLaughSquint		\N	\N	27	\N	8621
8622	faFaceLaughWink		\N	\N	27	\N	8622
8623	faFaceMeh		\N	\N	27	\N	8623
8624	faFaceMehBlank		\N	\N	27	\N	8624
8625	faFaceRollingEyes		\N	\N	27	\N	8625
8626	faFaceSadCry		\N	\N	27	\N	8626
8627	faFaceSadTear		\N	\N	27	\N	8627
8628	faFaceSmile		\N	\N	27	\N	8628
8629	faFaceSmileBeam		\N	\N	27	\N	8629
8630	faFaceSmileWink		\N	\N	27	\N	8630
8631	faFaceSurprise		\N	\N	27	\N	8631
8632	faFaceTired		\N	\N	27	\N	8632
8633	faFacebook		\N	\N	27	\N	8633
8745	faGear		\N	\N	27	\N	8745
8634	faFacebookF		\N	\N	27	\N	8634
8635	faFacebookMessenger		\N	\N	27	\N	8635
8636	faFan		\N	\N	27	\N	8636
8637	faFantasyFlightGames		\N	\N	27	\N	8637
8638	faFaucet		\N	\N	27	\N	8638
8639	faFaucetDrip		\N	\N	27	\N	8639
8640	faFax		\N	\N	27	\N	8640
8641	faFeather		\N	\N	27	\N	8641
8642	faFeatherPointed		\N	\N	27	\N	8642
8643	faFedex		\N	\N	27	\N	8643
8644	faFedora		\N	\N	27	\N	8644
8645	faFerry		\N	\N	27	\N	8645
8646	faFigma		\N	\N	27	\N	8646
8647	faFile		\N	\N	27	\N	8647
8648	faFileArrowDown		\N	\N	27	\N	8648
8649	faFileArrowUp		\N	\N	27	\N	8649
8650	faFileAudio		\N	\N	27	\N	8650
8651	faFileCircleCheck		\N	\N	27	\N	8651
8652	faFileCircleExclamation		\N	\N	27	\N	8652
8653	faFileCircleMinus		\N	\N	27	\N	8653
8654	faFileCirclePlus		\N	\N	27	\N	8654
8655	faFileCircleQuestion		\N	\N	27	\N	8655
8656	faFileCircleXmark		\N	\N	27	\N	8656
8657	faFileCode		\N	\N	27	\N	8657
8658	faFileContract		\N	\N	27	\N	8658
8659	faFileCsv		\N	\N	27	\N	8659
8660	faFileExcel		\N	\N	27	\N	8660
8661	faFileExport		\N	\N	27	\N	8661
8662	faFileFragment		\N	\N	27	\N	8662
8663	faFileHalfDashed		\N	\N	27	\N	8663
8664	faFileImage		\N	\N	27	\N	8664
8665	faFileImport		\N	\N	27	\N	8665
8666	faFileInvoice		\N	\N	27	\N	8666
8667	faFileInvoiceDollar		\N	\N	27	\N	8667
8668	faFileLines		\N	\N	27	\N	8668
8669	faFileMedical		\N	\N	27	\N	8669
8670	faFilePdf		\N	\N	27	\N	8670
8671	faFilePen		\N	\N	27	\N	8671
8672	faFilePowerpoint		\N	\N	27	\N	8672
8673	faFilePrescription		\N	\N	27	\N	8673
8674	faFileShield		\N	\N	27	\N	8674
8675	faFileSignature		\N	\N	27	\N	8675
8676	faFileVideo		\N	\N	27	\N	8676
8677	faFileWaveform		\N	\N	27	\N	8677
8678	faFileWord		\N	\N	27	\N	8678
8679	faFileZipper		\N	\N	27	\N	8679
8680	faFilesPinwheel		\N	\N	27	\N	8680
8681	faFill		\N	\N	27	\N	8681
8682	faFillDrip		\N	\N	27	\N	8682
8683	faFilm		\N	\N	27	\N	8683
8684	faFilter		\N	\N	27	\N	8684
8685	faFilterCircleDollar		\N	\N	27	\N	8685
8686	faFilterCircleXmark		\N	\N	27	\N	8686
8687	faFingerprint		\N	\N	27	\N	8687
8688	faFire		\N	\N	27	\N	8688
8689	faFireBurner		\N	\N	27	\N	8689
8690	faFireExtinguisher		\N	\N	27	\N	8690
8691	faFireFlameCurved		\N	\N	27	\N	8691
8692	faFireFlameSimple		\N	\N	27	\N	8692
8693	faFirefox		\N	\N	27	\N	8693
8694	faFirefoxBrowser		\N	\N	27	\N	8694
8695	faFirstOrder		\N	\N	27	\N	8695
8696	faFirstOrderAlt		\N	\N	27	\N	8696
8697	faFirstdraft		\N	\N	27	\N	8697
8698	faFish		\N	\N	27	\N	8698
8699	faFishFins		\N	\N	27	\N	8699
8700	faFlag		\N	\N	27	\N	8700
8701	faFlagCheckered		\N	\N	27	\N	8701
8702	faFlagUsa		\N	\N	27	\N	8702
8703	faFlask		\N	\N	27	\N	8703
8704	faFlaskVial		\N	\N	27	\N	8704
8705	faFlickr		\N	\N	27	\N	8705
8706	faFlipboard		\N	\N	27	\N	8706
8707	faFloppyDisk		\N	\N	27	\N	8707
8708	faFlorinSign		\N	\N	27	\N	8708
8709	faFlutter		\N	\N	27	\N	8709
8710	faFly		\N	\N	27	\N	8710
8711	faFolder		\N	\N	27	\N	8711
8712	faFolderClosed		\N	\N	27	\N	8712
8713	faFolderMinus		\N	\N	27	\N	8713
8714	faFolderOpen		\N	\N	27	\N	8714
8715	faFolderPlus		\N	\N	27	\N	8715
8716	faFolderTree		\N	\N	27	\N	8716
8717	faFont		\N	\N	27	\N	8717
8718	faFontAwesome		\N	\N	27	\N	8718
8719	faFonticons		\N	\N	27	\N	8719
8720	faFonticonsFi		\N	\N	27	\N	8720
8721	faFootball		\N	\N	27	\N	8721
8722	faFortAwesome		\N	\N	27	\N	8722
8723	faFortAwesomeAlt		\N	\N	27	\N	8723
8724	faForumbee		\N	\N	27	\N	8724
8725	faForward		\N	\N	27	\N	8725
8726	faForwardFast		\N	\N	27	\N	8726
8727	faForwardStep		\N	\N	27	\N	8727
8728	faFoursquare		\N	\N	27	\N	8728
8729	faFrancSign		\N	\N	27	\N	8729
8730	faFreeCodeCamp		\N	\N	27	\N	8730
8731	faFreebsd		\N	\N	27	\N	8731
8732	faFrog		\N	\N	27	\N	8732
8733	faFulcrum		\N	\N	27	\N	8733
8734	faFutbol		\N	\N	27	\N	8734
8735	faG		\N	\N	27	\N	8735
8736	faGalacticRepublic		\N	\N	27	\N	8736
8737	faGalacticSenate		\N	\N	27	\N	8737
8738	faGamepad		\N	\N	27	\N	8738
8739	faGasPump		\N	\N	27	\N	8739
8740	faGauge		\N	\N	27	\N	8740
8741	faGaugeHigh		\N	\N	27	\N	8741
8742	faGaugeSimple		\N	\N	27	\N	8742
8743	faGaugeSimpleHigh		\N	\N	27	\N	8743
8744	faGavel		\N	\N	27	\N	8744
8746	faGears		\N	\N	27	\N	8746
8747	faGem		\N	\N	27	\N	8747
8748	faGenderless		\N	\N	27	\N	8748
8749	faGetPocket		\N	\N	27	\N	8749
8750	faGg		\N	\N	27	\N	8750
8751	faGgCircle		\N	\N	27	\N	8751
8752	faGhost		\N	\N	27	\N	8752
8753	faGift		\N	\N	27	\N	8753
8754	faGifts		\N	\N	27	\N	8754
8755	faGit		\N	\N	27	\N	8755
8756	faGitAlt		\N	\N	27	\N	8756
8757	faGithub		\N	\N	27	\N	8757
8758	faGithubAlt		\N	\N	27	\N	8758
8759	faGitkraken		\N	\N	27	\N	8759
8760	faGitlab		\N	\N	27	\N	8760
8761	faGitter		\N	\N	27	\N	8761
8762	faGlassWater		\N	\N	27	\N	8762
8763	faGlassWaterDroplet		\N	\N	27	\N	8763
8764	faGlasses		\N	\N	27	\N	8764
8765	faGlide		\N	\N	27	\N	8765
8766	faGlideG		\N	\N	27	\N	8766
8767	faGlobe		\N	\N	27	\N	8767
8768	faGofore		\N	\N	27	\N	8768
8769	faGolang		\N	\N	27	\N	8769
8770	faGolfBallTee		\N	\N	27	\N	8770
8771	faGoodreads		\N	\N	27	\N	8771
8772	faGoodreadsG		\N	\N	27	\N	8772
8773	faGoogle		\N	\N	27	\N	8773
8774	faGoogleDrive		\N	\N	27	\N	8774
8775	faGooglePay		\N	\N	27	\N	8775
8776	faGooglePlay		\N	\N	27	\N	8776
8777	faGooglePlus		\N	\N	27	\N	8777
8778	faGooglePlusG		\N	\N	27	\N	8778
8779	faGoogleScholar		\N	\N	27	\N	8779
8780	faGoogleWallet		\N	\N	27	\N	8780
8781	faGopuram		\N	\N	27	\N	8781
8782	faGraduationCap		\N	\N	27	\N	8782
8783	faGratipay		\N	\N	27	\N	8783
8784	faGrav		\N	\N	27	\N	8784
8785	faGreaterThan		\N	\N	27	\N	8785
8786	faGreaterThanEqual		\N	\N	27	\N	8786
8787	faGrip		\N	\N	27	\N	8787
8788	faGripLines		\N	\N	27	\N	8788
8789	faGripLinesVertical		\N	\N	27	\N	8789
8790	faGripVertical		\N	\N	27	\N	8790
8791	faGripfire		\N	\N	27	\N	8791
8792	faGroupArrowsRotate		\N	\N	27	\N	8792
8793	faGrunt		\N	\N	27	\N	8793
8794	faGuaraniSign		\N	\N	27	\N	8794
8795	faGuilded		\N	\N	27	\N	8795
8796	faGuitar		\N	\N	27	\N	8796
8797	faGulp		\N	\N	27	\N	8797
8798	faGun		\N	\N	27	\N	8798
8799	faH		\N	\N	27	\N	8799
8800	faHackerNews		\N	\N	27	\N	8800
8801	faHackerrank		\N	\N	27	\N	8801
8802	faHammer		\N	\N	27	\N	8802
8803	faHamsa		\N	\N	27	\N	8803
8804	faHand		\N	\N	27	\N	8804
8805	faHandBackFist		\N	\N	27	\N	8805
8806	faHandDots		\N	\N	27	\N	8806
8807	faHandFist		\N	\N	27	\N	8807
8808	faHandHolding		\N	\N	27	\N	8808
8809	faHandHoldingDollar		\N	\N	27	\N	8809
8810	faHandHoldingDroplet		\N	\N	27	\N	8810
8811	faHandHoldingHand		\N	\N	27	\N	8811
8812	faHandHoldingHeart		\N	\N	27	\N	8812
8813	faHandHoldingMedical		\N	\N	27	\N	8813
8814	faHandLizard		\N	\N	27	\N	8814
8815	faHandMiddleFinger		\N	\N	27	\N	8815
8816	faHandPeace		\N	\N	27	\N	8816
8817	faHandPointDown		\N	\N	27	\N	8817
8818	faHandPointLeft		\N	\N	27	\N	8818
8819	faHandPointRight		\N	\N	27	\N	8819
8820	faHandPointUp		\N	\N	27	\N	8820
8821	faHandPointer		\N	\N	27	\N	8821
8822	faHandScissors		\N	\N	27	\N	8822
8823	faHandSparkles		\N	\N	27	\N	8823
8824	faHandSpock		\N	\N	27	\N	8824
8825	faHandcuffs		\N	\N	27	\N	8825
8826	faHands		\N	\N	27	\N	8826
8827	faHandsAslInterpreting		\N	\N	27	\N	8827
8828	faHandsBound		\N	\N	27	\N	8828
8829	faHandsBubbles		\N	\N	27	\N	8829
8830	faHandsClapping		\N	\N	27	\N	8830
8831	faHandsHolding		\N	\N	27	\N	8831
8832	faHandsHoldingChild		\N	\N	27	\N	8832
8833	faHandsHoldingCircle		\N	\N	27	\N	8833
8834	faHandsPraying		\N	\N	27	\N	8834
8835	faHandshake		\N	\N	27	\N	8835
8836	faHandshakeAngle		\N	\N	27	\N	8836
8837	faHandshakeSimple		\N	\N	27	\N	8837
8838	faHandshakeSimpleSlash		\N	\N	27	\N	8838
8839	faHandshakeSlash		\N	\N	27	\N	8839
8840	faHanukiah		\N	\N	27	\N	8840
8841	faHardDrive		\N	\N	27	\N	8841
8842	faHashnode		\N	\N	27	\N	8842
8843	faHashtag		\N	\N	27	\N	8843
8844	faHatCowboy		\N	\N	27	\N	8844
8845	faHatCowboySide		\N	\N	27	\N	8845
8846	faHatWizard		\N	\N	27	\N	8846
8847	faHeadSideCough		\N	\N	27	\N	8847
8848	faHeadSideCoughSlash		\N	\N	27	\N	8848
8849	faHeadSideMask		\N	\N	27	\N	8849
8850	faHeadSideVirus		\N	\N	27	\N	8850
8851	faHeading		\N	\N	27	\N	8851
8852	faHeadphones		\N	\N	27	\N	8852
8853	faHeadphonesSimple		\N	\N	27	\N	8853
8854	faHeadset		\N	\N	27	\N	8854
8855	faHeart		\N	\N	27	\N	8855
8856	faHeartCircleBolt		\N	\N	27	\N	8856
8857	faHeartCircleCheck		\N	\N	27	\N	8857
8858	faHeartCircleExclamation		\N	\N	27	\N	8858
8859	faHeartCircleMinus		\N	\N	27	\N	8859
8860	faHeartCirclePlus		\N	\N	27	\N	8860
8861	faHeartCircleXmark		\N	\N	27	\N	8861
8862	faHeartCrack		\N	\N	27	\N	8862
8863	faHeartPulse		\N	\N	27	\N	8863
8864	faHelicopter		\N	\N	27	\N	8864
8865	faHelicopterSymbol		\N	\N	27	\N	8865
8866	faHelmetSafety		\N	\N	27	\N	8866
8867	faHelmetUn		\N	\N	27	\N	8867
8868	faHexagonNodes		\N	\N	27	\N	8868
8869	faHexagonNodesBolt		\N	\N	27	\N	8869
8870	faHighlighter		\N	\N	27	\N	8870
8871	faHillAvalanche		\N	\N	27	\N	8871
8872	faHillRockslide		\N	\N	27	\N	8872
8873	faHippo		\N	\N	27	\N	8873
8874	faHips		\N	\N	27	\N	8874
8875	faHireAHelper		\N	\N	27	\N	8875
8876	faHive		\N	\N	27	\N	8876
8877	faHockeyPuck		\N	\N	27	\N	8877
8878	faHollyBerry		\N	\N	27	\N	8878
8879	faHooli		\N	\N	27	\N	8879
8880	faHornbill		\N	\N	27	\N	8880
8881	faHorse		\N	\N	27	\N	8881
8882	faHorseHead		\N	\N	27	\N	8882
8883	faHospital		\N	\N	27	\N	8883
8884	faHospitalUser		\N	\N	27	\N	8884
8885	faHotTubPerson		\N	\N	27	\N	8885
8886	faHotdog		\N	\N	27	\N	8886
8887	faHotel		\N	\N	27	\N	8887
8888	faHotjar		\N	\N	27	\N	8888
8889	faHourglass		\N	\N	27	\N	8889
8890	faHourglassEnd		\N	\N	27	\N	8890
8891	faHourglassHalf		\N	\N	27	\N	8891
8892	faHourglassStart		\N	\N	27	\N	8892
8893	faHouse		\N	\N	27	\N	8893
8894	faHouseChimney		\N	\N	27	\N	8894
8895	faHouseChimneyCrack		\N	\N	27	\N	8895
8896	faHouseChimneyMedical		\N	\N	27	\N	8896
8897	faHouseChimneyUser		\N	\N	27	\N	8897
8898	faHouseChimneyWindow		\N	\N	27	\N	8898
8899	faHouseCircleCheck		\N	\N	27	\N	8899
8900	faHouseCircleExclamation		\N	\N	27	\N	8900
8901	faHouseCircleXmark		\N	\N	27	\N	8901
8902	faHouseCrack		\N	\N	27	\N	8902
8903	faHouseFire		\N	\N	27	\N	8903
8904	faHouseFlag		\N	\N	27	\N	8904
8905	faHouseFloodWater		\N	\N	27	\N	8905
8906	faHouseFloodWaterCircleArrowRight		\N	\N	27	\N	8906
8907	faHouseLaptop		\N	\N	27	\N	8907
8908	faHouseLock		\N	\N	27	\N	8908
8909	faHouseMedical		\N	\N	27	\N	8909
8910	faHouseMedicalCircleCheck		\N	\N	27	\N	8910
8911	faHouseMedicalCircleExclamation		\N	\N	27	\N	8911
8912	faHouseMedicalCircleXmark		\N	\N	27	\N	8912
8913	faHouseMedicalFlag		\N	\N	27	\N	8913
8914	faHouseSignal		\N	\N	27	\N	8914
8915	faHouseTsunami		\N	\N	27	\N	8915
8916	faHouseUser		\N	\N	27	\N	8916
8917	faHouzz		\N	\N	27	\N	8917
8918	faHryvniaSign		\N	\N	27	\N	8918
8919	faHtml5		\N	\N	27	\N	8919
8920	faHubspot		\N	\N	27	\N	8920
8921	faHurricane		\N	\N	27	\N	8921
8922	faI		\N	\N	27	\N	8922
8923	faICursor		\N	\N	27	\N	8923
8924	faIceCream		\N	\N	27	\N	8924
8925	faIcicles		\N	\N	27	\N	8925
8926	faIcons		\N	\N	27	\N	8926
8927	faIdBadge		\N	\N	27	\N	8927
8928	faIdCard		\N	\N	27	\N	8928
8929	faIdCardClip		\N	\N	27	\N	8929
8930	faIdeal		\N	\N	27	\N	8930
8931	faIgloo		\N	\N	27	\N	8931
8932	faImage		\N	\N	27	\N	8932
8933	faImagePortrait		\N	\N	27	\N	8933
8934	faImages		\N	\N	27	\N	8934
8935	faImdb		\N	\N	27	\N	8935
8936	faInbox		\N	\N	27	\N	8936
8937	faIndent		\N	\N	27	\N	8937
8938	faIndianRupeeSign		\N	\N	27	\N	8938
8939	faIndustry		\N	\N	27	\N	8939
8940	faInfinity		\N	\N	27	\N	8940
8941	faInfo		\N	\N	27	\N	8941
8942	faInstagram		\N	\N	27	\N	8942
8943	faInstalod		\N	\N	27	\N	8943
8944	faIntercom		\N	\N	27	\N	8944
8945	faInternetExplorer		\N	\N	27	\N	8945
8946	faInvision		\N	\N	27	\N	8946
8947	faIoxhost		\N	\N	27	\N	8947
8948	faItalic		\N	\N	27	\N	8948
8949	faItchIo		\N	\N	27	\N	8949
8950	faItunes		\N	\N	27	\N	8950
8951	faItunesNote		\N	\N	27	\N	8951
8952	faJ		\N	\N	27	\N	8952
8953	faJar		\N	\N	27	\N	8953
8954	faJarWheat		\N	\N	27	\N	8954
8955	faJava		\N	\N	27	\N	8955
8956	faJedi		\N	\N	27	\N	8956
8957	faJediOrder		\N	\N	27	\N	8957
8958	faJenkins		\N	\N	27	\N	8958
8959	faJetFighter		\N	\N	27	\N	8959
8960	faJetFighterUp		\N	\N	27	\N	8960
8961	faJira		\N	\N	27	\N	8961
8962	faJoget		\N	\N	27	\N	8962
8963	faJoint		\N	\N	27	\N	8963
8964	faJoomla		\N	\N	27	\N	8964
8965	faJs		\N	\N	27	\N	8965
8966	faJsfiddle		\N	\N	27	\N	8966
8967	faJugDetergent		\N	\N	27	\N	8967
8968	faJxl		\N	\N	27	\N	8968
8969	faK		\N	\N	27	\N	8969
8970	faKaaba		\N	\N	27	\N	8970
8971	faKaggle		\N	\N	27	\N	8971
8972	faKey		\N	\N	27	\N	8972
8973	faKeybase		\N	\N	27	\N	8973
8974	faKeyboard		\N	\N	27	\N	8974
8975	faKeycdn		\N	\N	27	\N	8975
8976	faKhanda		\N	\N	27	\N	8976
8977	faKickstarter		\N	\N	27	\N	8977
8978	faKickstarterK		\N	\N	27	\N	8978
8979	faKipSign		\N	\N	27	\N	8979
8980	faKitMedical		\N	\N	27	\N	8980
8981	faKitchenSet		\N	\N	27	\N	8981
8982	faKiwiBird		\N	\N	27	\N	8982
8983	faKorvue		\N	\N	27	\N	8983
8984	faL		\N	\N	27	\N	8984
8985	faLandMineOn		\N	\N	27	\N	8985
8986	faLandmark		\N	\N	27	\N	8986
8987	faLandmarkDome		\N	\N	27	\N	8987
8988	faLandmarkFlag		\N	\N	27	\N	8988
8989	faLanguage		\N	\N	27	\N	8989
8990	faLaptop		\N	\N	27	\N	8990
8991	faLaptopCode		\N	\N	27	\N	8991
8992	faLaptopFile		\N	\N	27	\N	8992
8993	faLaptopMedical		\N	\N	27	\N	8993
8994	faLaravel		\N	\N	27	\N	8994
8995	faLariSign		\N	\N	27	\N	8995
8996	faLastfm		\N	\N	27	\N	8996
8997	faLayerGroup		\N	\N	27	\N	8997
8998	faLeaf		\N	\N	27	\N	8998
8999	faLeanpub		\N	\N	27	\N	8999
9000	faLeftLong		\N	\N	27	\N	9000
9001	faLeftRight		\N	\N	27	\N	9001
9002	faLemon		\N	\N	27	\N	9002
9003	faLess		\N	\N	27	\N	9003
9004	faLessThan		\N	\N	27	\N	9004
9005	faLessThanEqual		\N	\N	27	\N	9005
9006	faLetterboxd		\N	\N	27	\N	9006
9007	faLifeRing		\N	\N	27	\N	9007
9008	faLightbulb		\N	\N	27	\N	9008
9009	faLine		\N	\N	27	\N	9009
9010	faLinesLeaning		\N	\N	27	\N	9010
9011	faLink		\N	\N	27	\N	9011
9012	faLinkSlash		\N	\N	27	\N	9012
9013	faLinkedin		\N	\N	27	\N	9013
9014	faLinkedinIn		\N	\N	27	\N	9014
9015	faLinode		\N	\N	27	\N	9015
9016	faLinux		\N	\N	27	\N	9016
9017	faLiraSign		\N	\N	27	\N	9017
9018	faList		\N	\N	27	\N	9018
9019	faListCheck		\N	\N	27	\N	9019
9020	faListOl		\N	\N	27	\N	9020
9021	faListUl		\N	\N	27	\N	9021
9022	faLitecoinSign		\N	\N	27	\N	9022
9023	faLocationArrow		\N	\N	27	\N	9023
9024	faLocationCrosshairs		\N	\N	27	\N	9024
9025	faLocationDot		\N	\N	27	\N	9025
9026	faLocationPin		\N	\N	27	\N	9026
9027	faLocationPinLock		\N	\N	27	\N	9027
9028	faLock		\N	\N	27	\N	9028
9029	faLockOpen		\N	\N	27	\N	9029
9030	faLocust		\N	\N	27	\N	9030
9031	faLungs		\N	\N	27	\N	9031
9032	faLungsVirus		\N	\N	27	\N	9032
9033	faLyft		\N	\N	27	\N	9033
9034	faM		\N	\N	27	\N	9034
9035	faMagento		\N	\N	27	\N	9035
9036	faMagnet		\N	\N	27	\N	9036
9037	faMagnifyingGlass		\N	\N	27	\N	9037
9038	faMagnifyingGlassArrowRight		\N	\N	27	\N	9038
9039	faMagnifyingGlassChart		\N	\N	27	\N	9039
9040	faMagnifyingGlassDollar		\N	\N	27	\N	9040
9041	faMagnifyingGlassLocation		\N	\N	27	\N	9041
9042	faMagnifyingGlassMinus		\N	\N	27	\N	9042
9043	faMagnifyingGlassPlus		\N	\N	27	\N	9043
9044	faMailchimp		\N	\N	27	\N	9044
9045	faManatSign		\N	\N	27	\N	9045
9046	faMandalorian		\N	\N	27	\N	9046
9047	faMap		\N	\N	27	\N	9047
9048	faMapLocation		\N	\N	27	\N	9048
9049	faMapLocationDot		\N	\N	27	\N	9049
9050	faMapPin		\N	\N	27	\N	9050
9051	faMarkdown		\N	\N	27	\N	9051
9052	faMarker		\N	\N	27	\N	9052
9053	faMars		\N	\N	27	\N	9053
9054	faMarsAndVenus		\N	\N	27	\N	9054
9055	faMarsAndVenusBurst		\N	\N	27	\N	9055
9056	faMarsDouble		\N	\N	27	\N	9056
9057	faMarsStroke		\N	\N	27	\N	9057
9058	faMarsStrokeRight		\N	\N	27	\N	9058
9059	faMarsStrokeUp		\N	\N	27	\N	9059
9060	faMartiniGlass		\N	\N	27	\N	9060
9061	faMartiniGlassCitrus		\N	\N	27	\N	9061
9062	faMartiniGlassEmpty		\N	\N	27	\N	9062
9063	faMask		\N	\N	27	\N	9063
9064	faMaskFace		\N	\N	27	\N	9064
9065	faMaskVentilator		\N	\N	27	\N	9065
9066	faMasksTheater		\N	\N	27	\N	9066
9067	faMastodon		\N	\N	27	\N	9067
9068	faMattressPillow		\N	\N	27	\N	9068
9069	faMaxcdn		\N	\N	27	\N	9069
9070	faMaximize		\N	\N	27	\N	9070
9071	faMdb		\N	\N	27	\N	9071
9072	faMedal		\N	\N	27	\N	9072
9073	faMedapps		\N	\N	27	\N	9073
9074	faMedium		\N	\N	27	\N	9074
9075	faMedrt		\N	\N	27	\N	9075
9076	faMeetup		\N	\N	27	\N	9076
9077	faMegaport		\N	\N	27	\N	9077
9078	faMemory		\N	\N	27	\N	9078
9079	faMendeley		\N	\N	27	\N	9079
9080	faMenorah		\N	\N	27	\N	9080
9081	faMercury		\N	\N	27	\N	9081
9082	faMessage		\N	\N	27	\N	9082
9083	faMeta		\N	\N	27	\N	9083
9084	faMeteor		\N	\N	27	\N	9084
9085	faMicroblog		\N	\N	27	\N	9085
9086	faMicrochip		\N	\N	27	\N	9086
9087	faMicrophone		\N	\N	27	\N	9087
9088	faMicrophoneLines		\N	\N	27	\N	9088
9089	faMicrophoneLinesSlash		\N	\N	27	\N	9089
9090	faMicrophoneSlash		\N	\N	27	\N	9090
9091	faMicroscope		\N	\N	27	\N	9091
9092	faMicrosoft		\N	\N	27	\N	9092
9093	faMillSign		\N	\N	27	\N	9093
9094	faMinimize		\N	\N	27	\N	9094
9095	faMintbit		\N	\N	27	\N	9095
9096	faMinus		\N	\N	27	\N	9096
9097	faMitten		\N	\N	27	\N	9097
9098	faMix		\N	\N	27	\N	9098
9099	faMixcloud		\N	\N	27	\N	9099
9100	faMixer		\N	\N	27	\N	9100
9101	faMizuni		\N	\N	27	\N	9101
9102	faMobile		\N	\N	27	\N	9102
9103	faMobileButton		\N	\N	27	\N	9103
9104	faMobileRetro		\N	\N	27	\N	9104
9105	faMobileScreen		\N	\N	27	\N	9105
9106	faMobileScreenButton		\N	\N	27	\N	9106
9107	faModx		\N	\N	27	\N	9107
9108	faMonero		\N	\N	27	\N	9108
9109	faMoneyBill		\N	\N	27	\N	9109
9110	faMoneyBill1		\N	\N	27	\N	9110
9111	faMoneyBill1Wave		\N	\N	27	\N	9111
9112	faMoneyBillTransfer		\N	\N	27	\N	9112
9113	faMoneyBillTrendUp		\N	\N	27	\N	9113
9114	faMoneyBillWave		\N	\N	27	\N	9114
9115	faMoneyBillWheat		\N	\N	27	\N	9115
9116	faMoneyBills		\N	\N	27	\N	9116
9117	faMoneyCheck		\N	\N	27	\N	9117
9118	faMoneyCheckDollar		\N	\N	27	\N	9118
9119	faMonument		\N	\N	27	\N	9119
9120	faMoon		\N	\N	27	\N	9120
9121	faMortarPestle		\N	\N	27	\N	9121
9122	faMosque		\N	\N	27	\N	9122
9123	faMosquito		\N	\N	27	\N	9123
9124	faMosquitoNet		\N	\N	27	\N	9124
9125	faMotorcycle		\N	\N	27	\N	9125
9126	faMound		\N	\N	27	\N	9126
9127	faMountain		\N	\N	27	\N	9127
9128	faMountainCity		\N	\N	27	\N	9128
9129	faMountainSun		\N	\N	27	\N	9129
9130	faMugHot		\N	\N	27	\N	9130
9131	faMugSaucer		\N	\N	27	\N	9131
9132	faMusic		\N	\N	27	\N	9132
9133	faN		\N	\N	27	\N	9133
9134	faNairaSign		\N	\N	27	\N	9134
9135	faNapster		\N	\N	27	\N	9135
9136	faNeos		\N	\N	27	\N	9136
9137	faNetworkWired		\N	\N	27	\N	9137
9138	faNeuter		\N	\N	27	\N	9138
9139	faNewspaper		\N	\N	27	\N	9139
9140	faNfcDirectional		\N	\N	27	\N	9140
9141	faNfcSymbol		\N	\N	27	\N	9141
9142	faNimblr		\N	\N	27	\N	9142
9143	faNode		\N	\N	27	\N	9143
9144	faNodeJs		\N	\N	27	\N	9144
9145	faNotEqual		\N	\N	27	\N	9145
9146	faNotdef		\N	\N	27	\N	9146
9147	faNoteSticky		\N	\N	27	\N	9147
9148	faNotesMedical		\N	\N	27	\N	9148
9149	faNpm		\N	\N	27	\N	9149
9150	faNs8		\N	\N	27	\N	9150
9151	faNutritionix		\N	\N	27	\N	9151
9152	faO		\N	\N	27	\N	9152
9153	faObjectGroup		\N	\N	27	\N	9153
9154	faObjectUngroup		\N	\N	27	\N	9154
9155	faOctopusDeploy		\N	\N	27	\N	9155
9156	faOdnoklassniki		\N	\N	27	\N	9156
9157	faOdysee		\N	\N	27	\N	9157
9158	faOilCan		\N	\N	27	\N	9158
9159	faOilWell		\N	\N	27	\N	9159
9160	faOldRepublic		\N	\N	27	\N	9160
9161	faOm		\N	\N	27	\N	9161
9162	faOpencart		\N	\N	27	\N	9162
9163	faOpenid		\N	\N	27	\N	9163
9164	faOpensuse		\N	\N	27	\N	9164
9165	faOpera		\N	\N	27	\N	9165
9166	faOptinMonster		\N	\N	27	\N	9166
9167	faOrcid		\N	\N	27	\N	9167
9168	faOsi		\N	\N	27	\N	9168
9169	faOtter		\N	\N	27	\N	9169
9170	faOutdent		\N	\N	27	\N	9170
9171	faP		\N	\N	27	\N	9171
9172	faPadlet		\N	\N	27	\N	9172
9173	faPage4		\N	\N	27	\N	9173
9174	faPagelines		\N	\N	27	\N	9174
9175	faPager		\N	\N	27	\N	9175
9176	faPaintRoller		\N	\N	27	\N	9176
9177	faPaintbrush		\N	\N	27	\N	9177
9178	faPalette		\N	\N	27	\N	9178
9179	faPalfed		\N	\N	27	\N	9179
9180	faPallet		\N	\N	27	\N	9180
9181	faPanorama		\N	\N	27	\N	9181
9182	faPaperPlane		\N	\N	27	\N	9182
9183	faPaperclip		\N	\N	27	\N	9183
9184	faParachuteBox		\N	\N	27	\N	9184
9185	faParagraph		\N	\N	27	\N	9185
9186	faPassport		\N	\N	27	\N	9186
9187	faPaste		\N	\N	27	\N	9187
9188	faPatreon		\N	\N	27	\N	9188
9189	faPause		\N	\N	27	\N	9189
9190	faPaw		\N	\N	27	\N	9190
9191	faPaypal		\N	\N	27	\N	9191
9192	faPeace		\N	\N	27	\N	9192
9193	faPen		\N	\N	27	\N	9193
9194	faPenClip		\N	\N	27	\N	9194
9195	faPenFancy		\N	\N	27	\N	9195
9196	faPenNib		\N	\N	27	\N	9196
9197	faPenRuler		\N	\N	27	\N	9197
9198	faPenToSquare		\N	\N	27	\N	9198
9199	faPencil		\N	\N	27	\N	9199
9200	faPeopleArrows		\N	\N	27	\N	9200
9201	faPeopleCarryBox		\N	\N	27	\N	9201
9202	faPeopleGroup		\N	\N	27	\N	9202
9203	faPeopleLine		\N	\N	27	\N	9203
9204	faPeoplePulling		\N	\N	27	\N	9204
9205	faPeopleRobbery		\N	\N	27	\N	9205
9206	faPeopleRoof		\N	\N	27	\N	9206
9207	faPepperHot		\N	\N	27	\N	9207
9208	faPerbyte		\N	\N	27	\N	9208
9209	faPercent		\N	\N	27	\N	9209
9210	faPeriscope		\N	\N	27	\N	9210
9211	faPerson		\N	\N	27	\N	9211
9212	faPersonArrowDownToLine		\N	\N	27	\N	9212
9213	faPersonArrowUpFromLine		\N	\N	27	\N	9213
9214	faPersonBiking		\N	\N	27	\N	9214
9215	faPersonBooth		\N	\N	27	\N	9215
9216	faPersonBreastfeeding		\N	\N	27	\N	9216
9217	faPersonBurst		\N	\N	27	\N	9217
9218	faPersonCane		\N	\N	27	\N	9218
9219	faPersonChalkboard		\N	\N	27	\N	9219
9220	faPersonCircleCheck		\N	\N	27	\N	9220
9221	faPersonCircleExclamation		\N	\N	27	\N	9221
9222	faPersonCircleMinus		\N	\N	27	\N	9222
9223	faPersonCirclePlus		\N	\N	27	\N	9223
9224	faPersonCircleQuestion		\N	\N	27	\N	9224
9225	faPersonCircleXmark		\N	\N	27	\N	9225
9226	faPersonDigging		\N	\N	27	\N	9226
9227	faPersonDotsFromLine		\N	\N	27	\N	9227
9228	faPersonDress		\N	\N	27	\N	9228
9229	faPersonDressBurst		\N	\N	27	\N	9229
9230	faPersonDrowning		\N	\N	27	\N	9230
9231	faPersonFalling		\N	\N	27	\N	9231
9232	faPersonFallingBurst		\N	\N	27	\N	9232
9233	faPersonHalfDress		\N	\N	27	\N	9233
9234	faPersonHarassing		\N	\N	27	\N	9234
9235	faPersonHiking		\N	\N	27	\N	9235
9236	faPersonMilitaryPointing		\N	\N	27	\N	9236
9237	faPersonMilitaryRifle		\N	\N	27	\N	9237
9238	faPersonMilitaryToPerson		\N	\N	27	\N	9238
9239	faPersonPraying		\N	\N	27	\N	9239
9240	faPersonPregnant		\N	\N	27	\N	9240
9241	faPersonRays		\N	\N	27	\N	9241
9242	faPersonRifle		\N	\N	27	\N	9242
9243	faPersonRunning		\N	\N	27	\N	9243
9244	faPersonShelter		\N	\N	27	\N	9244
9245	faPersonSkating		\N	\N	27	\N	9245
9246	faPersonSkiing		\N	\N	27	\N	9246
9247	faPersonSkiingNordic		\N	\N	27	\N	9247
9248	faPersonSnowboarding		\N	\N	27	\N	9248
9249	faPersonSwimming		\N	\N	27	\N	9249
9250	faPersonThroughWindow		\N	\N	27	\N	9250
9251	faPersonWalking		\N	\N	27	\N	9251
9252	faPersonWalkingArrowLoopLeft		\N	\N	27	\N	9252
9253	faPersonWalkingArrowRight		\N	\N	27	\N	9253
9254	faPersonWalkingDashedLineArrowRight		\N	\N	27	\N	9254
9255	faPersonWalkingLuggage		\N	\N	27	\N	9255
9256	faPersonWalkingWithCane		\N	\N	27	\N	9256
9257	faPesetaSign		\N	\N	27	\N	9257
9258	faPesoSign		\N	\N	27	\N	9258
9259	faPhabricator		\N	\N	27	\N	9259
9260	faPhoenixFramework		\N	\N	27	\N	9260
9261	faPhoenixSquadron		\N	\N	27	\N	9261
9262	faPhone		\N	\N	27	\N	9262
9263	faPhoneFlip		\N	\N	27	\N	9263
9264	faPhoneSlash		\N	\N	27	\N	9264
9265	faPhoneVolume		\N	\N	27	\N	9265
9266	faPhotoFilm		\N	\N	27	\N	9266
9267	faPhp		\N	\N	27	\N	9267
9268	faPiedPiper		\N	\N	27	\N	9268
9269	faPiedPiperAlt		\N	\N	27	\N	9269
9270	faPiedPiperHat		\N	\N	27	\N	9270
9271	faPiedPiperPp		\N	\N	27	\N	9271
9272	faPiggyBank		\N	\N	27	\N	9272
9273	faPills		\N	\N	27	\N	9273
9274	faPinterest		\N	\N	27	\N	9274
9275	faPinterestP		\N	\N	27	\N	9275
9276	faPix		\N	\N	27	\N	9276
9277	faPixiv		\N	\N	27	\N	9277
9278	faPizzaSlice		\N	\N	27	\N	9278
9279	faPlaceOfWorship		\N	\N	27	\N	9279
9280	faPlane		\N	\N	27	\N	9280
9281	faPlaneArrival		\N	\N	27	\N	9281
9282	faPlaneCircleCheck		\N	\N	27	\N	9282
9283	faPlaneCircleExclamation		\N	\N	27	\N	9283
9284	faPlaneCircleXmark		\N	\N	27	\N	9284
9285	faPlaneDeparture		\N	\N	27	\N	9285
9286	faPlaneLock		\N	\N	27	\N	9286
9287	faPlaneSlash		\N	\N	27	\N	9287
9288	faPlaneUp		\N	\N	27	\N	9288
9289	faPlantWilt		\N	\N	27	\N	9289
9290	faPlateWheat		\N	\N	27	\N	9290
9291	faPlay		\N	\N	27	\N	9291
9292	faPlaystation		\N	\N	27	\N	9292
9293	faPlug		\N	\N	27	\N	9293
9294	faPlugCircleBolt		\N	\N	27	\N	9294
9295	faPlugCircleCheck		\N	\N	27	\N	9295
9296	faPlugCircleExclamation		\N	\N	27	\N	9296
9297	faPlugCircleMinus		\N	\N	27	\N	9297
9298	faPlugCirclePlus		\N	\N	27	\N	9298
9299	faPlugCircleXmark		\N	\N	27	\N	9299
9300	faPlus		\N	\N	27	\N	9300
9301	faPlusMinus		\N	\N	27	\N	9301
9302	faPodcast		\N	\N	27	\N	9302
9303	faPoo		\N	\N	27	\N	9303
9304	faPooStorm		\N	\N	27	\N	9304
9305	faPoop		\N	\N	27	\N	9305
9306	faPowerOff		\N	\N	27	\N	9306
9307	faPrescription		\N	\N	27	\N	9307
9308	faPrescriptionBottle		\N	\N	27	\N	9308
9309	faPrescriptionBottleMedical		\N	\N	27	\N	9309
9310	faPrint		\N	\N	27	\N	9310
9311	faProductHunt		\N	\N	27	\N	9311
9312	faPumpMedical		\N	\N	27	\N	9312
9313	faPumpSoap		\N	\N	27	\N	9313
9314	faPushed		\N	\N	27	\N	9314
9315	faPuzzlePiece		\N	\N	27	\N	9315
9316	faPython		\N	\N	27	\N	9316
9317	faQ		\N	\N	27	\N	9317
9318	faQq		\N	\N	27	\N	9318
9319	faQrcode		\N	\N	27	\N	9319
9320	faQuestion		\N	\N	27	\N	9320
9321	faQuinscape		\N	\N	27	\N	9321
9322	faQuora		\N	\N	27	\N	9322
9323	faQuoteLeft		\N	\N	27	\N	9323
9324	faQuoteRight		\N	\N	27	\N	9324
9325	faR		\N	\N	27	\N	9325
9326	faRProject		\N	\N	27	\N	9326
9327	faRadiation		\N	\N	27	\N	9327
9328	faRadio		\N	\N	27	\N	9328
9329	faRainbow		\N	\N	27	\N	9329
9330	faRankingStar		\N	\N	27	\N	9330
9331	faRaspberryPi		\N	\N	27	\N	9331
9332	faRavelry		\N	\N	27	\N	9332
9333	faReact		\N	\N	27	\N	9333
9334	faReacteurope		\N	\N	27	\N	9334
9335	faReadme		\N	\N	27	\N	9335
9336	faRebel		\N	\N	27	\N	9336
9337	faReceipt		\N	\N	27	\N	9337
9338	faRecordVinyl		\N	\N	27	\N	9338
9339	faRectangleAd		\N	\N	27	\N	9339
9340	faRectangleList		\N	\N	27	\N	9340
9341	faRectangleXmark		\N	\N	27	\N	9341
9342	faRecycle		\N	\N	27	\N	9342
9343	faRedRiver		\N	\N	27	\N	9343
9344	faReddit		\N	\N	27	\N	9344
9345	faRedditAlien		\N	\N	27	\N	9345
9346	faRedhat		\N	\N	27	\N	9346
9347	faRegistered		\N	\N	27	\N	9347
9348	faRenren		\N	\N	27	\N	9348
9349	faRepeat		\N	\N	27	\N	9349
9350	faReply		\N	\N	27	\N	9350
9351	faReplyAll		\N	\N	27	\N	9351
9352	faReplyd		\N	\N	27	\N	9352
9353	faRepublican		\N	\N	27	\N	9353
9354	faResearchgate		\N	\N	27	\N	9354
9355	faResolving		\N	\N	27	\N	9355
9356	faRestroom		\N	\N	27	\N	9356
9357	faRetweet		\N	\N	27	\N	9357
9358	faRev		\N	\N	27	\N	9358
9359	faRibbon		\N	\N	27	\N	9359
9360	faRightFromBracket		\N	\N	27	\N	9360
9361	faRightLeft		\N	\N	27	\N	9361
9362	faRightLong		\N	\N	27	\N	9362
9363	faRightToBracket		\N	\N	27	\N	9363
9364	faRing		\N	\N	27	\N	9364
9365	faRoad		\N	\N	27	\N	9365
9366	faRoadBarrier		\N	\N	27	\N	9366
9367	faRoadBridge		\N	\N	27	\N	9367
9368	faRoadCircleCheck		\N	\N	27	\N	9368
9369	faRoadCircleExclamation		\N	\N	27	\N	9369
9370	faRoadCircleXmark		\N	\N	27	\N	9370
9371	faRoadLock		\N	\N	27	\N	9371
9372	faRoadSpikes		\N	\N	27	\N	9372
9373	faRobot		\N	\N	27	\N	9373
9374	faRocket		\N	\N	27	\N	9374
9375	faRocketchat		\N	\N	27	\N	9375
9376	faRockrms		\N	\N	27	\N	9376
9377	faRotate		\N	\N	27	\N	9377
9378	faRotateLeft		\N	\N	27	\N	9378
9379	faRotateRight		\N	\N	27	\N	9379
9380	faRoute		\N	\N	27	\N	9380
9381	faRss		\N	\N	27	\N	9381
9382	faRubleSign		\N	\N	27	\N	9382
9383	faRug		\N	\N	27	\N	9383
9384	faRuler		\N	\N	27	\N	9384
9385	faRulerCombined		\N	\N	27	\N	9385
9386	faRulerHorizontal		\N	\N	27	\N	9386
9387	faRulerVertical		\N	\N	27	\N	9387
9388	faRupeeSign		\N	\N	27	\N	9388
9389	faRupiahSign		\N	\N	27	\N	9389
9390	faRust		\N	\N	27	\N	9390
9391	faS		\N	\N	27	\N	9391
9392	faSackDollar		\N	\N	27	\N	9392
9393	faSackXmark		\N	\N	27	\N	9393
9394	faSafari		\N	\N	27	\N	9394
9395	faSailboat		\N	\N	27	\N	9395
9396	faSalesforce		\N	\N	27	\N	9396
9397	faSass		\N	\N	27	\N	9397
9398	faSatellite		\N	\N	27	\N	9398
9399	faSatelliteDish		\N	\N	27	\N	9399
9400	faScaleBalanced		\N	\N	27	\N	9400
9401	faScaleUnbalanced		\N	\N	27	\N	9401
9402	faScaleUnbalancedFlip		\N	\N	27	\N	9402
9403	faSchlix		\N	\N	27	\N	9403
9404	faSchool		\N	\N	27	\N	9404
9405	faSchoolCircleCheck		\N	\N	27	\N	9405
9406	faSchoolCircleExclamation		\N	\N	27	\N	9406
9407	faSchoolCircleXmark		\N	\N	27	\N	9407
9408	faSchoolFlag		\N	\N	27	\N	9408
9409	faSchoolLock		\N	\N	27	\N	9409
9410	faScissors		\N	\N	27	\N	9410
9411	faScreenpal		\N	\N	27	\N	9411
9412	faScrewdriver		\N	\N	27	\N	9412
9413	faScrewdriverWrench		\N	\N	27	\N	9413
9414	faScribd		\N	\N	27	\N	9414
9415	faScroll		\N	\N	27	\N	9415
9416	faScrollTorah		\N	\N	27	\N	9416
9417	faSdCard		\N	\N	27	\N	9417
9418	faSearchengin		\N	\N	27	\N	9418
9419	faSection		\N	\N	27	\N	9419
9420	faSeedling		\N	\N	27	\N	9420
9421	faSellcast		\N	\N	27	\N	9421
9422	faSellsy		\N	\N	27	\N	9422
9423	faServer		\N	\N	27	\N	9423
9424	faServicestack		\N	\N	27	\N	9424
9425	faShapes		\N	\N	27	\N	9425
9426	faShare		\N	\N	27	\N	9426
9427	faShareFromSquare		\N	\N	27	\N	9427
9428	faShareNodes		\N	\N	27	\N	9428
9429	faSheetPlastic		\N	\N	27	\N	9429
9430	faShekelSign		\N	\N	27	\N	9430
9431	faShield		\N	\N	27	\N	9431
9432	faShieldCat		\N	\N	27	\N	9432
9433	faShieldDog		\N	\N	27	\N	9433
9434	faShieldHalved		\N	\N	27	\N	9434
9435	faShieldHeart		\N	\N	27	\N	9435
9436	faShieldVirus		\N	\N	27	\N	9436
9437	faShip		\N	\N	27	\N	9437
9438	faShirt		\N	\N	27	\N	9438
9439	faShirtsinbulk		\N	\N	27	\N	9439
9440	faShoePrints		\N	\N	27	\N	9440
9441	faShoelace		\N	\N	27	\N	9441
9442	faShop		\N	\N	27	\N	9442
9443	faShopLock		\N	\N	27	\N	9443
9444	faShopSlash		\N	\N	27	\N	9444
9445	faShopify		\N	\N	27	\N	9445
9446	faShopware		\N	\N	27	\N	9446
9447	faShower		\N	\N	27	\N	9447
9448	faShrimp		\N	\N	27	\N	9448
9449	faShuffle		\N	\N	27	\N	9449
9450	faShuttleSpace		\N	\N	27	\N	9450
9451	faSignHanging		\N	\N	27	\N	9451
9452	faSignal		\N	\N	27	\N	9452
9453	faSignalMessenger		\N	\N	27	\N	9453
9454	faSignature		\N	\N	27	\N	9454
9455	faSignsPost		\N	\N	27	\N	9455
9456	faSimCard		\N	\N	27	\N	9456
9457	faSimplybuilt		\N	\N	27	\N	9457
9458	faSink		\N	\N	27	\N	9458
9459	faSistrix		\N	\N	27	\N	9459
9460	faSitemap		\N	\N	27	\N	9460
9461	faSith		\N	\N	27	\N	9461
9462	faSitrox		\N	\N	27	\N	9462
9463	faSketch		\N	\N	27	\N	9463
9464	faSkull		\N	\N	27	\N	9464
9465	faSkullCrossbones		\N	\N	27	\N	9465
9466	faSkyatlas		\N	\N	27	\N	9466
9467	faSkype		\N	\N	27	\N	9467
9468	faSlack		\N	\N	27	\N	9468
9469	faSlash		\N	\N	27	\N	9469
9470	faSleigh		\N	\N	27	\N	9470
9471	faSliders		\N	\N	27	\N	9471
9472	faSlideshare		\N	\N	27	\N	9472
9473	faSmog		\N	\N	27	\N	9473
9474	faSmoking		\N	\N	27	\N	9474
9475	faSnapchat		\N	\N	27	\N	9475
9476	faSnowflake		\N	\N	27	\N	9476
9477	faSnowman		\N	\N	27	\N	9477
9478	faSnowplow		\N	\N	27	\N	9478
9479	faSoap		\N	\N	27	\N	9479
9480	faSocks		\N	\N	27	\N	9480
9481	faSolarPanel		\N	\N	27	\N	9481
9482	faSort		\N	\N	27	\N	9482
9483	faSortDown		\N	\N	27	\N	9483
9484	faSortUp		\N	\N	27	\N	9484
9485	faSoundcloud		\N	\N	27	\N	9485
9486	faSourcetree		\N	\N	27	\N	9486
9487	faSpa		\N	\N	27	\N	9487
9488	faSpaceAwesome		\N	\N	27	\N	9488
9489	faSpaghettiMonsterFlying		\N	\N	27	\N	9489
9490	faSpeakap		\N	\N	27	\N	9490
9491	faSpeakerDeck		\N	\N	27	\N	9491
9492	faSpellCheck		\N	\N	27	\N	9492
9493	faSpider		\N	\N	27	\N	9493
9494	faSpinner		\N	\N	27	\N	9494
9495	faSplotch		\N	\N	27	\N	9495
9496	faSpoon		\N	\N	27	\N	9496
9497	faSpotify		\N	\N	27	\N	9497
9498	faSprayCan		\N	\N	27	\N	9498
9499	faSprayCanSparkles		\N	\N	27	\N	9499
9500	faSquare		\N	\N	27	\N	9500
9501	faSquareArrowUpRight		\N	\N	27	\N	9501
9502	faSquareBehance		\N	\N	27	\N	9502
9503	faSquareBinary		\N	\N	27	\N	9503
9504	faSquareBluesky		\N	\N	27	\N	9504
9505	faSquareCaretDown		\N	\N	27	\N	9505
9506	faSquareCaretLeft		\N	\N	27	\N	9506
9507	faSquareCaretRight		\N	\N	27	\N	9507
9508	faSquareCaretUp		\N	\N	27	\N	9508
9509	faSquareCheck		\N	\N	27	\N	9509
9510	faSquareDribbble		\N	\N	27	\N	9510
9511	faSquareEnvelope		\N	\N	27	\N	9511
9512	faSquareFacebook		\N	\N	27	\N	9512
9513	faSquareFontAwesome		\N	\N	27	\N	9513
9514	faSquareFontAwesomeStroke		\N	\N	27	\N	9514
9515	faSquareFull		\N	\N	27	\N	9515
9516	faSquareGit		\N	\N	27	\N	9516
9517	faSquareGithub		\N	\N	27	\N	9517
9518	faSquareGitlab		\N	\N	27	\N	9518
9519	faSquareGooglePlus		\N	\N	27	\N	9519
9520	faSquareH		\N	\N	27	\N	9520
9521	faSquareHackerNews		\N	\N	27	\N	9521
9522	faSquareInstagram		\N	\N	27	\N	9522
9523	faSquareJs		\N	\N	27	\N	9523
9524	faSquareLastfm		\N	\N	27	\N	9524
9525	faSquareLetterboxd		\N	\N	27	\N	9525
9526	faSquareMinus		\N	\N	27	\N	9526
9527	faSquareNfi		\N	\N	27	\N	9527
9528	faSquareOdnoklassniki		\N	\N	27	\N	9528
9529	faSquareParking		\N	\N	27	\N	9529
9530	faSquarePen		\N	\N	27	\N	9530
9531	faSquarePersonConfined		\N	\N	27	\N	9531
9532	faSquarePhone		\N	\N	27	\N	9532
9533	faSquarePhoneFlip		\N	\N	27	\N	9533
9534	faSquarePiedPiper		\N	\N	27	\N	9534
9535	faSquarePinterest		\N	\N	27	\N	9535
9536	faSquarePlus		\N	\N	27	\N	9536
9537	faSquarePollHorizontal		\N	\N	27	\N	9537
9538	faSquarePollVertical		\N	\N	27	\N	9538
9539	faSquareReddit		\N	\N	27	\N	9539
9540	faSquareRootVariable		\N	\N	27	\N	9540
9541	faSquareRss		\N	\N	27	\N	9541
9542	faSquareShareNodes		\N	\N	27	\N	9542
9543	faSquareSnapchat		\N	\N	27	\N	9543
9544	faSquareSteam		\N	\N	27	\N	9544
9545	faSquareThreads		\N	\N	27	\N	9545
9546	faSquareTumblr		\N	\N	27	\N	9546
9547	faSquareTwitter		\N	\N	27	\N	9547
9548	faSquareUpRight		\N	\N	27	\N	9548
9549	faSquareUpwork		\N	\N	27	\N	9549
9550	faSquareViadeo		\N	\N	27	\N	9550
9551	faSquareVimeo		\N	\N	27	\N	9551
9552	faSquareVirus		\N	\N	27	\N	9552
9553	faSquareWebAwesome		\N	\N	27	\N	9553
9554	faSquareWebAwesomeStroke		\N	\N	27	\N	9554
9555	faSquareWhatsapp		\N	\N	27	\N	9555
9556	faSquareXTwitter		\N	\N	27	\N	9556
9557	faSquareXing		\N	\N	27	\N	9557
9558	faSquareXmark		\N	\N	27	\N	9558
9559	faSquareYoutube		\N	\N	27	\N	9559
9560	faSquarespace		\N	\N	27	\N	9560
9561	faStackExchange		\N	\N	27	\N	9561
9562	faStackOverflow		\N	\N	27	\N	9562
9563	faStackpath		\N	\N	27	\N	9563
9564	faStaffSnake		\N	\N	27	\N	9564
9565	faStairs		\N	\N	27	\N	9565
9566	faStamp		\N	\N	27	\N	9566
9567	faStapler		\N	\N	27	\N	9567
9568	faStar		\N	\N	27	\N	9568
9569	faStarAndCrescent		\N	\N	27	\N	9569
9570	faStarHalf		\N	\N	27	\N	9570
9571	faStarHalfStroke		\N	\N	27	\N	9571
9572	faStarOfDavid		\N	\N	27	\N	9572
9573	faStarOfLife		\N	\N	27	\N	9573
9574	faStaylinked		\N	\N	27	\N	9574
9575	faSteam		\N	\N	27	\N	9575
9576	faSteamSymbol		\N	\N	27	\N	9576
9577	faSterlingSign		\N	\N	27	\N	9577
9578	faStethoscope		\N	\N	27	\N	9578
9579	faStickerMule		\N	\N	27	\N	9579
9580	faStop		\N	\N	27	\N	9580
9581	faStopwatch		\N	\N	27	\N	9581
9582	faStopwatch20		\N	\N	27	\N	9582
9583	faStore		\N	\N	27	\N	9583
9584	faStoreSlash		\N	\N	27	\N	9584
9585	faStrava		\N	\N	27	\N	9585
9586	faStreetView		\N	\N	27	\N	9586
9587	faStrikethrough		\N	\N	27	\N	9587
9588	faStripe		\N	\N	27	\N	9588
9589	faStripeS		\N	\N	27	\N	9589
9590	faStroopwafel		\N	\N	27	\N	9590
9591	faStubber		\N	\N	27	\N	9591
9592	faStudiovinari		\N	\N	27	\N	9592
9593	faStumbleupon		\N	\N	27	\N	9593
9594	faStumbleuponCircle		\N	\N	27	\N	9594
9595	faSubscript		\N	\N	27	\N	9595
9596	faSuitcase		\N	\N	27	\N	9596
9597	faSuitcaseMedical		\N	\N	27	\N	9597
9598	faSuitcaseRolling		\N	\N	27	\N	9598
9599	faSun		\N	\N	27	\N	9599
9600	faSunPlantWilt		\N	\N	27	\N	9600
9601	faSuperpowers		\N	\N	27	\N	9601
9602	faSuperscript		\N	\N	27	\N	9602
9603	faSupple		\N	\N	27	\N	9603
9604	faSuse		\N	\N	27	\N	9604
9605	faSwatchbook		\N	\N	27	\N	9605
9606	faSwift		\N	\N	27	\N	9606
9607	faSymfony		\N	\N	27	\N	9607
9608	faSynagogue		\N	\N	27	\N	9608
9609	faSyringe		\N	\N	27	\N	9609
9610	faT		\N	\N	27	\N	9610
9611	faTable		\N	\N	27	\N	9611
9612	faTableCells		\N	\N	27	\N	9612
9613	faTableCellsColumnLock		\N	\N	27	\N	9613
9614	faTableCellsLarge		\N	\N	27	\N	9614
9615	faTableCellsRowLock		\N	\N	27	\N	9615
9616	faTableCellsRowUnlock		\N	\N	27	\N	9616
9617	faTableColumns		\N	\N	27	\N	9617
9618	faTableList		\N	\N	27	\N	9618
9619	faTableTennisPaddleBall		\N	\N	27	\N	9619
9620	faTablet		\N	\N	27	\N	9620
9621	faTabletButton		\N	\N	27	\N	9621
9622	faTabletScreenButton		\N	\N	27	\N	9622
9623	faTablets		\N	\N	27	\N	9623
9624	faTachographDigital		\N	\N	27	\N	9624
9625	faTag		\N	\N	27	\N	9625
9626	faTags		\N	\N	27	\N	9626
9627	faTape		\N	\N	27	\N	9627
9628	faTarp		\N	\N	27	\N	9628
9629	faTarpDroplet		\N	\N	27	\N	9629
9630	faTaxi		\N	\N	27	\N	9630
9631	faTeamspeak		\N	\N	27	\N	9631
9632	faTeeth		\N	\N	27	\N	9632
9633	faTeethOpen		\N	\N	27	\N	9633
9634	faTelegram		\N	\N	27	\N	9634
9635	faTemperatureArrowDown		\N	\N	27	\N	9635
9636	faTemperatureArrowUp		\N	\N	27	\N	9636
9637	faTemperatureEmpty		\N	\N	27	\N	9637
9638	faTemperatureFull		\N	\N	27	\N	9638
9639	faTemperatureHalf		\N	\N	27	\N	9639
9640	faTemperatureHigh		\N	\N	27	\N	9640
9641	faTemperatureLow		\N	\N	27	\N	9641
9642	faTemperatureQuarter		\N	\N	27	\N	9642
9643	faTemperatureThreeQuarters		\N	\N	27	\N	9643
9644	faTencentWeibo		\N	\N	27	\N	9644
9645	faTengeSign		\N	\N	27	\N	9645
9646	faTent		\N	\N	27	\N	9646
9647	faTentArrowDownToLine		\N	\N	27	\N	9647
9648	faTentArrowLeftRight		\N	\N	27	\N	9648
9649	faTentArrowTurnLeft		\N	\N	27	\N	9649
9650	faTentArrowsDown		\N	\N	27	\N	9650
9651	faTents		\N	\N	27	\N	9651
9652	faTerminal		\N	\N	27	\N	9652
9653	faTextHeight		\N	\N	27	\N	9653
9654	faTextSlash		\N	\N	27	\N	9654
9655	faTextWidth		\N	\N	27	\N	9655
9656	faTheRedYeti		\N	\N	27	\N	9656
9657	faThemeco		\N	\N	27	\N	9657
9658	faThemeisle		\N	\N	27	\N	9658
9659	faThermometer		\N	\N	27	\N	9659
9660	faThinkPeaks		\N	\N	27	\N	9660
9661	faThreads		\N	\N	27	\N	9661
9662	faThumbsDown		\N	\N	27	\N	9662
9663	faThumbsUp		\N	\N	27	\N	9663
9664	faThumbtack		\N	\N	27	\N	9664
9665	faThumbtackSlash		\N	\N	27	\N	9665
9666	faTicket		\N	\N	27	\N	9666
9667	faTicketSimple		\N	\N	27	\N	9667
9668	faTiktok		\N	\N	27	\N	9668
9669	faTimeline		\N	\N	27	\N	9669
9670	faToggleOff		\N	\N	27	\N	9670
9671	faToggleOn		\N	\N	27	\N	9671
9672	faToilet		\N	\N	27	\N	9672
9673	faToiletPaper		\N	\N	27	\N	9673
9674	faToiletPaperSlash		\N	\N	27	\N	9674
9675	faToiletPortable		\N	\N	27	\N	9675
9676	faToiletsPortable		\N	\N	27	\N	9676
9677	faToolbox		\N	\N	27	\N	9677
9678	faTooth		\N	\N	27	\N	9678
9679	faToriiGate		\N	\N	27	\N	9679
9680	faTornado		\N	\N	27	\N	9680
9681	faTowerBroadcast		\N	\N	27	\N	9681
9682	faTowerCell		\N	\N	27	\N	9682
9683	faTowerObservation		\N	\N	27	\N	9683
9684	faTractor		\N	\N	27	\N	9684
9685	faTradeFederation		\N	\N	27	\N	9685
9686	faTrademark		\N	\N	27	\N	9686
9687	faTrafficLight		\N	\N	27	\N	9687
9688	faTrailer		\N	\N	27	\N	9688
9689	faTrain		\N	\N	27	\N	9689
9690	faTrainSubway		\N	\N	27	\N	9690
9691	faTrainTram		\N	\N	27	\N	9691
9692	faTransgender		\N	\N	27	\N	9692
9693	faTrash		\N	\N	27	\N	9693
9694	faTrashArrowUp		\N	\N	27	\N	9694
9695	faTrashCan		\N	\N	27	\N	9695
9696	faTrashCanArrowUp		\N	\N	27	\N	9696
9697	faTree		\N	\N	27	\N	9697
9698	faTreeCity		\N	\N	27	\N	9698
9699	faTrello		\N	\N	27	\N	9699
9700	faTriangleExclamation		\N	\N	27	\N	9700
9701	faTrophy		\N	\N	27	\N	9701
9702	faTrowel		\N	\N	27	\N	9702
9703	faTrowelBricks		\N	\N	27	\N	9703
9704	faTruck		\N	\N	27	\N	9704
9705	faTruckArrowRight		\N	\N	27	\N	9705
9706	faTruckDroplet		\N	\N	27	\N	9706
9707	faTruckFast		\N	\N	27	\N	9707
9708	faTruckField		\N	\N	27	\N	9708
9709	faTruckFieldUn		\N	\N	27	\N	9709
9710	faTruckFront		\N	\N	27	\N	9710
9711	faTruckMedical		\N	\N	27	\N	9711
9712	faTruckMonster		\N	\N	27	\N	9712
9713	faTruckMoving		\N	\N	27	\N	9713
9714	faTruckPickup		\N	\N	27	\N	9714
9715	faTruckPlane		\N	\N	27	\N	9715
9716	faTruckRampBox		\N	\N	27	\N	9716
9717	faTty		\N	\N	27	\N	9717
9718	faTumblr		\N	\N	27	\N	9718
9719	faTurkishLiraSign		\N	\N	27	\N	9719
9720	faTurnDown		\N	\N	27	\N	9720
9721	faTurnUp		\N	\N	27	\N	9721
9722	faTv		\N	\N	27	\N	9722
9723	faTwitch		\N	\N	27	\N	9723
9724	faTwitter		\N	\N	27	\N	9724
9725	faTypo3		\N	\N	27	\N	9725
9726	faU		\N	\N	27	\N	9726
9727	faUber		\N	\N	27	\N	9727
9728	faUbuntu		\N	\N	27	\N	9728
9729	faUikit		\N	\N	27	\N	9729
9730	faUmbraco		\N	\N	27	\N	9730
9731	faUmbrella		\N	\N	27	\N	9731
9732	faUmbrellaBeach		\N	\N	27	\N	9732
9733	faUncharted		\N	\N	27	\N	9733
9734	faUnderline		\N	\N	27	\N	9734
9735	faUniregistry		\N	\N	27	\N	9735
9736	faUnity		\N	\N	27	\N	9736
9737	faUniversalAccess		\N	\N	27	\N	9737
9738	faUnlock		\N	\N	27	\N	9738
9739	faUnlockKeyhole		\N	\N	27	\N	9739
9740	faUnsplash		\N	\N	27	\N	9740
9741	faUntappd		\N	\N	27	\N	9741
9742	faUpDown		\N	\N	27	\N	9742
9743	faUpDownLeftRight		\N	\N	27	\N	9743
9744	faUpLong		\N	\N	27	\N	9744
9745	faUpRightAndDownLeftFromCenter		\N	\N	27	\N	9745
9746	faUpRightFromSquare		\N	\N	27	\N	9746
9747	faUpload		\N	\N	27	\N	9747
9748	faUps		\N	\N	27	\N	9748
9749	faUpwork		\N	\N	27	\N	9749
9750	faUsb		\N	\N	27	\N	9750
9751	faUser		\N	\N	27	\N	9751
9752	faUserAstronaut		\N	\N	27	\N	9752
9753	faUserCheck		\N	\N	27	\N	9753
9754	faUserClock		\N	\N	27	\N	9754
9755	faUserDoctor		\N	\N	27	\N	9755
9756	faUserGear		\N	\N	27	\N	9756
9757	faUserGraduate		\N	\N	27	\N	9757
9758	faUserGroup		\N	\N	27	\N	9758
9759	faUserInjured		\N	\N	27	\N	9759
9760	faUserLarge		\N	\N	27	\N	9760
9761	faUserLargeSlash		\N	\N	27	\N	9761
9762	faUserLock		\N	\N	27	\N	9762
9763	faUserMinus		\N	\N	27	\N	9763
9764	faUserNinja		\N	\N	27	\N	9764
9765	faUserNurse		\N	\N	27	\N	9765
9766	faUserPen		\N	\N	27	\N	9766
9767	faUserPlus		\N	\N	27	\N	9767
9768	faUserSecret		\N	\N	27	\N	9768
9769	faUserShield		\N	\N	27	\N	9769
9770	faUserSlash		\N	\N	27	\N	9770
9771	faUserTag		\N	\N	27	\N	9771
9772	faUserTie		\N	\N	27	\N	9772
9773	faUserXmark		\N	\N	27	\N	9773
9774	faUsers		\N	\N	27	\N	9774
9775	faUsersBetweenLines		\N	\N	27	\N	9775
9776	faUsersGear		\N	\N	27	\N	9776
9777	faUsersLine		\N	\N	27	\N	9777
9778	faUsersRays		\N	\N	27	\N	9778
9779	faUsersRectangle		\N	\N	27	\N	9779
9780	faUsersSlash		\N	\N	27	\N	9780
9781	faUsersViewfinder		\N	\N	27	\N	9781
9782	faUsps		\N	\N	27	\N	9782
9783	faUssunnah		\N	\N	27	\N	9783
9784	faUtensils		\N	\N	27	\N	9784
9785	faV		\N	\N	27	\N	9785
9786	faVaadin		\N	\N	27	\N	9786
9787	faVanShuttle		\N	\N	27	\N	9787
9788	faVault		\N	\N	27	\N	9788
9789	faVectorSquare		\N	\N	27	\N	9789
9790	faVenus		\N	\N	27	\N	9790
9791	faVenusDouble		\N	\N	27	\N	9791
9792	faVenusMars		\N	\N	27	\N	9792
9793	faVest		\N	\N	27	\N	9793
9794	faVestPatches		\N	\N	27	\N	9794
9795	faViacoin		\N	\N	27	\N	9795
9796	faViadeo		\N	\N	27	\N	9796
9797	faVial		\N	\N	27	\N	9797
9798	faVialCircleCheck		\N	\N	27	\N	9798
9799	faVialVirus		\N	\N	27	\N	9799
9800	faVials		\N	\N	27	\N	9800
9801	faViber		\N	\N	27	\N	9801
9802	faVideo		\N	\N	27	\N	9802
9803	faVideoSlash		\N	\N	27	\N	9803
9804	faVihara		\N	\N	27	\N	9804
9805	faVimeo		\N	\N	27	\N	9805
9806	faVimeoV		\N	\N	27	\N	9806
9807	faVine		\N	\N	27	\N	9807
9808	faVirus		\N	\N	27	\N	9808
9809	faVirusCovid		\N	\N	27	\N	9809
9810	faVirusCovidSlash		\N	\N	27	\N	9810
9811	faVirusSlash		\N	\N	27	\N	9811
9812	faViruses		\N	\N	27	\N	9812
9813	faVk		\N	\N	27	\N	9813
9814	faVnv		\N	\N	27	\N	9814
9815	faVoicemail		\N	\N	27	\N	9815
9816	faVolcano		\N	\N	27	\N	9816
9817	faVolleyball		\N	\N	27	\N	9817
9818	faVolumeHigh		\N	\N	27	\N	9818
9819	faVolumeLow		\N	\N	27	\N	9819
9820	faVolumeOff		\N	\N	27	\N	9820
9821	faVolumeXmark		\N	\N	27	\N	9821
9822	faVrCardboard		\N	\N	27	\N	9822
9823	faVuejs		\N	\N	27	\N	9823
9824	faW		\N	\N	27	\N	9824
9825	faWalkieTalkie		\N	\N	27	\N	9825
9826	faWallet		\N	\N	27	\N	9826
9827	faWandMagic		\N	\N	27	\N	9827
9828	faWandMagicSparkles		\N	\N	27	\N	9828
9829	faWandSparkles		\N	\N	27	\N	9829
9830	faWarehouse		\N	\N	27	\N	9830
9831	faWatchmanMonitoring		\N	\N	27	\N	9831
9832	faWater		\N	\N	27	\N	9832
9833	faWaterLadder		\N	\N	27	\N	9833
9834	faWaveSquare		\N	\N	27	\N	9834
9835	faWaze		\N	\N	27	\N	9835
9836	faWebAwesome		\N	\N	27	\N	9836
9837	faWebflow		\N	\N	27	\N	9837
9838	faWeebly		\N	\N	27	\N	9838
9839	faWeibo		\N	\N	27	\N	9839
9840	faWeightHanging		\N	\N	27	\N	9840
9841	faWeightScale		\N	\N	27	\N	9841
9842	faWeixin		\N	\N	27	\N	9842
9843	faWhatsapp		\N	\N	27	\N	9843
9844	faWheatAwn		\N	\N	27	\N	9844
9845	faWheatAwnCircleExclamation		\N	\N	27	\N	9845
9846	faWheelchair		\N	\N	27	\N	9846
9847	faWheelchairMove		\N	\N	27	\N	9847
9848	faWhiskeyGlass		\N	\N	27	\N	9848
9849	faWhmcs		\N	\N	27	\N	9849
9850	faWifi		\N	\N	27	\N	9850
9851	faWikipediaW		\N	\N	27	\N	9851
9852	faWind		\N	\N	27	\N	9852
9853	faWindowMaximize		\N	\N	27	\N	9853
9854	faWindowMinimize		\N	\N	27	\N	9854
9855	faWindowRestore		\N	\N	27	\N	9855
9856	faWindows		\N	\N	27	\N	9856
9857	faWineBottle		\N	\N	27	\N	9857
9858	faWineGlass		\N	\N	27	\N	9858
9859	faWineGlassEmpty		\N	\N	27	\N	9859
9860	faWirsindhandwerk		\N	\N	27	\N	9860
9861	faWix		\N	\N	27	\N	9861
9862	faWizardsOfTheCoast		\N	\N	27	\N	9862
9863	faWodu		\N	\N	27	\N	9863
9864	faWolfPackBattalion		\N	\N	27	\N	9864
9865	faWonSign		\N	\N	27	\N	9865
9866	faWordpress		\N	\N	27	\N	9866
9867	faWordpressSimple		\N	\N	27	\N	9867
9868	faWorm		\N	\N	27	\N	9868
9869	faWpbeginner		\N	\N	27	\N	9869
9870	faWpexplorer		\N	\N	27	\N	9870
9871	faWpforms		\N	\N	27	\N	9871
9872	faWpressr		\N	\N	27	\N	9872
9873	faWrench		\N	\N	27	\N	9873
9874	faX		\N	\N	27	\N	9874
9875	faXRay		\N	\N	27	\N	9875
9876	faXTwitter		\N	\N	27	\N	9876
9877	faXbox		\N	\N	27	\N	9877
9878	faXing		\N	\N	27	\N	9878
9879	faXmark		\N	\N	27	\N	9879
9880	faXmarksLines		\N	\N	27	\N	9880
9881	faY		\N	\N	27	\N	9881
9882	faYCombinator		\N	\N	27	\N	9882
9883	faYahoo		\N	\N	27	\N	9883
9884	faYammer		\N	\N	27	\N	9884
9885	faYandex		\N	\N	27	\N	9885
9886	faYandexInternational		\N	\N	27	\N	9886
9887	faYarn		\N	\N	27	\N	9887
9888	faYelp		\N	\N	27	\N	9888
9889	faYenSign		\N	\N	27	\N	9889
9890	faYinYang		\N	\N	27	\N	9890
9891	faYoast		\N	\N	27	\N	9891
9892	faYoutube		\N	\N	27	\N	9892
9893	faZ		\N	\N	27	\N	9893
9894	faZhihu		\N	\N	27	\N	9894
100019	enfermeridad	xd	\N	0	110	\N	\N
\.


--
-- TOC entry 4847 (class 0 OID 91643)
-- Dependencies: 221
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id_curso, id_nombre, id_type, id_status, duracion, descripcion_corto, descripcion_html, costo, codigo, id_facilitador, id_foto, id_modalidad, id_forma_pago) FROM stdin;
\.


--
-- TOC entry 4849 (class 0 OID 91649)
-- Dependencies: 223
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos (id_documento, id_tipo, fecha_hora, url, descripcion) FROM stdin;
\.


--
-- TOC entry 4851 (class 0 OID 91655)
-- Dependencies: 225
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (id_persona, nombre, apellido, telefono, "contraseña", id_genero, id_rol, id_pregunta, cedula, gmail, id_foto, id_status, respuesta) FROM stdin;
5	Isaac	Cattoni	04143173920	$2b$10$Q9qlT/W8BsNftjep/HNj/uABpSGCVth40Z6hKK5kHG8e4QVnVecRC	6	12	9	30551898	iujo@gmail.com	\N	\N	$2b$10$HW/3Qwc7wZKocPnk4itWv.zbKAy9QFuzdElvbcL/YtKZ2V5AWb5xC
6	Isaac	Cattoni	04143173920	$2b$10$N5lYkLxjUwzVQkgmBqiGyOgKLyEAXEisiZcAn76fOquvxc/s/70ii	6	13	9	30551897	isaac1@gmail.com	\N	\N	$2b$10$rgiSV9/3B0wAI1BH7GqwquJMhfFQHL4rDy/UzSPKvNVSDf/ryJeou
7	Isaac	xd	04143173920	$2b$10$ul33ZYSU99li06.Ug2e/2e6YhGhn/LabFkkRCYlf1a4j.uyoPr6ii	6	13	9	12344566	isaac13@gmail.com	\N	\N	$2b$10$8ThTD4NIjqb67ivoxAQLtuhSBvAlkpszj3fOPx0yq9TyUaDnJctuC
1	Victor	Gainza	1234567890	$2b$10$/Z0dUmPJqTKSZa1uctJSAeH2g/KH2xSIiiRDyT1HQ/ZP6xnYz5r0W	6	15	9	1234567890	superadmin@empresa.com	\N	\N	$2b$10$zhsw9kAZbVtOfk40DbyIneyr6xahazAuKjuD86iIeQBAI8UVY4ylK
8	javier	trujillo	041421492126	$2b$10$ZS82Roz4eNC8QLndn7MOd.SecqIfb9I7iqWt.3M6r6tI1pSv/fEQ6	6	12	9	30123123	trujillo@gmail.com	\N	\N	$2b$10$LS8vR4lJF89amEYnQ9Z98uxoDbO8fPq4BVTqck4thD9g5C5okiwna
9	Isaac	Cattoni	04143173920	$2b$10$eIJOhMBycFYniSEvao/Zp.TXUUCJp5PuGnTO7p3hh/wIN71a5XScu	6	12	9	1234567	xd@gmail.com	\N	\N	$2b$10$JgexyWZVyAmexZUeqo8i/uSDOOnKvI2QEajW2.y8Df7jXbThdQrRC
10	Isaac	Cattoni	04143173920	$2b$10$sS9cqXJUo5HfwL4ZiU57LuDQJYsWduQG46XSl2g1rwUjuLbyRKrri	6	12	9	1	isaac12@gmail.com	\N	\N	$2b$10$qJAnfDIuB.XrPd70JYKFdeNS.B2GNPlALHDjQlZ1TxeaSVgwilHfO
\.


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 218
-- Name: auditorias_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditorias_id_auditoria_seq', 1, false);


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 220
-- Name: clasificacion_id_clasificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clasificacion_id_clasificacion_seq', 100022, true);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 222
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 1, false);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 224
-- Name: documentos_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_id_documento_seq', 1, false);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 226
-- Name: personas_id_persona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personas_id_persona_seq', 10, true);


--
-- TOC entry 4667 (class 2606 OID 91667)
-- Name: auditorias auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_pkey PRIMARY KEY (id_auditoria);


--
-- TOC entry 4669 (class 2606 OID 91669)
-- Name: clasificacion clasificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_pkey PRIMARY KEY (id_clasificacion);


--
-- TOC entry 4671 (class 2606 OID 91671)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- TOC entry 4673 (class 2606 OID 91673)
-- Name: documentos documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id_documento);


--
-- TOC entry 4675 (class 2606 OID 91675)
-- Name: personas personas_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_cedula_key UNIQUE (cedula);


--
-- TOC entry 4677 (class 2606 OID 91677)
-- Name: personas personas_gmail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_gmail_key UNIQUE (gmail);


--
-- TOC entry 4679 (class 2606 OID 91679)
-- Name: personas personas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 4680 (class 2606 OID 91680)
-- Name: auditorias auditorias_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4681 (class 2606 OID 91685)
-- Name: auditorias auditorias_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4682 (class 2606 OID 91690)
-- Name: clasificacion clasificacion_id_icono_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_id_icono_fkey FOREIGN KEY (id_icono) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4683 (class 2606 OID 91695)
-- Name: clasificacion clasificacion_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4684 (class 2606 OID 91700)
-- Name: clasificacion clasificacion_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4685 (class 2606 OID 91705)
-- Name: cursos cursos_id_facilitador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_facilitador_fkey FOREIGN KEY (id_facilitador) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4686 (class 2606 OID 91710)
-- Name: cursos cursos_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4687 (class 2606 OID 91715)
-- Name: cursos cursos_id_foto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_foto_fkey FOREIGN KEY (id_foto) REFERENCES public.documentos(id_documento) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4688 (class 2606 OID 91725)
-- Name: cursos cursos_id_modalidad_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_modalidad_fkey1 FOREIGN KEY (id_modalidad) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4689 (class 2606 OID 91730)
-- Name: cursos cursos_id_nombre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_nombre_fkey FOREIGN KEY (id_nombre) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4690 (class 2606 OID 91735)
-- Name: cursos cursos_id_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4691 (class 2606 OID 91740)
-- Name: cursos cursos_id_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_type_fkey FOREIGN KEY (id_type) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4692 (class 2606 OID 91745)
-- Name: documentos documentos_id_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_id_tipo_fkey FOREIGN KEY (id_tipo) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4693 (class 2606 OID 91750)
-- Name: personas personas_id_foto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_foto_fkey FOREIGN KEY (id_foto) REFERENCES public.documentos(id_documento) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4694 (class 2606 OID 91755)
-- Name: personas personas_id_genero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_genero_fkey FOREIGN KEY (id_genero) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4695 (class 2606 OID 91765)
-- Name: personas personas_id_pregunta_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_pregunta_fkey1 FOREIGN KEY (id_pregunta) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4696 (class 2606 OID 91770)
-- Name: personas personas_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4697 (class 2606 OID 91775)
-- Name: personas personas_id_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2025-05-14 10:41:46

--
-- PostgreSQL database dump complete
--

