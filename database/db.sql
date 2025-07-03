--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-07-03 12:14:30

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
-- TOC entry 227 (class 1255 OID 108232)
-- Name: check_fechas_horarios(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_fechas_horarios() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
  IF NEW.fecha_hora_fin < NEW.fecha_hora_inicio THEN
    RAISE EXCEPTION 'PGT: FECHA FIN INFERIOR';
  END IF;
  RETURN NEW;
END;$$;


ALTER FUNCTION public.check_fechas_horarios() OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 108370)
-- Name: obtener_jerarquia_desde(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_jerarquia_desde(id_raiz integer) RETURNS TABLE(id integer, nombre text, descripcion text, type_id integer, parent_id integer, id_icono integer, icono text, nivel integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE jerarquia AS (
        SELECT 
            c.id_clasificacion AS id,
            c.nombre::text,
            c.descripcion::text,
            c.type_id::integer,
            c.parent_id::integer,
            c.id_icono::integer,
            1 AS nivel
        FROM clasificacion c
        WHERE c.id_clasificacion = id_raiz

        UNION ALL

        SELECT 
            h.id_clasificacion,
            h.nombre::text,
            h.descripcion::text,
            h.type_id::integer,
            h.parent_id::integer,
            h.id_icono::integer,
            j.nivel + 1
        FROM clasificacion h
        INNER JOIN jerarquia j ON h.parent_id = j.id
    )
    SELECT 
        jerarquia.id, 
        jerarquia.nombre, 
        jerarquia.descripcion, 
        jerarquia.type_id, 
        jerarquia.parent_id, 
        jerarquia.id_icono, 
        icono.nombre::text AS icono,  -- <--- CAST EXPLÍCITO AQUÍ
        jerarquia.nivel
    FROM jerarquia
    LEFT JOIN clasificacion icono ON jerarquia.id_icono = icono.id_clasificacion
    ORDER BY jerarquia.nivel, jerarquia.nombre;
END;
$$;


ALTER FUNCTION public.obtener_jerarquia_desde(id_raiz integer) OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 108377)
-- Name: obtener_parents(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_parents(p_id_clasificacion integer) RETURNS TABLE(id_clasificacion integer, nombre character varying, descripcion character varying, type_id bigint, id_icono bigint, adicional jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_current_id INTEGER := p_id_clasificacion;
BEGIN
    WHILE v_current_id IS NOT NULL LOOP
        RETURN QUERY
        SELECT 
            c.id_clasificacion::integer, 
            c.nombre::character varying, 
            c.descripcion::character varying,
            c.type_id::bigint,
            c.id_icono::bigint,
            c.adicional::jsonb
        FROM public.clasificacion c
        WHERE c.id_clasificacion = v_current_id;

        SELECT d.parent_id INTO v_current_id
        FROM public.clasificacion d
        WHERE d.id_clasificacion = v_current_id;
    END LOOP;
END;
$$;


ALTER FUNCTION public.obtener_parents(p_id_clasificacion integer) OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 108234)
-- Name: proteger_clasificacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.proteger_clasificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Para operaciones de ELIMINACIÓN (DELETE)
    IF TG_OP = 'DELETE' THEN
        IF OLD.protected = 1 THEN
            RAISE EXCEPTION 'PGT: Prohibido eliminar Clasificación';
        END IF;
    END IF;

    -- Para operaciones de ACTUALIZACIÓN (UPDATE)
    IF TG_OP = 'UPDATE' THEN
        -- Impedir la modificación del campo 'protected' si ya es 1
        IF OLD.protected = 1 AND NEW.protected <> 1 THEN
            RAISE EXCEPTION 'PGT: Prohibido cambiar valor "protected"';
        END IF;
        -- Impedir cualquier actualización si el registro está protegido (protected = 1)
        IF OLD.protected = 1 THEN
            RAISE EXCEPTION 'PGT: Prohibido actualizar Clasificación';
        END IF;
    END IF;

    RETURN NEW; -- Para UPDATE e INSERT, siempre se debe retornar NEW
END;
$$;


ALTER FUNCTION public.proteger_clasificacion() OWNER TO postgres;

--
-- TOC entry 229 (class 1255 OID 108235)
-- Name: proteger_data_clasificacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.proteger_data_clasificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    
    IF TG_OP = 'DELETE' THEN
      
        IF OLD.protected = 1 THEN
            RAISE EXCEPTION 'PGT: Prohibido eliminar Clasificación (Registro protegido)';
        END IF;
     
        RETURN OLD; 
    END IF;

    IF TG_OP = 'UPDATE' THEN
    
        IF OLD.protected = 1 AND NEW.protected <> 1 THEN
            -- RAISE EXCEPTION 'PGT: Prohibido cambiar valor "protected"';
			RETURN NEW;
        END IF;
    
        IF OLD.protected = 1 THEN
            RAISE EXCEPTION 'PGT: Prohibido actualizar Clasificación (Registro protegido)';
        END IF;
        RETURN NEW; 
    END IF;

    IF TG_OP = 'INSERT' THEN
      
        RETURN NEW;
    END IF;

    RETURN NEW; 
END;
$$;


ALTER FUNCTION public.proteger_data_clasificacion() OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 108236)
-- Name: validar_clasificacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_clasificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Verificar si hay un id duplicado en el campo adicional SOLO SI type_id = 5 y parent_id es el mismo
    IF NEW.type_id = 5 AND EXISTS (
        SELECT 1 FROM public.clasificacion
        WHERE type_id = 5
        AND parent_id = NEW.parent_id
        AND LOWER((adicional->>'id')) = LOWER((NEW.adicional->>'id'))
        AND id_clasificacion <> NEW.id_clasificacion
    ) THEN
        RAISE EXCEPTION 'Ya existe un curso con el mismo parent_id y el mismo ID dentro de adicional (%).', NEW.adicional->>'id';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_clasificacion() OWNER TO postgres;

--
-- TOC entry 231 (class 1255 OID 108237)
-- Name: validar_codigo_cohorte(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_codigo_cohorte() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.codigo_cohorte IS DISTINCT FROM OLD.codigo_cohorte OR NEW.id_nombre IS DISTINCT FROM OLD.id_nombre THEN
        IF NEW.codigo_cohorte IS NOT NULL AND TRIM(NEW.codigo_cohorte) != '' THEN
            IF EXISTS (
                SELECT 1 FROM public.cursos
                WHERE UPPER(TRIM(codigo_cohorte)) = UPPER(TRIM(NEW.codigo_cohorte))
                AND id_nombre = COALESCE(NEW.id_nombre, 0)
                AND id_curso IS DISTINCT FROM OLD.id_curso 
            ) THEN
                RAISE EXCEPTION 'PGT: Ya existe un código de cohorte (%) para el mismo curso (id_nombre: %).', NEW.codigo_cohorte, NEW.id_nombre;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_codigo_cohorte() OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 108379)
-- Name: validar_codigo_curso(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_codigo_curso() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_instituto_id bigint;
BEGIN
    -- Solo aplica para cursos
    IF NEW.type_id = 5 THEN
        -- Subir la jerarquía: curso -> programa -> carrera -> instituto
        SELECT cc3.parent_id INTO v_instituto_id
        FROM public.clasificacion c
        LEFT JOIN public.clasificacion cc1 ON c.parent_id = cc1.id_clasificacion -- programa
        LEFT JOIN public.clasificacion cc2 ON cc1.parent_id = cc2.id_clasificacion -- carrera
        LEFT JOIN public.clasificacion cc3 ON cc2.parent_id = cc3.id_clasificacion -- instituto
        WHERE c.id_clasificacion = NEW.id_clasificacion;

        IF v_instituto_id IS NULL THEN
            RAISE EXCEPTION 'PGT: No se pudo determinar el instituto del curso (id_clasificacion: %)', NEW.id_clasificacion;
        END IF;

        -- Buscar si existe otro curso con el mismo código bajo el mismo instituto
        IF EXISTS (
            SELECT 1
            FROM public.clasificacion c
            LEFT JOIN public.clasificacion cc1 ON c.parent_id = cc1.id_clasificacion -- programa
            LEFT JOIN public.clasificacion cc2 ON cc1.parent_id = cc2.id_clasificacion -- carrera
            LEFT JOIN public.clasificacion cc3 ON cc2.parent_id = cc3.id_clasificacion -- instituto
            WHERE c.type_id = 5
              AND cc3.parent_id = v_instituto_id
              AND LOWER(c.adicional->>'id') = LOWER(NEW.adicional->>'id')
              AND c.id_clasificacion <> NEW.id_clasificacion
        ) THEN
            RAISE EXCEPTION 'PGT: Ya existe un curso con el mismo código bajo el mismo instituto.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_codigo_curso() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 108238)
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
-- TOC entry 218 (class 1259 OID 108243)
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
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 218
-- Name: auditorias_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditorias_id_auditoria_seq OWNED BY public.auditorias.id_auditoria;


--
-- TOC entry 219 (class 1259 OID 108244)
-- Name: clasificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clasificacion (
    id_clasificacion integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying,
    orden integer,
    type_id bigint,
    parent_id bigint,
    id_icono bigint,
    adicional jsonb,
    protected integer DEFAULT 0 NOT NULL,
    documentos json
);


ALTER TABLE public.clasificacion OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 108250)
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
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 220
-- Name: clasificacion_id_clasificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clasificacion_id_clasificacion_seq OWNED BY public.clasificacion.id_clasificacion;


--
-- TOC entry 221 (class 1259 OID 108251)
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
    fecha_hora_inicio timestamp without time zone,
    fecha_hora_fin timestamp without time zone,
    color character varying,
    partipantes json,
    codigo_cohorte character varying,
    horarios json,
    propiedades_curso json,
    documentos json
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 108256)
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
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 222
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_curso_seq OWNED BY public.cursos.id_curso;


--
-- TOC entry 223 (class 1259 OID 108257)
-- Name: documentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos (
    id_documento integer NOT NULL,
    id_tipo bigint NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    nombre character varying,
    descripcion character varying,
    ext character varying,
    tamano bigint DEFAULT 0
);


ALTER TABLE public.documentos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 108263)
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
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 224
-- Name: documentos_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_id_documento_seq OWNED BY public.documentos.id_documento;


--
-- TOC entry 225 (class 1259 OID 108264)
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    id_persona integer NOT NULL,
    nombre character varying NOT NULL,
    apellido character varying NOT NULL,
    telefono character varying NOT NULL,
    contrasena character varying NOT NULL,
    id_genero bigint NOT NULL,
    id_pregunta bigint NOT NULL,
    cedula bigint NOT NULL,
    gmail character varying NOT NULL,
    id_status bigint,
    respuesta character varying NOT NULL,
    id_rol json,
    documentos json
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 108269)
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
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 226
-- Name: personas_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personas_id_persona_seq OWNED BY public.personas.id_persona;


--
-- TOC entry 4669 (class 2604 OID 108270)
-- Name: auditorias id_auditoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditorias_id_auditoria_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 108271)
-- Name: clasificacion id_clasificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion ALTER COLUMN id_clasificacion SET DEFAULT nextval('public.clasificacion_id_clasificacion_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 108272)
-- Name: cursos id_curso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id_curso SET DEFAULT nextval('public.cursos_id_curso_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 108273)
-- Name: documentos id_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id_documento SET DEFAULT nextval('public.documentos_id_documento_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 108274)
-- Name: personas id_persona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas ALTER COLUMN id_persona SET DEFAULT nextval('public.personas_id_persona_seq'::regclass);


--
-- TOC entry 4854 (class 0 OID 108238)
-- Dependencies: 217
-- Data for Name: auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditorias (id_auditoria, fecha_hora, ip, descripcion, id_persona, id_evento) FROM stdin;
\.


--
-- TOC entry 4856 (class 0 OID 108244)
-- Dependencies: 219
-- Data for Name: clasificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clasificacion (id_clasificacion, nombre, descripcion, orden, type_id, parent_id, id_icono, adicional, protected, documentos) FROM stdin;
14	Personal IUJO		7	3	11	\N	{"id_objeto": []}	0	\N
13	Participante Externo		8	3	11	\N	{"id_objeto": []}	0	\N
100004	faMapLocationDot	xx	\N	27	\N	100004	\N	1	\N
8065	faArrowLeft		\N	27	\N	8065	\N	1	\N
8066	faArrowLeftLong		\N	27	\N	8066	\N	1	\N
8067	faArrowPointer		\N	27	\N	8067	\N	1	\N
8068	faArrowRight		\N	27	\N	8068	\N	1	\N
8069	faArrowRightArrowLeft		\N	27	\N	8069	\N	1	\N
8070	faArrowRightFromBracket		\N	27	\N	8070	\N	1	\N
8071	faArrowRightLong		\N	27	\N	8071	\N	1	\N
8072	faArrowRightToBracket		\N	27	\N	8072	\N	1	\N
8073	faArrowRightToCity		\N	27	\N	8073	\N	1	\N
8074	faArrowRotateLeft		\N	27	\N	8074	\N	1	\N
8075	faArrowRotateRight		\N	27	\N	8075	\N	1	\N
9	¿Cuál es tu Animal favorito?		0	8	\N	8882	\N	0	\N
8076	faArrowTrendDown		\N	27	\N	8076	\N	1	\N
11	Participante 	Tiene acceso solo a participar a los cursos \n	5	3	\N	9503	{"id_objeto": []}	0	\N
8077	faArrowTrendUp		\N	27	\N	8077	\N	1	\N
8078	faArrowTurnDown		\N	27	\N	8078	\N	1	\N
8079	faArrowTurnUp		\N	27	\N	8079	\N	1	\N
8080	faArrowUp		\N	27	\N	8080	\N	1	\N
8081	faArrowUp19		\N	27	\N	8081	\N	1	\N
8082	faArrowUp91		\N	27	\N	8082	\N	1	\N
57	¿Cuál es tu pelicula favorita?		0	8	\N	8683	\N	0	\N
100128	Navidad	25/12	7	100121	100121	\N	\N	0	\N
84	¿Cuál es tu comida favorita?		0	8	\N	8698	\N	0	\N
96	Facilitador	Tiene acceso a ver los cursos que da	3	3	\N	8319	{"id_objeto": [100067, 100068, 100164, 100141, 100167, 100171, 100142, 100066, 100154], "id_clasificacion": [3, 73, 5]}	0	\N
98	Administrador	Tiene acceso a los programas y cursos	2	3	\N	\N	{"id_objeto": [100066, 100154, 100067, 100158, 100157, 100166, 100160, 100162, 100068, 100164, 100142, 100167, 100171, 100159, 100141], "id_clasificacion": [100172]}	0	\N
10001	Amazonas		\N	122	122	\N	\N	1	\N
123	Municipios	Lista de Municipios de Venezuela	60	\N	\N	9048	\N	1	\N
124	Parroquias	Lista de Parroquias de Venezuela	70	\N	\N	100005	\N	1	\N
122	Estados	Lista de Estados de Venezuela	50	\N	\N	100004	\N	1	\N
10002	Anzoátegui		\N	122	\N	\N	\N	1	\N
10003	Apure		\N	122	\N	\N	\N	1	\N
10004	Aragua		\N	122	\N	\N	\N	1	\N
10005	Barinas		\N	122	\N	\N	\N	1	\N
10006	Bolívar		\N	122	\N	\N	\N	1	\N
10007	Carabobo		\N	122	\N	\N	\N	1	\N
10008	Cojedes		\N	122	\N	\N	\N	1	\N
10009	Delta Amacuro		\N	122	\N	\N	\N	1	\N
100289	Foto de Perfil del Usuario		0	100094	\N	\N	\N	0	\N
8009	fa9		\N	27	\N	8009	\N	1	\N
8012	faA		\N	27	\N	8012	\N	1	\N
8015	faAddressBook		\N	27	\N	8015	\N	1	\N
8016	faAddressCard		\N	27	\N	8016	\N	1	\N
8022	faAlignCenter		\N	27	\N	8022	\N	1	\N
8023	faAlignJustify		\N	27	\N	8023	\N	1	\N
8024	faAlignLeft		\N	27	\N	8024	\N	1	\N
8025	faAlignRight		\N	27	\N	8025	\N	1	\N
8030	faAnchor		\N	27	\N	8030	\N	1	\N
8031	faAnchorCircleCheck		\N	27	\N	8031	\N	1	\N
8032	faAnchorCircleExclamation		\N	27	\N	8032	\N	1	\N
8033	faAnchorCircleXmark		\N	27	\N	8033	\N	1	\N
8034	faAnchorLock		\N	27	\N	8034	\N	1	\N
8037	faAngleDown		\N	27	\N	8037	\N	1	\N
8038	faAngleLeft		\N	27	\N	8038	\N	1	\N
8039	faAngleRight		\N	27	\N	8039	\N	1	\N
8040	faAngleUp		\N	27	\N	8040	\N	1	\N
8041	faAnglesDown		\N	27	\N	8041	\N	1	\N
8042	faAnglesLeft		\N	27	\N	8042	\N	1	\N
8043	faAnglesRight		\N	27	\N	8043	\N	1	\N
8044	faAnglesUp		\N	27	\N	8044	\N	1	\N
8047	faAnkh		\N	27	\N	8047	\N	1	\N
8048	faAppStore		\N	27	\N	8048	\N	1	\N
8049	faAppStoreIos		\N	27	\N	8049	\N	1	\N
8053	faAppleWhole		\N	27	\N	8053	\N	1	\N
8054	faArchway		\N	27	\N	8054	\N	1	\N
8055	faArrowDown		\N	27	\N	8055	\N	1	\N
8056	faArrowDown19		\N	27	\N	8056	\N	1	\N
8057	faArrowDown91		\N	27	\N	8057	\N	1	\N
8058	faArrowDownAZ		\N	27	\N	8058	\N	1	\N
8059	faArrowDownLong		\N	27	\N	8059	\N	1	\N
8060	faArrowDownShortWide		\N	27	\N	8060	\N	1	\N
8061	faArrowDownUpAcrossLine		\N	27	\N	8061	\N	1	\N
8062	faArrowDownUpLock		\N	27	\N	8062	\N	1	\N
8063	faArrowDownWideShort		\N	27	\N	8063	\N	1	\N
8064	faArrowDownZA		\N	27	\N	8064	\N	1	\N
8083	faArrowUpAZ		\N	27	\N	8083	\N	1	\N
8084	faArrowUpFromBracket		\N	27	\N	8084	\N	1	\N
8085	faArrowUpFromGroundWater		\N	27	\N	8085	\N	1	\N
8086	faArrowUpFromWaterPump		\N	27	\N	8086	\N	1	\N
8087	faArrowUpLong		\N	27	\N	8087	\N	1	\N
8088	faArrowUpRightDots		\N	27	\N	8088	\N	1	\N
8089	faArrowUpRightFromSquare		\N	27	\N	8089	\N	1	\N
8090	faArrowUpShortWide		\N	27	\N	8090	\N	1	\N
4	Programas	Programas del CEP\n	30	\N	\N	9072	\N	0	\N
8091	faArrowUpWideShort		\N	27	\N	8091	\N	1	\N
8092	faArrowUpZA		\N	27	\N	8092	\N	1	\N
1	Géneros		100	\N	\N	9792	\N	0	\N
8093	faArrowsDownToLine		\N	27	\N	8093	\N	1	\N
8094	faArrowsDownToPeople		\N	27	\N	8094	\N	1	\N
8095	faArrowsLeftRight		\N	27	\N	8095	\N	1	\N
8096	faArrowsLeftRightToLine		\N	27	\N	8096	\N	1	\N
8097	faArrowsRotate		\N	27	\N	8097	\N	1	\N
8098	faArrowsSpin		\N	27	\N	8098	\N	1	\N
8099	faArrowsSplitUpAndLeft		\N	27	\N	8099	\N	1	\N
8100	faArrowsToCircle		\N	27	\N	8100	\N	1	\N
8101	faArrowsToDot		\N	27	\N	8101	\N	1	\N
8102	faArrowsToEye		\N	27	\N	8102	\N	1	\N
8103	faArrowsTurnRight		\N	27	\N	8103	\N	1	\N
8104	faArrowsTurnToDots		\N	27	\N	8104	\N	1	\N
8105	faArrowsUpDown		\N	27	\N	8105	\N	1	\N
8106	faArrowsUpDownLeftRight		\N	27	\N	8106	\N	1	\N
8107	faArrowsUpToLine		\N	27	\N	8107	\N	1	\N
8109	faAsterisk		\N	27	\N	8109	\N	1	\N
8110	faAsymmetrik		\N	27	\N	8110	\N	1	\N
8111	faAt		\N	27	\N	8111	\N	1	\N
8112	faAtlassian		\N	27	\N	8112	\N	1	\N
8113	faAtom		\N	27	\N	8113	\N	1	\N
8114	faAudible		\N	27	\N	8114	\N	1	\N
8115	faAudioDescription		\N	27	\N	8115	\N	1	\N
8116	faAustralSign		\N	27	\N	8116	\N	1	\N
8117	faAutoprefixer		\N	27	\N	8117	\N	1	\N
8118	faAvianex		\N	27	\N	8118	\N	1	\N
8119	faAviato		\N	27	\N	8119	\N	1	\N
8120	faAward		\N	27	\N	8120	\N	1	\N
8121	faAws		\N	27	\N	8121	\N	1	\N
8122	faB		\N	27	\N	8122	\N	1	\N
8123	faBaby		\N	27	\N	8123	\N	1	\N
8124	faBabyCarriage		\N	27	\N	8124	\N	1	\N
8125	faBackward		\N	27	\N	8125	\N	1	\N
8126	faBackwardFast		\N	27	\N	8126	\N	1	\N
8127	faBackwardStep		\N	27	\N	8127	\N	1	\N
8128	faBacon		\N	27	\N	8128	\N	1	\N
8129	faBacteria		\N	27	\N	8129	\N	1	\N
8130	faBacterium		\N	27	\N	8130	\N	1	\N
8131	faBagShopping		\N	27	\N	8131	\N	1	\N
8132	faBahai		\N	27	\N	8132	\N	1	\N
8133	faBahtSign		\N	27	\N	8133	\N	1	\N
8134	faBan		\N	27	\N	8134	\N	1	\N
8135	faBanSmoking		\N	27	\N	8135	\N	1	\N
8136	faBandage		\N	27	\N	8136	\N	1	\N
8137	faBandcamp		\N	27	\N	8137	\N	1	\N
8138	faBangladeshiTakaSign		\N	27	\N	8138	\N	1	\N
8139	faBarcode		\N	27	\N	8139	\N	1	\N
8140	faBars		\N	27	\N	8140	\N	1	\N
8141	faBarsProgress		\N	27	\N	8141	\N	1	\N
8142	faBarsStaggered		\N	27	\N	8142	\N	1	\N
8143	faBaseball		\N	27	\N	8143	\N	1	\N
8144	faBaseballBatBall		\N	27	\N	8144	\N	1	\N
8145	faBasketShopping		\N	27	\N	8145	\N	1	\N
8146	faBasketball		\N	27	\N	8146	\N	1	\N
8147	faBath		\N	27	\N	8147	\N	1	\N
8148	faBatteryEmpty		\N	27	\N	8148	\N	1	\N
8149	faBatteryFull		\N	27	\N	8149	\N	1	\N
8150	faBatteryHalf		\N	27	\N	8150	\N	1	\N
8151	faBatteryQuarter		\N	27	\N	8151	\N	1	\N
8152	faBatteryThreeQuarters		\N	27	\N	8152	\N	1	\N
8153	faBattleNet		\N	27	\N	8153	\N	1	\N
8154	faBed		\N	27	\N	8154	\N	1	\N
8155	faBedPulse		\N	27	\N	8155	\N	1	\N
8156	faBeerMugEmpty		\N	27	\N	8156	\N	1	\N
8157	faBehance		\N	27	\N	8157	\N	1	\N
8158	faBell		\N	27	\N	8158	\N	1	\N
8159	faBellConcierge		\N	27	\N	8159	\N	1	\N
8160	faBellSlash		\N	27	\N	8160	\N	1	\N
8161	faBezierCurve		\N	27	\N	8161	\N	1	\N
8162	faBicycle		\N	27	\N	8162	\N	1	\N
8163	faBilibili		\N	27	\N	8163	\N	1	\N
8164	faBimobject		\N	27	\N	8164	\N	1	\N
8165	faBinoculars		\N	27	\N	8165	\N	1	\N
8166	faBiohazard		\N	27	\N	8166	\N	1	\N
8167	faBitbucket		\N	27	\N	8167	\N	1	\N
8168	faBitcoin		\N	27	\N	8168	\N	1	\N
8169	faBitcoinSign		\N	27	\N	8169	\N	1	\N
8170	faBity		\N	27	\N	8170	\N	1	\N
8171	faBlackTie		\N	27	\N	8171	\N	1	\N
8172	faBlackberry		\N	27	\N	8172	\N	1	\N
8173	faBlender		\N	27	\N	8173	\N	1	\N
8174	faBlenderPhone		\N	27	\N	8174	\N	1	\N
8175	faBlog		\N	27	\N	8175	\N	1	\N
8176	faBlogger		\N	27	\N	8176	\N	1	\N
8177	faBloggerB		\N	27	\N	8177	\N	1	\N
8178	faBluesky		\N	27	\N	8178	\N	1	\N
8179	faBluetooth		\N	27	\N	8179	\N	1	\N
8180	faBluetoothB		\N	27	\N	8180	\N	1	\N
8181	faBold		\N	27	\N	8181	\N	1	\N
8182	faBolt		\N	27	\N	8182	\N	1	\N
8183	faBoltLightning		\N	27	\N	8183	\N	1	\N
8184	faBomb		\N	27	\N	8184	\N	1	\N
8185	faBone		\N	27	\N	8185	\N	1	\N
8186	faBong		\N	27	\N	8186	\N	1	\N
8187	faBook		\N	27	\N	8187	\N	1	\N
8188	faBookAtlas		\N	27	\N	8188	\N	1	\N
8189	faBookBible		\N	27	\N	8189	\N	1	\N
8190	faBookBookmark		\N	27	\N	8190	\N	1	\N
8191	faBookJournalWhills		\N	27	\N	8191	\N	1	\N
8192	faBookMedical		\N	27	\N	8192	\N	1	\N
8193	faBookOpen		\N	27	\N	8193	\N	1	\N
8194	faBookOpenReader		\N	27	\N	8194	\N	1	\N
8195	faBookQuran		\N	27	\N	8195	\N	1	\N
8196	faBookSkull		\N	27	\N	8196	\N	1	\N
8197	faBookTanakh		\N	27	\N	8197	\N	1	\N
8198	faBookmark		\N	27	\N	8198	\N	1	\N
8199	faBootstrap		\N	27	\N	8199	\N	1	\N
8200	faBorderAll		\N	27	\N	8200	\N	1	\N
8201	faBorderNone		\N	27	\N	8201	\N	1	\N
8202	faBorderTopLeft		\N	27	\N	8202	\N	1	\N
8203	faBoreHole		\N	27	\N	8203	\N	1	\N
8204	faBots		\N	27	\N	8204	\N	1	\N
8205	faBottleDroplet		\N	27	\N	8205	\N	1	\N
8206	faBottleWater		\N	27	\N	8206	\N	1	\N
8207	faBowlFood		\N	27	\N	8207	\N	1	\N
8208	faBowlRice		\N	27	\N	8208	\N	1	\N
8209	faBowlingBall		\N	27	\N	8209	\N	1	\N
8210	faBox		\N	27	\N	8210	\N	1	\N
8211	faBoxArchive		\N	27	\N	8211	\N	1	\N
8212	faBoxOpen		\N	27	\N	8212	\N	1	\N
8213	faBoxTissue		\N	27	\N	8213	\N	1	\N
8214	faBoxesPacking		\N	27	\N	8214	\N	1	\N
8215	faBoxesStacked		\N	27	\N	8215	\N	1	\N
8216	faBraille		\N	27	\N	8216	\N	1	\N
8217	faBrain		\N	27	\N	8217	\N	1	\N
8218	faBrave		\N	27	\N	8218	\N	1	\N
8219	faBraveReverse		\N	27	\N	8219	\N	1	\N
8220	faBrazilianRealSign		\N	27	\N	8220	\N	1	\N
8221	faBreadSlice		\N	27	\N	8221	\N	1	\N
8222	faBridge		\N	27	\N	8222	\N	1	\N
8223	faBridgeCircleCheck		\N	27	\N	8223	\N	1	\N
8224	faBridgeCircleExclamation		\N	27	\N	8224	\N	1	\N
8225	faBridgeCircleXmark		\N	27	\N	8225	\N	1	\N
8226	faBridgeLock		\N	27	\N	8226	\N	1	\N
8227	faBridgeWater		\N	27	\N	8227	\N	1	\N
8228	faBriefcase		\N	27	\N	8228	\N	1	\N
8229	faBriefcaseMedical		\N	27	\N	8229	\N	1	\N
8230	faBroom		\N	27	\N	8230	\N	1	\N
8231	faBroomBall		\N	27	\N	8231	\N	1	\N
8232	faBrush		\N	27	\N	8232	\N	1	\N
8233	faBtc		\N	27	\N	8233	\N	1	\N
8234	faBucket		\N	27	\N	8234	\N	1	\N
8235	faBuffer		\N	27	\N	8235	\N	1	\N
8236	faBug		\N	27	\N	8236	\N	1	\N
8237	faBugSlash		\N	27	\N	8237	\N	1	\N
8238	faBugs		\N	27	\N	8238	\N	1	\N
8239	faBuilding		\N	27	\N	8239	\N	1	\N
8240	faBuildingCircleArrowRight		\N	27	\N	8240	\N	1	\N
8241	faBuildingCircleCheck		\N	27	\N	8241	\N	1	\N
8242	faBuildingCircleExclamation		\N	27	\N	8242	\N	1	\N
8243	faBuildingCircleXmark		\N	27	\N	8243	\N	1	\N
8244	faBuildingColumns		\N	27	\N	8244	\N	1	\N
8245	faBuildingFlag		\N	27	\N	8245	\N	1	\N
8246	faBuildingLock		\N	27	\N	8246	\N	1	\N
8247	faBuildingNgo		\N	27	\N	8247	\N	1	\N
8248	faBuildingShield		\N	27	\N	8248	\N	1	\N
8249	faBuildingUn		\N	27	\N	8249	\N	1	\N
8250	faBuildingUser		\N	27	\N	8250	\N	1	\N
8251	faBuildingWheat		\N	27	\N	8251	\N	1	\N
8252	faBullhorn		\N	27	\N	8252	\N	1	\N
8253	faBullseye		\N	27	\N	8253	\N	1	\N
8254	faBurger		\N	27	\N	8254	\N	1	\N
8255	faBuromobelexperte		\N	27	\N	8255	\N	1	\N
8256	faBurst		\N	27	\N	8256	\N	1	\N
8257	faBus		\N	27	\N	8257	\N	1	\N
8258	faBusSimple		\N	27	\N	8258	\N	1	\N
8259	faBusinessTime		\N	27	\N	8259	\N	1	\N
8260	faBuyNLarge		\N	27	\N	8260	\N	1	\N
8261	faBuysellads		\N	27	\N	8261	\N	1	\N
8262	faC		\N	27	\N	8262	\N	1	\N
8263	faCableCar		\N	27	\N	8263	\N	1	\N
8264	faCakeCandles		\N	27	\N	8264	\N	1	\N
8265	faCalculator		\N	27	\N	8265	\N	1	\N
8266	faCalendar		\N	27	\N	8266	\N	1	\N
8267	faCalendarCheck		\N	27	\N	8267	\N	1	\N
8268	faCalendarDay		\N	27	\N	8268	\N	1	\N
8269	faCalendarDays		\N	27	\N	8269	\N	1	\N
8270	faCalendarMinus		\N	27	\N	8270	\N	1	\N
8271	faCalendarPlus		\N	27	\N	8271	\N	1	\N
8272	faCalendarWeek		\N	27	\N	8272	\N	1	\N
8273	faCalendarXmark		\N	27	\N	8273	\N	1	\N
8274	faCamera		\N	27	\N	8274	\N	1	\N
8275	faCameraRetro		\N	27	\N	8275	\N	1	\N
8276	faCameraRotate		\N	27	\N	8276	\N	1	\N
8277	faCampground		\N	27	\N	8277	\N	1	\N
8278	faCanadianMapleLeaf		\N	27	\N	8278	\N	1	\N
8279	faCandyCane		\N	27	\N	8279	\N	1	\N
8280	faCannabis		\N	27	\N	8280	\N	1	\N
8281	faCapsules		\N	27	\N	8281	\N	1	\N
8282	faCar		\N	27	\N	8282	\N	1	\N
8283	faCarBattery		\N	27	\N	8283	\N	1	\N
8284	faCarBurst		\N	27	\N	8284	\N	1	\N
8285	faCarOn		\N	27	\N	8285	\N	1	\N
8286	faCarRear		\N	27	\N	8286	\N	1	\N
8287	faCarSide		\N	27	\N	8287	\N	1	\N
8288	faCarTunnel		\N	27	\N	8288	\N	1	\N
8289	faCaravan		\N	27	\N	8289	\N	1	\N
8290	faCaretDown		\N	27	\N	8290	\N	1	\N
8291	faCaretLeft		\N	27	\N	8291	\N	1	\N
8292	faCaretRight		\N	27	\N	8292	\N	1	\N
8293	faCaretUp		\N	27	\N	8293	\N	1	\N
8294	faCarrot		\N	27	\N	8294	\N	1	\N
8295	faCartArrowDown		\N	27	\N	8295	\N	1	\N
8296	faCartFlatbed		\N	27	\N	8296	\N	1	\N
8297	faCartFlatbedSuitcase		\N	27	\N	8297	\N	1	\N
8298	faCartPlus		\N	27	\N	8298	\N	1	\N
8299	faCartShopping		\N	27	\N	8299	\N	1	\N
8300	faCashRegister		\N	27	\N	8300	\N	1	\N
8301	faCat		\N	27	\N	8301	\N	1	\N
8302	faCcAmazonPay		\N	27	\N	8302	\N	1	\N
8303	faCcAmex		\N	27	\N	8303	\N	1	\N
8304	faCcApplePay		\N	27	\N	8304	\N	1	\N
8305	faCcDinersClub		\N	27	\N	8305	\N	1	\N
8306	faCcDiscover		\N	27	\N	8306	\N	1	\N
8307	faCcJcb		\N	27	\N	8307	\N	1	\N
8308	faCcMastercard		\N	27	\N	8308	\N	1	\N
8309	faCcPaypal		\N	27	\N	8309	\N	1	\N
8310	faCcStripe		\N	27	\N	8310	\N	1	\N
8311	faCcVisa		\N	27	\N	8311	\N	1	\N
8312	faCediSign		\N	27	\N	8312	\N	1	\N
8313	faCentSign		\N	27	\N	8313	\N	1	\N
8314	faCentercode		\N	27	\N	8314	\N	1	\N
8315	faCentos		\N	27	\N	8315	\N	1	\N
8316	faCertificate		\N	27	\N	8316	\N	1	\N
8317	faChair		\N	27	\N	8317	\N	1	\N
8318	faChalkboard		\N	27	\N	8318	\N	1	\N
8319	faChalkboardUser		\N	27	\N	8319	\N	1	\N
8320	faChampagneGlasses		\N	27	\N	8320	\N	1	\N
8321	faChargingStation		\N	27	\N	8321	\N	1	\N
8322	faChartArea		\N	27	\N	8322	\N	1	\N
8323	faChartBar		\N	27	\N	8323	\N	1	\N
8324	faChartColumn		\N	27	\N	8324	\N	1	\N
8325	faChartDiagram		\N	27	\N	8325	\N	1	\N
8326	faChartGantt		\N	27	\N	8326	\N	1	\N
8327	faChartLine		\N	27	\N	8327	\N	1	\N
8328	faChartPie		\N	27	\N	8328	\N	1	\N
8329	faChartSimple		\N	27	\N	8329	\N	1	\N
8330	faCheck		\N	27	\N	8330	\N	1	\N
8331	faCheckDouble		\N	27	\N	8331	\N	1	\N
8332	faCheckToSlot		\N	27	\N	8332	\N	1	\N
8333	faCheese		\N	27	\N	8333	\N	1	\N
8334	faChess		\N	27	\N	8334	\N	1	\N
8335	faChessBishop		\N	27	\N	8335	\N	1	\N
8336	faChessBoard		\N	27	\N	8336	\N	1	\N
8337	faChessKing		\N	27	\N	8337	\N	1	\N
8338	faChessKnight		\N	27	\N	8338	\N	1	\N
8339	faChessPawn		\N	27	\N	8339	\N	1	\N
8340	faChessQueen		\N	27	\N	8340	\N	1	\N
8341	faChessRook		\N	27	\N	8341	\N	1	\N
8342	faChevronDown		\N	27	\N	8342	\N	1	\N
8343	faChevronLeft		\N	27	\N	8343	\N	1	\N
8344	faChevronRight		\N	27	\N	8344	\N	1	\N
8345	faChevronUp		\N	27	\N	8345	\N	1	\N
8346	faChild		\N	27	\N	8346	\N	1	\N
8347	faChildCombatant		\N	27	\N	8347	\N	1	\N
8348	faChildDress		\N	27	\N	8348	\N	1	\N
8349	faChildReaching		\N	27	\N	8349	\N	1	\N
8350	faChildren		\N	27	\N	8350	\N	1	\N
8351	faChrome		\N	27	\N	8351	\N	1	\N
8352	faChromecast		\N	27	\N	8352	\N	1	\N
8353	faChurch		\N	27	\N	8353	\N	1	\N
8354	faCircle		\N	27	\N	8354	\N	1	\N
8355	faCircleArrowDown		\N	27	\N	8355	\N	1	\N
8356	faCircleArrowLeft		\N	27	\N	8356	\N	1	\N
8357	faCircleArrowRight		\N	27	\N	8357	\N	1	\N
8358	faCircleArrowUp		\N	27	\N	8358	\N	1	\N
8359	faCircleCheck		\N	27	\N	8359	\N	1	\N
8360	faCircleChevronDown		\N	27	\N	8360	\N	1	\N
8361	faCircleChevronLeft		\N	27	\N	8361	\N	1	\N
8362	faCircleChevronRight		\N	27	\N	8362	\N	1	\N
8363	faCircleChevronUp		\N	27	\N	8363	\N	1	\N
8364	faCircleDollarToSlot		\N	27	\N	8364	\N	1	\N
8365	faCircleDot		\N	27	\N	8365	\N	1	\N
8366	faCircleDown		\N	27	\N	8366	\N	1	\N
8367	faCircleExclamation		\N	27	\N	8367	\N	1	\N
8368	faCircleH		\N	27	\N	8368	\N	1	\N
8369	faCircleHalfStroke		\N	27	\N	8369	\N	1	\N
8370	faCircleInfo		\N	27	\N	8370	\N	1	\N
8371	faCircleLeft		\N	27	\N	8371	\N	1	\N
8372	faCircleMinus		\N	27	\N	8372	\N	1	\N
8373	faCircleNodes		\N	27	\N	8373	\N	1	\N
8374	faCircleNotch		\N	27	\N	8374	\N	1	\N
8375	faCirclePause		\N	27	\N	8375	\N	1	\N
8376	faCirclePlay		\N	27	\N	8376	\N	1	\N
8377	faCirclePlus		\N	27	\N	8377	\N	1	\N
8378	faCircleQuestion		\N	27	\N	8378	\N	1	\N
8379	faCircleRadiation		\N	27	\N	8379	\N	1	\N
8380	faCircleRight		\N	27	\N	8380	\N	1	\N
8381	faCircleStop		\N	27	\N	8381	\N	1	\N
8382	faCircleUp		\N	27	\N	8382	\N	1	\N
8383	faCircleUser		\N	27	\N	8383	\N	1	\N
8384	faCircleXmark		\N	27	\N	8384	\N	1	\N
8385	faCity		\N	27	\N	8385	\N	1	\N
8386	faClapperboard		\N	27	\N	8386	\N	1	\N
8387	faClipboard		\N	27	\N	8387	\N	1	\N
8388	faClipboardCheck		\N	27	\N	8388	\N	1	\N
8389	faClipboardList		\N	27	\N	8389	\N	1	\N
8390	faClipboardQuestion		\N	27	\N	8390	\N	1	\N
8391	faClipboardUser		\N	27	\N	8391	\N	1	\N
8392	faClock		\N	27	\N	8392	\N	1	\N
8393	faClockRotateLeft		\N	27	\N	8393	\N	1	\N
8394	faClone		\N	27	\N	8394	\N	1	\N
8395	faClosedCaptioning		\N	27	\N	8395	\N	1	\N
8396	faCloud		\N	27	\N	8396	\N	1	\N
8397	faCloudArrowDown		\N	27	\N	8397	\N	1	\N
8398	faCloudArrowUp		\N	27	\N	8398	\N	1	\N
8399	faCloudBolt		\N	27	\N	8399	\N	1	\N
8400	faCloudMeatball		\N	27	\N	8400	\N	1	\N
8401	faCloudMoon		\N	27	\N	8401	\N	1	\N
8402	faCloudMoonRain		\N	27	\N	8402	\N	1	\N
8403	faCloudRain		\N	27	\N	8403	\N	1	\N
8404	faCloudShowersHeavy		\N	27	\N	8404	\N	1	\N
8405	faCloudShowersWater		\N	27	\N	8405	\N	1	\N
8406	faCloudSun		\N	27	\N	8406	\N	1	\N
8407	faCloudSunRain		\N	27	\N	8407	\N	1	\N
8408	faCloudflare		\N	27	\N	8408	\N	1	\N
8409	faCloudscale		\N	27	\N	8409	\N	1	\N
8410	faCloudsmith		\N	27	\N	8410	\N	1	\N
8411	faCloudversify		\N	27	\N	8411	\N	1	\N
8412	faClover		\N	27	\N	8412	\N	1	\N
8413	faCmplid		\N	27	\N	8413	\N	1	\N
8414	faCode		\N	27	\N	8414	\N	1	\N
8415	faCodeBranch		\N	27	\N	8415	\N	1	\N
8416	faCodeCommit		\N	27	\N	8416	\N	1	\N
8417	faCodeCompare		\N	27	\N	8417	\N	1	\N
8418	faCodeFork		\N	27	\N	8418	\N	1	\N
8419	faCodeMerge		\N	27	\N	8419	\N	1	\N
8420	faCodePullRequest		\N	27	\N	8420	\N	1	\N
8421	faCodepen		\N	27	\N	8421	\N	1	\N
8422	faCodiepie		\N	27	\N	8422	\N	1	\N
8423	faCoins		\N	27	\N	8423	\N	1	\N
8424	faColonSign		\N	27	\N	8424	\N	1	\N
8425	faComment		\N	27	\N	8425	\N	1	\N
8426	faCommentDollar		\N	27	\N	8426	\N	1	\N
8427	faCommentDots		\N	27	\N	8427	\N	1	\N
8428	faCommentMedical		\N	27	\N	8428	\N	1	\N
8429	faCommentNodes		\N	27	\N	8429	\N	1	\N
8430	faCommentSlash		\N	27	\N	8430	\N	1	\N
8431	faCommentSms		\N	27	\N	8431	\N	1	\N
8432	faComments		\N	27	\N	8432	\N	1	\N
8433	faCommentsDollar		\N	27	\N	8433	\N	1	\N
8434	faCompactDisc		\N	27	\N	8434	\N	1	\N
8435	faCompass		\N	27	\N	8435	\N	1	\N
8436	faCompassDrafting		\N	27	\N	8436	\N	1	\N
8437	faCompress		\N	27	\N	8437	\N	1	\N
8438	faComputer		\N	27	\N	8438	\N	1	\N
8439	faComputerMouse		\N	27	\N	8439	\N	1	\N
8440	faConfluence		\N	27	\N	8440	\N	1	\N
8441	faConnectdevelop		\N	27	\N	8441	\N	1	\N
8442	faContao		\N	27	\N	8442	\N	1	\N
8443	faCookie		\N	27	\N	8443	\N	1	\N
8444	faCookieBite		\N	27	\N	8444	\N	1	\N
8445	faCopy		\N	27	\N	8445	\N	1	\N
8446	faCopyright		\N	27	\N	8446	\N	1	\N
8447	faCottonBureau		\N	27	\N	8447	\N	1	\N
8448	faCouch		\N	27	\N	8448	\N	1	\N
8449	faCow		\N	27	\N	8449	\N	1	\N
8450	faCpanel		\N	27	\N	8450	\N	1	\N
8451	faCreativeCommons		\N	27	\N	8451	\N	1	\N
8452	faCreativeCommonsBy		\N	27	\N	8452	\N	1	\N
8453	faCreativeCommonsNc		\N	27	\N	8453	\N	1	\N
8454	faCreativeCommonsNcEu		\N	27	\N	8454	\N	1	\N
8455	faCreativeCommonsNcJp		\N	27	\N	8455	\N	1	\N
8456	faCreativeCommonsNd		\N	27	\N	8456	\N	1	\N
8457	faCreativeCommonsPd		\N	27	\N	8457	\N	1	\N
8458	faCreativeCommonsPdAlt		\N	27	\N	8458	\N	1	\N
8459	faCreativeCommonsRemix		\N	27	\N	8459	\N	1	\N
8460	faCreativeCommonsSa		\N	27	\N	8460	\N	1	\N
8461	faCreativeCommonsSampling		\N	27	\N	8461	\N	1	\N
8462	faCreativeCommonsSamplingPlus		\N	27	\N	8462	\N	1	\N
8463	faCreativeCommonsShare		\N	27	\N	8463	\N	1	\N
8464	faCreativeCommonsZero		\N	27	\N	8464	\N	1	\N
8465	faCreditCard		\N	27	\N	8465	\N	1	\N
8466	faCriticalRole		\N	27	\N	8466	\N	1	\N
8467	faCrop		\N	27	\N	8467	\N	1	\N
8468	faCropSimple		\N	27	\N	8468	\N	1	\N
8469	faCross		\N	27	\N	8469	\N	1	\N
8470	faCrosshairs		\N	27	\N	8470	\N	1	\N
8471	faCrow		\N	27	\N	8471	\N	1	\N
8472	faCrown		\N	27	\N	8472	\N	1	\N
8473	faCrutch		\N	27	\N	8473	\N	1	\N
8474	faCruzeiroSign		\N	27	\N	8474	\N	1	\N
8475	faCss		\N	27	\N	8475	\N	1	\N
8476	faCss3		\N	27	\N	8476	\N	1	\N
8477	faCss3Alt		\N	27	\N	8477	\N	1	\N
8478	faCube		\N	27	\N	8478	\N	1	\N
8479	faCubes		\N	27	\N	8479	\N	1	\N
8480	faCubesStacked		\N	27	\N	8480	\N	1	\N
8481	faCuttlefish		\N	27	\N	8481	\N	1	\N
8482	faD		\N	27	\N	8482	\N	1	\N
8483	faDAndD		\N	27	\N	8483	\N	1	\N
8484	faDAndDBeyond		\N	27	\N	8484	\N	1	\N
8485	faDailymotion		\N	27	\N	8485	\N	1	\N
8486	faDartLang		\N	27	\N	8486	\N	1	\N
8487	faDashcube		\N	27	\N	8487	\N	1	\N
8488	faDatabase		\N	27	\N	8488	\N	1	\N
8489	faDebian		\N	27	\N	8489	\N	1	\N
8490	faDeezer		\N	27	\N	8490	\N	1	\N
8491	faDeleteLeft		\N	27	\N	8491	\N	1	\N
8492	faDelicious		\N	27	\N	8492	\N	1	\N
8493	faDemocrat		\N	27	\N	8493	\N	1	\N
8494	faDeploydog		\N	27	\N	8494	\N	1	\N
8495	faDeskpro		\N	27	\N	8495	\N	1	\N
8496	faDesktop		\N	27	\N	8496	\N	1	\N
8497	faDev		\N	27	\N	8497	\N	1	\N
8498	faDeviantart		\N	27	\N	8498	\N	1	\N
8499	faDharmachakra		\N	27	\N	8499	\N	1	\N
8500	faDhl		\N	27	\N	8500	\N	1	\N
8501	faDiagramNext		\N	27	\N	8501	\N	1	\N
8502	faDiagramPredecessor		\N	27	\N	8502	\N	1	\N
8503	faDiagramProject		\N	27	\N	8503	\N	1	\N
8504	faDiagramSuccessor		\N	27	\N	8504	\N	1	\N
8505	faDiamond		\N	27	\N	8505	\N	1	\N
8506	faDiamondTurnRight		\N	27	\N	8506	\N	1	\N
8507	faDiaspora		\N	27	\N	8507	\N	1	\N
8508	faDice		\N	27	\N	8508	\N	1	\N
8509	faDiceD20		\N	27	\N	8509	\N	1	\N
8510	faDiceD6		\N	27	\N	8510	\N	1	\N
8511	faDiceFive		\N	27	\N	8511	\N	1	\N
8512	faDiceFour		\N	27	\N	8512	\N	1	\N
8513	faDiceOne		\N	27	\N	8513	\N	1	\N
8514	faDiceSix		\N	27	\N	8514	\N	1	\N
8515	faDiceThree		\N	27	\N	8515	\N	1	\N
8516	faDiceTwo		\N	27	\N	8516	\N	1	\N
8517	faDigg		\N	27	\N	8517	\N	1	\N
8518	faDigitalOcean		\N	27	\N	8518	\N	1	\N
8519	faDiscord		\N	27	\N	8519	\N	1	\N
8520	faDiscourse		\N	27	\N	8520	\N	1	\N
8521	faDisease		\N	27	\N	8521	\N	1	\N
8522	faDisplay		\N	27	\N	8522	\N	1	\N
8523	faDivide		\N	27	\N	8523	\N	1	\N
8524	faDna		\N	27	\N	8524	\N	1	\N
8525	faDochub		\N	27	\N	8525	\N	1	\N
8526	faDocker		\N	27	\N	8526	\N	1	\N
8527	faDog		\N	27	\N	8527	\N	1	\N
8528	faDollarSign		\N	27	\N	8528	\N	1	\N
8529	faDolly		\N	27	\N	8529	\N	1	\N
8530	faDongSign		\N	27	\N	8530	\N	1	\N
8531	faDoorClosed		\N	27	\N	8531	\N	1	\N
8532	faDoorOpen		\N	27	\N	8532	\N	1	\N
8533	faDove		\N	27	\N	8533	\N	1	\N
8534	faDownLeftAndUpRightToCenter		\N	27	\N	8534	\N	1	\N
8535	faDownLong		\N	27	\N	8535	\N	1	\N
8536	faDownload		\N	27	\N	8536	\N	1	\N
8537	faDraft2digital		\N	27	\N	8537	\N	1	\N
8538	faDragon		\N	27	\N	8538	\N	1	\N
8539	faDrawPolygon		\N	27	\N	8539	\N	1	\N
8540	faDribbble		\N	27	\N	8540	\N	1	\N
8541	faDropbox		\N	27	\N	8541	\N	1	\N
8542	faDroplet		\N	27	\N	8542	\N	1	\N
8543	faDropletSlash		\N	27	\N	8543	\N	1	\N
8544	faDrum		\N	27	\N	8544	\N	1	\N
8545	faDrumSteelpan		\N	27	\N	8545	\N	1	\N
8546	faDrumstickBite		\N	27	\N	8546	\N	1	\N
8547	faDrupal		\N	27	\N	8547	\N	1	\N
8548	faDumbbell		\N	27	\N	8548	\N	1	\N
8549	faDumpster		\N	27	\N	8549	\N	1	\N
8550	faDumpsterFire		\N	27	\N	8550	\N	1	\N
8551	faDungeon		\N	27	\N	8551	\N	1	\N
8552	faDyalog		\N	27	\N	8552	\N	1	\N
8553	faE		\N	27	\N	8553	\N	1	\N
8554	faEarDeaf		\N	27	\N	8554	\N	1	\N
8555	faEarListen		\N	27	\N	8555	\N	1	\N
8556	faEarlybirds		\N	27	\N	8556	\N	1	\N
8557	faEarthAfrica		\N	27	\N	8557	\N	1	\N
8558	faEarthAmericas		\N	27	\N	8558	\N	1	\N
8559	faEarthAsia		\N	27	\N	8559	\N	1	\N
8560	faEarthEurope		\N	27	\N	8560	\N	1	\N
8561	faEarthOceania		\N	27	\N	8561	\N	1	\N
8562	faEbay		\N	27	\N	8562	\N	1	\N
8563	faEdge		\N	27	\N	8563	\N	1	\N
8564	faEdgeLegacy		\N	27	\N	8564	\N	1	\N
8565	faEgg		\N	27	\N	8565	\N	1	\N
8566	faEject		\N	27	\N	8566	\N	1	\N
8567	faElementor		\N	27	\N	8567	\N	1	\N
8568	faElevator		\N	27	\N	8568	\N	1	\N
8569	faEllipsis		\N	27	\N	8569	\N	1	\N
8570	faEllipsisVertical		\N	27	\N	8570	\N	1	\N
8571	faEllo		\N	27	\N	8571	\N	1	\N
8572	faEmber		\N	27	\N	8572	\N	1	\N
8573	faEmpire		\N	27	\N	8573	\N	1	\N
8574	faEnvelope		\N	27	\N	8574	\N	1	\N
8575	faEnvelopeCircleCheck		\N	27	\N	8575	\N	1	\N
8576	faEnvelopeOpen		\N	27	\N	8576	\N	1	\N
8577	faEnvelopeOpenText		\N	27	\N	8577	\N	1	\N
8578	faEnvelopesBulk		\N	27	\N	8578	\N	1	\N
8579	faEnvira		\N	27	\N	8579	\N	1	\N
8580	faEquals		\N	27	\N	8580	\N	1	\N
8581	faEraser		\N	27	\N	8581	\N	1	\N
8582	faErlang		\N	27	\N	8582	\N	1	\N
8583	faEthereum		\N	27	\N	8583	\N	1	\N
8584	faEthernet		\N	27	\N	8584	\N	1	\N
8585	faEtsy		\N	27	\N	8585	\N	1	\N
8586	faEuroSign		\N	27	\N	8586	\N	1	\N
8587	faEvernote		\N	27	\N	8587	\N	1	\N
8588	faExclamation		\N	27	\N	8588	\N	1	\N
8589	faExpand		\N	27	\N	8589	\N	1	\N
8590	faExpeditedssl		\N	27	\N	8590	\N	1	\N
8591	faExplosion		\N	27	\N	8591	\N	1	\N
8592	faEye		\N	27	\N	8592	\N	1	\N
8593	faEyeDropper		\N	27	\N	8593	\N	1	\N
8594	faEyeLowVision		\N	27	\N	8594	\N	1	\N
8595	faEyeSlash		\N	27	\N	8595	\N	1	\N
8596	faF		\N	27	\N	8596	\N	1	\N
8597	faFaceAngry		\N	27	\N	8597	\N	1	\N
8598	faFaceDizzy		\N	27	\N	8598	\N	1	\N
8599	faFaceFlushed		\N	27	\N	8599	\N	1	\N
8600	faFaceFrown		\N	27	\N	8600	\N	1	\N
8601	faFaceFrownOpen		\N	27	\N	8601	\N	1	\N
8602	faFaceGrimace		\N	27	\N	8602	\N	1	\N
8603	faFaceGrin		\N	27	\N	8603	\N	1	\N
8604	faFaceGrinBeam		\N	27	\N	8604	\N	1	\N
8605	faFaceGrinBeamSweat		\N	27	\N	8605	\N	1	\N
8606	faFaceGrinHearts		\N	27	\N	8606	\N	1	\N
8607	faFaceGrinSquint		\N	27	\N	8607	\N	1	\N
8608	faFaceGrinSquintTears		\N	27	\N	8608	\N	1	\N
8609	faFaceGrinStars		\N	27	\N	8609	\N	1	\N
8610	faFaceGrinTears		\N	27	\N	8610	\N	1	\N
8611	faFaceGrinTongue		\N	27	\N	8611	\N	1	\N
8612	faFaceGrinTongueSquint		\N	27	\N	8612	\N	1	\N
8613	faFaceGrinTongueWink		\N	27	\N	8613	\N	1	\N
8614	faFaceGrinWide		\N	27	\N	8614	\N	1	\N
8615	faFaceGrinWink		\N	27	\N	8615	\N	1	\N
8616	faFaceKiss		\N	27	\N	8616	\N	1	\N
8617	faFaceKissBeam		\N	27	\N	8617	\N	1	\N
8618	faFaceKissWinkHeart		\N	27	\N	8618	\N	1	\N
8619	faFaceLaugh		\N	27	\N	8619	\N	1	\N
8620	faFaceLaughBeam		\N	27	\N	8620	\N	1	\N
8621	faFaceLaughSquint		\N	27	\N	8621	\N	1	\N
8622	faFaceLaughWink		\N	27	\N	8622	\N	1	\N
8623	faFaceMeh		\N	27	\N	8623	\N	1	\N
8624	faFaceMehBlank		\N	27	\N	8624	\N	1	\N
8625	faFaceRollingEyes		\N	27	\N	8625	\N	1	\N
8626	faFaceSadCry		\N	27	\N	8626	\N	1	\N
8627	faFaceSadTear		\N	27	\N	8627	\N	1	\N
8628	faFaceSmile		\N	27	\N	8628	\N	1	\N
8629	faFaceSmileBeam		\N	27	\N	8629	\N	1	\N
8630	faFaceSmileWink		\N	27	\N	8630	\N	1	\N
8631	faFaceSurprise		\N	27	\N	8631	\N	1	\N
8632	faFaceTired		\N	27	\N	8632	\N	1	\N
8633	faFacebook		\N	27	\N	8633	\N	1	\N
8745	faGear		\N	27	\N	8745	\N	1	\N
8634	faFacebookF		\N	27	\N	8634	\N	1	\N
8635	faFacebookMessenger		\N	27	\N	8635	\N	1	\N
8636	faFan		\N	27	\N	8636	\N	1	\N
8637	faFantasyFlightGames		\N	27	\N	8637	\N	1	\N
8638	faFaucet		\N	27	\N	8638	\N	1	\N
8639	faFaucetDrip		\N	27	\N	8639	\N	1	\N
8640	faFax		\N	27	\N	8640	\N	1	\N
8641	faFeather		\N	27	\N	8641	\N	1	\N
8642	faFeatherPointed		\N	27	\N	8642	\N	1	\N
8643	faFedex		\N	27	\N	8643	\N	1	\N
8644	faFedora		\N	27	\N	8644	\N	1	\N
8645	faFerry		\N	27	\N	8645	\N	1	\N
8646	faFigma		\N	27	\N	8646	\N	1	\N
8647	faFile		\N	27	\N	8647	\N	1	\N
8648	faFileArrowDown		\N	27	\N	8648	\N	1	\N
8649	faFileArrowUp		\N	27	\N	8649	\N	1	\N
8650	faFileAudio		\N	27	\N	8650	\N	1	\N
8651	faFileCircleCheck		\N	27	\N	8651	\N	1	\N
8652	faFileCircleExclamation		\N	27	\N	8652	\N	1	\N
8653	faFileCircleMinus		\N	27	\N	8653	\N	1	\N
8654	faFileCirclePlus		\N	27	\N	8654	\N	1	\N
8655	faFileCircleQuestion		\N	27	\N	8655	\N	1	\N
8656	faFileCircleXmark		\N	27	\N	8656	\N	1	\N
8657	faFileCode		\N	27	\N	8657	\N	1	\N
8658	faFileContract		\N	27	\N	8658	\N	1	\N
8659	faFileCsv		\N	27	\N	8659	\N	1	\N
8660	faFileExcel		\N	27	\N	8660	\N	1	\N
8661	faFileExport		\N	27	\N	8661	\N	1	\N
8662	faFileFragment		\N	27	\N	8662	\N	1	\N
8663	faFileHalfDashed		\N	27	\N	8663	\N	1	\N
8664	faFileImage		\N	27	\N	8664	\N	1	\N
8665	faFileImport		\N	27	\N	8665	\N	1	\N
8666	faFileInvoice		\N	27	\N	8666	\N	1	\N
8667	faFileInvoiceDollar		\N	27	\N	8667	\N	1	\N
8668	faFileLines		\N	27	\N	8668	\N	1	\N
8669	faFileMedical		\N	27	\N	8669	\N	1	\N
8670	faFilePdf		\N	27	\N	8670	\N	1	\N
8671	faFilePen		\N	27	\N	8671	\N	1	\N
8672	faFilePowerpoint		\N	27	\N	8672	\N	1	\N
8673	faFilePrescription		\N	27	\N	8673	\N	1	\N
8674	faFileShield		\N	27	\N	8674	\N	1	\N
8675	faFileSignature		\N	27	\N	8675	\N	1	\N
8676	faFileVideo		\N	27	\N	8676	\N	1	\N
8677	faFileWaveform		\N	27	\N	8677	\N	1	\N
8678	faFileWord		\N	27	\N	8678	\N	1	\N
8679	faFileZipper		\N	27	\N	8679	\N	1	\N
8680	faFilesPinwheel		\N	27	\N	8680	\N	1	\N
8681	faFill		\N	27	\N	8681	\N	1	\N
8682	faFillDrip		\N	27	\N	8682	\N	1	\N
8683	faFilm		\N	27	\N	8683	\N	1	\N
8684	faFilter		\N	27	\N	8684	\N	1	\N
8685	faFilterCircleDollar		\N	27	\N	8685	\N	1	\N
8686	faFilterCircleXmark		\N	27	\N	8686	\N	1	\N
8687	faFingerprint		\N	27	\N	8687	\N	1	\N
8688	faFire		\N	27	\N	8688	\N	1	\N
8689	faFireBurner		\N	27	\N	8689	\N	1	\N
8690	faFireExtinguisher		\N	27	\N	8690	\N	1	\N
8691	faFireFlameCurved		\N	27	\N	8691	\N	1	\N
8692	faFireFlameSimple		\N	27	\N	8692	\N	1	\N
8693	faFirefox		\N	27	\N	8693	\N	1	\N
8694	faFirefoxBrowser		\N	27	\N	8694	\N	1	\N
8695	faFirstOrder		\N	27	\N	8695	\N	1	\N
8696	faFirstOrderAlt		\N	27	\N	8696	\N	1	\N
8697	faFirstdraft		\N	27	\N	8697	\N	1	\N
8698	faFish		\N	27	\N	8698	\N	1	\N
8699	faFishFins		\N	27	\N	8699	\N	1	\N
8700	faFlag		\N	27	\N	8700	\N	1	\N
8701	faFlagCheckered		\N	27	\N	8701	\N	1	\N
8702	faFlagUsa		\N	27	\N	8702	\N	1	\N
8703	faFlask		\N	27	\N	8703	\N	1	\N
8704	faFlaskVial		\N	27	\N	8704	\N	1	\N
8705	faFlickr		\N	27	\N	8705	\N	1	\N
8706	faFlipboard		\N	27	\N	8706	\N	1	\N
8707	faFloppyDisk		\N	27	\N	8707	\N	1	\N
8708	faFlorinSign		\N	27	\N	8708	\N	1	\N
8709	faFlutter		\N	27	\N	8709	\N	1	\N
8710	faFly		\N	27	\N	8710	\N	1	\N
8711	faFolder		\N	27	\N	8711	\N	1	\N
8712	faFolderClosed		\N	27	\N	8712	\N	1	\N
8713	faFolderMinus		\N	27	\N	8713	\N	1	\N
8714	faFolderOpen		\N	27	\N	8714	\N	1	\N
8715	faFolderPlus		\N	27	\N	8715	\N	1	\N
8716	faFolderTree		\N	27	\N	8716	\N	1	\N
8717	faFont		\N	27	\N	8717	\N	1	\N
8718	faFontAwesome		\N	27	\N	8718	\N	1	\N
8719	faFonticons		\N	27	\N	8719	\N	1	\N
8720	faFonticonsFi		\N	27	\N	8720	\N	1	\N
8721	faFootball		\N	27	\N	8721	\N	1	\N
8722	faFortAwesome		\N	27	\N	8722	\N	1	\N
8723	faFortAwesomeAlt		\N	27	\N	8723	\N	1	\N
8724	faForumbee		\N	27	\N	8724	\N	1	\N
8725	faForward		\N	27	\N	8725	\N	1	\N
8726	faForwardFast		\N	27	\N	8726	\N	1	\N
8727	faForwardStep		\N	27	\N	8727	\N	1	\N
8728	faFoursquare		\N	27	\N	8728	\N	1	\N
8729	faFrancSign		\N	27	\N	8729	\N	1	\N
8730	faFreeCodeCamp		\N	27	\N	8730	\N	1	\N
8731	faFreebsd		\N	27	\N	8731	\N	1	\N
8732	faFrog		\N	27	\N	8732	\N	1	\N
8733	faFulcrum		\N	27	\N	8733	\N	1	\N
8734	faFutbol		\N	27	\N	8734	\N	1	\N
8735	faG		\N	27	\N	8735	\N	1	\N
8736	faGalacticRepublic		\N	27	\N	8736	\N	1	\N
8737	faGalacticSenate		\N	27	\N	8737	\N	1	\N
8738	faGamepad		\N	27	\N	8738	\N	1	\N
8739	faGasPump		\N	27	\N	8739	\N	1	\N
8740	faGauge		\N	27	\N	8740	\N	1	\N
8741	faGaugeHigh		\N	27	\N	8741	\N	1	\N
8742	faGaugeSimple		\N	27	\N	8742	\N	1	\N
8743	faGaugeSimpleHigh		\N	27	\N	8743	\N	1	\N
8744	faGavel		\N	27	\N	8744	\N	1	\N
8746	faGears		\N	27	\N	8746	\N	1	\N
8747	faGem		\N	27	\N	8747	\N	1	\N
8748	faGenderless		\N	27	\N	8748	\N	1	\N
8749	faGetPocket		\N	27	\N	8749	\N	1	\N
8750	faGg		\N	27	\N	8750	\N	1	\N
8751	faGgCircle		\N	27	\N	8751	\N	1	\N
8752	faGhost		\N	27	\N	8752	\N	1	\N
8753	faGift		\N	27	\N	8753	\N	1	\N
8754	faGifts		\N	27	\N	8754	\N	1	\N
8755	faGit		\N	27	\N	8755	\N	1	\N
8756	faGitAlt		\N	27	\N	8756	\N	1	\N
8757	faGithub		\N	27	\N	8757	\N	1	\N
8758	faGithubAlt		\N	27	\N	8758	\N	1	\N
8759	faGitkraken		\N	27	\N	8759	\N	1	\N
8760	faGitlab		\N	27	\N	8760	\N	1	\N
8761	faGitter		\N	27	\N	8761	\N	1	\N
8762	faGlassWater		\N	27	\N	8762	\N	1	\N
8763	faGlassWaterDroplet		\N	27	\N	8763	\N	1	\N
8764	faGlasses		\N	27	\N	8764	\N	1	\N
8765	faGlide		\N	27	\N	8765	\N	1	\N
8766	faGlideG		\N	27	\N	8766	\N	1	\N
8767	faGlobe		\N	27	\N	8767	\N	1	\N
8768	faGofore		\N	27	\N	8768	\N	1	\N
8769	faGolang		\N	27	\N	8769	\N	1	\N
8770	faGolfBallTee		\N	27	\N	8770	\N	1	\N
8771	faGoodreads		\N	27	\N	8771	\N	1	\N
8772	faGoodreadsG		\N	27	\N	8772	\N	1	\N
8773	faGoogle		\N	27	\N	8773	\N	1	\N
8774	faGoogleDrive		\N	27	\N	8774	\N	1	\N
8775	faGooglePay		\N	27	\N	8775	\N	1	\N
8776	faGooglePlay		\N	27	\N	8776	\N	1	\N
8777	faGooglePlus		\N	27	\N	8777	\N	1	\N
8778	faGooglePlusG		\N	27	\N	8778	\N	1	\N
8779	faGoogleScholar		\N	27	\N	8779	\N	1	\N
8780	faGoogleWallet		\N	27	\N	8780	\N	1	\N
8781	faGopuram		\N	27	\N	8781	\N	1	\N
8782	faGraduationCap		\N	27	\N	8782	\N	1	\N
8783	faGratipay		\N	27	\N	8783	\N	1	\N
8784	faGrav		\N	27	\N	8784	\N	1	\N
8785	faGreaterThan		\N	27	\N	8785	\N	1	\N
8786	faGreaterThanEqual		\N	27	\N	8786	\N	1	\N
8787	faGrip		\N	27	\N	8787	\N	1	\N
8788	faGripLines		\N	27	\N	8788	\N	1	\N
8789	faGripLinesVertical		\N	27	\N	8789	\N	1	\N
8790	faGripVertical		\N	27	\N	8790	\N	1	\N
8791	faGripfire		\N	27	\N	8791	\N	1	\N
8792	faGroupArrowsRotate		\N	27	\N	8792	\N	1	\N
8793	faGrunt		\N	27	\N	8793	\N	1	\N
8794	faGuaraniSign		\N	27	\N	8794	\N	1	\N
8795	faGuilded		\N	27	\N	8795	\N	1	\N
8796	faGuitar		\N	27	\N	8796	\N	1	\N
8797	faGulp		\N	27	\N	8797	\N	1	\N
8798	faGun		\N	27	\N	8798	\N	1	\N
8799	faH		\N	27	\N	8799	\N	1	\N
8800	faHackerNews		\N	27	\N	8800	\N	1	\N
8801	faHackerrank		\N	27	\N	8801	\N	1	\N
8802	faHammer		\N	27	\N	8802	\N	1	\N
8803	faHamsa		\N	27	\N	8803	\N	1	\N
8804	faHand		\N	27	\N	8804	\N	1	\N
8805	faHandBackFist		\N	27	\N	8805	\N	1	\N
8806	faHandDots		\N	27	\N	8806	\N	1	\N
8807	faHandFist		\N	27	\N	8807	\N	1	\N
8808	faHandHolding		\N	27	\N	8808	\N	1	\N
8809	faHandHoldingDollar		\N	27	\N	8809	\N	1	\N
8810	faHandHoldingDroplet		\N	27	\N	8810	\N	1	\N
8811	faHandHoldingHand		\N	27	\N	8811	\N	1	\N
8812	faHandHoldingHeart		\N	27	\N	8812	\N	1	\N
8813	faHandHoldingMedical		\N	27	\N	8813	\N	1	\N
8814	faHandLizard		\N	27	\N	8814	\N	1	\N
8815	faHandMiddleFinger		\N	27	\N	8815	\N	1	\N
8816	faHandPeace		\N	27	\N	8816	\N	1	\N
8817	faHandPointDown		\N	27	\N	8817	\N	1	\N
8818	faHandPointLeft		\N	27	\N	8818	\N	1	\N
8819	faHandPointRight		\N	27	\N	8819	\N	1	\N
8820	faHandPointUp		\N	27	\N	8820	\N	1	\N
8821	faHandPointer		\N	27	\N	8821	\N	1	\N
8822	faHandScissors		\N	27	\N	8822	\N	1	\N
8823	faHandSparkles		\N	27	\N	8823	\N	1	\N
8824	faHandSpock		\N	27	\N	8824	\N	1	\N
8825	faHandcuffs		\N	27	\N	8825	\N	1	\N
8826	faHands		\N	27	\N	8826	\N	1	\N
8827	faHandsAslInterpreting		\N	27	\N	8827	\N	1	\N
8828	faHandsBound		\N	27	\N	8828	\N	1	\N
8829	faHandsBubbles		\N	27	\N	8829	\N	1	\N
8830	faHandsClapping		\N	27	\N	8830	\N	1	\N
8831	faHandsHolding		\N	27	\N	8831	\N	1	\N
8832	faHandsHoldingChild		\N	27	\N	8832	\N	1	\N
8833	faHandsHoldingCircle		\N	27	\N	8833	\N	1	\N
8834	faHandsPraying		\N	27	\N	8834	\N	1	\N
8835	faHandshake		\N	27	\N	8835	\N	1	\N
8836	faHandshakeAngle		\N	27	\N	8836	\N	1	\N
8837	faHandshakeSimple		\N	27	\N	8837	\N	1	\N
8838	faHandshakeSimpleSlash		\N	27	\N	8838	\N	1	\N
8839	faHandshakeSlash		\N	27	\N	8839	\N	1	\N
8840	faHanukiah		\N	27	\N	8840	\N	1	\N
8841	faHardDrive		\N	27	\N	8841	\N	1	\N
8842	faHashnode		\N	27	\N	8842	\N	1	\N
8843	faHashtag		\N	27	\N	8843	\N	1	\N
8844	faHatCowboy		\N	27	\N	8844	\N	1	\N
8845	faHatCowboySide		\N	27	\N	8845	\N	1	\N
8846	faHatWizard		\N	27	\N	8846	\N	1	\N
8847	faHeadSideCough		\N	27	\N	8847	\N	1	\N
8848	faHeadSideCoughSlash		\N	27	\N	8848	\N	1	\N
8849	faHeadSideMask		\N	27	\N	8849	\N	1	\N
8850	faHeadSideVirus		\N	27	\N	8850	\N	1	\N
8851	faHeading		\N	27	\N	8851	\N	1	\N
8852	faHeadphones		\N	27	\N	8852	\N	1	\N
8853	faHeadphonesSimple		\N	27	\N	8853	\N	1	\N
8854	faHeadset		\N	27	\N	8854	\N	1	\N
8855	faHeart		\N	27	\N	8855	\N	1	\N
8856	faHeartCircleBolt		\N	27	\N	8856	\N	1	\N
8857	faHeartCircleCheck		\N	27	\N	8857	\N	1	\N
8858	faHeartCircleExclamation		\N	27	\N	8858	\N	1	\N
8859	faHeartCircleMinus		\N	27	\N	8859	\N	1	\N
8860	faHeartCirclePlus		\N	27	\N	8860	\N	1	\N
8861	faHeartCircleXmark		\N	27	\N	8861	\N	1	\N
8862	faHeartCrack		\N	27	\N	8862	\N	1	\N
8863	faHeartPulse		\N	27	\N	8863	\N	1	\N
8864	faHelicopter		\N	27	\N	8864	\N	1	\N
8865	faHelicopterSymbol		\N	27	\N	8865	\N	1	\N
8866	faHelmetSafety		\N	27	\N	8866	\N	1	\N
8867	faHelmetUn		\N	27	\N	8867	\N	1	\N
8868	faHexagonNodes		\N	27	\N	8868	\N	1	\N
8869	faHexagonNodesBolt		\N	27	\N	8869	\N	1	\N
8870	faHighlighter		\N	27	\N	8870	\N	1	\N
8871	faHillAvalanche		\N	27	\N	8871	\N	1	\N
8872	faHillRockslide		\N	27	\N	8872	\N	1	\N
8873	faHippo		\N	27	\N	8873	\N	1	\N
8874	faHips		\N	27	\N	8874	\N	1	\N
8875	faHireAHelper		\N	27	\N	8875	\N	1	\N
8876	faHive		\N	27	\N	8876	\N	1	\N
8877	faHockeyPuck		\N	27	\N	8877	\N	1	\N
8878	faHollyBerry		\N	27	\N	8878	\N	1	\N
8879	faHooli		\N	27	\N	8879	\N	1	\N
8880	faHornbill		\N	27	\N	8880	\N	1	\N
8881	faHorse		\N	27	\N	8881	\N	1	\N
8882	faHorseHead		\N	27	\N	8882	\N	1	\N
8883	faHospital		\N	27	\N	8883	\N	1	\N
8884	faHospitalUser		\N	27	\N	8884	\N	1	\N
8885	faHotTubPerson		\N	27	\N	8885	\N	1	\N
8886	faHotdog		\N	27	\N	8886	\N	1	\N
8887	faHotel		\N	27	\N	8887	\N	1	\N
8888	faHotjar		\N	27	\N	8888	\N	1	\N
8889	faHourglass		\N	27	\N	8889	\N	1	\N
8890	faHourglassEnd		\N	27	\N	8890	\N	1	\N
8891	faHourglassHalf		\N	27	\N	8891	\N	1	\N
8892	faHourglassStart		\N	27	\N	8892	\N	1	\N
8893	faHouse		\N	27	\N	8893	\N	1	\N
8894	faHouseChimney		\N	27	\N	8894	\N	1	\N
8895	faHouseChimneyCrack		\N	27	\N	8895	\N	1	\N
8896	faHouseChimneyMedical		\N	27	\N	8896	\N	1	\N
8897	faHouseChimneyUser		\N	27	\N	8897	\N	1	\N
8898	faHouseChimneyWindow		\N	27	\N	8898	\N	1	\N
8899	faHouseCircleCheck		\N	27	\N	8899	\N	1	\N
8900	faHouseCircleExclamation		\N	27	\N	8900	\N	1	\N
8901	faHouseCircleXmark		\N	27	\N	8901	\N	1	\N
8902	faHouseCrack		\N	27	\N	8902	\N	1	\N
8903	faHouseFire		\N	27	\N	8903	\N	1	\N
8904	faHouseFlag		\N	27	\N	8904	\N	1	\N
8905	faHouseFloodWater		\N	27	\N	8905	\N	1	\N
8906	faHouseFloodWaterCircleArrowRight		\N	27	\N	8906	\N	1	\N
8907	faHouseLaptop		\N	27	\N	8907	\N	1	\N
8908	faHouseLock		\N	27	\N	8908	\N	1	\N
8909	faHouseMedical		\N	27	\N	8909	\N	1	\N
8910	faHouseMedicalCircleCheck		\N	27	\N	8910	\N	1	\N
8911	faHouseMedicalCircleExclamation		\N	27	\N	8911	\N	1	\N
8912	faHouseMedicalCircleXmark		\N	27	\N	8912	\N	1	\N
8913	faHouseMedicalFlag		\N	27	\N	8913	\N	1	\N
8914	faHouseSignal		\N	27	\N	8914	\N	1	\N
8915	faHouseTsunami		\N	27	\N	8915	\N	1	\N
8916	faHouseUser		\N	27	\N	8916	\N	1	\N
8917	faHouzz		\N	27	\N	8917	\N	1	\N
8918	faHryvniaSign		\N	27	\N	8918	\N	1	\N
8919	faHtml5		\N	27	\N	8919	\N	1	\N
8920	faHubspot		\N	27	\N	8920	\N	1	\N
8921	faHurricane		\N	27	\N	8921	\N	1	\N
8922	faI		\N	27	\N	8922	\N	1	\N
8923	faICursor		\N	27	\N	8923	\N	1	\N
8924	faIceCream		\N	27	\N	8924	\N	1	\N
8925	faIcicles		\N	27	\N	8925	\N	1	\N
8926	faIcons		\N	27	\N	8926	\N	1	\N
8927	faIdBadge		\N	27	\N	8927	\N	1	\N
8928	faIdCard		\N	27	\N	8928	\N	1	\N
8929	faIdCardClip		\N	27	\N	8929	\N	1	\N
8930	faIdeal		\N	27	\N	8930	\N	1	\N
8931	faIgloo		\N	27	\N	8931	\N	1	\N
8932	faImage		\N	27	\N	8932	\N	1	\N
8933	faImagePortrait		\N	27	\N	8933	\N	1	\N
8934	faImages		\N	27	\N	8934	\N	1	\N
8935	faImdb		\N	27	\N	8935	\N	1	\N
8936	faInbox		\N	27	\N	8936	\N	1	\N
8937	faIndent		\N	27	\N	8937	\N	1	\N
8938	faIndianRupeeSign		\N	27	\N	8938	\N	1	\N
8939	faIndustry		\N	27	\N	8939	\N	1	\N
8940	faInfinity		\N	27	\N	8940	\N	1	\N
8941	faInfo		\N	27	\N	8941	\N	1	\N
8942	faInstagram		\N	27	\N	8942	\N	1	\N
8943	faInstalod		\N	27	\N	8943	\N	1	\N
8944	faIntercom		\N	27	\N	8944	\N	1	\N
8945	faInternetExplorer		\N	27	\N	8945	\N	1	\N
8946	faInvision		\N	27	\N	8946	\N	1	\N
8947	faIoxhost		\N	27	\N	8947	\N	1	\N
8948	faItalic		\N	27	\N	8948	\N	1	\N
8949	faItchIo		\N	27	\N	8949	\N	1	\N
8950	faItunes		\N	27	\N	8950	\N	1	\N
8951	faItunesNote		\N	27	\N	8951	\N	1	\N
8952	faJ		\N	27	\N	8952	\N	1	\N
8953	faJar		\N	27	\N	8953	\N	1	\N
8954	faJarWheat		\N	27	\N	8954	\N	1	\N
8955	faJava		\N	27	\N	8955	\N	1	\N
8956	faJedi		\N	27	\N	8956	\N	1	\N
8957	faJediOrder		\N	27	\N	8957	\N	1	\N
8958	faJenkins		\N	27	\N	8958	\N	1	\N
8959	faJetFighter		\N	27	\N	8959	\N	1	\N
8960	faJetFighterUp		\N	27	\N	8960	\N	1	\N
8961	faJira		\N	27	\N	8961	\N	1	\N
8962	faJoget		\N	27	\N	8962	\N	1	\N
8963	faJoint		\N	27	\N	8963	\N	1	\N
8964	faJoomla		\N	27	\N	8964	\N	1	\N
8965	faJs		\N	27	\N	8965	\N	1	\N
8966	faJsfiddle		\N	27	\N	8966	\N	1	\N
8967	faJugDetergent		\N	27	\N	8967	\N	1	\N
8968	faJxl		\N	27	\N	8968	\N	1	\N
8969	faK		\N	27	\N	8969	\N	1	\N
8970	faKaaba		\N	27	\N	8970	\N	1	\N
8971	faKaggle		\N	27	\N	8971	\N	1	\N
8972	faKey		\N	27	\N	8972	\N	1	\N
8973	faKeybase		\N	27	\N	8973	\N	1	\N
8974	faKeyboard		\N	27	\N	8974	\N	1	\N
8975	faKeycdn		\N	27	\N	8975	\N	1	\N
8976	faKhanda		\N	27	\N	8976	\N	1	\N
8977	faKickstarter		\N	27	\N	8977	\N	1	\N
8978	faKickstarterK		\N	27	\N	8978	\N	1	\N
8979	faKipSign		\N	27	\N	8979	\N	1	\N
8980	faKitMedical		\N	27	\N	8980	\N	1	\N
8981	faKitchenSet		\N	27	\N	8981	\N	1	\N
8982	faKiwiBird		\N	27	\N	8982	\N	1	\N
8983	faKorvue		\N	27	\N	8983	\N	1	\N
8984	faL		\N	27	\N	8984	\N	1	\N
8985	faLandMineOn		\N	27	\N	8985	\N	1	\N
8986	faLandmark		\N	27	\N	8986	\N	1	\N
8987	faLandmarkDome		\N	27	\N	8987	\N	1	\N
8988	faLandmarkFlag		\N	27	\N	8988	\N	1	\N
8989	faLanguage		\N	27	\N	8989	\N	1	\N
8990	faLaptop		\N	27	\N	8990	\N	1	\N
8991	faLaptopCode		\N	27	\N	8991	\N	1	\N
8992	faLaptopFile		\N	27	\N	8992	\N	1	\N
8993	faLaptopMedical		\N	27	\N	8993	\N	1	\N
8994	faLaravel		\N	27	\N	8994	\N	1	\N
8995	faLariSign		\N	27	\N	8995	\N	1	\N
8996	faLastfm		\N	27	\N	8996	\N	1	\N
8997	faLayerGroup		\N	27	\N	8997	\N	1	\N
8998	faLeaf		\N	27	\N	8998	\N	1	\N
8999	faLeanpub		\N	27	\N	8999	\N	1	\N
9000	faLeftLong		\N	27	\N	9000	\N	1	\N
9001	faLeftRight		\N	27	\N	9001	\N	1	\N
9002	faLemon		\N	27	\N	9002	\N	1	\N
9003	faLess		\N	27	\N	9003	\N	1	\N
9004	faLessThan		\N	27	\N	9004	\N	1	\N
9005	faLessThanEqual		\N	27	\N	9005	\N	1	\N
9006	faLetterboxd		\N	27	\N	9006	\N	1	\N
9007	faLifeRing		\N	27	\N	9007	\N	1	\N
9008	faLightbulb		\N	27	\N	9008	\N	1	\N
9009	faLine		\N	27	\N	9009	\N	1	\N
9010	faLinesLeaning		\N	27	\N	9010	\N	1	\N
9011	faLink		\N	27	\N	9011	\N	1	\N
9012	faLinkSlash		\N	27	\N	9012	\N	1	\N
9013	faLinkedin		\N	27	\N	9013	\N	1	\N
9014	faLinkedinIn		\N	27	\N	9014	\N	1	\N
9015	faLinode		\N	27	\N	9015	\N	1	\N
9016	faLinux		\N	27	\N	9016	\N	1	\N
9017	faLiraSign		\N	27	\N	9017	\N	1	\N
9018	faList		\N	27	\N	9018	\N	1	\N
9019	faListCheck		\N	27	\N	9019	\N	1	\N
9020	faListOl		\N	27	\N	9020	\N	1	\N
9021	faListUl		\N	27	\N	9021	\N	1	\N
9022	faLitecoinSign		\N	27	\N	9022	\N	1	\N
9023	faLocationArrow		\N	27	\N	9023	\N	1	\N
9024	faLocationCrosshairs		\N	27	\N	9024	\N	1	\N
9025	faLocationDot		\N	27	\N	9025	\N	1	\N
9026	faLocationPin		\N	27	\N	9026	\N	1	\N
9027	faLocationPinLock		\N	27	\N	9027	\N	1	\N
9028	faLock		\N	27	\N	9028	\N	1	\N
9029	faLockOpen		\N	27	\N	9029	\N	1	\N
9030	faLocust		\N	27	\N	9030	\N	1	\N
9031	faLungs		\N	27	\N	9031	\N	1	\N
9032	faLungsVirus		\N	27	\N	9032	\N	1	\N
9033	faLyft		\N	27	\N	9033	\N	1	\N
9034	faM		\N	27	\N	9034	\N	1	\N
9035	faMagento		\N	27	\N	9035	\N	1	\N
9036	faMagnet		\N	27	\N	9036	\N	1	\N
9037	faMagnifyingGlass		\N	27	\N	9037	\N	1	\N
9038	faMagnifyingGlassArrowRight		\N	27	\N	9038	\N	1	\N
9039	faMagnifyingGlassChart		\N	27	\N	9039	\N	1	\N
9040	faMagnifyingGlassDollar		\N	27	\N	9040	\N	1	\N
9041	faMagnifyingGlassLocation		\N	27	\N	9041	\N	1	\N
9042	faMagnifyingGlassMinus		\N	27	\N	9042	\N	1	\N
9043	faMagnifyingGlassPlus		\N	27	\N	9043	\N	1	\N
9044	faMailchimp		\N	27	\N	9044	\N	1	\N
9045	faManatSign		\N	27	\N	9045	\N	1	\N
9046	faMandalorian		\N	27	\N	9046	\N	1	\N
9047	faMap		\N	27	\N	9047	\N	1	\N
9048	faMapLocation		\N	27	\N	9048	\N	1	\N
9049	faMapLocationDot		\N	27	\N	9049	\N	1	\N
9050	faMapPin		\N	27	\N	9050	\N	1	\N
9051	faMarkdown		\N	27	\N	9051	\N	1	\N
9052	faMarker		\N	27	\N	9052	\N	1	\N
9053	faMars		\N	27	\N	9053	\N	1	\N
9054	faMarsAndVenus		\N	27	\N	9054	\N	1	\N
9055	faMarsAndVenusBurst		\N	27	\N	9055	\N	1	\N
9056	faMarsDouble		\N	27	\N	9056	\N	1	\N
9057	faMarsStroke		\N	27	\N	9057	\N	1	\N
9058	faMarsStrokeRight		\N	27	\N	9058	\N	1	\N
9059	faMarsStrokeUp		\N	27	\N	9059	\N	1	\N
9060	faMartiniGlass		\N	27	\N	9060	\N	1	\N
9061	faMartiniGlassCitrus		\N	27	\N	9061	\N	1	\N
9062	faMartiniGlassEmpty		\N	27	\N	9062	\N	1	\N
9063	faMask		\N	27	\N	9063	\N	1	\N
9064	faMaskFace		\N	27	\N	9064	\N	1	\N
9065	faMaskVentilator		\N	27	\N	9065	\N	1	\N
9066	faMasksTheater		\N	27	\N	9066	\N	1	\N
9067	faMastodon		\N	27	\N	9067	\N	1	\N
9068	faMattressPillow		\N	27	\N	9068	\N	1	\N
9069	faMaxcdn		\N	27	\N	9069	\N	1	\N
9070	faMaximize		\N	27	\N	9070	\N	1	\N
9071	faMdb		\N	27	\N	9071	\N	1	\N
9072	faMedal		\N	27	\N	9072	\N	1	\N
9073	faMedapps		\N	27	\N	9073	\N	1	\N
9074	faMedium		\N	27	\N	9074	\N	1	\N
9075	faMedrt		\N	27	\N	9075	\N	1	\N
9076	faMeetup		\N	27	\N	9076	\N	1	\N
9077	faMegaport		\N	27	\N	9077	\N	1	\N
9078	faMemory		\N	27	\N	9078	\N	1	\N
9079	faMendeley		\N	27	\N	9079	\N	1	\N
9080	faMenorah		\N	27	\N	9080	\N	1	\N
9081	faMercury		\N	27	\N	9081	\N	1	\N
9082	faMessage		\N	27	\N	9082	\N	1	\N
9083	faMeta		\N	27	\N	9083	\N	1	\N
9084	faMeteor		\N	27	\N	9084	\N	1	\N
9085	faMicroblog		\N	27	\N	9085	\N	1	\N
9086	faMicrochip		\N	27	\N	9086	\N	1	\N
9087	faMicrophone		\N	27	\N	9087	\N	1	\N
9088	faMicrophoneLines		\N	27	\N	9088	\N	1	\N
9089	faMicrophoneLinesSlash		\N	27	\N	9089	\N	1	\N
9090	faMicrophoneSlash		\N	27	\N	9090	\N	1	\N
9091	faMicroscope		\N	27	\N	9091	\N	1	\N
9092	faMicrosoft		\N	27	\N	9092	\N	1	\N
9093	faMillSign		\N	27	\N	9093	\N	1	\N
9094	faMinimize		\N	27	\N	9094	\N	1	\N
9095	faMintbit		\N	27	\N	9095	\N	1	\N
9096	faMinus		\N	27	\N	9096	\N	1	\N
9097	faMitten		\N	27	\N	9097	\N	1	\N
9098	faMix		\N	27	\N	9098	\N	1	\N
9099	faMixcloud		\N	27	\N	9099	\N	1	\N
9100	faMixer		\N	27	\N	9100	\N	1	\N
9101	faMizuni		\N	27	\N	9101	\N	1	\N
9102	faMobile		\N	27	\N	9102	\N	1	\N
9103	faMobileButton		\N	27	\N	9103	\N	1	\N
9104	faMobileRetro		\N	27	\N	9104	\N	1	\N
9105	faMobileScreen		\N	27	\N	9105	\N	1	\N
9106	faMobileScreenButton		\N	27	\N	9106	\N	1	\N
9107	faModx		\N	27	\N	9107	\N	1	\N
9108	faMonero		\N	27	\N	9108	\N	1	\N
9109	faMoneyBill		\N	27	\N	9109	\N	1	\N
9110	faMoneyBill1		\N	27	\N	9110	\N	1	\N
9111	faMoneyBill1Wave		\N	27	\N	9111	\N	1	\N
9112	faMoneyBillTransfer		\N	27	\N	9112	\N	1	\N
9113	faMoneyBillTrendUp		\N	27	\N	9113	\N	1	\N
9114	faMoneyBillWave		\N	27	\N	9114	\N	1	\N
9115	faMoneyBillWheat		\N	27	\N	9115	\N	1	\N
9116	faMoneyBills		\N	27	\N	9116	\N	1	\N
9117	faMoneyCheck		\N	27	\N	9117	\N	1	\N
9118	faMoneyCheckDollar		\N	27	\N	9118	\N	1	\N
9119	faMonument		\N	27	\N	9119	\N	1	\N
9120	faMoon		\N	27	\N	9120	\N	1	\N
9121	faMortarPestle		\N	27	\N	9121	\N	1	\N
9122	faMosque		\N	27	\N	9122	\N	1	\N
9123	faMosquito		\N	27	\N	9123	\N	1	\N
9124	faMosquitoNet		\N	27	\N	9124	\N	1	\N
9125	faMotorcycle		\N	27	\N	9125	\N	1	\N
9126	faMound		\N	27	\N	9126	\N	1	\N
9127	faMountain		\N	27	\N	9127	\N	1	\N
9128	faMountainCity		\N	27	\N	9128	\N	1	\N
9129	faMountainSun		\N	27	\N	9129	\N	1	\N
9130	faMugHot		\N	27	\N	9130	\N	1	\N
9131	faMugSaucer		\N	27	\N	9131	\N	1	\N
9132	faMusic		\N	27	\N	9132	\N	1	\N
9133	faN		\N	27	\N	9133	\N	1	\N
9134	faNairaSign		\N	27	\N	9134	\N	1	\N
9135	faNapster		\N	27	\N	9135	\N	1	\N
9136	faNeos		\N	27	\N	9136	\N	1	\N
9137	faNetworkWired		\N	27	\N	9137	\N	1	\N
9138	faNeuter		\N	27	\N	9138	\N	1	\N
9139	faNewspaper		\N	27	\N	9139	\N	1	\N
9140	faNfcDirectional		\N	27	\N	9140	\N	1	\N
9141	faNfcSymbol		\N	27	\N	9141	\N	1	\N
9142	faNimblr		\N	27	\N	9142	\N	1	\N
9143	faNode		\N	27	\N	9143	\N	1	\N
9144	faNodeJs		\N	27	\N	9144	\N	1	\N
9145	faNotEqual		\N	27	\N	9145	\N	1	\N
9146	faNotdef		\N	27	\N	9146	\N	1	\N
9147	faNoteSticky		\N	27	\N	9147	\N	1	\N
9148	faNotesMedical		\N	27	\N	9148	\N	1	\N
9149	faNpm		\N	27	\N	9149	\N	1	\N
9150	faNs8		\N	27	\N	9150	\N	1	\N
9151	faNutritionix		\N	27	\N	9151	\N	1	\N
9152	faO		\N	27	\N	9152	\N	1	\N
9153	faObjectGroup		\N	27	\N	9153	\N	1	\N
9154	faObjectUngroup		\N	27	\N	9154	\N	1	\N
9155	faOctopusDeploy		\N	27	\N	9155	\N	1	\N
9156	faOdnoklassniki		\N	27	\N	9156	\N	1	\N
9157	faOdysee		\N	27	\N	9157	\N	1	\N
9158	faOilCan		\N	27	\N	9158	\N	1	\N
9159	faOilWell		\N	27	\N	9159	\N	1	\N
9160	faOldRepublic		\N	27	\N	9160	\N	1	\N
9161	faOm		\N	27	\N	9161	\N	1	\N
9162	faOpencart		\N	27	\N	9162	\N	1	\N
9163	faOpenid		\N	27	\N	9163	\N	1	\N
9164	faOpensuse		\N	27	\N	9164	\N	1	\N
9165	faOpera		\N	27	\N	9165	\N	1	\N
9166	faOptinMonster		\N	27	\N	9166	\N	1	\N
9167	faOrcid		\N	27	\N	9167	\N	1	\N
9168	faOsi		\N	27	\N	9168	\N	1	\N
9169	faOtter		\N	27	\N	9169	\N	1	\N
9170	faOutdent		\N	27	\N	9170	\N	1	\N
9171	faP		\N	27	\N	9171	\N	1	\N
9172	faPadlet		\N	27	\N	9172	\N	1	\N
9173	faPage4		\N	27	\N	9173	\N	1	\N
9174	faPagelines		\N	27	\N	9174	\N	1	\N
9175	faPager		\N	27	\N	9175	\N	1	\N
9176	faPaintRoller		\N	27	\N	9176	\N	1	\N
9177	faPaintbrush		\N	27	\N	9177	\N	1	\N
9178	faPalette		\N	27	\N	9178	\N	1	\N
9179	faPalfed		\N	27	\N	9179	\N	1	\N
9180	faPallet		\N	27	\N	9180	\N	1	\N
9181	faPanorama		\N	27	\N	9181	\N	1	\N
9182	faPaperPlane		\N	27	\N	9182	\N	1	\N
9183	faPaperclip		\N	27	\N	9183	\N	1	\N
9184	faParachuteBox		\N	27	\N	9184	\N	1	\N
9185	faParagraph		\N	27	\N	9185	\N	1	\N
9186	faPassport		\N	27	\N	9186	\N	1	\N
9187	faPaste		\N	27	\N	9187	\N	1	\N
9188	faPatreon		\N	27	\N	9188	\N	1	\N
9189	faPause		\N	27	\N	9189	\N	1	\N
9190	faPaw		\N	27	\N	9190	\N	1	\N
9191	faPaypal		\N	27	\N	9191	\N	1	\N
9192	faPeace		\N	27	\N	9192	\N	1	\N
9193	faPen		\N	27	\N	9193	\N	1	\N
9194	faPenClip		\N	27	\N	9194	\N	1	\N
9195	faPenFancy		\N	27	\N	9195	\N	1	\N
9196	faPenNib		\N	27	\N	9196	\N	1	\N
9197	faPenRuler		\N	27	\N	9197	\N	1	\N
9198	faPenToSquare		\N	27	\N	9198	\N	1	\N
9199	faPencil		\N	27	\N	9199	\N	1	\N
9200	faPeopleArrows		\N	27	\N	9200	\N	1	\N
9201	faPeopleCarryBox		\N	27	\N	9201	\N	1	\N
9202	faPeopleGroup		\N	27	\N	9202	\N	1	\N
9203	faPeopleLine		\N	27	\N	9203	\N	1	\N
9204	faPeoplePulling		\N	27	\N	9204	\N	1	\N
9205	faPeopleRobbery		\N	27	\N	9205	\N	1	\N
9206	faPeopleRoof		\N	27	\N	9206	\N	1	\N
9207	faPepperHot		\N	27	\N	9207	\N	1	\N
9208	faPerbyte		\N	27	\N	9208	\N	1	\N
9209	faPercent		\N	27	\N	9209	\N	1	\N
9210	faPeriscope		\N	27	\N	9210	\N	1	\N
9211	faPerson		\N	27	\N	9211	\N	1	\N
9212	faPersonArrowDownToLine		\N	27	\N	9212	\N	1	\N
9213	faPersonArrowUpFromLine		\N	27	\N	9213	\N	1	\N
9214	faPersonBiking		\N	27	\N	9214	\N	1	\N
9215	faPersonBooth		\N	27	\N	9215	\N	1	\N
9216	faPersonBreastfeeding		\N	27	\N	9216	\N	1	\N
9217	faPersonBurst		\N	27	\N	9217	\N	1	\N
9218	faPersonCane		\N	27	\N	9218	\N	1	\N
9219	faPersonChalkboard		\N	27	\N	9219	\N	1	\N
9220	faPersonCircleCheck		\N	27	\N	9220	\N	1	\N
9221	faPersonCircleExclamation		\N	27	\N	9221	\N	1	\N
9222	faPersonCircleMinus		\N	27	\N	9222	\N	1	\N
9223	faPersonCirclePlus		\N	27	\N	9223	\N	1	\N
9224	faPersonCircleQuestion		\N	27	\N	9224	\N	1	\N
9225	faPersonCircleXmark		\N	27	\N	9225	\N	1	\N
9226	faPersonDigging		\N	27	\N	9226	\N	1	\N
9227	faPersonDotsFromLine		\N	27	\N	9227	\N	1	\N
9228	faPersonDress		\N	27	\N	9228	\N	1	\N
9229	faPersonDressBurst		\N	27	\N	9229	\N	1	\N
9230	faPersonDrowning		\N	27	\N	9230	\N	1	\N
9231	faPersonFalling		\N	27	\N	9231	\N	1	\N
9232	faPersonFallingBurst		\N	27	\N	9232	\N	1	\N
9233	faPersonHalfDress		\N	27	\N	9233	\N	1	\N
9234	faPersonHarassing		\N	27	\N	9234	\N	1	\N
9235	faPersonHiking		\N	27	\N	9235	\N	1	\N
9236	faPersonMilitaryPointing		\N	27	\N	9236	\N	1	\N
9237	faPersonMilitaryRifle		\N	27	\N	9237	\N	1	\N
9238	faPersonMilitaryToPerson		\N	27	\N	9238	\N	1	\N
9239	faPersonPraying		\N	27	\N	9239	\N	1	\N
9240	faPersonPregnant		\N	27	\N	9240	\N	1	\N
9241	faPersonRays		\N	27	\N	9241	\N	1	\N
9242	faPersonRifle		\N	27	\N	9242	\N	1	\N
9243	faPersonRunning		\N	27	\N	9243	\N	1	\N
9244	faPersonShelter		\N	27	\N	9244	\N	1	\N
9245	faPersonSkating		\N	27	\N	9245	\N	1	\N
9246	faPersonSkiing		\N	27	\N	9246	\N	1	\N
9247	faPersonSkiingNordic		\N	27	\N	9247	\N	1	\N
9248	faPersonSnowboarding		\N	27	\N	9248	\N	1	\N
9249	faPersonSwimming		\N	27	\N	9249	\N	1	\N
9250	faPersonThroughWindow		\N	27	\N	9250	\N	1	\N
9251	faPersonWalking		\N	27	\N	9251	\N	1	\N
9252	faPersonWalkingArrowLoopLeft		\N	27	\N	9252	\N	1	\N
9253	faPersonWalkingArrowRight		\N	27	\N	9253	\N	1	\N
9254	faPersonWalkingDashedLineArrowRight		\N	27	\N	9254	\N	1	\N
9255	faPersonWalkingLuggage		\N	27	\N	9255	\N	1	\N
9256	faPersonWalkingWithCane		\N	27	\N	9256	\N	1	\N
9257	faPesetaSign		\N	27	\N	9257	\N	1	\N
9258	faPesoSign		\N	27	\N	9258	\N	1	\N
9259	faPhabricator		\N	27	\N	9259	\N	1	\N
9260	faPhoenixFramework		\N	27	\N	9260	\N	1	\N
9261	faPhoenixSquadron		\N	27	\N	9261	\N	1	\N
9262	faPhone		\N	27	\N	9262	\N	1	\N
9263	faPhoneFlip		\N	27	\N	9263	\N	1	\N
9264	faPhoneSlash		\N	27	\N	9264	\N	1	\N
9265	faPhoneVolume		\N	27	\N	9265	\N	1	\N
9266	faPhotoFilm		\N	27	\N	9266	\N	1	\N
9267	faPhp		\N	27	\N	9267	\N	1	\N
9268	faPiedPiper		\N	27	\N	9268	\N	1	\N
9269	faPiedPiperAlt		\N	27	\N	9269	\N	1	\N
9270	faPiedPiperHat		\N	27	\N	9270	\N	1	\N
9271	faPiedPiperPp		\N	27	\N	9271	\N	1	\N
9272	faPiggyBank		\N	27	\N	9272	\N	1	\N
9273	faPills		\N	27	\N	9273	\N	1	\N
9274	faPinterest		\N	27	\N	9274	\N	1	\N
9275	faPinterestP		\N	27	\N	9275	\N	1	\N
9276	faPix		\N	27	\N	9276	\N	1	\N
9277	faPixiv		\N	27	\N	9277	\N	1	\N
9278	faPizzaSlice		\N	27	\N	9278	\N	1	\N
9279	faPlaceOfWorship		\N	27	\N	9279	\N	1	\N
9280	faPlane		\N	27	\N	9280	\N	1	\N
9281	faPlaneArrival		\N	27	\N	9281	\N	1	\N
9282	faPlaneCircleCheck		\N	27	\N	9282	\N	1	\N
9283	faPlaneCircleExclamation		\N	27	\N	9283	\N	1	\N
9284	faPlaneCircleXmark		\N	27	\N	9284	\N	1	\N
9285	faPlaneDeparture		\N	27	\N	9285	\N	1	\N
9286	faPlaneLock		\N	27	\N	9286	\N	1	\N
9287	faPlaneSlash		\N	27	\N	9287	\N	1	\N
9288	faPlaneUp		\N	27	\N	9288	\N	1	\N
9289	faPlantWilt		\N	27	\N	9289	\N	1	\N
9290	faPlateWheat		\N	27	\N	9290	\N	1	\N
9291	faPlay		\N	27	\N	9291	\N	1	\N
9292	faPlaystation		\N	27	\N	9292	\N	1	\N
9293	faPlug		\N	27	\N	9293	\N	1	\N
9294	faPlugCircleBolt		\N	27	\N	9294	\N	1	\N
9295	faPlugCircleCheck		\N	27	\N	9295	\N	1	\N
9296	faPlugCircleExclamation		\N	27	\N	9296	\N	1	\N
9297	faPlugCircleMinus		\N	27	\N	9297	\N	1	\N
9298	faPlugCirclePlus		\N	27	\N	9298	\N	1	\N
9299	faPlugCircleXmark		\N	27	\N	9299	\N	1	\N
9300	faPlus		\N	27	\N	9300	\N	1	\N
9301	faPlusMinus		\N	27	\N	9301	\N	1	\N
9302	faPodcast		\N	27	\N	9302	\N	1	\N
9303	faPoo		\N	27	\N	9303	\N	1	\N
9304	faPooStorm		\N	27	\N	9304	\N	1	\N
9305	faPoop		\N	27	\N	9305	\N	1	\N
9306	faPowerOff		\N	27	\N	9306	\N	1	\N
9307	faPrescription		\N	27	\N	9307	\N	1	\N
9308	faPrescriptionBottle		\N	27	\N	9308	\N	1	\N
9309	faPrescriptionBottleMedical		\N	27	\N	9309	\N	1	\N
9310	faPrint		\N	27	\N	9310	\N	1	\N
9311	faProductHunt		\N	27	\N	9311	\N	1	\N
9312	faPumpMedical		\N	27	\N	9312	\N	1	\N
9313	faPumpSoap		\N	27	\N	9313	\N	1	\N
9314	faPushed		\N	27	\N	9314	\N	1	\N
9315	faPuzzlePiece		\N	27	\N	9315	\N	1	\N
9316	faPython		\N	27	\N	9316	\N	1	\N
9317	faQ		\N	27	\N	9317	\N	1	\N
9318	faQq		\N	27	\N	9318	\N	1	\N
9319	faQrcode		\N	27	\N	9319	\N	1	\N
100005	faMap	s	\N	27	\N	100005	\N	1	\N
8000	fa0		\N	27	\N	8000	\N	1	\N
8001	fa1		\N	27	\N	8001	\N	1	\N
8002	fa2		\N	27	\N	8002	\N	1	\N
8003	fa3		\N	27	\N	8003	\N	1	\N
8004	fa4		\N	27	\N	8004	\N	1	\N
8005	fa5		\N	27	\N	8005	\N	1	\N
8006	fa6		\N	27	\N	8006	\N	1	\N
8007	fa7		\N	27	\N	8007	\N	1	\N
8008	fa8		\N	27	\N	8008	\N	1	\N
100129	Fin de Año	31/12	8	100121	100121	\N	\N	0	\N
100028	Divisas en efectivo ( directamente en caja principal)		\N	100026	100026	\N	\N	0	\N
100130	Halloween	31/10	10	100121	100121	\N	\N	0	\N
100131	Carnaval  2025	03/03/25 , 04/03/25	11	100121	100121	\N	\N	0	\N
100148	Diplomado		0	4	100270	\N	\N	0	\N
100271	Contaduria		0	110	\N	\N	\N	0	\N
100190	Prefijos Telefónicos (Venezuela)		81	\N	\N	9104	\N	1	\N
100132	Elecciones 2025	25/05/25	9	100121	100121	\N	\N	0	\N
100191	0412	Digitel	0	100190	\N	9104	{"mobile": true}	0	\N
100314	Admin xd		9	3	\N	9769	{"id_objeto": [100290, 100141, 100142], "id_clasificacion": [110, 200, 122, 5, 1, 4, 100310]}	0	\N
100192	Día de Todos los Santos	01/11\n	0	100121	\N	\N	\N	0	\N
100133	Oficio Tecnológico emergente (Petare)		0	4	100134	\N	\N	0	\N
100134	Informática (Sede Petare)		0	110	202	\N	\N	0	\N
100193	Día de los Reyes Magos	06/01\n	0	100121	\N	\N	\N	0	\N
100194	Día de la Divina Pastora	14/01\n	0	100121	\N	\N	\N	0	\N
100195	Declaración de la Independencia	19/04	0	100121	\N	\N	\N	0	\N
100196	Día de la Bandera	03/08\n	0	100121	\N	\N	\N	0	\N
100155	Bancos		129	\N	\N	8244	\N	1	\N
100197	Día de la Guardía Nacional	04/08	0	100121	\N	\N	\N	0	\N
100198	Día de la Resistencia Indígena	12/10\n	0	100121	\N	\N	\N	0	\N
100140	¿Cuál es tu deporte favorito?		0	8	8	9817	\N	0	\N
100199	0414	Movistar	0	100190	\N	9104	{"mobile": true}	0	\N
100201	0416	Movilnet	0	100190	\N	9104	{"mobile": true}	0	\N
100200	0424	Movistar	0	100190	\N	9104	{"mobile": true}	0	\N
100121	Días Feriados		126	\N	\N	8269	\N	1	\N
100122	Año Nuevo	01/01	1	100121	100121	\N	\N	0	\N
100202	0426	Movilnet	0	100190	\N	9104	{"mobile": true}	0	\N
100323	Contaduria (Sede Petare)		0	110	202	\N	\N	0	\N
100123	Batalla de Carabobo	24/06	3	100121	100121	\N	\N	0	\N
100307	Foto del Curso		0	100094	\N	\N	\N	0	\N
100324	Administración de Empresas  (Sede Petare)		0	110	202	\N	\N	0	\N
300	 BANCO DE VENEZUELA	0102	0	100155	\N	\N	\N	0	\N
301	BANCO VENEZOLANO DE CREDITO	0104	0	100155	\N	\N	\N	0	\N
100124	Día Del Trabajador	01/05	2	100121	100121	\N	\N	0	\N
302	BANCO MERCANTIL	0105	0	100155	\N	\N	\N	0	\N
100167	Agregar Configuraciones	No tiene la opción de agregar configuraciones	0	73	\N	\N	\N	0	\N
100142	Menú de Configuración	No tiene la opción del menú de configuración	0	73	\N	\N	\N	0	\N
100319	Menú de Cohorte	No tiene la opción del  menú de la Cohorte	0	73	\N	\N	\N	0	\N
100290	Menú de Lista de Cursos	No tiene la opción del menú de la lista de cursos	0	73	\N	\N	\N	0	\N
100171	Menú de Tipos de Documentos	No tiene la opción del menú de documentos	0	73	\N	\N	\N	0	\N
100270	Administración  de Empresas		0	110	201	8239	\N	0	\N
303	 BBVA PROVINCIAL	0108	0	100155	\N	\N	\N	0	\N
100205	0234	Miranda (Los Teques)	\N	100190	\N	9265	{"mobile": false}	0	\N
100206	0235	Miranda (Guatire)	\N	100190	\N	9265	{"mobile": false}	0	\N
100152	Informática		0	110	201	8414	{"mask": "CEP-999"}	0	\N
100207	0239	Miranda (Guarenas)	\N	100190	\N	9265	{"mobile": false}	0	\N
100208	0243	Aragua (Maracay)	\N	100190	\N	9265	{"mobile": false}	0	\N
100209	0241	Carabobo (Valencia)	\N	100190	\N	9265	{"mobile": false}	0	\N
100210	0251	Lara (Barquisimeto)	\N	100190	\N	9265	{"mobile": false}	0	\N
100211	0261	Zulia (Maracaibo)	\N	100190	\N	9265	{"mobile": false}	0	\N
100212	0268	Falcón (Coro, Punto Fijo)	\N	100190	\N	9265	{"mobile": false}	0	\N
100213	0269	Falcón (Tucacas)	\N	100190	\N	9265	{"mobile": false}	0	\N
100214	0281	Anzoátegui (Barcelona, Puerto La Cruz)	\N	100190	\N	9265	{"mobile": false}	0	\N
100215	0285	Bolívar (Ciudad Bolívar)	\N	100190	\N	9265	{"mobile": false}	0	\N
100216	0286	Bolívar ( Ciudad Guayana)	\N	100190	\N	9265	{"mobile": false}	0	\N
100217	0295	Nueva Esparta (Isla Margarita)	\N	100190	\N	9265	{"mobile": false}	0	\N
100218	0276	Táchira (San Cristóbal)	\N	100190	\N	9265	{"mobile": false}	0	\N
100219	0274	Mérida (Mérida)	\N	100190	\N	9265	{"mobile": false}	0	\N
100220	0271	Trujillo (Trujillo)	\N	100190	\N	9265	{"mobile": false}	0	\N
100221	0257	Portuguesa (Guanare)	\N	100190	\N	9265	{"mobile": false}	0	\N
100222	0258	Cojedes (San Carlos)	\N	100190	\N	9265	{"mobile": false}	0	\N
100223	0246	Guárico (Calabozo)	\N	100190	\N	9265	{"mobile": false}	0	\N
100224	0247	Guárico (San Juan de Los Morros)	\N	100190	\N	9265	{"mobile": false}	0	\N
100225	0291	Monagas (Maturín)	\N	100190	\N	9265	{"mobile": false}	0	\N
100226	0293	Sucre (Cumaná)	\N	100190	\N	9265	{"mobile": false}	0	\N
100227	0287	Delta Amacuro (Tucupita)	\N	100190	\N	9265	{"mobile": false}	0	\N
100228	0282	Amazonas (Puerto Ayacucho)	\N	100190	\N	9265	{"mobile": false}	0	\N
100229	0247	Apure (San Fernando de Apure)	\N	100190	\N	9265	{"mobile": false}	0	\N
100230	0273	Barinas (Barinas)	\N	100190	\N	9265	{"mobile": false}	0	\N
100231	0254	Yaracuy (San Felipe)	\N	100190	\N	9265	{"mobile": false}	0	\N
304	 BANCARIBE	0114	0	100155	\N	\N	\N	0	\N
100233	0212	La Guaira (La Guaira)	\N	100190	\N	9265	{"mobile": false}	0	\N
100232	0292	Dependencias Federales	\N	100190	\N	9265	{"mobile": false}	0	\N
305	 BANCO EXTERIOR	0115	0	100155	\N	\N	\N	0	\N
306	 BANCO CARONI	0128	0	100155	\N	\N	\N	0	\N
307	 BANESCO	0134	0	100155	\N	\N	\N	0	\N
309	 BANCO PLAZA	0138	0	100155	\N	\N	\N	0	\N
308	 BANCO SOFITASA	0137	0	100155	\N	\N	\N	0	\N
312	100% BANCO	0156	0	100155	\N	\N	\N	0	\N
313	DELSUR BANCO UNIVERSAL	0157	0	100155	\N	\N	\N	0	\N
314	BANCO DEL TESORO	0163	0	100155	\N	\N	\N	0	\N
315	 BANCRECER	0168	0	100155	\N	\N	\N	0	\N
316	 R4 BANCO MICROFINANCIERO C.A.	0169	0	100155	\N	\N	\N	0	\N
317	 BANCO ACTIVO	0171	0	100155	\N	\N	\N	0	\N
318	 BANCAMIGA BANCO UNIVERSAL, C.A.	0172	0	100155	\N	\N	\N	0	\N
319	 BANCO INTERNACIONAL DE DESARROLLO	0173	0	100155	\N	\N	\N	0	\N
320	 BANPLUS	0174	0	100155	\N	\N	\N	0	\N
100204	0212	Distrito Capital (Caracas, El Junquito)	0	100190	\N	9265	{"mobile": true}	0	\N
311	BANCO FONDO COMUN	0151	0	100155	\N	\N	\N	0	\N
310	 BANGENTE	0146	0	100155	\N	\N	\N	0	\N
100125	Día de la Independencia	05/07	4	100121	100121	\N	\N	0	\N
321	 BANCO DIGITAL DE LOS TRABAJADORES, BANCO UNIVERSAL	0175	0	100155	\N	\N	\N	0	\N
322	 BANFANB	0177	0	100155	\N	\N	\N	0	\N
323	N58 BANCO DIGITAL BANCO MICROFINANCIERO S A	0178	0	100155	\N	\N	\N	0	\N
324	 BANCO NACIONAL DE CREDITO	0191	0	100155	\N	\N	\N	0	\N
10024	Distrito Capital		0	122	\N	8072	\N	0	\N
100126	Víspera de Navidad	24/12	6	100121	100121	\N	\N	0	\N
6	Masculino	sexo masculino	1	1	\N	9053	\N	1	\N
100052	Presencial / Sabatino		\N	100050	\N	\N	\N	0	\N
100053	On line		\N	100050	\N	\N	\N	0	\N
100027	Transferencia Bancaria		\N	100026	100026	\N	\N	0	\N
100055	Bolívares en efectivo ( directamente en caja principal)		\N	100026	\N	\N	\N	0	\N
100056	Débito / Punto de Venta (directamente en caja principal)		\N	100026	\N	\N	\N	0	\N
100057	Financiamiento		\N	100026	\N	\N	\N	0	\N
100058	Cancelar el día de Inicio del Curso		\N	100026	\N	\N	\N	0	\N
100060	Activo		\N	100059	\N	\N	\N	0	\N
9320	faQuestion		\N	27	\N	9320	\N	1	\N
116	Ninguna		\N	110	\N	\N	\N	0	\N
100079	Educación Especial		\N	110	202	8239	\N	0	\N
100096	Genérico		0	100094	\N	\N	\N	0	\N
100097	Listado Asistencia		0	100094	\N	\N	\N	0	\N
100098	Fotografía Grupal		0	100094	\N	\N	\N	0	\N
100099	Certificado Docente		0	100094	\N	\N	\N	0	\N
100100	Flyer de Presentación		0	100094	\N	\N	\N	0	\N
202	IUJO (Petare)	El Instituto Universitario Jesús Obrero Ampliación Petare	20	200	200	8240	{"mask": "UPP-999"}	0	\N
100101	Láminas de Ejercicios		0	100094	\N	\N	\N	0	\N
100102	Imagen de Carrusel		0	100094	\N	\N	\N	0	\N
9321	faQuinscape		\N	27	\N	9321	\N	1	\N
9322	faQuora		\N	27	\N	9322	\N	1	\N
9323	faQuoteLeft		\N	27	\N	9323	\N	1	\N
12	Estudiante IUJO		6	3	\N	9772	{"id_objeto": [100290], "id_clasificacion": []}	0	\N
100059	Status		150	\N	\N	8330	\N	0	\N
100050	Modalidad		45	\N	\N	8266	\N	0	\N
9324	faQuoteRight		\N	27	\N	9324	\N	1	\N
9325	faR		\N	27	\N	9325	\N	1	\N
100026	Forma de pago	pagos de los cursos	130	\N	\N	8809	\N	1	\N
7	Femenino	sexo femenino	\N	1	\N	9790	\N	1	\N
100062	Cancelado		0	100059	100059	8075	\N	0	\N
100061	Inactivo		1	100059	100059	\N	\N	0	\N
9326	faRProject		\N	27	\N	9326	\N	1	\N
9327	faRadiation		\N	27	\N	9327	\N	1	\N
201	IUJO (Catia)	Instituto Universitario Jesús Obrero (Catia)	10	200	200	8245	{"mask": "CEP-999"}	0	\N
203	IUJO (Barquisimeto)	Instituto Universitario Jesús Obrero (Barquisimeto)	30	200	200	8241	{"mask": "CEB-999"}	0	\N
27	Íconos		80	\N	\N	8926	\N	1	\N
100094	Tipo de Documento	Listado de Tipos de Documentos	120	\N	\N	8678	\N	0	\N
100095	Informativo		0	100094	\N	\N	\N	0	\N
10010	Falcón		\N	122	\N	\N	\N	1	\N
10011	Guárico		\N	122	\N	\N	\N	1	\N
10012	Lara		\N	122	\N	\N	\N	1	\N
10013	Mérida		\N	122	\N	\N	\N	1	\N
10014	Miranda		\N	122	\N	\N	\N	1	\N
10015	Monagas		\N	122	\N	\N	\N	1	\N
10016	Nueva Esparta		\N	122	\N	\N	\N	1	\N
10017	Portuguesa		\N	122	\N	\N	\N	1	\N
10018	Sucre		\N	122	\N	\N	\N	1	\N
10019	Táchira		\N	122	\N	\N	\N	1	\N
10020	Trujillo		\N	122	\N	\N	\N	1	\N
10021	Vargas		\N	122	\N	\N	\N	1	\N
10022	Yaracuy		\N	122	\N	\N	\N	1	\N
10023	Zulia		\N	122	\N	\N	\N	1	\N
10025	Dependencias Federales		\N	122	\N	\N	\N	1	\N
30001	Alto Orinoco		\N	123	10001	\N	\N	1	\N
30002	Atabapo		\N	123	10001	\N	\N	1	\N
30003	Atures		\N	123	10001	\N	\N	1	\N
30004	Autana		\N	123	10001	\N	\N	1	\N
30005	Manapiare		\N	123	10001	\N	\N	1	\N
30006	Maroa		\N	123	10001	\N	\N	1	\N
30007	Río Negro		\N	123	10001	\N	\N	1	\N
30008	Anaco		\N	123	10002	\N	\N	1	\N
30009	Aragua		\N	123	10002	\N	\N	1	\N
30010	Manuel Ezequiel Bruzual		\N	123	10002	\N	\N	1	\N
30011	Diego Bautista Urbaneja		\N	123	10002	\N	\N	1	\N
30012	Fernando Peñalver		\N	123	10002	\N	\N	1	\N
30013	Francisco Del Carmen Carvajal		\N	123	10002	\N	\N	1	\N
30014	General Sir Arthur McGregor		\N	123	10002	\N	\N	1	\N
30015	Guanta		\N	123	10002	\N	\N	1	\N
30016	Independencia		\N	123	10002	\N	\N	1	\N
30017	José Gregorio Monagas		\N	123	10002	\N	\N	1	\N
30018	Juan Antonio Sotillo		\N	123	10002	\N	\N	1	\N
30019	Juan Manuel Cajigal		\N	123	10002	\N	\N	1	\N
30020	Libertad		\N	123	10002	\N	\N	1	\N
30021	Francisco de Miranda		\N	123	10002	\N	\N	1	\N
30022	Pedro María Freites		\N	123	10002	\N	\N	1	\N
30023	Píritu		\N	123	10002	\N	\N	1	\N
30024	San José de Guanipa		\N	123	10002	\N	\N	1	\N
30025	San Juan de Capistrano		\N	123	10002	\N	\N	1	\N
30026	Santa Ana		\N	123	10002	\N	\N	1	\N
30027	Simón Bolívar		\N	123	10002	\N	\N	1	\N
30028	Simón Rodríguez		\N	123	10002	\N	\N	1	\N
30029	Achaguas		\N	123	10003	\N	\N	1	\N
30030	Biruaca		\N	123	10003	\N	\N	1	\N
30031	Muñóz		\N	123	10003	\N	\N	1	\N
30032	Páez		\N	123	10003	\N	\N	1	\N
30033	Pedro Camejo		\N	123	10003	\N	\N	1	\N
30034	Rómulo Gallegos		\N	123	10003	\N	\N	1	\N
30035	San Fernando		\N	123	10003	\N	\N	1	\N
30036	Atanasio Girardot		\N	123	10004	\N	\N	1	\N
30037	Bolívar		\N	123	10004	\N	\N	1	\N
30038	Camatagua		\N	123	10004	\N	\N	1	\N
30039	Francisco Linares Alcántara		\N	123	10004	\N	\N	1	\N
30040	José Ángel Lamas		\N	123	10004	\N	\N	1	\N
30041	José Félix Ribas		\N	123	10004	\N	\N	1	\N
30042	José Rafael Revenga		\N	123	10004	\N	\N	1	\N
30043	Libertador		\N	123	10004	\N	\N	1	\N
30044	Mario Briceño Iragorry		\N	123	10004	\N	\N	1	\N
30045	Ocumare de la Costa de Oro		\N	123	10004	\N	\N	1	\N
30046	San Casimiro		\N	123	10004	\N	\N	1	\N
30047	San Sebastián		\N	123	10004	\N	\N	1	\N
30048	Santiago Mariño		\N	123	10004	\N	\N	1	\N
30049	Santos Michelena		\N	123	10004	\N	\N	1	\N
30050	Sucre		\N	123	10004	\N	\N	1	\N
30051	Tovar		\N	123	10004	\N	\N	1	\N
30052	Urdaneta		\N	123	10004	\N	\N	1	\N
30053	Zamora		\N	123	10004	\N	\N	1	\N
30054	Alberto Arvelo Torrealba		\N	123	10005	\N	\N	1	\N
30055	Andrés Eloy Blanco		\N	123	10005	\N	\N	1	\N
30056	Antonio José de Sucre		\N	123	10005	\N	\N	1	\N
30057	Arismendi		\N	123	10005	\N	\N	1	\N
30058	Barinas		\N	123	10005	\N	\N	1	\N
30059	Bolívar		\N	123	10005	\N	\N	1	\N
30060	Cruz Paredes		\N	123	10005	\N	\N	1	\N
30061	Ezequiel Zamora		\N	123	10005	\N	\N	1	\N
30062	Obispos		\N	123	10005	\N	\N	1	\N
30063	Pedraza		\N	123	10005	\N	\N	1	\N
30064	Rojas		\N	123	10005	\N	\N	1	\N
30065	Sosa		\N	123	10005	\N	\N	1	\N
30066	Caroní		\N	123	10006	\N	\N	1	\N
8	Pregunta de Seguridad		140	\N	\N	9320	\N	0	\N
30067	Cedeño		\N	123	10006	\N	\N	1	\N
30068	El Callao		\N	123	10006	\N	\N	1	\N
30069	Gran Sabana		\N	123	10006	\N	\N	1	\N
30070	Heres		\N	123	10006	\N	\N	1	\N
30071	Piar		\N	123	10006	\N	\N	1	\N
30072	Angostura Raúl Leoni		\N	123	10006	\N	\N	1	\N
30073	Roscio		\N	123	10006	\N	\N	1	\N
30074	Sifontes		\N	123	10006	\N	\N	1	\N
30075	Sucre		\N	123	10006	\N	\N	1	\N
30076	Padre Pedro Chien		\N	123	10006	\N	\N	1	\N
30077	Bejuma		\N	123	10007	\N	\N	1	\N
30078	Carlos Arvelo		\N	123	10007	\N	\N	1	\N
30079	Diego Ibarra		\N	123	10007	\N	\N	1	\N
30080	Guacara		\N	123	10007	\N	\N	1	\N
30081	Juan José Mora		\N	123	10007	\N	\N	1	\N
30082	Libertador		\N	123	10007	\N	\N	1	\N
30083	Los Guayos		\N	123	10007	\N	\N	1	\N
30084	Miranda		\N	123	10007	\N	\N	1	\N
30085	Montalbán		\N	123	10007	\N	\N	1	\N
30086	Naguanagua		\N	123	10007	\N	\N	1	\N
30087	Puerto Cabello		\N	123	10007	\N	\N	1	\N
30088	San Diego		\N	123	10007	\N	\N	1	\N
30089	San Joaquín		\N	123	10007	\N	\N	1	\N
30090	Valencia		\N	123	10007	\N	\N	1	\N
30091	Anzoátegui		\N	123	10008	\N	\N	1	\N
30092	Tinaquillo		\N	123	10008	\N	\N	1	\N
30093	Girardot		\N	123	10008	\N	\N	1	\N
30094	Lima Blanco		\N	123	10008	\N	\N	1	\N
30095	Pao de San Juan Bautista		\N	123	10008	\N	\N	1	\N
30096	Ricaurte		\N	123	10008	\N	\N	1	\N
30097	Rómulo Gallegos		\N	123	10008	\N	\N	1	\N
30098	San Carlos		\N	123	10008	\N	\N	1	\N
30099	Tinaco		\N	123	10008	\N	\N	1	\N
30100	Antonio Díaz		\N	123	10009	\N	\N	1	\N
30101	Casacoima		\N	123	10009	\N	\N	1	\N
30102	Pedernales		\N	123	10009	\N	\N	1	\N
30103	Tucupita		\N	123	10009	\N	\N	1	\N
30104	Acosta		\N	123	10010	\N	\N	1	\N
30105	Bolívar		\N	123	10010	\N	\N	1	\N
30106	Buchivacoa		\N	123	10010	\N	\N	1	\N
30107	Cacique Manaure		\N	123	10010	\N	\N	1	\N
30108	Carirubana		\N	123	10010	\N	\N	1	\N
30109	Colina		\N	123	10010	\N	\N	1	\N
30110	Dabajuro		\N	123	10010	\N	\N	1	\N
30111	Democracia		\N	123	10010	\N	\N	1	\N
30112	Falcón		\N	123	10010	\N	\N	1	\N
30113	Federación		\N	123	10010	\N	\N	1	\N
30114	Jacura		\N	123	10010	\N	\N	1	\N
30115	José Laurencio Silva		\N	123	10010	\N	\N	1	\N
30116	Los Taques		\N	123	10010	\N	\N	1	\N
30117	Mauroa		\N	123	10010	\N	\N	1	\N
30118	Miranda		\N	123	10010	\N	\N	1	\N
30119	Monseñor Iturriza		\N	123	10010	\N	\N	1	\N
30120	Palmasola		\N	123	10010	\N	\N	1	\N
30121	Petit		\N	123	10010	\N	\N	1	\N
30122	Píritu		\N	123	10010	\N	\N	1	\N
30123	San Francisco		\N	123	10010	\N	\N	1	\N
30124	Sucre		\N	123	10010	\N	\N	1	\N
30125	Tocópero		\N	123	10010	\N	\N	1	\N
30126	Unión		\N	123	10010	\N	\N	1	\N
30127	Urumaco		\N	123	10010	\N	\N	1	\N
30128	Zamora		\N	123	10010	\N	\N	1	\N
30129	Camaguán		\N	123	10011	\N	\N	1	\N
30130	Chaguaramas		\N	123	10011	\N	\N	1	\N
30131	El Socorro		\N	123	10011	\N	\N	1	\N
30132	José Félix Ribas		\N	123	10011	\N	\N	1	\N
30133	José Tadeo Monagas		\N	123	10011	\N	\N	1	\N
30134	Juan Germán Roscio		\N	123	10011	\N	\N	1	\N
30135	Julián Mellado		\N	123	10011	\N	\N	1	\N
30136	Las Mercedes		\N	123	10011	\N	\N	1	\N
30137	Leonardo Infante		\N	123	10011	\N	\N	1	\N
30138	Pedro Zaraza		\N	123	10011	\N	\N	1	\N
30139	Ortíz		\N	123	10011	\N	\N	1	\N
30140	San Gerónimo de Guayabal		\N	123	10011	\N	\N	1	\N
30141	San José de Guaribe		\N	123	10011	\N	\N	1	\N
30142	Santa María de Ipire		\N	123	10011	\N	\N	1	\N
30143	Sebastián Francisco de Miranda		\N	123	10011	\N	\N	1	\N
30144	Andrés Eloy Blanco		\N	123	10012	\N	\N	1	\N
30145	Crespo		\N	123	10012	\N	\N	1	\N
30146	Iribarren		\N	123	10012	\N	\N	1	\N
30147	Jiménez		\N	123	10012	\N	\N	1	\N
30148	Morán		\N	123	10012	\N	\N	1	\N
30149	Palavecino		\N	123	10012	\N	\N	1	\N
30150	Simón Planas		\N	123	10012	\N	\N	1	\N
30151	Torres		\N	123	10012	\N	\N	1	\N
30152	Urdaneta		\N	123	10012	\N	\N	1	\N
30179	Alberto Adriani		\N	123	10013	\N	\N	1	\N
30180	Andrés Bello		\N	123	10013	\N	\N	1	\N
30181	Antonio Pinto Salinas		\N	123	10013	\N	\N	1	\N
30182	Aricagua		\N	123	10013	\N	\N	1	\N
30183	Arzobispo Chacón		\N	123	10013	\N	\N	1	\N
30184	Campo Elías		\N	123	10013	\N	\N	1	\N
30185	Caracciolo Parra Olmedo		\N	123	10013	\N	\N	1	\N
30186	Cardenal Quintero		\N	123	10013	\N	\N	1	\N
30187	Guaraque		\N	123	10013	\N	\N	1	\N
30188	Julio César Salas		\N	123	10013	\N	\N	1	\N
30189	Justo Briceño		\N	123	10013	\N	\N	1	\N
30190	Libertador		\N	123	10013	\N	\N	1	\N
30191	Miranda		\N	123	10013	\N	\N	1	\N
30192	Obispo Ramos de Lora		\N	123	10013	\N	\N	1	\N
30193	Padre Noguera		\N	123	10013	\N	\N	1	\N
30194	Pueblo Llano		\N	123	10013	\N	\N	1	\N
30195	Rangel		\N	123	10013	\N	\N	1	\N
30196	Rivas Dávila		\N	123	10013	\N	\N	1	\N
30197	Santos Marquina		\N	123	10013	\N	\N	1	\N
30198	Sucre		\N	123	10013	\N	\N	1	\N
30199	Tovar		\N	123	10013	\N	\N	1	\N
30200	Tulio Febres Cordero		\N	123	10013	\N	\N	1	\N
30201	Zea		\N	123	10013	\N	\N	1	\N
30223	Acevedo		\N	123	10014	\N	\N	1	\N
30224	Andrés Bello		\N	123	10014	\N	\N	1	\N
30225	Baruta		\N	123	10014	\N	\N	1	\N
30226	Brión		\N	123	10014	\N	\N	1	\N
30227	Buroz		\N	123	10014	\N	\N	1	\N
30228	Carrizal		\N	123	10014	\N	\N	1	\N
30229	Chacao		\N	123	10014	\N	\N	1	\N
30230	Cristóbal Rojas		\N	123	10014	\N	\N	1	\N
30231	El Hatillo		\N	123	10014	\N	\N	1	\N
30232	Guaicaipuro		\N	123	10014	\N	\N	1	\N
30233	Independencia		\N	123	10014	\N	\N	1	\N
30234	Lander		\N	123	10014	\N	\N	1	\N
30235	Los Salias		\N	123	10014	\N	\N	1	\N
30236	Páez		\N	123	10014	\N	\N	1	\N
30237	Paz Castillo		\N	123	10014	\N	\N	1	\N
30238	Pedro Gual		\N	123	10014	\N	\N	1	\N
30239	Plaza		\N	123	10014	\N	\N	1	\N
30240	Simón Bolívar		\N	123	10014	\N	\N	1	\N
30241	Sucre		\N	123	10014	\N	\N	1	\N
30242	Urdaneta		\N	123	10014	\N	\N	1	\N
30243	Zamora		\N	123	10014	\N	\N	1	\N
30258	Acosta		\N	123	10015	\N	\N	1	\N
30259	Aguasay		\N	123	10015	\N	\N	1	\N
30260	Bolívar		\N	123	10015	\N	\N	1	\N
30261	Caripe		\N	123	10015	\N	\N	1	\N
30262	Cedeño		\N	123	10015	\N	\N	1	\N
30263	Ezequiel Zamora		\N	123	10015	\N	\N	1	\N
30264	Libertador		\N	123	10015	\N	\N	1	\N
30265	Maturín		\N	123	10015	\N	\N	1	\N
30266	Piar		\N	123	10015	\N	\N	1	\N
30267	Punceres		\N	123	10015	\N	\N	1	\N
30268	Santa Bárbara		\N	123	10015	\N	\N	1	\N
30269	Sotillo		\N	123	10015	\N	\N	1	\N
30270	Uracoa		\N	123	10015	\N	\N	1	\N
30271	Antolín del Campo		\N	123	10016	\N	\N	1	\N
30272	Arismendi		\N	123	10016	\N	\N	1	\N
30273	García		\N	123	10016	\N	\N	1	\N
30274	Gómez		\N	123	10016	\N	\N	1	\N
30275	Maneiro		\N	123	10016	\N	\N	1	\N
30276	Marcano		\N	123	10016	\N	\N	1	\N
30277	Mariño		\N	123	10016	\N	\N	1	\N
30278	Península de Macanao		\N	123	10016	\N	\N	1	\N
30279	Tubores		\N	123	10016	\N	\N	1	\N
30280	Villalba		\N	123	10016	\N	\N	1	\N
30281	Díaz		\N	123	10016	\N	\N	1	\N
30282	Agua Blanca		\N	123	10017	\N	\N	1	\N
30283	Araure		\N	123	10017	\N	\N	1	\N
30284	Esteller		\N	123	10017	\N	\N	1	\N
30285	Guanare		\N	123	10017	\N	\N	1	\N
30286	Guanarito		\N	123	10017	\N	\N	1	\N
30287	Monseñor José Vicente de Unda		\N	123	10017	\N	\N	1	\N
30288	Ospino		\N	123	10017	\N	\N	1	\N
30289	Páez		\N	123	10017	\N	\N	1	\N
30290	Papelón		\N	123	10017	\N	\N	1	\N
30291	San Genaro de Boconoíto		\N	123	10017	\N	\N	1	\N
30292	San Rafael de Onoto		\N	123	10017	\N	\N	1	\N
30293	Santa Rosalía		\N	123	10017	\N	\N	1	\N
30294	Sucre		\N	123	10017	\N	\N	1	\N
30295	Turén		\N	123	10017	\N	\N	1	\N
30296	Andrés Eloy Blanco		\N	123	10018	\N	\N	1	\N
30297	Andrés Mata		\N	123	10018	\N	\N	1	\N
30298	Arismendi		\N	123	10018	\N	\N	1	\N
30299	Benítez		\N	123	10018	\N	\N	1	\N
30300	Bermúdez		\N	123	10018	\N	\N	1	\N
30301	Bolívar		\N	123	10018	\N	\N	1	\N
30302	Cajigal		\N	123	10018	\N	\N	1	\N
30303	Cruz Salmerón Acosta		\N	123	10018	\N	\N	1	\N
30304	Libertador		\N	123	10018	\N	\N	1	\N
30305	Mariño		\N	123	10018	\N	\N	1	\N
30306	Mejía		\N	123	10018	\N	\N	1	\N
30307	Montes		\N	123	10018	\N	\N	1	\N
30308	Ribero		\N	123	10018	\N	\N	1	\N
30309	Sucre		\N	123	10018	\N	\N	1	\N
30310	Valdéz		\N	123	10018	\N	\N	1	\N
30341	Andrés Bello		\N	123	10019	\N	\N	1	\N
30342	Antonio Rómulo Costa		\N	123	10019	\N	\N	1	\N
30343	Ayacucho		\N	123	10019	\N	\N	1	\N
30344	Bolívar		\N	123	10019	\N	\N	1	\N
30345	Cárdenas		\N	123	10019	\N	\N	1	\N
30346	Córdoba		\N	123	10019	\N	\N	1	\N
30347	Fernández Feo		\N	123	10019	\N	\N	1	\N
30348	Francisco de Miranda		\N	123	10019	\N	\N	1	\N
30349	García de Hevia		\N	123	10019	\N	\N	1	\N
30350	Guásimos		\N	123	10019	\N	\N	1	\N
30351	Independencia		\N	123	10019	\N	\N	1	\N
30352	Jáuregui		\N	123	10019	\N	\N	1	\N
30353	José María Vargas		\N	123	10019	\N	\N	1	\N
30354	Junín		\N	123	10019	\N	\N	1	\N
30355	Libertad		\N	123	10019	\N	\N	1	\N
30356	Libertador		\N	123	10019	\N	\N	1	\N
30357	Lobatera		\N	123	10019	\N	\N	1	\N
30358	Michelena		\N	123	10019	\N	\N	1	\N
30359	Panamericano		\N	123	10019	\N	\N	1	\N
30360	Pedro María Ureña		\N	123	10019	\N	\N	1	\N
30361	Rafael Urdaneta		\N	123	10019	\N	\N	1	\N
30362	Samuel Darío Maldonado		\N	123	10019	\N	\N	1	\N
30363	San Cristóbal		\N	123	10019	\N	\N	1	\N
30364	Seboruco		\N	123	10019	\N	\N	1	\N
30365	Simón Rodríguez		\N	123	10019	\N	\N	1	\N
30366	Sucre		\N	123	10019	\N	\N	1	\N
30367	Torbes		\N	123	10019	\N	\N	1	\N
30368	Uribante		\N	123	10019	\N	\N	1	\N
30369	San Judas Tadeo		\N	123	10019	\N	\N	1	\N
30370	Andrés Bello		\N	123	10020	\N	\N	1	\N
30371	Boconó		\N	123	10020	\N	\N	1	\N
30372	Bolívar		\N	123	10020	\N	\N	1	\N
30373	Candelaria		\N	123	10020	\N	\N	1	\N
30374	Carache		\N	123	10020	\N	\N	1	\N
30375	Escuque		\N	123	10020	\N	\N	1	\N
30376	José Felipe Márquez Cañizalez		\N	123	10020	\N	\N	1	\N
30377	Juan Vicente Campos Elías		\N	123	10020	\N	\N	1	\N
30378	La Ceiba		\N	123	10020	\N	\N	1	\N
30379	Miranda		\N	123	10020	\N	\N	1	\N
30380	Monte Carmelo		\N	123	10020	\N	\N	1	\N
30381	Motatán		\N	123	10020	\N	\N	1	\N
30382	Pampán		\N	123	10020	\N	\N	1	\N
30383	Pampanito		\N	123	10020	\N	\N	1	\N
30384	Rafael Rangel		\N	123	10020	\N	\N	1	\N
30385	San Rafael de Carvajal		\N	123	10020	\N	\N	1	\N
30386	Sucre		\N	123	10020	\N	\N	1	\N
30387	Trujillo		\N	123	10020	\N	\N	1	\N
30388	Urdaneta		\N	123	10020	\N	\N	1	\N
30389	Valera		\N	123	10020	\N	\N	1	\N
30390	Vargas		\N	123	10021	\N	\N	1	\N
30391	Arístides Bastidas		\N	123	10022	\N	\N	1	\N
30392	Bolívar		\N	123	10022	\N	\N	1	\N
30407	Bruzual		\N	123	10022	\N	\N	1	\N
30408	Cocorote		\N	123	10022	\N	\N	1	\N
30409	Independencia		\N	123	10022	\N	\N	1	\N
30410	José Antonio Páez		\N	123	10022	\N	\N	1	\N
30411	La Trinidad		\N	123	10022	\N	\N	1	\N
30412	Manuel Monge		\N	123	10022	\N	\N	1	\N
30413	Nirgua		\N	123	10022	\N	\N	1	\N
30414	Peña		\N	123	10022	\N	\N	1	\N
30415	San Felipe		\N	123	10022	\N	\N	1	\N
30416	Sucre		\N	123	10022	\N	\N	1	\N
30417	Urachiche		\N	123	10022	\N	\N	1	\N
30418	José Joaquín Veroes		\N	123	10022	\N	\N	1	\N
30441	Almirante Padilla		\N	123	10023	\N	\N	1	\N
30442	Baralt		\N	123	10023	\N	\N	1	\N
30443	Cabimas		\N	123	10023	\N	\N	1	\N
30444	Catatumbo		\N	123	10023	\N	\N	1	\N
30445	Colón		\N	123	10023	\N	\N	1	\N
30446	Francisco Javier Pulgar		\N	123	10023	\N	\N	1	\N
30447	Páez		\N	123	10023	\N	\N	1	\N
30448	Jesús Enrique Losada		\N	123	10023	\N	\N	1	\N
30449	Jesús María Semprún		\N	123	10023	\N	\N	1	\N
30450	La Cañada de Urdaneta		\N	123	10023	\N	\N	1	\N
30451	Lagunillas		\N	123	10023	\N	\N	1	\N
30452	Machiques de Perijá		\N	123	10023	\N	\N	1	\N
30453	Mara		\N	123	10023	\N	\N	1	\N
30454	Maracaibo		\N	123	10023	\N	\N	1	\N
30455	Miranda		\N	123	10023	\N	\N	1	\N
30456	Rosario de Perijá		\N	123	10023	\N	\N	1	\N
30457	San Francisco		\N	123	10023	\N	\N	1	\N
30458	Santa Rita		\N	123	10023	\N	\N	1	\N
30459	Simón Bolívar		\N	123	10023	\N	\N	1	\N
30460	Sucre		\N	123	10023	\N	\N	1	\N
30461	Valmore Rodríguez		\N	123	10023	\N	\N	1	\N
30462	Libertador		\N	123	10024	\N	\N	1	\N
40001	Alto Orinoco		\N	124	30001	\N	\N	1	\N
40002	Huachamacare Acanaña		\N	124	30001	\N	\N	1	\N
40003	Marawaka Toky Shamanaña		\N	124	30001	\N	\N	1	\N
40004	Mavaka Mavaka		\N	124	30001	\N	\N	1	\N
40005	Sierra Parima Parimabé		\N	124	30001	\N	\N	1	\N
40006	Ucata Laja Lisa		\N	124	30002	\N	\N	1	\N
40007	Yapacana Macuruco		\N	124	30002	\N	\N	1	\N
40008	Caname Guarinuma		\N	124	30002	\N	\N	1	\N
40009	Fernando Girón Tovar		\N	124	30003	\N	\N	1	\N
40010	Luis Alberto Gómez		\N	124	30003	\N	\N	1	\N
40011	Pahueña Limón de Parhueña		\N	124	30003	\N	\N	1	\N
40012	Platanillal Platanillal		\N	124	30003	\N	\N	1	\N
40013	Samariapo		\N	124	30004	\N	\N	1	\N
40014	Sipapo		\N	124	30004	\N	\N	1	\N
40015	Munduapo		\N	124	30004	\N	\N	1	\N
40016	Guayapo		\N	124	30004	\N	\N	1	\N
40017	Alto Ventuari		\N	124	30005	\N	\N	1	\N
40018	Medio Ventuari		\N	124	30005	\N	\N	1	\N
40019	Bajo Ventuari		\N	124	30005	\N	\N	1	\N
40020	Victorino		\N	124	30006	\N	\N	1	\N
40021	Comunidad		\N	124	30006	\N	\N	1	\N
40022	Casiquiare		\N	124	30007	\N	\N	1	\N
40023	Cocuy		\N	124	30007	\N	\N	1	\N
40024	San Carlos de Río Negro		\N	124	30007	\N	\N	1	\N
40025	Solano		\N	124	30007	\N	\N	1	\N
40026	Anaco		\N	124	30008	\N	\N	1	\N
40027	San Joaquín		\N	124	30008	\N	\N	1	\N
40028	Cachipo		\N	124	30009	\N	\N	1	\N
40029	Aragua de Barcelona		\N	124	30009	\N	\N	1	\N
40030	Lechería		\N	124	30011	\N	\N	1	\N
40031	El Morro		\N	124	30011	\N	\N	1	\N
40032	Puerto Píritu		\N	124	30012	\N	\N	1	\N
40033	San Miguel		\N	124	30012	\N	\N	1	\N
40034	Sucre		\N	124	30012	\N	\N	1	\N
40035	Valle de Guanape		\N	124	30013	\N	\N	1	\N
40036	Santa Bárbara		\N	124	30013	\N	\N	1	\N
40037	El Chaparro		\N	124	30014	\N	\N	1	\N
40038	Tomás Alfaro		\N	124	30014	\N	\N	1	\N
40039	Calatrava		\N	124	30014	\N	\N	1	\N
40040	Guanta		\N	124	30015	\N	\N	1	\N
40041	Chorrerón		\N	124	30015	\N	\N	1	\N
40042	Mamo		\N	124	30016	\N	\N	1	\N
40043	Soledad		\N	124	30016	\N	\N	1	\N
40044	Mapire		\N	124	30017	\N	\N	1	\N
40045	Piar		\N	124	30017	\N	\N	1	\N
40046	Santa Clara		\N	124	30017	\N	\N	1	\N
40047	San Diego de Cabrutica		\N	124	30017	\N	\N	1	\N
40048	Uverito		\N	124	30017	\N	\N	1	\N
40049	Zuata		\N	124	30017	\N	\N	1	\N
40050	Puerto La Cruz		\N	124	30018	\N	\N	1	\N
40051	Pozuelos		\N	124	30018	\N	\N	1	\N
40052	Onoto		\N	124	30019	\N	\N	1	\N
40053	San Pablo		\N	124	30019	\N	\N	1	\N
40054	San Mateo		\N	124	30020	\N	\N	1	\N
40055	El Carito		\N	124	30020	\N	\N	1	\N
40056	Santa Inés		\N	124	30020	\N	\N	1	\N
40057	La Romereña		\N	124	30020	\N	\N	1	\N
40058	Atapirire		\N	124	30021	\N	\N	1	\N
40059	Boca del Pao		\N	124	30021	\N	\N	1	\N
40060	El Pao		\N	124	30021	\N	\N	1	\N
40061	Pariaguán		\N	124	30021	\N	\N	1	\N
40062	Cantaura		\N	124	30022	\N	\N	1	\N
40063	Libertador		\N	124	30022	\N	\N	1	\N
40064	Santa Rosa		\N	124	30022	\N	\N	1	\N
40065	Urica		\N	124	30022	\N	\N	1	\N
40066	Píritu		\N	124	30023	\N	\N	1	\N
40067	San Francisco		\N	124	30023	\N	\N	1	\N
40068	San José de Guanipa		\N	124	30024	\N	\N	1	\N
40069	Boca de Uchire		\N	124	30025	\N	\N	1	\N
40070	Boca de Chávez		\N	124	30025	\N	\N	1	\N
40071	Pueblo Nuevo		\N	124	30026	\N	\N	1	\N
40072	Santa Ana		\N	124	30026	\N	\N	1	\N
40073	Bergantín		\N	124	30027	\N	\N	1	\N
40074	Caigua		\N	124	30027	\N	\N	1	\N
40075	El Carmen		\N	124	30027	\N	\N	1	\N
40076	El Pilar		\N	124	30027	\N	\N	1	\N
40077	Naricual		\N	124	30027	\N	\N	1	\N
40078	San Crsitóbal		\N	124	30027	\N	\N	1	\N
40079	Edmundo Barrios		\N	124	30028	\N	\N	1	\N
40080	Miguel Otero Silva		\N	124	30028	\N	\N	1	\N
40081	Achaguas		\N	124	30029	\N	\N	1	\N
40082	Apurito		\N	124	30029	\N	\N	1	\N
40083	El Yagual		\N	124	30029	\N	\N	1	\N
40084	Guachara		\N	124	30029	\N	\N	1	\N
40085	Mucuritas		\N	124	30029	\N	\N	1	\N
40086	Queseras del medio		\N	124	30029	\N	\N	1	\N
40087	Biruaca		\N	124	30030	\N	\N	1	\N
40088	Bruzual		\N	124	30031	\N	\N	1	\N
40089	Mantecal		\N	124	30031	\N	\N	1	\N
40090	Quintero		\N	124	30031	\N	\N	1	\N
40091	Rincón Hondo		\N	124	30031	\N	\N	1	\N
40092	San Vicente		\N	124	30031	\N	\N	1	\N
40093	Guasdualito		\N	124	30032	\N	\N	1	\N
40094	Aramendi		\N	124	30032	\N	\N	1	\N
40095	El Amparo		\N	124	30032	\N	\N	1	\N
40096	San Camilo		\N	124	30032	\N	\N	1	\N
40097	Urdaneta		\N	124	30032	\N	\N	1	\N
40098	San Juan de Payara		\N	124	30033	\N	\N	1	\N
40099	Codazzi		\N	124	30033	\N	\N	1	\N
40100	Cunaviche		\N	124	30033	\N	\N	1	\N
40101	Elorza		\N	124	30034	\N	\N	1	\N
40102	La Trinidad		\N	124	30034	\N	\N	1	\N
40103	San Fernando		\N	124	30035	\N	\N	1	\N
40104	El Recreo		\N	124	30035	\N	\N	1	\N
40105	Peñalver		\N	124	30035	\N	\N	1	\N
40106	San Rafael de Atamaica		\N	124	30035	\N	\N	1	\N
40107	Pedro José Ovalles		\N	124	30036	\N	\N	1	\N
40108	Joaquín Crespo		\N	124	30036	\N	\N	1	\N
40109	José Casanova Godoy		\N	124	30036	\N	\N	1	\N
40110	Madre María de San José		\N	124	30036	\N	\N	1	\N
40111	Andrés Eloy Blanco		\N	124	30036	\N	\N	1	\N
40112	Los Tacarigua		\N	124	30036	\N	\N	1	\N
40113	Las Delicias		\N	124	30036	\N	\N	1	\N
40114	Choroní		\N	124	30036	\N	\N	1	\N
40115	Bolívar		\N	124	30037	\N	\N	1	\N
40116	Camatagua		\N	124	30038	\N	\N	1	\N
40117	Carmen de Cura		\N	124	30038	\N	\N	1	\N
40118	Santa Rita		\N	124	30039	\N	\N	1	\N
40119	Francisco de Miranda		\N	124	30039	\N	\N	1	\N
40120	Moseñor Feliciano González		\N	124	30039	\N	\N	1	\N
40121	Santa Cruz		\N	124	30040	\N	\N	1	\N
40122	José Félix Ribas		\N	124	30041	\N	\N	1	\N
40123	Castor Nieves Ríos		\N	124	30041	\N	\N	1	\N
40124	Las Guacamayas		\N	124	30041	\N	\N	1	\N
40125	Pao de Zárate		\N	124	30041	\N	\N	1	\N
40126	Zuata		\N	124	30041	\N	\N	1	\N
40127	José Rafael Revenga		\N	124	30042	\N	\N	1	\N
40128	Palo Negro		\N	124	30043	\N	\N	1	\N
40129	San Martín de Porres		\N	124	30043	\N	\N	1	\N
40130	El Limón		\N	124	30044	\N	\N	1	\N
40131	Caña de Azúcar		\N	124	30044	\N	\N	1	\N
40132	Ocumare de la Costa		\N	124	30045	\N	\N	1	\N
40133	San Casimiro		\N	124	30046	\N	\N	1	\N
40134	Güiripa		\N	124	30046	\N	\N	1	\N
40135	Ollas de Caramacate		\N	124	30046	\N	\N	1	\N
40136	Valle Morín		\N	124	30046	\N	\N	1	\N
40137	San Sebastían		\N	124	30047	\N	\N	1	\N
40138	Turmero		\N	124	30048	\N	\N	1	\N
40139	Arevalo Aponte		\N	124	30048	\N	\N	1	\N
40140	Chuao		\N	124	30048	\N	\N	1	\N
40141	Samán de Güere		\N	124	30048	\N	\N	1	\N
40142	Alfredo Pacheco Miranda		\N	124	30048	\N	\N	1	\N
40143	Santos Michelena		\N	124	30049	\N	\N	1	\N
40144	Tiara		\N	124	30049	\N	\N	1	\N
40145	Cagua		\N	124	30050	\N	\N	1	\N
40146	Bella Vista		\N	124	30050	\N	\N	1	\N
40147	Tovar		\N	124	30051	\N	\N	1	\N
40148	Urdaneta		\N	124	30052	\N	\N	1	\N
40149	Las Peñitas		\N	124	30052	\N	\N	1	\N
40150	San Francisco de Cara		\N	124	30052	\N	\N	1	\N
40151	Taguay		\N	124	30052	\N	\N	1	\N
40152	Zamora		\N	124	30053	\N	\N	1	\N
40153	Magdaleno		\N	124	30053	\N	\N	1	\N
40154	San Francisco de Asís		\N	124	30053	\N	\N	1	\N
40155	Valles de Tucutunemo		\N	124	30053	\N	\N	1	\N
40156	Augusto Mijares		\N	124	30053	\N	\N	1	\N
40157	Sabaneta		\N	124	30054	\N	\N	1	\N
40158	Juan Antonio Rodríguez Domínguez		\N	124	30054	\N	\N	1	\N
40159	El Cantón		\N	124	30055	\N	\N	1	\N
40160	Santa Cruz de Guacas		\N	124	30055	\N	\N	1	\N
40161	Puerto Vivas		\N	124	30055	\N	\N	1	\N
40162	Ticoporo		\N	124	30056	\N	\N	1	\N
40163	Nicolás Pulido		\N	124	30056	\N	\N	1	\N
40164	Andrés Bello		\N	124	30056	\N	\N	1	\N
40165	Arismendi		\N	124	30057	\N	\N	1	\N
40166	Guadarrama		\N	124	30057	\N	\N	1	\N
40167	La Unión		\N	124	30057	\N	\N	1	\N
40168	San Antonio		\N	124	30057	\N	\N	1	\N
40169	Barinas		\N	124	30058	\N	\N	1	\N
40170	Alberto Arvelo Larriva		\N	124	30058	\N	\N	1	\N
40171	San Silvestre		\N	124	30058	\N	\N	1	\N
40172	Santa Inés		\N	124	30058	\N	\N	1	\N
40173	Santa Lucía		\N	124	30058	\N	\N	1	\N
40174	Torumos		\N	124	30058	\N	\N	1	\N
40175	El Carmen		\N	124	30058	\N	\N	1	\N
40176	Rómulo Betancourt		\N	124	30058	\N	\N	1	\N
40177	Corazón de Jesús		\N	124	30058	\N	\N	1	\N
40178	Ramón Ignacio Méndez		\N	124	30058	\N	\N	1	\N
40179	Alto Barinas		\N	124	30058	\N	\N	1	\N
40180	Manuel Palacio Fajardo		\N	124	30058	\N	\N	1	\N
40181	Juan Antonio Rodríguez Domínguez		\N	124	30058	\N	\N	1	\N
40182	Dominga Ortiz de Páez		\N	124	30058	\N	\N	1	\N
40183	Barinitas		\N	124	30059	\N	\N	1	\N
40184	Altamira de Cáceres		\N	124	30059	\N	\N	1	\N
40185	Calderas		\N	124	30059	\N	\N	1	\N
40186	Barrancas		\N	124	30060	\N	\N	1	\N
40187	El Socorro		\N	124	30060	\N	\N	1	\N
40188	Mazparrito		\N	124	30060	\N	\N	1	\N
40189	Santa Bárbara		\N	124	30061	\N	\N	1	\N
40190	Pedro Briceño Méndez		\N	124	30061	\N	\N	1	\N
40191	Ramón Ignacio Méndez		\N	124	30061	\N	\N	1	\N
40192	José Ignacio del Pumar		\N	124	30061	\N	\N	1	\N
40193	Obispos		\N	124	30062	\N	\N	1	\N
40194	Guasimitos		\N	124	30062	\N	\N	1	\N
40195	El Real		\N	124	30062	\N	\N	1	\N
40196	La Luz		\N	124	30062	\N	\N	1	\N
40197	Ciudad Bolívia		\N	124	30063	\N	\N	1	\N
40198	José Ignacio Briceño		\N	124	30063	\N	\N	1	\N
40199	José Félix Ribas		\N	124	30063	\N	\N	1	\N
40200	Páez		\N	124	30063	\N	\N	1	\N
40201	Libertad		\N	124	30064	\N	\N	1	\N
40202	Dolores		\N	124	30064	\N	\N	1	\N
40203	Santa Rosa		\N	124	30064	\N	\N	1	\N
40204	Palacio Fajardo		\N	124	30064	\N	\N	1	\N
40205	Ciudad de Nutrias		\N	124	30065	\N	\N	1	\N
40206	El Regalo		\N	124	30065	\N	\N	1	\N
40207	Puerto Nutrias		\N	124	30065	\N	\N	1	\N
40208	Santa Catalina		\N	124	30065	\N	\N	1	\N
40209	Cachamay		\N	124	30066	\N	\N	1	\N
40210	Chirica		\N	124	30066	\N	\N	1	\N
40211	Dalla Costa		\N	124	30066	\N	\N	1	\N
40212	Once de Abril		\N	124	30066	\N	\N	1	\N
40213	Simón Bolívar		\N	124	30066	\N	\N	1	\N
40214	Unare		\N	124	30066	\N	\N	1	\N
40215	Universidad		\N	124	30066	\N	\N	1	\N
40216	Vista al Sol		\N	124	30066	\N	\N	1	\N
40217	Pozo Verde		\N	124	30066	\N	\N	1	\N
40218	Yocoima		\N	124	30066	\N	\N	1	\N
40219	5 de Julio		\N	124	30066	\N	\N	1	\N
40220	Cedeño		\N	124	30067	\N	\N	1	\N
40221	Altagracia		\N	124	30067	\N	\N	1	\N
40222	Ascensión Farreras		\N	124	30067	\N	\N	1	\N
40223	Guaniamo		\N	124	30067	\N	\N	1	\N
40224	La Urbana		\N	124	30067	\N	\N	1	\N
40225	Pijiguaos		\N	124	30067	\N	\N	1	\N
40226	El Callao		\N	124	30068	\N	\N	1	\N
40227	Gran Sabana		\N	124	30069	\N	\N	1	\N
40228	Ikabarú		\N	124	30069	\N	\N	1	\N
40229	Catedral		\N	124	30070	\N	\N	1	\N
40230	Zea		\N	124	30070	\N	\N	1	\N
40231	Orinoco		\N	124	30070	\N	\N	1	\N
40232	José Antonio Páez		\N	124	30070	\N	\N	1	\N
40233	Marhuanta		\N	124	30070	\N	\N	1	\N
40234	Agua Salada		\N	124	30070	\N	\N	1	\N
40235	Vista Hermosa		\N	124	30070	\N	\N	1	\N
40236	La Sabanita		\N	124	30070	\N	\N	1	\N
40237	Panapana		\N	124	30070	\N	\N	1	\N
40238	Andrés Eloy Blanco		\N	124	30071	\N	\N	1	\N
40239	Pedro Cova		\N	124	30071	\N	\N	1	\N
40240	Raúl Leoni		\N	124	30072	\N	\N	1	\N
40241	Barceloneta		\N	124	30072	\N	\N	1	\N
40242	Santa Bárbara		\N	124	30072	\N	\N	1	\N
40243	San Francisco		\N	124	30072	\N	\N	1	\N
40244	Roscio		\N	124	30073	\N	\N	1	\N
40245	Salóm		\N	124	30073	\N	\N	1	\N
40246	Sifontes		\N	124	30074	\N	\N	1	\N
40247	Dalla Costa		\N	124	30074	\N	\N	1	\N
40248	San Isidro		\N	124	30074	\N	\N	1	\N
40249	Sucre		\N	124	30075	\N	\N	1	\N
40250	Aripao		\N	124	30075	\N	\N	1	\N
40251	Guarataro		\N	124	30075	\N	\N	1	\N
40252	Las Majadas		\N	124	30075	\N	\N	1	\N
40253	Moitaco		\N	124	30075	\N	\N	1	\N
40254	Padre Pedro Chien		\N	124	30076	\N	\N	1	\N
40255	Río Grande		\N	124	30076	\N	\N	1	\N
40256	Bejuma		\N	124	30077	\N	\N	1	\N
40257	Canoabo		\N	124	30077	\N	\N	1	\N
40258	Simón Bolívar		\N	124	30077	\N	\N	1	\N
40259	Güigüe		\N	124	30078	\N	\N	1	\N
40260	Carabobo		\N	124	30078	\N	\N	1	\N
40261	Tacarigua		\N	124	30078	\N	\N	1	\N
40262	Mariara		\N	124	30079	\N	\N	1	\N
40263	Aguas Calientes		\N	124	30079	\N	\N	1	\N
40264	Ciudad Alianza		\N	124	30080	\N	\N	1	\N
40265	Guacara		\N	124	30080	\N	\N	1	\N
40266	Yagua		\N	124	30080	\N	\N	1	\N
40267	Morón		\N	124	30081	\N	\N	1	\N
40268	Yagua		\N	124	30081	\N	\N	1	\N
40269	Tocuyito		\N	124	30082	\N	\N	1	\N
40270	Independencia		\N	124	30082	\N	\N	1	\N
40271	Los Guayos		\N	124	30083	\N	\N	1	\N
40272	Miranda		\N	124	30084	\N	\N	1	\N
40273	Montalbán		\N	124	30085	\N	\N	1	\N
40274	Naguanagua		\N	124	30086	\N	\N	1	\N
40275	Bartolomé Salóm		\N	124	30087	\N	\N	1	\N
40276	Democracia		\N	124	30087	\N	\N	1	\N
40277	Fraternidad		\N	124	30087	\N	\N	1	\N
40278	Goaigoaza		\N	124	30087	\N	\N	1	\N
40279	Juan José Flores		\N	124	30087	\N	\N	1	\N
40280	Unión		\N	124	30087	\N	\N	1	\N
40281	Borburata		\N	124	30087	\N	\N	1	\N
40282	Patanemo		\N	124	30087	\N	\N	1	\N
40283	San Diego		\N	124	30088	\N	\N	1	\N
40284	San Joaquín		\N	124	30089	\N	\N	1	\N
40285	Candelaria		\N	124	30090	\N	\N	1	\N
40286	Catedral		\N	124	30090	\N	\N	1	\N
40287	El Socorro		\N	124	30090	\N	\N	1	\N
40288	Miguel Peña		\N	124	30090	\N	\N	1	\N
40289	Rafael Urdaneta		\N	124	30090	\N	\N	1	\N
40290	San Blas		\N	124	30090	\N	\N	1	\N
40291	San José		\N	124	30090	\N	\N	1	\N
40292	Santa Rosa		\N	124	30090	\N	\N	1	\N
40293	Negro Primero		\N	124	30090	\N	\N	1	\N
40294	Cojedes		\N	124	30091	\N	\N	1	\N
40295	Juan de Mata Suárez		\N	124	30091	\N	\N	1	\N
40296	Tinaquillo		\N	124	30092	\N	\N	1	\N
40297	El Baúl		\N	124	30093	\N	\N	1	\N
40298	Sucre		\N	124	30093	\N	\N	1	\N
40299	La Aguadita		\N	124	30094	\N	\N	1	\N
40300	Macapo		\N	124	30094	\N	\N	1	\N
40301	El Pao		\N	124	30095	\N	\N	1	\N
40302	El Amparo		\N	124	30096	\N	\N	1	\N
40303	Libertad de Cojedes		\N	124	30096	\N	\N	1	\N
40304	Rómulo Gallegos		\N	124	30097	\N	\N	1	\N
40305	San Carlos de Austria		\N	124	30098	\N	\N	1	\N
40306	Juan Ángel Bravo		\N	124	30098	\N	\N	1	\N
40307	Manuel Manrique		\N	124	30098	\N	\N	1	\N
40308	General en Jefe José Laurencio Silva		\N	124	30099	\N	\N	1	\N
40309	Curiapo		\N	124	30100	\N	\N	1	\N
40310	Almirante Luis Brión		\N	124	30100	\N	\N	1	\N
40311	Francisco Aniceto Lugo		\N	124	30100	\N	\N	1	\N
40312	Manuel Renaud		\N	124	30100	\N	\N	1	\N
40313	Padre Barral		\N	124	30100	\N	\N	1	\N
40314	Santos de Abelgas		\N	124	30100	\N	\N	1	\N
40315	Imataca		\N	124	30101	\N	\N	1	\N
40316	Cinco de Julio		\N	124	30101	\N	\N	1	\N
40317	Juan Bautista Arismendi		\N	124	30101	\N	\N	1	\N
40318	Manuel Piar		\N	124	30101	\N	\N	1	\N
40319	Rómulo Gallegos		\N	124	30101	\N	\N	1	\N
40320	Pedernales		\N	124	30102	\N	\N	1	\N
40321	Luis Beltrán Prieto Figueroa		\N	124	30102	\N	\N	1	\N
40322	San José Delta Amacuro)		\N	124	30103	\N	\N	1	\N
40323	José Vidal Marcano		\N	124	30103	\N	\N	1	\N
40324	Juan Millán		\N	124	30103	\N	\N	1	\N
40325	Leonardo Ruíz Pineda		\N	124	30103	\N	\N	1	\N
40326	Mariscal Antonio José de Sucre		\N	124	30103	\N	\N	1	\N
40327	Monseñor Argimiro García		\N	124	30103	\N	\N	1	\N
40328	San Rafael Delta Amacuro)		\N	124	30103	\N	\N	1	\N
40329	Virgen del Valle		\N	124	30103	\N	\N	1	\N
40330	Clarines		\N	124	30010	\N	\N	1	\N
40331	Guanape		\N	124	30010	\N	\N	1	\N
40332	Sabana de Uchire		\N	124	30010	\N	\N	1	\N
40333	Capadare		\N	124	30104	\N	\N	1	\N
40334	La Pastora		\N	124	30104	\N	\N	1	\N
40335	Libertador		\N	124	30104	\N	\N	1	\N
40336	San Juan de los Cayos		\N	124	30104	\N	\N	1	\N
40337	Aracua		\N	124	30105	\N	\N	1	\N
40338	La Peña		\N	124	30105	\N	\N	1	\N
40339	San Luis		\N	124	30105	\N	\N	1	\N
40340	Bariro		\N	124	30106	\N	\N	1	\N
40341	Borojó		\N	124	30106	\N	\N	1	\N
40342	Capatárida		\N	124	30106	\N	\N	1	\N
40343	Guajiro		\N	124	30106	\N	\N	1	\N
40344	Seque		\N	124	30106	\N	\N	1	\N
40345	Zazárida		\N	124	30106	\N	\N	1	\N
40346	Valle de Eroa		\N	124	30106	\N	\N	1	\N
40347	Cacique Manaure		\N	124	30107	\N	\N	1	\N
40348	Norte		\N	124	30108	\N	\N	1	\N
40349	Carirubana		\N	124	30108	\N	\N	1	\N
40350	Santa Ana		\N	124	30108	\N	\N	1	\N
40351	Urbana Punta Cardón		\N	124	30108	\N	\N	1	\N
40352	La Vela de Coro		\N	124	30109	\N	\N	1	\N
40353	Acurigua		\N	124	30109	\N	\N	1	\N
40354	Guaibacoa		\N	124	30109	\N	\N	1	\N
40355	Las Calderas		\N	124	30109	\N	\N	1	\N
40356	Macoruca		\N	124	30109	\N	\N	1	\N
40357	Dabajuro		\N	124	30110	\N	\N	1	\N
40358	Agua Clara		\N	124	30111	\N	\N	1	\N
40359	Avaria		\N	124	30111	\N	\N	1	\N
40360	Pedregal		\N	124	30111	\N	\N	1	\N
40361	Piedra Grande		\N	124	30111	\N	\N	1	\N
40362	Purureche		\N	124	30111	\N	\N	1	\N
40363	Adaure		\N	124	30112	\N	\N	1	\N
40364	Adícora		\N	124	30112	\N	\N	1	\N
40365	Baraived		\N	124	30112	\N	\N	1	\N
40366	Buena Vista		\N	124	30112	\N	\N	1	\N
40367	Jadacaquiva		\N	124	30112	\N	\N	1	\N
40368	El Vínculo		\N	124	30112	\N	\N	1	\N
40369	El Hato		\N	124	30112	\N	\N	1	\N
40370	Moruy		\N	124	30112	\N	\N	1	\N
40371	Pueblo Nuevo		\N	124	30112	\N	\N	1	\N
40372	Agua Larga		\N	124	30113	\N	\N	1	\N
40373	El Paují		\N	124	30113	\N	\N	1	\N
40374	Independencia		\N	124	30113	\N	\N	1	\N
40375	Mapararí		\N	124	30113	\N	\N	1	\N
40376	Agua Linda		\N	124	30114	\N	\N	1	\N
40377	Araurima		\N	124	30114	\N	\N	1	\N
40378	Jacura		\N	124	30114	\N	\N	1	\N
40379	Tucacas		\N	124	30115	\N	\N	1	\N
40380	Boca de Aroa		\N	124	30115	\N	\N	1	\N
40381	Los Taques		\N	124	30116	\N	\N	1	\N
40382	Judibana		\N	124	30116	\N	\N	1	\N
40383	Mene de Mauroa		\N	124	30117	\N	\N	1	\N
40384	San Félix		\N	124	30117	\N	\N	1	\N
40385	Casigua		\N	124	30117	\N	\N	1	\N
40386	Guzmán Guillermo		\N	124	30118	\N	\N	1	\N
40387	Mitare		\N	124	30118	\N	\N	1	\N
40388	Río Seco		\N	124	30118	\N	\N	1	\N
40389	Sabaneta		\N	124	30118	\N	\N	1	\N
40390	San Antonio		\N	124	30118	\N	\N	1	\N
40391	San Gabriel		\N	124	30118	\N	\N	1	\N
40392	Santa Ana		\N	124	30118	\N	\N	1	\N
40393	Boca del Tocuyo		\N	124	30119	\N	\N	1	\N
40394	Chichiriviche		\N	124	30119	\N	\N	1	\N
40395	Tocuyo de la Costa		\N	124	30119	\N	\N	1	\N
40396	Palmasola		\N	124	30120	\N	\N	1	\N
40397	Cabure		\N	124	30121	\N	\N	1	\N
40398	Colina		\N	124	30121	\N	\N	1	\N
40399	Curimagua		\N	124	30121	\N	\N	1	\N
40400	San José de la Costa		\N	124	30122	\N	\N	1	\N
40401	Píritu		\N	124	30122	\N	\N	1	\N
40402	San Francisco		\N	124	30123	\N	\N	1	\N
40403	Sucre		\N	124	30124	\N	\N	1	\N
40404	Pecaya		\N	124	30124	\N	\N	1	\N
40405	Tocópero		\N	124	30125	\N	\N	1	\N
40406	El Charal		\N	124	30126	\N	\N	1	\N
40407	Las Vegas del Tuy		\N	124	30126	\N	\N	1	\N
40408	Santa Cruz de Bucaral		\N	124	30126	\N	\N	1	\N
40409	Bruzual		\N	124	30127	\N	\N	1	\N
40410	Urumaco		\N	124	30127	\N	\N	1	\N
40411	Puerto Cumarebo		\N	124	30128	\N	\N	1	\N
40412	La Ciénaga		\N	124	30128	\N	\N	1	\N
40413	La Soledad		\N	124	30128	\N	\N	1	\N
40414	Pueblo Cumarebo		\N	124	30128	\N	\N	1	\N
40415	Zazárida		\N	124	30128	\N	\N	1	\N
40416	Churuguara		\N	124	30113	\N	\N	1	\N
40417	Camaguán		\N	124	30129	\N	\N	1	\N
40418	Puerto Miranda		\N	124	30129	\N	\N	1	\N
40419	Uverito		\N	124	30129	\N	\N	1	\N
40420	Chaguaramas		\N	124	30130	\N	\N	1	\N
40421	El Socorro		\N	124	30131	\N	\N	1	\N
40422	Tucupido		\N	124	30132	\N	\N	1	\N
40423	San Rafael de Laya		\N	124	30132	\N	\N	1	\N
40424	Altagracia de Orituco		\N	124	30133	\N	\N	1	\N
40425	San Rafael de Orituco		\N	124	30133	\N	\N	1	\N
40426	San Francisco Javier de Lezama		\N	124	30133	\N	\N	1	\N
40427	Paso Real de Macaira		\N	124	30133	\N	\N	1	\N
40428	Carlos Soublette		\N	124	30133	\N	\N	1	\N
40429	San Francisco de Macaira		\N	124	30133	\N	\N	1	\N
40430	Libertad de Orituco		\N	124	30133	\N	\N	1	\N
40431	Cantaclaro		\N	124	30134	\N	\N	1	\N
40432	San Juan de los Morros		\N	124	30134	\N	\N	1	\N
40433	Parapara		\N	124	30134	\N	\N	1	\N
40434	El Sombrero		\N	124	30135	\N	\N	1	\N
40435	Sosa		\N	124	30135	\N	\N	1	\N
40436	Las Mercedes		\N	124	30136	\N	\N	1	\N
40437	Cabruta		\N	124	30136	\N	\N	1	\N
40438	Santa Rita de Manapire		\N	124	30136	\N	\N	1	\N
40439	Valle de la Pascua		\N	124	30137	\N	\N	1	\N
40440	Espino		\N	124	30137	\N	\N	1	\N
40441	San José de Unare		\N	124	30138	\N	\N	1	\N
40442	Zaraza		\N	124	30138	\N	\N	1	\N
40443	San José de Tiznados		\N	124	30139	\N	\N	1	\N
40444	San Francisco de Tiznados		\N	124	30139	\N	\N	1	\N
40445	San Lorenzo de Tiznados		\N	124	30139	\N	\N	1	\N
40446	Ortiz		\N	124	30139	\N	\N	1	\N
40447	Guayabal		\N	124	30140	\N	\N	1	\N
40448	Cazorla		\N	124	30140	\N	\N	1	\N
40449	San José de Guaribe		\N	124	30141	\N	\N	1	\N
40450	Uveral		\N	124	30141	\N	\N	1	\N
40451	Santa María de Ipire		\N	124	30142	\N	\N	1	\N
40452	Altamira		\N	124	30142	\N	\N	1	\N
40453	El Calvario		\N	124	30143	\N	\N	1	\N
40454	El Rastro		\N	124	30143	\N	\N	1	\N
40455	Guardatinajas		\N	124	30143	\N	\N	1	\N
40456	Capital Urbana Calabozo		\N	124	30143	\N	\N	1	\N
40457	Quebrada Honda de Guache		\N	124	30144	\N	\N	1	\N
40458	Pío Tamayo		\N	124	30144	\N	\N	1	\N
40459	Yacambú		\N	124	30144	\N	\N	1	\N
40460	Fréitez		\N	124	30145	\N	\N	1	\N
40461	José María Blanco		\N	124	30145	\N	\N	1	\N
40462	Catedral		\N	124	30146	\N	\N	1	\N
40463	Concepción		\N	124	30146	\N	\N	1	\N
40464	El Cují		\N	124	30146	\N	\N	1	\N
40465	Juan de Villegas		\N	124	30146	\N	\N	1	\N
40466	Santa Rosa		\N	124	30146	\N	\N	1	\N
40467	Tamaca		\N	124	30146	\N	\N	1	\N
40468	Unión		\N	124	30146	\N	\N	1	\N
40469	Aguedo Felipe Alvarado		\N	124	30146	\N	\N	1	\N
40470	Buena Vista		\N	124	30146	\N	\N	1	\N
40471	Juárez		\N	124	30146	\N	\N	1	\N
40472	Juan Bautista Rodríguez		\N	124	30147	\N	\N	1	\N
40473	Cuara		\N	124	30147	\N	\N	1	\N
40474	Diego de Lozada		\N	124	30147	\N	\N	1	\N
40475	Paraíso de San José		\N	124	30147	\N	\N	1	\N
40476	San Miguel		\N	124	30147	\N	\N	1	\N
40477	Tintorero		\N	124	30147	\N	\N	1	\N
40478	José Bernardo Dorante		\N	124	30147	\N	\N	1	\N
40479	Coronel Mariano Peraza		\N	124	30147	\N	\N	1	\N
40480	Bolívar		\N	124	30148	\N	\N	1	\N
40481	Anzoátegui		\N	124	30148	\N	\N	1	\N
40482	Guarico		\N	124	30148	\N	\N	1	\N
40483	Hilario Luna y Luna		\N	124	30148	\N	\N	1	\N
40484	Humocaro Alto		\N	124	30148	\N	\N	1	\N
40485	Humocaro Bajo		\N	124	30148	\N	\N	1	\N
40486	La Candelaria		\N	124	30148	\N	\N	1	\N
40487	Morán		\N	124	30148	\N	\N	1	\N
40488	Cabudare		\N	124	30149	\N	\N	1	\N
40489	José Gregorio Bastidas		\N	124	30149	\N	\N	1	\N
40490	Agua Viva		\N	124	30149	\N	\N	1	\N
40491	Sarare		\N	124	30150	\N	\N	1	\N
40492	Buría		\N	124	30150	\N	\N	1	\N
40493	Gustavo Vegas León		\N	124	30150	\N	\N	1	\N
40494	Trinidad Samuel		\N	124	30151	\N	\N	1	\N
40495	Antonio Díaz		\N	124	30151	\N	\N	1	\N
40496	Camacaro		\N	124	30151	\N	\N	1	\N
40497	Castañeda		\N	124	30151	\N	\N	1	\N
40498	Cecilio Zubillaga		\N	124	30151	\N	\N	1	\N
40499	Chiquinquirá		\N	124	30151	\N	\N	1	\N
40500	El Blanco		\N	124	30151	\N	\N	1	\N
40501	Espinoza de los Monteros		\N	124	30151	\N	\N	1	\N
40502	Lara		\N	124	30151	\N	\N	1	\N
40503	Las Mercedes		\N	124	30151	\N	\N	1	\N
40504	Manuel Morillo		\N	124	30151	\N	\N	1	\N
40505	Montaña Verde		\N	124	30151	\N	\N	1	\N
40506	Montes de Oca		\N	124	30151	\N	\N	1	\N
40507	Torres		\N	124	30151	\N	\N	1	\N
40508	Heriberto Arroyo		\N	124	30151	\N	\N	1	\N
40509	Reyes Vargas		\N	124	30151	\N	\N	1	\N
40510	Altagracia		\N	124	30151	\N	\N	1	\N
40511	Siquisique		\N	124	30152	\N	\N	1	\N
40512	Moroturo		\N	124	30152	\N	\N	1	\N
40513	San Miguel		\N	124	30152	\N	\N	1	\N
40514	Xaguas		\N	124	30152	\N	\N	1	\N
40515	Presidente Betancourt		\N	124	30179	\N	\N	1	\N
40516	Presidente Páez		\N	124	30179	\N	\N	1	\N
40517	Presidente Rómulo Gallegos		\N	124	30179	\N	\N	1	\N
40518	Gabriel Picón González		\N	124	30179	\N	\N	1	\N
40519	Héctor Amable Mora		\N	124	30179	\N	\N	1	\N
40520	José Nucete Sardi		\N	124	30179	\N	\N	1	\N
40521	Pulido Méndez		\N	124	30179	\N	\N	1	\N
40522	La Azulita		\N	124	30180	\N	\N	1	\N
40523	Santa Cruz de Mora		\N	124	30181	\N	\N	1	\N
40524	Mesa Bolívar		\N	124	30181	\N	\N	1	\N
40525	Mesa de Las Palmas		\N	124	30181	\N	\N	1	\N
40526	Aricagua		\N	124	30182	\N	\N	1	\N
40527	San Antonio		\N	124	30182	\N	\N	1	\N
40528	Canagua		\N	124	30183	\N	\N	1	\N
40529	Capurí		\N	124	30183	\N	\N	1	\N
40530	Chacantá		\N	124	30183	\N	\N	1	\N
40531	El Molino		\N	124	30183	\N	\N	1	\N
40532	Guaimaral		\N	124	30183	\N	\N	1	\N
40533	Mucutuy		\N	124	30183	\N	\N	1	\N
40534	Mucuchachí		\N	124	30183	\N	\N	1	\N
40535	Fernández Peña		\N	124	30184	\N	\N	1	\N
40536	Matriz		\N	124	30184	\N	\N	1	\N
40537	Montalbán		\N	124	30184	\N	\N	1	\N
40538	Acequias		\N	124	30184	\N	\N	1	\N
40539	Jají		\N	124	30184	\N	\N	1	\N
40540	La Mesa		\N	124	30184	\N	\N	1	\N
40541	San José del Sur		\N	124	30184	\N	\N	1	\N
40542	Tucaní		\N	124	30185	\N	\N	1	\N
40543	Florencio Ramírez		\N	124	30185	\N	\N	1	\N
40544	Santo Domingo		\N	124	30186	\N	\N	1	\N
40545	Las Piedras		\N	124	30186	\N	\N	1	\N
40546	Guaraque		\N	124	30187	\N	\N	1	\N
40547	Mesa de Quintero		\N	124	30187	\N	\N	1	\N
40548	Río Negro		\N	124	30187	\N	\N	1	\N
40549	Arapuey		\N	124	30188	\N	\N	1	\N
40550	Palmira		\N	124	30188	\N	\N	1	\N
40551	San Cristóbal de Torondoy		\N	124	30189	\N	\N	1	\N
40552	Torondoy		\N	124	30189	\N	\N	1	\N
40553	Antonio Spinetti Dini		\N	124	30190	\N	\N	1	\N
40554	Arias		\N	124	30190	\N	\N	1	\N
40555	Caracciolo Parra Pérez		\N	124	30190	\N	\N	1	\N
40556	Domingo Peña		\N	124	30190	\N	\N	1	\N
40557	El Llano		\N	124	30190	\N	\N	1	\N
40558	Gonzalo Picón Febres		\N	124	30190	\N	\N	1	\N
40559	Jacinto Plaza		\N	124	30190	\N	\N	1	\N
40560	Juan Rodríguez Suárez		\N	124	30190	\N	\N	1	\N
40561	Lasso de la Vega		\N	124	30190	\N	\N	1	\N
40562	Mariano Picón Salas		\N	124	30190	\N	\N	1	\N
40563	Milla		\N	124	30190	\N	\N	1	\N
40564	Osuna Rodríguez		\N	124	30190	\N	\N	1	\N
40565	Sagrario		\N	124	30190	\N	\N	1	\N
40566	El Morro		\N	124	30190	\N	\N	1	\N
40567	Los Nevados		\N	124	30190	\N	\N	1	\N
40568	Andrés Eloy Blanco		\N	124	30191	\N	\N	1	\N
40569	La Venta		\N	124	30191	\N	\N	1	\N
40570	Piñango		\N	124	30191	\N	\N	1	\N
40571	Timotes		\N	124	30191	\N	\N	1	\N
40572	Eloy Paredes		\N	124	30192	\N	\N	1	\N
40573	San Rafael de Alcázar		\N	124	30192	\N	\N	1	\N
40574	Santa Elena de Arenales		\N	124	30192	\N	\N	1	\N
40575	Santa María de Caparo		\N	124	30193	\N	\N	1	\N
40576	Pueblo Llano		\N	124	30194	\N	\N	1	\N
40577	Cacute		\N	124	30195	\N	\N	1	\N
40578	La Toma		\N	124	30195	\N	\N	1	\N
40579	Mucuchíes		\N	124	30195	\N	\N	1	\N
40580	Mucurubá		\N	124	30195	\N	\N	1	\N
40581	San Rafael		\N	124	30195	\N	\N	1	\N
40582	Gerónimo Maldonado		\N	124	30196	\N	\N	1	\N
40583	Bailadores		\N	124	30196	\N	\N	1	\N
40584	Tabay		\N	124	30197	\N	\N	1	\N
40585	Chiguará		\N	124	30198	\N	\N	1	\N
40586	Estánquez		\N	124	30198	\N	\N	1	\N
40587	Lagunillas		\N	124	30198	\N	\N	1	\N
40588	La Trampa		\N	124	30198	\N	\N	1	\N
40589	Pueblo Nuevo del Sur		\N	124	30198	\N	\N	1	\N
40590	San Juan		\N	124	30198	\N	\N	1	\N
40591	El Amparo		\N	124	30199	\N	\N	1	\N
40592	El Llano		\N	124	30199	\N	\N	1	\N
40593	San Francisco		\N	124	30199	\N	\N	1	\N
40594	Tovar		\N	124	30199	\N	\N	1	\N
40595	Independencia		\N	124	30200	\N	\N	1	\N
40596	María de la Concepción Palacios Blanco		\N	124	30200	\N	\N	1	\N
40597	Nueva Bolivia		\N	124	30200	\N	\N	1	\N
40598	Santa Apolonia		\N	124	30200	\N	\N	1	\N
40599	Caño El Tigre		\N	124	30201	\N	\N	1	\N
40600	Zea		\N	124	30201	\N	\N	1	\N
40601	Aragüita		\N	124	30223	\N	\N	1	\N
40602	Arévalo González		\N	124	30223	\N	\N	1	\N
40603	Capaya		\N	124	30223	\N	\N	1	\N
40604	Caucagua		\N	124	30223	\N	\N	1	\N
40605	Panaquire		\N	124	30223	\N	\N	1	\N
40606	Ribas		\N	124	30223	\N	\N	1	\N
40607	El Café		\N	124	30223	\N	\N	1	\N
40608	Marizapa		\N	124	30223	\N	\N	1	\N
40609	Cumbo		\N	124	30224	\N	\N	1	\N
40610	San José de Barlovento		\N	124	30224	\N	\N	1	\N
40611	El Cafetal		\N	124	30225	\N	\N	1	\N
40612	Las Minas		\N	124	30225	\N	\N	1	\N
40613	Nuestra Señora del Rosario		\N	124	30225	\N	\N	1	\N
40614	Higuerote		\N	124	30226	\N	\N	1	\N
40615	Curiepe		\N	124	30226	\N	\N	1	\N
40616	Tacarigua de Brión		\N	124	30226	\N	\N	1	\N
40617	Mamporal		\N	124	30227	\N	\N	1	\N
40618	Carrizal		\N	124	30228	\N	\N	1	\N
40619	Chacao		\N	124	30229	\N	\N	1	\N
40620	Charallave		\N	124	30230	\N	\N	1	\N
40621	Las Brisas		\N	124	30230	\N	\N	1	\N
40622	El Hatillo		\N	124	30231	\N	\N	1	\N
40623	Altagracia de la Montaña		\N	124	30232	\N	\N	1	\N
40624	Cecilio Acosta		\N	124	30232	\N	\N	1	\N
40625	Los Teques		\N	124	30232	\N	\N	1	\N
40626	El Jarillo		\N	124	30232	\N	\N	1	\N
40627	San Pedro		\N	124	30232	\N	\N	1	\N
40628	Tácata		\N	124	30232	\N	\N	1	\N
40629	Paracotos		\N	124	30232	\N	\N	1	\N
40630	Cartanal		\N	124	30233	\N	\N	1	\N
40631	Santa Teresa del Tuy		\N	124	30233	\N	\N	1	\N
40632	La Democracia		\N	124	30234	\N	\N	1	\N
40633	Ocumare del Tuy		\N	124	30234	\N	\N	1	\N
40634	Santa Bárbara		\N	124	30234	\N	\N	1	\N
40635	San Antonio de los Altos		\N	124	30235	\N	\N	1	\N
40636	Río Chico		\N	124	30236	\N	\N	1	\N
40637	El Guapo		\N	124	30236	\N	\N	1	\N
40638	Tacarigua de la Laguna		\N	124	30236	\N	\N	1	\N
40639	Paparo		\N	124	30236	\N	\N	1	\N
40640	San Fernando del Guapo		\N	124	30236	\N	\N	1	\N
40641	Santa Lucía del Tuy		\N	124	30237	\N	\N	1	\N
40642	Cúpira		\N	124	30238	\N	\N	1	\N
40643	Machurucuto		\N	124	30238	\N	\N	1	\N
40644	Guarenas		\N	124	30239	\N	\N	1	\N
40645	San Antonio de Yare		\N	124	30240	\N	\N	1	\N
40646	San Francisco de Yare		\N	124	30240	\N	\N	1	\N
40647	Leoncio Martínez		\N	124	30241	\N	\N	1	\N
40648	Petare		\N	124	30241	\N	\N	1	\N
40649	Caucagüita		\N	124	30241	\N	\N	1	\N
40650	Filas de Mariche		\N	124	30241	\N	\N	1	\N
40651	La Dolorita		\N	124	30241	\N	\N	1	\N
40652	Cúa		\N	124	30242	\N	\N	1	\N
40653	Nueva Cúa		\N	124	30242	\N	\N	1	\N
40654	Guatire		\N	124	30243	\N	\N	1	\N
40655	Bolívar		\N	124	30243	\N	\N	1	\N
40656	San Antonio de Maturín		\N	124	30258	\N	\N	1	\N
40657	San Francisco de Maturín		\N	124	30258	\N	\N	1	\N
40658	Aguasay		\N	124	30259	\N	\N	1	\N
40659	Caripito		\N	124	30260	\N	\N	1	\N
40660	El Guácharo		\N	124	30261	\N	\N	1	\N
40661	La Guanota		\N	124	30261	\N	\N	1	\N
40662	Sabana de Piedra		\N	124	30261	\N	\N	1	\N
40663	San Agustín		\N	124	30261	\N	\N	1	\N
40664	Teresen		\N	124	30261	\N	\N	1	\N
40665	Caripe		\N	124	30261	\N	\N	1	\N
40666	Areo		\N	124	30262	\N	\N	1	\N
40667	Capital Cedeño		\N	124	30262	\N	\N	1	\N
40668	San Félix de Cantalicio		\N	124	30262	\N	\N	1	\N
40669	Viento Fresco		\N	124	30262	\N	\N	1	\N
40670	El Tejero		\N	124	30263	\N	\N	1	\N
40671	Punta de Mata		\N	124	30263	\N	\N	1	\N
40672	Chaguaramas		\N	124	30264	\N	\N	1	\N
40673	Las Alhuacas		\N	124	30264	\N	\N	1	\N
40674	Tabasca		\N	124	30264	\N	\N	1	\N
40675	Temblador		\N	124	30264	\N	\N	1	\N
40676	Alto de los Godos		\N	124	30265	\N	\N	1	\N
40677	Boquerón		\N	124	30265	\N	\N	1	\N
40678	Las Cocuizas		\N	124	30265	\N	\N	1	\N
40679	La Cruz		\N	124	30265	\N	\N	1	\N
40680	San Simón		\N	124	30265	\N	\N	1	\N
40681	El Corozo		\N	124	30265	\N	\N	1	\N
40682	El Furrial		\N	124	30265	\N	\N	1	\N
40683	Jusepín		\N	124	30265	\N	\N	1	\N
40684	La Pica		\N	124	30265	\N	\N	1	\N
40685	San Vicente		\N	124	30265	\N	\N	1	\N
40686	Aparicio		\N	124	30266	\N	\N	1	\N
40687	Aragua de Maturín		\N	124	30266	\N	\N	1	\N
40688	Chaguamal		\N	124	30266	\N	\N	1	\N
40689	El Pinto		\N	124	30266	\N	\N	1	\N
40690	Guanaguana		\N	124	30266	\N	\N	1	\N
40691	La Toscana		\N	124	30266	\N	\N	1	\N
40692	Taguaya		\N	124	30266	\N	\N	1	\N
40693	Cachipo		\N	124	30267	\N	\N	1	\N
40694	Quiriquire		\N	124	30267	\N	\N	1	\N
40695	Santa Bárbara		\N	124	30268	\N	\N	1	\N
40696	Barrancas		\N	124	30269	\N	\N	1	\N
40697	Los Barrancos de Fajardo		\N	124	30269	\N	\N	1	\N
40698	Uracoa		\N	124	30270	\N	\N	1	\N
40699	Antolín del Campo		\N	124	30271	\N	\N	1	\N
40700	Arismendi		\N	124	30272	\N	\N	1	\N
40701	García		\N	124	30273	\N	\N	1	\N
40702	Francisco Fajardo		\N	124	30273	\N	\N	1	\N
40703	Bolívar		\N	124	30274	\N	\N	1	\N
40704	Guevara		\N	124	30274	\N	\N	1	\N
40705	Matasiete		\N	124	30274	\N	\N	1	\N
40706	Santa Ana		\N	124	30274	\N	\N	1	\N
40707	Sucre		\N	124	30274	\N	\N	1	\N
40708	Aguirre		\N	124	30275	\N	\N	1	\N
40709	Maneiro		\N	124	30275	\N	\N	1	\N
40710	Adrián		\N	124	30276	\N	\N	1	\N
40711	Juan Griego		\N	124	30276	\N	\N	1	\N
40712	Yaguaraparo		\N	124	30276	\N	\N	1	\N
40713	Porlamar		\N	124	30277	\N	\N	1	\N
40714	San Francisco de Macanao		\N	124	30278	\N	\N	1	\N
40715	Boca de Río		\N	124	30278	\N	\N	1	\N
40716	Tubores		\N	124	30279	\N	\N	1	\N
40717	Los Baleales		\N	124	30279	\N	\N	1	\N
40718	Vicente Fuentes		\N	124	30280	\N	\N	1	\N
40719	Villalba		\N	124	30280	\N	\N	1	\N
40720	San Juan Bautista		\N	124	30281	\N	\N	1	\N
40721	Zabala		\N	124	30281	\N	\N	1	\N
40722	Capital Araure		\N	124	30283	\N	\N	1	\N
40723	Río Acarigua		\N	124	30283	\N	\N	1	\N
40724	Capital Esteller		\N	124	30284	\N	\N	1	\N
40725	Uveral		\N	124	30284	\N	\N	1	\N
40726	Guanare		\N	124	30285	\N	\N	1	\N
40727	Córdoba		\N	124	30285	\N	\N	1	\N
40728	San José de la Montaña		\N	124	30285	\N	\N	1	\N
40729	San Juan de Guanaguanare		\N	124	30285	\N	\N	1	\N
40730	Virgen de la Coromoto		\N	124	30285	\N	\N	1	\N
40731	Guanarito		\N	124	30286	\N	\N	1	\N
40732	Trinidad de la Capilla		\N	124	30286	\N	\N	1	\N
40733	Divina Pastora		\N	124	30286	\N	\N	1	\N
40734	Monseñor José Vicente de Unda		\N	124	30287	\N	\N	1	\N
40735	Peña Blanca		\N	124	30287	\N	\N	1	\N
40736	Capital Ospino		\N	124	30288	\N	\N	1	\N
40737	Aparición		\N	124	30288	\N	\N	1	\N
40738	La Estación		\N	124	30288	\N	\N	1	\N
40739	Páez		\N	124	30289	\N	\N	1	\N
40740	Payara		\N	124	30289	\N	\N	1	\N
40741	Pimpinela		\N	124	30289	\N	\N	1	\N
40742	Ramón Peraza		\N	124	30289	\N	\N	1	\N
40743	Papelón		\N	124	30290	\N	\N	1	\N
40744	Caño Delgadito		\N	124	30290	\N	\N	1	\N
40745	San Genaro de Boconoito		\N	124	30291	\N	\N	1	\N
40746	Antolín Tovar		\N	124	30291	\N	\N	1	\N
40747	San Rafael de Onoto		\N	124	30292	\N	\N	1	\N
40748	Santa Fe		\N	124	30292	\N	\N	1	\N
40749	Thermo Morles		\N	124	30292	\N	\N	1	\N
40750	Santa Rosalía		\N	124	30293	\N	\N	1	\N
40751	Florida		\N	124	30293	\N	\N	1	\N
40752	Sucre		\N	124	30294	\N	\N	1	\N
40753	Concepción		\N	124	30294	\N	\N	1	\N
40754	San Rafael de Palo Alzado		\N	124	30294	\N	\N	1	\N
40755	Uvencio Antonio Velásquez		\N	124	30294	\N	\N	1	\N
40756	San José de Saguaz		\N	124	30294	\N	\N	1	\N
40757	Villa Rosa		\N	124	30294	\N	\N	1	\N
40758	Turén		\N	124	30295	\N	\N	1	\N
40759	Canelones		\N	124	30295	\N	\N	1	\N
40760	Santa Cruz		\N	124	30295	\N	\N	1	\N
40761	San Isidro Labrador		\N	124	30295	\N	\N	1	\N
40762	Mariño		\N	124	30296	\N	\N	1	\N
40763	Rómulo Gallegos		\N	124	30296	\N	\N	1	\N
40764	San José de Aerocuar		\N	124	30297	\N	\N	1	\N
40765	Tavera Acosta		\N	124	30297	\N	\N	1	\N
40766	Río Caribe		\N	124	30298	\N	\N	1	\N
40767	Antonio José de Sucre		\N	124	30298	\N	\N	1	\N
40768	El Morro de Puerto Santo		\N	124	30298	\N	\N	1	\N
40769	Puerto Santo		\N	124	30298	\N	\N	1	\N
40770	San Juan de las Galdonas		\N	124	30298	\N	\N	1	\N
40771	El Pilar		\N	124	30299	\N	\N	1	\N
40772	El Rincón		\N	124	30299	\N	\N	1	\N
40773	General Francisco Antonio Váquez		\N	124	30299	\N	\N	1	\N
40774	Guaraúnos		\N	124	30299	\N	\N	1	\N
40775	Tunapuicito		\N	124	30299	\N	\N	1	\N
40776	Unión		\N	124	30299	\N	\N	1	\N
40777	Santa Catalina		\N	124	30300	\N	\N	1	\N
40778	Santa Rosa		\N	124	30300	\N	\N	1	\N
40779	Santa Teresa		\N	124	30300	\N	\N	1	\N
40780	Bolívar		\N	124	30300	\N	\N	1	\N
40781	Maracapana		\N	124	30300	\N	\N	1	\N
40782	Libertad		\N	124	30302	\N	\N	1	\N
40783	El Paujil		\N	124	30302	\N	\N	1	\N
40784	Yaguaraparo		\N	124	30302	\N	\N	1	\N
40785	Cruz Salmerón Acosta		\N	124	30303	\N	\N	1	\N
40786	Chacopata		\N	124	30303	\N	\N	1	\N
40787	Manicuare		\N	124	30303	\N	\N	1	\N
40788	Tunapuy		\N	124	30304	\N	\N	1	\N
40789	Campo Elías		\N	124	30304	\N	\N	1	\N
40790	Irapa		\N	124	30305	\N	\N	1	\N
40791	Campo Claro		\N	124	30305	\N	\N	1	\N
40792	Maraval		\N	124	30305	\N	\N	1	\N
40793	San Antonio de Irapa		\N	124	30305	\N	\N	1	\N
40794	Soro		\N	124	30305	\N	\N	1	\N
40795	Mejía		\N	124	30306	\N	\N	1	\N
40796	Cumanacoa		\N	124	30307	\N	\N	1	\N
40797	Arenas		\N	124	30307	\N	\N	1	\N
40798	Aricagua		\N	124	30307	\N	\N	1	\N
40799	Cogollar		\N	124	30307	\N	\N	1	\N
40800	San Fernando		\N	124	30307	\N	\N	1	\N
40801	San Lorenzo		\N	124	30307	\N	\N	1	\N
40802	Villa Frontado Muelle de Cariaco)		\N	124	30308	\N	\N	1	\N
40803	Catuaro		\N	124	30308	\N	\N	1	\N
40804	Rendón		\N	124	30308	\N	\N	1	\N
40805	San Cruz		\N	124	30308	\N	\N	1	\N
40806	Santa María		\N	124	30308	\N	\N	1	\N
40807	Altagracia		\N	124	30309	\N	\N	1	\N
40808	Santa Inés		\N	124	30309	\N	\N	1	\N
40809	Valentín Valiente		\N	124	30309	\N	\N	1	\N
40810	Ayacucho		\N	124	30309	\N	\N	1	\N
40811	San Juan		\N	124	30309	\N	\N	1	\N
40812	Raúl Leoni		\N	124	30309	\N	\N	1	\N
40813	Gran Mariscal		\N	124	30309	\N	\N	1	\N
40814	Cristóbal Colón		\N	124	30310	\N	\N	1	\N
40815	Bideau		\N	124	30310	\N	\N	1	\N
40816	Punta de Piedras		\N	124	30310	\N	\N	1	\N
40817	Güiria		\N	124	30310	\N	\N	1	\N
40818	Andrés Bello		\N	124	30341	\N	\N	1	\N
40819	Antonio Rómulo Costa		\N	124	30342	\N	\N	1	\N
40820	Ayacucho		\N	124	30343	\N	\N	1	\N
40821	Rivas Berti		\N	124	30343	\N	\N	1	\N
40822	San Pedro del Río		\N	124	30343	\N	\N	1	\N
40823	Bolívar		\N	124	30344	\N	\N	1	\N
40824	Palotal		\N	124	30344	\N	\N	1	\N
40825	General Juan Vicente Gómez		\N	124	30344	\N	\N	1	\N
40826	Isaías Medina Angarita		\N	124	30344	\N	\N	1	\N
40827	Cárdenas		\N	124	30345	\N	\N	1	\N
40828	Amenodoro Ángel Lamus		\N	124	30345	\N	\N	1	\N
40829	La Florida		\N	124	30345	\N	\N	1	\N
40830	Córdoba		\N	124	30346	\N	\N	1	\N
40831	Fernández Feo		\N	124	30347	\N	\N	1	\N
40832	Alberto Adriani		\N	124	30347	\N	\N	1	\N
40833	Santo Domingo		\N	124	30347	\N	\N	1	\N
40834	Francisco de Miranda		\N	124	30348	\N	\N	1	\N
40835	García de Hevia		\N	124	30349	\N	\N	1	\N
40836	Boca de Grita		\N	124	30349	\N	\N	1	\N
40837	José Antonio Páez		\N	124	30349	\N	\N	1	\N
40838	Guásimos		\N	124	30350	\N	\N	1	\N
40839	Independencia		\N	124	30351	\N	\N	1	\N
40840	Juan Germán Roscio		\N	124	30351	\N	\N	1	\N
40841	Román Cárdenas		\N	124	30351	\N	\N	1	\N
40842	Jáuregui		\N	124	30352	\N	\N	1	\N
40843	Emilio Constantino Guerrero		\N	124	30352	\N	\N	1	\N
40844	Monseñor Miguel Antonio Salas		\N	124	30352	\N	\N	1	\N
40845	José María Vargas		\N	124	30353	\N	\N	1	\N
40846	Junín		\N	124	30354	\N	\N	1	\N
40847	La Petrólea		\N	124	30354	\N	\N	1	\N
40848	Quinimarí		\N	124	30354	\N	\N	1	\N
40849	Bramón		\N	124	30354	\N	\N	1	\N
40850	Libertad		\N	124	30355	\N	\N	1	\N
40851	Cipriano Castro		\N	124	30355	\N	\N	1	\N
40852	Manuel Felipe Rugeles		\N	124	30355	\N	\N	1	\N
40853	Libertador		\N	124	30356	\N	\N	1	\N
40854	Doradas		\N	124	30356	\N	\N	1	\N
40855	Emeterio Ochoa		\N	124	30356	\N	\N	1	\N
40856	San Joaquín de Navay		\N	124	30356	\N	\N	1	\N
40857	Lobatera		\N	124	30357	\N	\N	1	\N
40858	Constitución		\N	124	30357	\N	\N	1	\N
40859	Michelena		\N	124	30358	\N	\N	1	\N
40860	Panamericano		\N	124	30359	\N	\N	1	\N
40861	La Palmita		\N	124	30359	\N	\N	1	\N
40862	Pedro María Ureña		\N	124	30360	\N	\N	1	\N
40863	Nueva Arcadia		\N	124	30360	\N	\N	1	\N
40864	Delicias		\N	124	30361	\N	\N	1	\N
40865	Pecaya		\N	124	30361	\N	\N	1	\N
40866	Samuel Darío Maldonado		\N	124	30362	\N	\N	1	\N
40867	Boconó		\N	124	30362	\N	\N	1	\N
40868	Hernández		\N	124	30362	\N	\N	1	\N
40869	La Concordia		\N	124	30363	\N	\N	1	\N
40870	San Juan Bautista		\N	124	30363	\N	\N	1	\N
40871	Pedro María Morantes		\N	124	30363	\N	\N	1	\N
40872	San Sebastián		\N	124	30363	\N	\N	1	\N
40873	Dr. Francisco Romero Lobo		\N	124	30363	\N	\N	1	\N
40874	Seboruco		\N	124	30364	\N	\N	1	\N
40875	Simón Rodríguez		\N	124	30365	\N	\N	1	\N
40876	Sucre		\N	124	30366	\N	\N	1	\N
40877	Eleazar López Contreras		\N	124	30366	\N	\N	1	\N
40878	San Pablo		\N	124	30366	\N	\N	1	\N
40879	Torbes		\N	124	30367	\N	\N	1	\N
40880	Uribante		\N	124	30368	\N	\N	1	\N
40881	Cárdenas		\N	124	30368	\N	\N	1	\N
40882	Juan Pablo Peñalosa		\N	124	30368	\N	\N	1	\N
40883	Potosí		\N	124	30368	\N	\N	1	\N
40884	San Judas Tadeo		\N	124	30369	\N	\N	1	\N
40885	Araguaney		\N	124	30370	\N	\N	1	\N
40886	El Jaguito		\N	124	30370	\N	\N	1	\N
40887	La Esperanza		\N	124	30370	\N	\N	1	\N
40888	Santa Isabel		\N	124	30370	\N	\N	1	\N
40889	Boconó		\N	124	30371	\N	\N	1	\N
40890	El Carmen		\N	124	30371	\N	\N	1	\N
40891	Mosquey		\N	124	30371	\N	\N	1	\N
40892	Ayacucho		\N	124	30371	\N	\N	1	\N
40893	Burbusay		\N	124	30371	\N	\N	1	\N
40894	General Ribas		\N	124	30371	\N	\N	1	\N
40895	Guaramacal		\N	124	30371	\N	\N	1	\N
40896	Vega de Guaramacal		\N	124	30371	\N	\N	1	\N
40897	Monseñor Jáuregui		\N	124	30371	\N	\N	1	\N
40898	Rafael Rangel		\N	124	30371	\N	\N	1	\N
40899	San Miguel		\N	124	30371	\N	\N	1	\N
40900	San José		\N	124	30371	\N	\N	1	\N
40901	Sabana Grande		\N	124	30372	\N	\N	1	\N
40902	Cheregüé		\N	124	30372	\N	\N	1	\N
40903	Granados		\N	124	30372	\N	\N	1	\N
40904	Arnoldo Gabaldón		\N	124	30373	\N	\N	1	\N
40905	Bolivia		\N	124	30373	\N	\N	1	\N
40906	Carrillo		\N	124	30373	\N	\N	1	\N
40907	Cegarra		\N	124	30373	\N	\N	1	\N
40908	Chejendé		\N	124	30373	\N	\N	1	\N
40909	Manuel Salvador Ulloa		\N	124	30373	\N	\N	1	\N
40910	San José		\N	124	30373	\N	\N	1	\N
40911	Carache		\N	124	30374	\N	\N	1	\N
40912	La Concepción		\N	124	30374	\N	\N	1	\N
40913	Cuicas		\N	124	30374	\N	\N	1	\N
40914	Panamericana		\N	124	30374	\N	\N	1	\N
40915	Santa Cruz		\N	124	30374	\N	\N	1	\N
40916	Escuque		\N	124	30375	\N	\N	1	\N
40917	La Unión		\N	124	30375	\N	\N	1	\N
40918	Santa Rita		\N	124	30375	\N	\N	1	\N
40919	Sabana Libre		\N	124	30375	\N	\N	1	\N
40920	El Socorro		\N	124	30376	\N	\N	1	\N
40921	Los Caprichos		\N	124	30376	\N	\N	1	\N
40922	Antonio José de Sucre		\N	124	30376	\N	\N	1	\N
40923	Campo Elías		\N	124	30377	\N	\N	1	\N
40924	Arnoldo Gabaldón		\N	124	30377	\N	\N	1	\N
40925	Santa Apolonia		\N	124	30378	\N	\N	1	\N
40926	El Progreso		\N	124	30378	\N	\N	1	\N
40927	La Ceiba		\N	124	30378	\N	\N	1	\N
40928	Tres de Febrero		\N	124	30378	\N	\N	1	\N
40929	El Dividive		\N	124	30379	\N	\N	1	\N
40930	Agua Santa		\N	124	30379	\N	\N	1	\N
40931	Agua Caliente		\N	124	30379	\N	\N	1	\N
40932	El Cenizo		\N	124	30379	\N	\N	1	\N
40933	Valerita		\N	124	30379	\N	\N	1	\N
40934	Monte Carmelo		\N	124	30380	\N	\N	1	\N
40935	Buena Vista		\N	124	30380	\N	\N	1	\N
40936	Santa María del Horcón		\N	124	30380	\N	\N	1	\N
40937	Motatán		\N	124	30381	\N	\N	1	\N
40938	El Baño		\N	124	30381	\N	\N	1	\N
40939	Jalisco		\N	124	30381	\N	\N	1	\N
40940	Pampán		\N	124	30382	\N	\N	1	\N
40941	Flor de Patria		\N	124	30382	\N	\N	1	\N
40942	La Paz		\N	124	30382	\N	\N	1	\N
40943	Santa Ana		\N	124	30382	\N	\N	1	\N
40944	Pampanito		\N	124	30383	\N	\N	1	\N
40945	La Concepción		\N	124	30383	\N	\N	1	\N
40946	Pampanito II		\N	124	30383	\N	\N	1	\N
40947	Betijoque		\N	124	30384	\N	\N	1	\N
40948	José Gregorio Hernández		\N	124	30384	\N	\N	1	\N
40949	La Pueblita		\N	124	30384	\N	\N	1	\N
40950	Los Cedros		\N	124	30384	\N	\N	1	\N
40951	Carvajal		\N	124	30385	\N	\N	1	\N
40952	Campo Alegre		\N	124	30385	\N	\N	1	\N
40953	Antonio Nicolás Briceño		\N	124	30385	\N	\N	1	\N
40954	José Leonardo Suárez		\N	124	30385	\N	\N	1	\N
40955	Sabana de Mendoza		\N	124	30386	\N	\N	1	\N
40956	Junín		\N	124	30386	\N	\N	1	\N
40957	Valmore Rodríguez		\N	124	30386	\N	\N	1	\N
40958	El Paraíso		\N	124	30386	\N	\N	1	\N
40959	Andrés Linares		\N	124	30387	\N	\N	1	\N
40960	Chiquinquirá		\N	124	30387	\N	\N	1	\N
40961	Cristóbal Mendoza		\N	124	30387	\N	\N	1	\N
40962	Cruz Carrillo		\N	124	30387	\N	\N	1	\N
40963	Matriz		\N	124	30387	\N	\N	1	\N
40964	Monseñor Carrillo		\N	124	30387	\N	\N	1	\N
40965	Tres Esquinas		\N	124	30387	\N	\N	1	\N
40966	Cabimbú		\N	124	30388	\N	\N	1	\N
40967	Jajó		\N	124	30388	\N	\N	1	\N
40968	La Mesa de Esnujaque		\N	124	30388	\N	\N	1	\N
40969	Santiago		\N	124	30388	\N	\N	1	\N
40970	Tuñame		\N	124	30388	\N	\N	1	\N
40971	La Quebrada		\N	124	30388	\N	\N	1	\N
40972	Juan Ignacio Montilla		\N	124	30389	\N	\N	1	\N
40973	La Beatriz		\N	124	30389	\N	\N	1	\N
40974	La Puerta		\N	124	30389	\N	\N	1	\N
40975	Mendoza del Valle de Momboy		\N	124	30389	\N	\N	1	\N
40976	Mercedes Díaz		\N	124	30389	\N	\N	1	\N
40977	San Luis		\N	124	30389	\N	\N	1	\N
40978	Caraballeda		\N	124	30390	\N	\N	1	\N
40979	Carayaca		\N	124	30390	\N	\N	1	\N
40980	Carlos Soublette		\N	124	30390	\N	\N	1	\N
40981	Caruao Chuspa		\N	124	30390	\N	\N	1	\N
40982	Catia La Mar		\N	124	30390	\N	\N	1	\N
40983	El Junko		\N	124	30390	\N	\N	1	\N
40984	La Guaira		\N	124	30390	\N	\N	1	\N
40985	Macuto		\N	124	30390	\N	\N	1	\N
40986	Maiquetía		\N	124	30390	\N	\N	1	\N
40987	Naiguatá		\N	124	30390	\N	\N	1	\N
40988	Urimare		\N	124	30390	\N	\N	1	\N
40989	Arístides Bastidas		\N	124	30391	\N	\N	1	\N
40990	Bolívar		\N	124	30392	\N	\N	1	\N
40991	Chivacoa		\N	124	30407	\N	\N	1	\N
40992	Campo Elías		\N	124	30407	\N	\N	1	\N
40993	Cocorote		\N	124	30408	\N	\N	1	\N
40994	Independencia		\N	124	30409	\N	\N	1	\N
40995	José Antonio Páez		\N	124	30410	\N	\N	1	\N
40996	La Trinidad		\N	124	30411	\N	\N	1	\N
40997	Manuel Monge		\N	124	30412	\N	\N	1	\N
40998	Salóm		\N	124	30413	\N	\N	1	\N
40999	Temerla		\N	124	30413	\N	\N	1	\N
41000	Nirgua		\N	124	30413	\N	\N	1	\N
41001	San Andrés		\N	124	30414	\N	\N	1	\N
41002	Yaritagua		\N	124	30414	\N	\N	1	\N
41003	San Javier		\N	124	30415	\N	\N	1	\N
41004	Albarico		\N	124	30415	\N	\N	1	\N
41005	San Felipe		\N	124	30415	\N	\N	1	\N
41006	Sucre		\N	124	30416	\N	\N	1	\N
41007	Urachiche		\N	124	30417	\N	\N	1	\N
41008	El Guayabo		\N	124	30418	\N	\N	1	\N
41009	Farriar		\N	124	30418	\N	\N	1	\N
41010	Isla de Toas		\N	124	30441	\N	\N	1	\N
41011	Monagas		\N	124	30441	\N	\N	1	\N
41012	San Timoteo		\N	124	30442	\N	\N	1	\N
41013	General Urdaneta		\N	124	30442	\N	\N	1	\N
41014	Libertador		\N	124	30442	\N	\N	1	\N
41015	Marcelino Briceño		\N	124	30442	\N	\N	1	\N
41016	Pueblo Nuevo		\N	124	30442	\N	\N	1	\N
41017	Manuel Guanipa Matos		\N	124	30442	\N	\N	1	\N
41018	Ambrosio		\N	124	30443	\N	\N	1	\N
41019	Carmen Herrera		\N	124	30443	\N	\N	1	\N
41020	La Rosa		\N	124	30443	\N	\N	1	\N
41021	Germán Ríos Linares		\N	124	30443	\N	\N	1	\N
41022	San Benito		\N	124	30443	\N	\N	1	\N
41023	Rómulo Betancourt		\N	124	30443	\N	\N	1	\N
41024	Jorge Hernández		\N	124	30443	\N	\N	1	\N
41025	Punta Gorda		\N	124	30443	\N	\N	1	\N
41026	Arístides Calvani		\N	124	30443	\N	\N	1	\N
41027	Encontrados		\N	124	30444	\N	\N	1	\N
41028	Udón Pérez		\N	124	30444	\N	\N	1	\N
41029	Moralito		\N	124	30445	\N	\N	1	\N
41030	San Carlos del Zulia		\N	124	30445	\N	\N	1	\N
41031	Santa Cruz del Zulia		\N	124	30445	\N	\N	1	\N
41032	Santa Bárbara		\N	124	30445	\N	\N	1	\N
41033	Urribarrí		\N	124	30445	\N	\N	1	\N
41034	Carlos Quevedo		\N	124	30446	\N	\N	1	\N
41035	Francisco Javier Pulgar		\N	124	30446	\N	\N	1	\N
41036	Simón Rodríguez		\N	124	30446	\N	\N	1	\N
41037	Guamo-Gavilanes		\N	124	30446	\N	\N	1	\N
41038	La Concepción		\N	124	30448	\N	\N	1	\N
41039	San José		\N	124	30448	\N	\N	1	\N
41040	Mariano Parra León		\N	124	30448	\N	\N	1	\N
41041	José Ramón Yépez		\N	124	30448	\N	\N	1	\N
41042	Jesús María Semprún		\N	124	30449	\N	\N	1	\N
41043	Barí		\N	124	30449	\N	\N	1	\N
41044	Concepción		\N	124	30450	\N	\N	1	\N
41045	Andrés Bello		\N	124	30450	\N	\N	1	\N
41046	Chiquinquirá		\N	124	30450	\N	\N	1	\N
41047	El Carmelo		\N	124	30450	\N	\N	1	\N
41048	Potreritos		\N	124	30450	\N	\N	1	\N
41049	Libertad		\N	124	30451	\N	\N	1	\N
41050	Alonso de Ojeda		\N	124	30451	\N	\N	1	\N
41051	Venezuela		\N	124	30451	\N	\N	1	\N
41052	Eleazar López Contreras		\N	124	30451	\N	\N	1	\N
41053	Campo Lara		\N	124	30451	\N	\N	1	\N
41054	Bartolomé de las Casas		\N	124	30452	\N	\N	1	\N
41055	Libertad		\N	124	30452	\N	\N	1	\N
41056	Río Negro		\N	124	30452	\N	\N	1	\N
41057	San José de Perijá		\N	124	30452	\N	\N	1	\N
41058	San Rafael		\N	124	30453	\N	\N	1	\N
41059	La Sierrita		\N	124	30453	\N	\N	1	\N
41060	Las Parcelas		\N	124	30453	\N	\N	1	\N
41061	Luis de Vicente		\N	124	30453	\N	\N	1	\N
41062	Monseñor Marcos Sergio Godoy		\N	124	30453	\N	\N	1	\N
41063	Ricaurte		\N	124	30453	\N	\N	1	\N
41064	Tamare		\N	124	30453	\N	\N	1	\N
41065	Antonio Borjas Romero		\N	124	30454	\N	\N	1	\N
41066	Bolívar		\N	124	30454	\N	\N	1	\N
41067	Cacique Mara		\N	124	30454	\N	\N	1	\N
41068	Carracciolo Parra Pérez		\N	124	30454	\N	\N	1	\N
41069	Cecilio Acosta		\N	124	30454	\N	\N	1	\N
41070	Cristo de Aranza		\N	124	30454	\N	\N	1	\N
41071	Coquivacoa		\N	124	30454	\N	\N	1	\N
41072	Chiquinquirá		\N	124	30454	\N	\N	1	\N
41073	Francisco Eugenio Bustamante		\N	124	30454	\N	\N	1	\N
41074	Idelfonzo Vásquez		\N	124	30454	\N	\N	1	\N
41075	Juana de Ávila		\N	124	30454	\N	\N	1	\N
41076	Luis Hurtado Higuera		\N	124	30454	\N	\N	1	\N
41077	Manuel Dagnino		\N	124	30454	\N	\N	1	\N
41078	Olegario Villalobos		\N	124	30454	\N	\N	1	\N
41079	Raúl Leoni		\N	124	30454	\N	\N	1	\N
41080	Santa Lucía		\N	124	30454	\N	\N	1	\N
41081	Venancio Pulgar		\N	124	30454	\N	\N	1	\N
41082	San Isidro		\N	124	30454	\N	\N	1	\N
41083	Altagracia		\N	124	30455	\N	\N	1	\N
41084	Faría		\N	124	30455	\N	\N	1	\N
41085	Ana María Campos		\N	124	30455	\N	\N	1	\N
41086	San Antonio		\N	124	30455	\N	\N	1	\N
41087	San José		\N	124	30455	\N	\N	1	\N
41088	Donaldo García		\N	124	30456	\N	\N	1	\N
41089	El Rosario		\N	124	30456	\N	\N	1	\N
41090	Sixto Zambrano		\N	124	30456	\N	\N	1	\N
41091	San Francisco		\N	124	30457	\N	\N	1	\N
41092	El Bajo		\N	124	30457	\N	\N	1	\N
41093	Domitila Flores		\N	124	30457	\N	\N	1	\N
41094	Francisco Ochoa		\N	124	30457	\N	\N	1	\N
41095	Los Cortijos		\N	124	30457	\N	\N	1	\N
41096	Marcial Hernández		\N	124	30457	\N	\N	1	\N
41097	Santa Rita		\N	124	30458	\N	\N	1	\N
41098	El Mene		\N	124	30458	\N	\N	1	\N
41099	Pedro Lucas Urribarrí		\N	124	30458	\N	\N	1	\N
41100	José Cenobio Urribarrí		\N	124	30458	\N	\N	1	\N
41101	Rafael Maria Baralt		\N	124	30459	\N	\N	1	\N
41102	Manuel Manrique		\N	124	30459	\N	\N	1	\N
41103	Rafael Urdaneta		\N	124	30459	\N	\N	1	\N
41104	Bobures		\N	124	30460	\N	\N	1	\N
41105	Gibraltar		\N	124	30460	\N	\N	1	\N
41106	Heras		\N	124	30460	\N	\N	1	\N
41107	Monseñor Arturo Álvarez		\N	124	30460	\N	\N	1	\N
41108	Rómulo Gallegos		\N	124	30460	\N	\N	1	\N
41109	El Batey		\N	124	30460	\N	\N	1	\N
41110	Rafael Urdaneta		\N	124	30461	\N	\N	1	\N
41111	La Victoria		\N	124	30461	\N	\N	1	\N
41112	Raúl Cuenca		\N	124	30461	\N	\N	1	\N
41113	Sinamaica		\N	124	30447	\N	\N	1	\N
41114	Alta Guajira		\N	124	30447	\N	\N	1	\N
41115	Elías Sánchez Rubio		\N	124	30447	\N	\N	1	\N
41116	Guajira		\N	124	30447	\N	\N	1	\N
41117	Altagracia		\N	124	30462	\N	\N	1	\N
41118	Antímano		\N	124	30462	\N	\N	1	\N
41119	Caricuao		\N	124	30462	\N	\N	1	\N
41120	Catedral		\N	124	30462	\N	\N	1	\N
41121	Coche		\N	124	30462	\N	\N	1	\N
41122	El Junquito		\N	124	30462	\N	\N	1	\N
41123	El Paraíso		\N	124	30462	\N	\N	1	\N
41124	El Recreo		\N	124	30462	\N	\N	1	\N
41125	El Valle		\N	124	30462	\N	\N	1	\N
41126	La Candelaria		\N	124	30462	\N	\N	1	\N
41127	La Pastora		\N	124	30462	\N	\N	1	\N
41128	La Vega		\N	124	30462	\N	\N	1	\N
41129	Macarao		\N	124	30462	\N	\N	1	\N
41130	San Agustín		\N	124	30462	\N	\N	1	\N
41131	San Bernardino		\N	124	30462	\N	\N	1	\N
41132	San José		\N	124	30462	\N	\N	1	\N
41133	San Juan		\N	124	30462	\N	\N	1	\N
41134	San Pedro		\N	124	30462	\N	\N	1	\N
41135	Santa Rosalía		\N	124	30462	\N	\N	1	\N
41136	Santa Teresa		\N	124	30462	\N	\N	1	\N
41137	Sucre (Catia)		\N	124	30462	\N	\N	1	\N
41138	23 de enero		\N	124	30462	100004	\N	1	\N
9328	faRadio		\N	27	\N	9328	\N	1	\N
9329	faRainbow		\N	27	\N	9329	\N	1	\N
9330	faRankingStar		\N	27	\N	9330	\N	1	\N
9331	faRaspberryPi		\N	27	\N	9331	\N	1	\N
9332	faRavelry		\N	27	\N	9332	\N	1	\N
9333	faReact		\N	27	\N	9333	\N	1	\N
9334	faReacteurope		\N	27	\N	9334	\N	1	\N
9335	faReadme		\N	27	\N	9335	\N	1	\N
9336	faRebel		\N	27	\N	9336	\N	1	\N
9337	faReceipt		\N	27	\N	9337	\N	1	\N
9338	faRecordVinyl		\N	27	\N	9338	\N	1	\N
9339	faRectangleAd		\N	27	\N	9339	\N	1	\N
9340	faRectangleList		\N	27	\N	9340	\N	1	\N
9341	faRectangleXmark		\N	27	\N	9341	\N	1	\N
9342	faRecycle		\N	27	\N	9342	\N	1	\N
9343	faRedRiver		\N	27	\N	9343	\N	1	\N
9344	faReddit		\N	27	\N	9344	\N	1	\N
9345	faRedditAlien		\N	27	\N	9345	\N	1	\N
9346	faRedhat		\N	27	\N	9346	\N	1	\N
9347	faRegistered		\N	27	\N	9347	\N	1	\N
9348	faRenren		\N	27	\N	9348	\N	1	\N
9349	faRepeat		\N	27	\N	9349	\N	1	\N
9350	faReply		\N	27	\N	9350	\N	1	\N
9351	faReplyAll		\N	27	\N	9351	\N	1	\N
9352	faReplyd		\N	27	\N	9352	\N	1	\N
9353	faRepublican		\N	27	\N	9353	\N	1	\N
9354	faResearchgate		\N	27	\N	9354	\N	1	\N
9355	faResolving		\N	27	\N	9355	\N	1	\N
9356	faRestroom		\N	27	\N	9356	\N	1	\N
9357	faRetweet		\N	27	\N	9357	\N	1	\N
9358	faRev		\N	27	\N	9358	\N	1	\N
9359	faRibbon		\N	27	\N	9359	\N	1	\N
9360	faRightFromBracket		\N	27	\N	9360	\N	1	\N
9361	faRightLeft		\N	27	\N	9361	\N	1	\N
9362	faRightLong		\N	27	\N	9362	\N	1	\N
9363	faRightToBracket		\N	27	\N	9363	\N	1	\N
9364	faRing		\N	27	\N	9364	\N	1	\N
9365	faRoad		\N	27	\N	9365	\N	1	\N
9366	faRoadBarrier		\N	27	\N	9366	\N	1	\N
9367	faRoadBridge		\N	27	\N	9367	\N	1	\N
9368	faRoadCircleCheck		\N	27	\N	9368	\N	1	\N
9369	faRoadCircleExclamation		\N	27	\N	9369	\N	1	\N
9370	faRoadCircleXmark		\N	27	\N	9370	\N	1	\N
9371	faRoadLock		\N	27	\N	9371	\N	1	\N
9372	faRoadSpikes		\N	27	\N	9372	\N	1	\N
9373	faRobot		\N	27	\N	9373	\N	1	\N
9374	faRocket		\N	27	\N	9374	\N	1	\N
9375	faRocketchat		\N	27	\N	9375	\N	1	\N
9376	faRockrms		\N	27	\N	9376	\N	1	\N
9377	faRotate		\N	27	\N	9377	\N	1	\N
9378	faRotateLeft		\N	27	\N	9378	\N	1	\N
9379	faRotateRight		\N	27	\N	9379	\N	1	\N
9380	faRoute		\N	27	\N	9380	\N	1	\N
9381	faRss		\N	27	\N	9381	\N	1	\N
9382	faRubleSign		\N	27	\N	9382	\N	1	\N
9383	faRug		\N	27	\N	9383	\N	1	\N
9384	faRuler		\N	27	\N	9384	\N	1	\N
9385	faRulerCombined		\N	27	\N	9385	\N	1	\N
9386	faRulerHorizontal		\N	27	\N	9386	\N	1	\N
9387	faRulerVertical		\N	27	\N	9387	\N	1	\N
9388	faRupeeSign		\N	27	\N	9388	\N	1	\N
9389	faRupiahSign		\N	27	\N	9389	\N	1	\N
9390	faRust		\N	27	\N	9390	\N	1	\N
9391	faS		\N	27	\N	9391	\N	1	\N
9392	faSackDollar		\N	27	\N	9392	\N	1	\N
9393	faSackXmark		\N	27	\N	9393	\N	1	\N
9394	faSafari		\N	27	\N	9394	\N	1	\N
9395	faSailboat		\N	27	\N	9395	\N	1	\N
9396	faSalesforce		\N	27	\N	9396	\N	1	\N
9397	faSass		\N	27	\N	9397	\N	1	\N
9398	faSatellite		\N	27	\N	9398	\N	1	\N
9399	faSatelliteDish		\N	27	\N	9399	\N	1	\N
9400	faScaleBalanced		\N	27	\N	9400	\N	1	\N
9401	faScaleUnbalanced		\N	27	\N	9401	\N	1	\N
9402	faScaleUnbalancedFlip		\N	27	\N	9402	\N	1	\N
9403	faSchlix		\N	27	\N	9403	\N	1	\N
9404	faSchool		\N	27	\N	9404	\N	1	\N
9405	faSchoolCircleCheck		\N	27	\N	9405	\N	1	\N
9406	faSchoolCircleExclamation		\N	27	\N	9406	\N	1	\N
9407	faSchoolCircleXmark		\N	27	\N	9407	\N	1	\N
9408	faSchoolFlag		\N	27	\N	9408	\N	1	\N
9409	faSchoolLock		\N	27	\N	9409	\N	1	\N
9410	faScissors		\N	27	\N	9410	\N	1	\N
9411	faScreenpal		\N	27	\N	9411	\N	1	\N
9412	faScrewdriver		\N	27	\N	9412	\N	1	\N
9413	faScrewdriverWrench		\N	27	\N	9413	\N	1	\N
9414	faScribd		\N	27	\N	9414	\N	1	\N
9415	faScroll		\N	27	\N	9415	\N	1	\N
9416	faScrollTorah		\N	27	\N	9416	\N	1	\N
9417	faSdCard		\N	27	\N	9417	\N	1	\N
9418	faSearchengin		\N	27	\N	9418	\N	1	\N
9419	faSection		\N	27	\N	9419	\N	1	\N
9420	faSeedling		\N	27	\N	9420	\N	1	\N
9421	faSellcast		\N	27	\N	9421	\N	1	\N
9422	faSellsy		\N	27	\N	9422	\N	1	\N
9423	faServer		\N	27	\N	9423	\N	1	\N
9424	faServicestack		\N	27	\N	9424	\N	1	\N
9425	faShapes		\N	27	\N	9425	\N	1	\N
9426	faShare		\N	27	\N	9426	\N	1	\N
9427	faShareFromSquare		\N	27	\N	9427	\N	1	\N
9428	faShareNodes		\N	27	\N	9428	\N	1	\N
9429	faSheetPlastic		\N	27	\N	9429	\N	1	\N
9430	faShekelSign		\N	27	\N	9430	\N	1	\N
9431	faShield		\N	27	\N	9431	\N	1	\N
9432	faShieldCat		\N	27	\N	9432	\N	1	\N
9433	faShieldDog		\N	27	\N	9433	\N	1	\N
9434	faShieldHalved		\N	27	\N	9434	\N	1	\N
9435	faShieldHeart		\N	27	\N	9435	\N	1	\N
9436	faShieldVirus		\N	27	\N	9436	\N	1	\N
9437	faShip		\N	27	\N	9437	\N	1	\N
9438	faShirt		\N	27	\N	9438	\N	1	\N
9439	faShirtsinbulk		\N	27	\N	9439	\N	1	\N
9440	faShoePrints		\N	27	\N	9440	\N	1	\N
9441	faShoelace		\N	27	\N	9441	\N	1	\N
9442	faShop		\N	27	\N	9442	\N	1	\N
9443	faShopLock		\N	27	\N	9443	\N	1	\N
9444	faShopSlash		\N	27	\N	9444	\N	1	\N
9445	faShopify		\N	27	\N	9445	\N	1	\N
9446	faShopware		\N	27	\N	9446	\N	1	\N
9447	faShower		\N	27	\N	9447	\N	1	\N
9448	faShrimp		\N	27	\N	9448	\N	1	\N
9449	faShuffle		\N	27	\N	9449	\N	1	\N
9450	faShuttleSpace		\N	27	\N	9450	\N	1	\N
9451	faSignHanging		\N	27	\N	9451	\N	1	\N
9452	faSignal		\N	27	\N	9452	\N	1	\N
9453	faSignalMessenger		\N	27	\N	9453	\N	1	\N
9454	faSignature		\N	27	\N	9454	\N	1	\N
9455	faSignsPost		\N	27	\N	9455	\N	1	\N
9456	faSimCard		\N	27	\N	9456	\N	1	\N
9457	faSimplybuilt		\N	27	\N	9457	\N	1	\N
9458	faSink		\N	27	\N	9458	\N	1	\N
9459	faSistrix		\N	27	\N	9459	\N	1	\N
9460	faSitemap		\N	27	\N	9460	\N	1	\N
9461	faSith		\N	27	\N	9461	\N	1	\N
9462	faSitrox		\N	27	\N	9462	\N	1	\N
9463	faSketch		\N	27	\N	9463	\N	1	\N
9464	faSkull		\N	27	\N	9464	\N	1	\N
9465	faSkullCrossbones		\N	27	\N	9465	\N	1	\N
9466	faSkyatlas		\N	27	\N	9466	\N	1	\N
9467	faSkype		\N	27	\N	9467	\N	1	\N
9468	faSlack		\N	27	\N	9468	\N	1	\N
9469	faSlash		\N	27	\N	9469	\N	1	\N
9470	faSleigh		\N	27	\N	9470	\N	1	\N
9471	faSliders		\N	27	\N	9471	\N	1	\N
9472	faSlideshare		\N	27	\N	9472	\N	1	\N
9473	faSmog		\N	27	\N	9473	\N	1	\N
9474	faSmoking		\N	27	\N	9474	\N	1	\N
9475	faSnapchat		\N	27	\N	9475	\N	1	\N
9476	faSnowflake		\N	27	\N	9476	\N	1	\N
9477	faSnowman		\N	27	\N	9477	\N	1	\N
9478	faSnowplow		\N	27	\N	9478	\N	1	\N
9479	faSoap		\N	27	\N	9479	\N	1	\N
9480	faSocks		\N	27	\N	9480	\N	1	\N
9481	faSolarPanel		\N	27	\N	9481	\N	1	\N
9482	faSort		\N	27	\N	9482	\N	1	\N
9483	faSortDown		\N	27	\N	9483	\N	1	\N
9484	faSortUp		\N	27	\N	9484	\N	1	\N
9485	faSoundcloud		\N	27	\N	9485	\N	1	\N
9486	faSourcetree		\N	27	\N	9486	\N	1	\N
9487	faSpa		\N	27	\N	9487	\N	1	\N
9488	faSpaceAwesome		\N	27	\N	9488	\N	1	\N
9489	faSpaghettiMonsterFlying		\N	27	\N	9489	\N	1	\N
9490	faSpeakap		\N	27	\N	9490	\N	1	\N
9491	faSpeakerDeck		\N	27	\N	9491	\N	1	\N
9492	faSpellCheck		\N	27	\N	9492	\N	1	\N
9493	faSpider		\N	27	\N	9493	\N	1	\N
9494	faSpinner		\N	27	\N	9494	\N	1	\N
9495	faSplotch		\N	27	\N	9495	\N	1	\N
9496	faSpoon		\N	27	\N	9496	\N	1	\N
9497	faSpotify		\N	27	\N	9497	\N	1	\N
9498	faSprayCan		\N	27	\N	9498	\N	1	\N
9499	faSprayCanSparkles		\N	27	\N	9499	\N	1	\N
9500	faSquare		\N	27	\N	9500	\N	1	\N
9501	faSquareArrowUpRight		\N	27	\N	9501	\N	1	\N
9502	faSquareBehance		\N	27	\N	9502	\N	1	\N
9503	faSquareBinary		\N	27	\N	9503	\N	1	\N
9504	faSquareBluesky		\N	27	\N	9504	\N	1	\N
9505	faSquareCaretDown		\N	27	\N	9505	\N	1	\N
9506	faSquareCaretLeft		\N	27	\N	9506	\N	1	\N
9507	faSquareCaretRight		\N	27	\N	9507	\N	1	\N
9508	faSquareCaretUp		\N	27	\N	9508	\N	1	\N
9509	faSquareCheck		\N	27	\N	9509	\N	1	\N
9510	faSquareDribbble		\N	27	\N	9510	\N	1	\N
9511	faSquareEnvelope		\N	27	\N	9511	\N	1	\N
9512	faSquareFacebook		\N	27	\N	9512	\N	1	\N
9513	faSquareFontAwesome		\N	27	\N	9513	\N	1	\N
9514	faSquareFontAwesomeStroke		\N	27	\N	9514	\N	1	\N
9515	faSquareFull		\N	27	\N	9515	\N	1	\N
9516	faSquareGit		\N	27	\N	9516	\N	1	\N
9517	faSquareGithub		\N	27	\N	9517	\N	1	\N
9518	faSquareGitlab		\N	27	\N	9518	\N	1	\N
9519	faSquareGooglePlus		\N	27	\N	9519	\N	1	\N
9520	faSquareH		\N	27	\N	9520	\N	1	\N
9521	faSquareHackerNews		\N	27	\N	9521	\N	1	\N
9522	faSquareInstagram		\N	27	\N	9522	\N	1	\N
9523	faSquareJs		\N	27	\N	9523	\N	1	\N
9524	faSquareLastfm		\N	27	\N	9524	\N	1	\N
9525	faSquareLetterboxd		\N	27	\N	9525	\N	1	\N
9526	faSquareMinus		\N	27	\N	9526	\N	1	\N
9527	faSquareNfi		\N	27	\N	9527	\N	1	\N
9528	faSquareOdnoklassniki		\N	27	\N	9528	\N	1	\N
9529	faSquareParking		\N	27	\N	9529	\N	1	\N
9530	faSquarePen		\N	27	\N	9530	\N	1	\N
9531	faSquarePersonConfined		\N	27	\N	9531	\N	1	\N
9532	faSquarePhone		\N	27	\N	9532	\N	1	\N
9533	faSquarePhoneFlip		\N	27	\N	9533	\N	1	\N
9534	faSquarePiedPiper		\N	27	\N	9534	\N	1	\N
9535	faSquarePinterest		\N	27	\N	9535	\N	1	\N
9536	faSquarePlus		\N	27	\N	9536	\N	1	\N
9537	faSquarePollHorizontal		\N	27	\N	9537	\N	1	\N
9538	faSquarePollVertical		\N	27	\N	9538	\N	1	\N
9539	faSquareReddit		\N	27	\N	9539	\N	1	\N
9540	faSquareRootVariable		\N	27	\N	9540	\N	1	\N
9541	faSquareRss		\N	27	\N	9541	\N	1	\N
9542	faSquareShareNodes		\N	27	\N	9542	\N	1	\N
9543	faSquareSnapchat		\N	27	\N	9543	\N	1	\N
9544	faSquareSteam		\N	27	\N	9544	\N	1	\N
9545	faSquareThreads		\N	27	\N	9545	\N	1	\N
9546	faSquareTumblr		\N	27	\N	9546	\N	1	\N
9547	faSquareTwitter		\N	27	\N	9547	\N	1	\N
9548	faSquareUpRight		\N	27	\N	9548	\N	1	\N
9549	faSquareUpwork		\N	27	\N	9549	\N	1	\N
9550	faSquareViadeo		\N	27	\N	9550	\N	1	\N
9551	faSquareVimeo		\N	27	\N	9551	\N	1	\N
9552	faSquareVirus		\N	27	\N	9552	\N	1	\N
9553	faSquareWebAwesome		\N	27	\N	9553	\N	1	\N
9554	faSquareWebAwesomeStroke		\N	27	\N	9554	\N	1	\N
9555	faSquareWhatsapp		\N	27	\N	9555	\N	1	\N
9556	faSquareXTwitter		\N	27	\N	9556	\N	1	\N
9557	faSquareXing		\N	27	\N	9557	\N	1	\N
9558	faSquareXmark		\N	27	\N	9558	\N	1	\N
9559	faSquareYoutube		\N	27	\N	9559	\N	1	\N
9560	faSquarespace		\N	27	\N	9560	\N	1	\N
9561	faStackExchange		\N	27	\N	9561	\N	1	\N
9562	faStackOverflow		\N	27	\N	9562	\N	1	\N
9563	faStackpath		\N	27	\N	9563	\N	1	\N
9564	faStaffSnake		\N	27	\N	9564	\N	1	\N
9565	faStairs		\N	27	\N	9565	\N	1	\N
9566	faStamp		\N	27	\N	9566	\N	1	\N
9567	faStapler		\N	27	\N	9567	\N	1	\N
9568	faStar		\N	27	\N	9568	\N	1	\N
9569	faStarAndCrescent		\N	27	\N	9569	\N	1	\N
9570	faStarHalf		\N	27	\N	9570	\N	1	\N
9571	faStarHalfStroke		\N	27	\N	9571	\N	1	\N
9572	faStarOfDavid		\N	27	\N	9572	\N	1	\N
9573	faStarOfLife		\N	27	\N	9573	\N	1	\N
9574	faStaylinked		\N	27	\N	9574	\N	1	\N
9575	faSteam		\N	27	\N	9575	\N	1	\N
9576	faSteamSymbol		\N	27	\N	9576	\N	1	\N
9577	faSterlingSign		\N	27	\N	9577	\N	1	\N
9578	faStethoscope		\N	27	\N	9578	\N	1	\N
9579	faStickerMule		\N	27	\N	9579	\N	1	\N
9580	faStop		\N	27	\N	9580	\N	1	\N
9581	faStopwatch		\N	27	\N	9581	\N	1	\N
9582	faStopwatch20		\N	27	\N	9582	\N	1	\N
9583	faStore		\N	27	\N	9583	\N	1	\N
9584	faStoreSlash		\N	27	\N	9584	\N	1	\N
9585	faStrava		\N	27	\N	9585	\N	1	\N
9586	faStreetView		\N	27	\N	9586	\N	1	\N
9587	faStrikethrough		\N	27	\N	9587	\N	1	\N
9588	faStripe		\N	27	\N	9588	\N	1	\N
9589	faStripeS		\N	27	\N	9589	\N	1	\N
9590	faStroopwafel		\N	27	\N	9590	\N	1	\N
9591	faStubber		\N	27	\N	9591	\N	1	\N
9592	faStudiovinari		\N	27	\N	9592	\N	1	\N
9593	faStumbleupon		\N	27	\N	9593	\N	1	\N
9594	faStumbleuponCircle		\N	27	\N	9594	\N	1	\N
9595	faSubscript		\N	27	\N	9595	\N	1	\N
9596	faSuitcase		\N	27	\N	9596	\N	1	\N
9597	faSuitcaseMedical		\N	27	\N	9597	\N	1	\N
9598	faSuitcaseRolling		\N	27	\N	9598	\N	1	\N
9599	faSun		\N	27	\N	9599	\N	1	\N
9600	faSunPlantWilt		\N	27	\N	9600	\N	1	\N
9601	faSuperpowers		\N	27	\N	9601	\N	1	\N
9602	faSuperscript		\N	27	\N	9602	\N	1	\N
9603	faSupple		\N	27	\N	9603	\N	1	\N
9604	faSuse		\N	27	\N	9604	\N	1	\N
9605	faSwatchbook		\N	27	\N	9605	\N	1	\N
9606	faSwift		\N	27	\N	9606	\N	1	\N
9607	faSymfony		\N	27	\N	9607	\N	1	\N
9608	faSynagogue		\N	27	\N	9608	\N	1	\N
9609	faSyringe		\N	27	\N	9609	\N	1	\N
9610	faT		\N	27	\N	9610	\N	1	\N
9611	faTable		\N	27	\N	9611	\N	1	\N
9612	faTableCells		\N	27	\N	9612	\N	1	\N
9613	faTableCellsColumnLock		\N	27	\N	9613	\N	1	\N
9614	faTableCellsLarge		\N	27	\N	9614	\N	1	\N
9615	faTableCellsRowLock		\N	27	\N	9615	\N	1	\N
9616	faTableCellsRowUnlock		\N	27	\N	9616	\N	1	\N
9617	faTableColumns		\N	27	\N	9617	\N	1	\N
9618	faTableList		\N	27	\N	9618	\N	1	\N
9619	faTableTennisPaddleBall		\N	27	\N	9619	\N	1	\N
9620	faTablet		\N	27	\N	9620	\N	1	\N
9621	faTabletButton		\N	27	\N	9621	\N	1	\N
9622	faTabletScreenButton		\N	27	\N	9622	\N	1	\N
9623	faTablets		\N	27	\N	9623	\N	1	\N
9624	faTachographDigital		\N	27	\N	9624	\N	1	\N
9625	faTag		\N	27	\N	9625	\N	1	\N
9626	faTags		\N	27	\N	9626	\N	1	\N
9627	faTape		\N	27	\N	9627	\N	1	\N
9628	faTarp		\N	27	\N	9628	\N	1	\N
9629	faTarpDroplet		\N	27	\N	9629	\N	1	\N
9630	faTaxi		\N	27	\N	9630	\N	1	\N
9631	faTeamspeak		\N	27	\N	9631	\N	1	\N
9632	faTeeth		\N	27	\N	9632	\N	1	\N
9633	faTeethOpen		\N	27	\N	9633	\N	1	\N
9634	faTelegram		\N	27	\N	9634	\N	1	\N
9635	faTemperatureArrowDown		\N	27	\N	9635	\N	1	\N
9636	faTemperatureArrowUp		\N	27	\N	9636	\N	1	\N
9637	faTemperatureEmpty		\N	27	\N	9637	\N	1	\N
9638	faTemperatureFull		\N	27	\N	9638	\N	1	\N
9639	faTemperatureHalf		\N	27	\N	9639	\N	1	\N
9640	faTemperatureHigh		\N	27	\N	9640	\N	1	\N
9641	faTemperatureLow		\N	27	\N	9641	\N	1	\N
9642	faTemperatureQuarter		\N	27	\N	9642	\N	1	\N
9643	faTemperatureThreeQuarters		\N	27	\N	9643	\N	1	\N
9644	faTencentWeibo		\N	27	\N	9644	\N	1	\N
9645	faTengeSign		\N	27	\N	9645	\N	1	\N
9646	faTent		\N	27	\N	9646	\N	1	\N
9647	faTentArrowDownToLine		\N	27	\N	9647	\N	1	\N
9648	faTentArrowLeftRight		\N	27	\N	9648	\N	1	\N
9649	faTentArrowTurnLeft		\N	27	\N	9649	\N	1	\N
9650	faTentArrowsDown		\N	27	\N	9650	\N	1	\N
9651	faTents		\N	27	\N	9651	\N	1	\N
9652	faTerminal		\N	27	\N	9652	\N	1	\N
9653	faTextHeight		\N	27	\N	9653	\N	1	\N
9654	faTextSlash		\N	27	\N	9654	\N	1	\N
9655	faTextWidth		\N	27	\N	9655	\N	1	\N
9656	faTheRedYeti		\N	27	\N	9656	\N	1	\N
9657	faThemeco		\N	27	\N	9657	\N	1	\N
9658	faThemeisle		\N	27	\N	9658	\N	1	\N
9659	faThermometer		\N	27	\N	9659	\N	1	\N
9660	faThinkPeaks		\N	27	\N	9660	\N	1	\N
9661	faThreads		\N	27	\N	9661	\N	1	\N
9662	faThumbsDown		\N	27	\N	9662	\N	1	\N
9663	faThumbsUp		\N	27	\N	9663	\N	1	\N
9664	faThumbtack		\N	27	\N	9664	\N	1	\N
9665	faThumbtackSlash		\N	27	\N	9665	\N	1	\N
9666	faTicket		\N	27	\N	9666	\N	1	\N
9667	faTicketSimple		\N	27	\N	9667	\N	1	\N
9668	faTiktok		\N	27	\N	9668	\N	1	\N
9669	faTimeline		\N	27	\N	9669	\N	1	\N
9670	faToggleOff		\N	27	\N	9670	\N	1	\N
9671	faToggleOn		\N	27	\N	9671	\N	1	\N
9672	faToilet		\N	27	\N	9672	\N	1	\N
9673	faToiletPaper		\N	27	\N	9673	\N	1	\N
9674	faToiletPaperSlash		\N	27	\N	9674	\N	1	\N
9675	faToiletPortable		\N	27	\N	9675	\N	1	\N
9676	faToiletsPortable		\N	27	\N	9676	\N	1	\N
9677	faToolbox		\N	27	\N	9677	\N	1	\N
9678	faTooth		\N	27	\N	9678	\N	1	\N
9679	faToriiGate		\N	27	\N	9679	\N	1	\N
9680	faTornado		\N	27	\N	9680	\N	1	\N
9681	faTowerBroadcast		\N	27	\N	9681	\N	1	\N
9682	faTowerCell		\N	27	\N	9682	\N	1	\N
9683	faTowerObservation		\N	27	\N	9683	\N	1	\N
9684	faTractor		\N	27	\N	9684	\N	1	\N
9685	faTradeFederation		\N	27	\N	9685	\N	1	\N
9686	faTrademark		\N	27	\N	9686	\N	1	\N
9687	faTrafficLight		\N	27	\N	9687	\N	1	\N
9688	faTrailer		\N	27	\N	9688	\N	1	\N
9689	faTrain		\N	27	\N	9689	\N	1	\N
9690	faTrainSubway		\N	27	\N	9690	\N	1	\N
9691	faTrainTram		\N	27	\N	9691	\N	1	\N
9692	faTransgender		\N	27	\N	9692	\N	1	\N
9693	faTrash		\N	27	\N	9693	\N	1	\N
9694	faTrashArrowUp		\N	27	\N	9694	\N	1	\N
9695	faTrashCan		\N	27	\N	9695	\N	1	\N
9696	faTrashCanArrowUp		\N	27	\N	9696	\N	1	\N
9697	faTree		\N	27	\N	9697	\N	1	\N
9698	faTreeCity		\N	27	\N	9698	\N	1	\N
9699	faTrello		\N	27	\N	9699	\N	1	\N
9700	faTriangleExclamation		\N	27	\N	9700	\N	1	\N
9701	faTrophy		\N	27	\N	9701	\N	1	\N
9702	faTrowel		\N	27	\N	9702	\N	1	\N
9703	faTrowelBricks		\N	27	\N	9703	\N	1	\N
9704	faTruck		\N	27	\N	9704	\N	1	\N
9705	faTruckArrowRight		\N	27	\N	9705	\N	1	\N
9706	faTruckDroplet		\N	27	\N	9706	\N	1	\N
9707	faTruckFast		\N	27	\N	9707	\N	1	\N
9708	faTruckField		\N	27	\N	9708	\N	1	\N
9709	faTruckFieldUn		\N	27	\N	9709	\N	1	\N
9710	faTruckFront		\N	27	\N	9710	\N	1	\N
9711	faTruckMedical		\N	27	\N	9711	\N	1	\N
9712	faTruckMonster		\N	27	\N	9712	\N	1	\N
9713	faTruckMoving		\N	27	\N	9713	\N	1	\N
9714	faTruckPickup		\N	27	\N	9714	\N	1	\N
9715	faTruckPlane		\N	27	\N	9715	\N	1	\N
9716	faTruckRampBox		\N	27	\N	9716	\N	1	\N
9717	faTty		\N	27	\N	9717	\N	1	\N
9718	faTumblr		\N	27	\N	9718	\N	1	\N
9719	faTurkishLiraSign		\N	27	\N	9719	\N	1	\N
9720	faTurnDown		\N	27	\N	9720	\N	1	\N
9721	faTurnUp		\N	27	\N	9721	\N	1	\N
9722	faTv		\N	27	\N	9722	\N	1	\N
9723	faTwitch		\N	27	\N	9723	\N	1	\N
9724	faTwitter		\N	27	\N	9724	\N	1	\N
9725	faTypo3		\N	27	\N	9725	\N	1	\N
9726	faU		\N	27	\N	9726	\N	1	\N
9727	faUber		\N	27	\N	9727	\N	1	\N
9728	faUbuntu		\N	27	\N	9728	\N	1	\N
9729	faUikit		\N	27	\N	9729	\N	1	\N
9730	faUmbraco		\N	27	\N	9730	\N	1	\N
9731	faUmbrella		\N	27	\N	9731	\N	1	\N
9732	faUmbrellaBeach		\N	27	\N	9732	\N	1	\N
9733	faUncharted		\N	27	\N	9733	\N	1	\N
9734	faUnderline		\N	27	\N	9734	\N	1	\N
9735	faUniregistry		\N	27	\N	9735	\N	1	\N
9736	faUnity		\N	27	\N	9736	\N	1	\N
9737	faUniversalAccess		\N	27	\N	9737	\N	1	\N
9738	faUnlock		\N	27	\N	9738	\N	1	\N
9739	faUnlockKeyhole		\N	27	\N	9739	\N	1	\N
9740	faUnsplash		\N	27	\N	9740	\N	1	\N
9741	faUntappd		\N	27	\N	9741	\N	1	\N
9742	faUpDown		\N	27	\N	9742	\N	1	\N
9743	faUpDownLeftRight		\N	27	\N	9743	\N	1	\N
9744	faUpLong		\N	27	\N	9744	\N	1	\N
9745	faUpRightAndDownLeftFromCenter		\N	27	\N	9745	\N	1	\N
9746	faUpRightFromSquare		\N	27	\N	9746	\N	1	\N
9747	faUpload		\N	27	\N	9747	\N	1	\N
9748	faUps		\N	27	\N	9748	\N	1	\N
9749	faUpwork		\N	27	\N	9749	\N	1	\N
9750	faUsb		\N	27	\N	9750	\N	1	\N
9751	faUser		\N	27	\N	9751	\N	1	\N
9752	faUserAstronaut		\N	27	\N	9752	\N	1	\N
9753	faUserCheck		\N	27	\N	9753	\N	1	\N
9754	faUserClock		\N	27	\N	9754	\N	1	\N
9755	faUserDoctor		\N	27	\N	9755	\N	1	\N
9756	faUserGear		\N	27	\N	9756	\N	1	\N
9757	faUserGraduate		\N	27	\N	9757	\N	1	\N
9758	faUserGroup		\N	27	\N	9758	\N	1	\N
9759	faUserInjured		\N	27	\N	9759	\N	1	\N
9760	faUserLarge		\N	27	\N	9760	\N	1	\N
9761	faUserLargeSlash		\N	27	\N	9761	\N	1	\N
9762	faUserLock		\N	27	\N	9762	\N	1	\N
9763	faUserMinus		\N	27	\N	9763	\N	1	\N
9764	faUserNinja		\N	27	\N	9764	\N	1	\N
9765	faUserNurse		\N	27	\N	9765	\N	1	\N
9766	faUserPen		\N	27	\N	9766	\N	1	\N
9767	faUserPlus		\N	27	\N	9767	\N	1	\N
9768	faUserSecret		\N	27	\N	9768	\N	1	\N
9769	faUserShield		\N	27	\N	9769	\N	1	\N
9770	faUserSlash		\N	27	\N	9770	\N	1	\N
9771	faUserTag		\N	27	\N	9771	\N	1	\N
9772	faUserTie		\N	27	\N	9772	\N	1	\N
9773	faUserXmark		\N	27	\N	9773	\N	1	\N
9774	faUsers		\N	27	\N	9774	\N	1	\N
9775	faUsersBetweenLines		\N	27	\N	9775	\N	1	\N
9776	faUsersGear		\N	27	\N	9776	\N	1	\N
9777	faUsersLine		\N	27	\N	9777	\N	1	\N
9778	faUsersRays		\N	27	\N	9778	\N	1	\N
9779	faUsersRectangle		\N	27	\N	9779	\N	1	\N
9780	faUsersSlash		\N	27	\N	9780	\N	1	\N
9781	faUsersViewfinder		\N	27	\N	9781	\N	1	\N
9782	faUsps		\N	27	\N	9782	\N	1	\N
9783	faUssunnah		\N	27	\N	9783	\N	1	\N
9784	faUtensils		\N	27	\N	9784	\N	1	\N
9785	faV		\N	27	\N	9785	\N	1	\N
9786	faVaadin		\N	27	\N	9786	\N	1	\N
9787	faVanShuttle		\N	27	\N	9787	\N	1	\N
9788	faVault		\N	27	\N	9788	\N	1	\N
9789	faVectorSquare		\N	27	\N	9789	\N	1	\N
9790	faVenus		\N	27	\N	9790	\N	1	\N
9791	faVenusDouble		\N	27	\N	9791	\N	1	\N
9792	faVenusMars		\N	27	\N	9792	\N	1	\N
9793	faVest		\N	27	\N	9793	\N	1	\N
9794	faVestPatches		\N	27	\N	9794	\N	1	\N
9795	faViacoin		\N	27	\N	9795	\N	1	\N
9796	faViadeo		\N	27	\N	9796	\N	1	\N
9797	faVial		\N	27	\N	9797	\N	1	\N
9798	faVialCircleCheck		\N	27	\N	9798	\N	1	\N
9799	faVialVirus		\N	27	\N	9799	\N	1	\N
9800	faVials		\N	27	\N	9800	\N	1	\N
9801	faViber		\N	27	\N	9801	\N	1	\N
9802	faVideo		\N	27	\N	9802	\N	1	\N
9803	faVideoSlash		\N	27	\N	9803	\N	1	\N
9804	faVihara		\N	27	\N	9804	\N	1	\N
9805	faVimeo		\N	27	\N	9805	\N	1	\N
9806	faVimeoV		\N	27	\N	9806	\N	1	\N
9807	faVine		\N	27	\N	9807	\N	1	\N
9808	faVirus		\N	27	\N	9808	\N	1	\N
9809	faVirusCovid		\N	27	\N	9809	\N	1	\N
9810	faVirusCovidSlash		\N	27	\N	9810	\N	1	\N
9811	faVirusSlash		\N	27	\N	9811	\N	1	\N
9812	faViruses		\N	27	\N	9812	\N	1	\N
9813	faVk		\N	27	\N	9813	\N	1	\N
9814	faVnv		\N	27	\N	9814	\N	1	\N
9815	faVoicemail		\N	27	\N	9815	\N	1	\N
9816	faVolcano		\N	27	\N	9816	\N	1	\N
9817	faVolleyball		\N	27	\N	9817	\N	1	\N
9818	faVolumeHigh		\N	27	\N	9818	\N	1	\N
9819	faVolumeLow		\N	27	\N	9819	\N	1	\N
9820	faVolumeOff		\N	27	\N	9820	\N	1	\N
9821	faVolumeXmark		\N	27	\N	9821	\N	1	\N
9822	faVrCardboard		\N	27	\N	9822	\N	1	\N
9823	faVuejs		\N	27	\N	9823	\N	1	\N
9824	faW		\N	27	\N	9824	\N	1	\N
9825	faWalkieTalkie		\N	27	\N	9825	\N	1	\N
9826	faWallet		\N	27	\N	9826	\N	1	\N
9827	faWandMagic		\N	27	\N	9827	\N	1	\N
9828	faWandMagicSparkles		\N	27	\N	9828	\N	1	\N
9829	faWandSparkles		\N	27	\N	9829	\N	1	\N
9830	faWarehouse		\N	27	\N	9830	\N	1	\N
9831	faWatchmanMonitoring		\N	27	\N	9831	\N	1	\N
9832	faWater		\N	27	\N	9832	\N	1	\N
9833	faWaterLadder		\N	27	\N	9833	\N	1	\N
9834	faWaveSquare		\N	27	\N	9834	\N	1	\N
9835	faWaze		\N	27	\N	9835	\N	1	\N
9836	faWebAwesome		\N	27	\N	9836	\N	1	\N
9837	faWebflow		\N	27	\N	9837	\N	1	\N
9838	faWeebly		\N	27	\N	9838	\N	1	\N
9839	faWeibo		\N	27	\N	9839	\N	1	\N
9840	faWeightHanging		\N	27	\N	9840	\N	1	\N
9841	faWeightScale		\N	27	\N	9841	\N	1	\N
9842	faWeixin		\N	27	\N	9842	\N	1	\N
9843	faWhatsapp		\N	27	\N	9843	\N	1	\N
9844	faWheatAwn		\N	27	\N	9844	\N	1	\N
9845	faWheatAwnCircleExclamation		\N	27	\N	9845	\N	1	\N
9846	faWheelchair		\N	27	\N	9846	\N	1	\N
9847	faWheelchairMove		\N	27	\N	9847	\N	1	\N
9848	faWhiskeyGlass		\N	27	\N	9848	\N	1	\N
9849	faWhmcs		\N	27	\N	9849	\N	1	\N
9850	faWifi		\N	27	\N	9850	\N	1	\N
9851	faWikipediaW		\N	27	\N	9851	\N	1	\N
9852	faWind		\N	27	\N	9852	\N	1	\N
9853	faWindowMaximize		\N	27	\N	9853	\N	1	\N
9854	faWindowMinimize		\N	27	\N	9854	\N	1	\N
9855	faWindowRestore		\N	27	\N	9855	\N	1	\N
9856	faWindows		\N	27	\N	9856	\N	1	\N
9857	faWineBottle		\N	27	\N	9857	\N	1	\N
9858	faWineGlass		\N	27	\N	9858	\N	1	\N
9859	faWineGlassEmpty		\N	27	\N	9859	\N	1	\N
9860	faWirsindhandwerk		\N	27	\N	9860	\N	1	\N
9861	faWix		\N	27	\N	9861	\N	1	\N
9862	faWizardsOfTheCoast		\N	27	\N	9862	\N	1	\N
9863	faWodu		\N	27	\N	9863	\N	1	\N
9864	faWolfPackBattalion		\N	27	\N	9864	\N	1	\N
9865	faWonSign		\N	27	\N	9865	\N	1	\N
9866	faWordpress		\N	27	\N	9866	\N	1	\N
9867	faWordpressSimple		\N	27	\N	9867	\N	1	\N
9868	faWorm		\N	27	\N	9868	\N	1	\N
9869	faWpbeginner		\N	27	\N	9869	\N	1	\N
9870	faWpexplorer		\N	27	\N	9870	\N	1	\N
9871	faWpforms		\N	27	\N	9871	\N	1	\N
9872	faWpressr		\N	27	\N	9872	\N	1	\N
9873	faWrench		\N	27	\N	9873	\N	1	\N
9874	faX		\N	27	\N	9874	\N	1	\N
9875	faXRay		\N	27	\N	9875	\N	1	\N
9877	faXbox		\N	27	\N	9877	\N	1	\N
9879	faXmark		\N	27	\N	9879	\N	1	\N
9880	faXmarksLines		\N	27	\N	9880	\N	1	\N
9881	faY		\N	27	\N	9881	\N	1	\N
9889	faYenSign		\N	27	\N	9889	\N	1	\N
9890	faYinYang		\N	27	\N	9890	\N	1	\N
9893	faZ		\N	27	\N	9893	\N	1	\N
100127	Natalicio de Simón Bolívar	24/07	5	100121	100121	\N	\N	0	\N
100331	Módulo 1: Introduction to Network		0	5	100147	8584	{"id": "CEP-CISCO-01", "costo": 100}	0	\N
100337	Menú de Estadística	No tiene la opción del menú de estadísticas 	0	73	\N	\N	\N	0	\N
100339	DO YOU AGGREGATE?: Descubriendo insights en NoSQL (de Collections/Validations, ...a Modelos Escalables)		0	5	100149	8488	{"id": "CEP-06", "costo": 30}	0	\N
100334	Primeros pasos con Office		0	5	100149	8660	{"id": "CEP-03", "costo": 20}	0	\N
100335	Manejo de Bases de Datos con PostgreSQL		0	5	100149	8488	{"id": "CEP-04", "costo": 20}	0	\N
100336	Nómina y Prestaciones Sociales		0	5	100149	9109	{"id": "CEP-05", "costo": 20}	0	\N
100154	Campo ORDEN (Clasificacion)	No tiene la opción agregar/modificar el orden\n	0	73	\N	\N	\N	0	\N
100141	Menú de Cursos	No tiene la opción del menú de cursos 	0	73	\N	\N	\N	0	\N
100164	Menú de PDF	No tiene la opción del menú del PDF	0	73	\N	\N	\N	0	\N
100066	Menú de Roles	No tiene la opción del menú de roles	0	73	\N	\N	\N	0	\N
100338	Comprobante de Pago		0	100094	\N	9111	\N	0	\N
15	Super Administrador		1	3	\N	9769	{"id_objeto": [100166, 100156, 100157, 100158, 100159, 100161, 100162, 100067, 100068, 100160, 100142, 100164, 100171, 100066, 100290, 100319, 100337, 100141], "id_clasificacion": [100172, 100173, 100174, 100178, 100179, 100181, 100234, 100300, 100301, 200, 110, 4, 122, 100050, 5, 123, 124, 27, 1, 73, 100190, 3, 100094, 100121, 100187, 100026, 100155, 8, 100059, 100311, 100315, 100310, 100317, 100318, 100327]}	0	\N
200	Institutos	Institutos asociados a Fe y Alegría 	10	\N	\N	9404	\N	0	\N
100332	DO YOU COMMIT?: Dominando el potencial DB (en Oracle XE, MySQL, MS SQL Server, …y PostgreSQL)		0	5	100149	8488	{"id": "CEP-02", "costo": 20}	0	\N
3	Roles	Roles del Sistema	110	\N	\N	9769	\N	0	\N
100149	Oficio Tecnológico Emergente		0	4	100152	8438	{"mask": "CEP-99"}	0	\N
100333	Módulo 2: Switching, Routing and Wireless Essentials (SRWE)		0	5	100147	8584	{"id": "CEP-CISCO-02", "costo": 100}	0	\N
73	Permisos de Objetos	Objetos de permisologia\n	90	\N	\N	9768	\N	0	\N
110	Carreras	Carreras de los Institutos	20	\N	\N	8782	\N	0	\N
5	Cursos	Cursos del CEP\n	40	\N	\N	9019	\N	0	\N
204	IUSF	Instituto Universitario San Francisco	40	200	200	8249	{"mask": "IUSF-999"}	0	\N
100147	Cisco Academy		0	4	100152	9381	{"mask": "CEP-CISCO-99"}	0	\N
100330	Curso Básico de Mantenimiento y Reparación de PC		0	5	100149	9078	{"id": "CEP-01", "costo": 20}	0	\N
\.


--
-- TOC entry 4858 (class 0 OID 108251)
-- Dependencies: 221
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id_curso, id_nombre, id_type, id_status, duracion, descripcion_corto, descripcion_html, costo, codigo, id_facilitador, id_foto, id_modalidad, fecha_hora_inicio, fecha_hora_fin, color, partipantes, codigo_cohorte, horarios, propiedades_curso, documentos) FROM stdin;
2	100330	\N	100060	20	Primera Cohorte 	\N	20	CEP-01	114	\N	100052	2025-03-08 08:00:00	2025-03-29 12:00:00	#4F46E5	[]	1-2025	\N	\N	\N
3	100334	\N	100060	\N		<p><strong>CONTENIDO:</strong></p>\n<p>Conociendo Word</p>\n<ul>\n<li>Introducción</li>\n<li>Ventana de Word</li>\n<li>Ayuda en Office</li>\n<li>Barra de herramientas</li>\n<li>Tareas básicas para manejar archivos</li>\n<li>Trabajar con Texto</li>\n<li>Ortografía y Gramática</li>\n<li>Formato y Estilo</li>\n<li>Tablas e Ilustraciones</li>\n<li>Opciones de Impresión</li>\n</ul>\n<p>Power Point</p>\n<ul>\n<li>Interfaz</li>\n<li>Barra de Herramientas</li>\n<li>Manejo de Imágenes</li>\n<li>Uso de texto y símbolos</li>\n<li>Audios y Videos</li>\n<li>Animaciones y Transiciones</li>\n<li>Presentaciones</li>\n<li>Formatos de Guardado</li>\n</ul>\n<p>Exel</p>\n<ul>\n<li>Interfaz</li>\n<li>Barra de Herramientas</li>\n<li>Tareas Básicas con Datos</li>\n<li>Formatos básicos y condicionales</li>\n<li>Fórmulas Básicas</li>\n<li>Gráficos</li>\n<li>Datos Distribuidos</li>\n<li>Listas y Tablas de Datos</li>\n<li>Macros</li>\n</ul>\n	20	CEP-03	115	\N	100052	2025-03-08 08:00:00	2025-03-29 12:00:00	#4F46E5	[]	1-2025	\N	\N	[44]
1	100331	\N	100060	70	Primera cohorte	<p><strong>CONTENIDO:</strong></p>\n<ul>\n<li>Configuración básica de switches</li>\n<li>Protocolos y modelos.</li>\n<li>Capa física</li>\n<li>Sistemas numéricos</li>\n<li>Capa de enlace de datos</li>\n<li>Switching Ethernet.</li>\n<li>Capa de red</li>\n<li>Resolución de dirección</li>\n<li>Configuración básica de un router.</li>\n<li>Asignación de direcciones IPv4.</li>\n<li>Asignación de direcciones IPv6</li>\n<li>ICMP</li>\n<li>Capa de transporte</li>\n<li>Capa de aplicación</li>\n<li>Fundamentos de seguridad en la red.</li>\n<li>Cree una red pequeña.</li>\n</ul>\n	100	CEP-CISCO-01	97	\N	100052	2025-03-08 08:00:00	2025-06-21 12:00:00	#2cbaa9	[]	1-2025	\N	\N	[34]
4	100339	\N	100060	37	Primera cohorte	<p><strong>CONTENIDO:</strong></p>\n<ul>\n<li><strong>Introducción a las Bases de Datos      NoSQL</strong></li>\n</ul>\n<p>o Diferencias/Propiedades ACID vs. BASE</p>\n<p>o Componentes/Operaciones SQL</p>\n<p>o ¿Transaccionalidad o no?</p>\n<ul>\n<li><strong>Fundamentos de MongoDB</strong></li>\n</ul>\n<p>o Documentos y Colecciones</p>\n<p>o CRUD básico &lt;Back&gt; (Crear, Leer, Actualizar, Eliminar)</p>\n<p>o Consultas simples y operadores</p>\n<ul>\n<li><strong>Consultas Avanzadas en MongoDB</strong></li>\n</ul>\n<p>o Índices y rendimiento Agregaciones y pipelines</p>\n<p>o Uso de Compass para consultas avanzadas</p>\n<ul>\n<li><strong>Modelado de Datos y Seguridad</strong></li>\n</ul>\n<p>o Herramientas avanzadas en Studio 3T</p>\n<p>o Automatización de tareas con Studio 3T</p>\n<p>o Integración con sistemas existentes</p>\n<ul>\n<li><strong>Studio 3T para Desarrolladores</strong></li>\n</ul>\n<p>o Entorno Node.js con DBs: Oracle, Microsoft, …otras</p>\n<p>o Conexión y operaciones desde Node.js</p>\n<p>o Aplicación ejemplo v1</p>\n<ul>\n<li><strong>Integración con Node.js</strong></li>\n</ul>\n<p>o Configuración del entorno Node.js con MongoDB</p>\n<p>o Conexión y operaciones CRUD desde Node.js</p>\n<p>o Ejemplo de aplicación</p>\n	30	CEP-06	108	\N	100053	2025-04-12 17:00:00	2025-05-03 01:00:00	#48e59c	[]	1-2025	\N	\N	[43]
\.


--
-- TOC entry 4860 (class 0 OID 108257)
-- Dependencies: 223
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos (id_documento, id_tipo, fecha_hora, nombre, descripcion, ext, tamano) FROM stdin;
22	100099	2025-06-19 05:15:27.53	Administrador	tarea	docx	1790700
23	100096	2025-06-19 05:21:07.845	chaconiana	xddd	pptx	88419
24	100102	2025-06-19 05:23:23.89	backup	del sistema nuestro y de la ia	jpg	7144
25	100101	2025-06-19 05:24:02.536	Super Administrador	ggjhg	pdf	850957
26	100100	2025-06-19 06:03:30.785	Nirvanita	musica	mp3	4635722
28	100095	2025-06-19 06:05:02.377	musica	de la buena	mp3	7242533
27	100096	2025-06-19 06:17:11.163	hol0	video de musica	jpg	3670271
29	100099	2025-06-20 03:55:50.429	backup	sadas	sql	209920
30	100102	2025-06-20 03:57:48.901	setup	xd	exe	126882312
32	100095	2025-06-20 04:28:32.016	musica de ia	xd xd xd\n\n	mp3	3718004
31	100099	2025-06-20 04:28:43.349	base de datos de tesis	base de datos de tesis	mp4	452096
33	100099	2025-06-21 06:18:43.87	sadas	asdas	pdf	490704
37	100101	2025-06-24 23:35:12.209	xdddd	hola	jpg	82763
38	100097	2025-06-25 15:18:50.834	pepwq	 xdd	csv	2300
40	100097	2025-06-25 15:56:39.437	xddd		pdf	921972
41	100099	2025-06-29 19:13:19.898	Supe	xd	jpg	184754
42	100338	2025-07-01 16:10:28.569	redes.jpg	Comprobante de pago para inscripción	jpg	175096
43	100102	2025-07-03 06:11:46.826	Imagen de Mongo DB		png	261080
44	100102	2025-07-03 06:12:14.762	Imagen de Office		jpg	55572
45	100102	2025-07-03 06:24:02.64	logo IUJO		png	10951
34	100102	2025-07-03 16:04:40.299	Portada de Cisco Modulo 1	Portada de Cisco Modulo 1	png	175096
\.


--
-- TOC entry 4862 (class 0 OID 108264)
-- Dependencies: 225
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (id_persona, nombre, apellido, telefono, contrasena, id_genero, id_pregunta, cedula, gmail, id_status, respuesta, id_rol, documentos) FROM stdin;
98	Victor	Gainza	04123426726	$2b$10$3reMAACjfCrBSi5MUnNOJubAyKoVPogo.keYJ96y5s2MNiS5KPbLO	6	9	20234123	superadmin@empresa.com	\N	$2b$10$zhsw9kAZbVtOfk40DbyIneyr6xahazAuKjuD86iIeQBAI8UVY4ylK	[15]	\N
99	Modesta	Gonzales	04142129875	$2b$10$Feaj0VK5MsFW9Bc2W67iVeQoXG8NTY7poc1d9AjNT6RRrtJEg0BZu	7	84	14123432	Modesta21@gmail.com	\N	$2b$10$M/XsUgsnPKLMhesgG3D9..g87p1Z9VFPy1Y0z6m7btKX9pdQ26BP.	[98]	\N
97	Yeferson	Moronta	04143173920	$2b$10$3EKu78bP0gn81KuKsUcw2eYlDRqVlwtDqNzziiOrrV.Bu4KbNhUeC	6	9	20212313	yeferson@gmail.com	\N	$2b$10$X4U3F18CncEi6vQSP7CYZ.CbQRtl5LsSMlNReFbPxyaXoCdL3nrXC	[96]	\N
108	David	Hernández	04141314402	$2b$10$76/C6acDC5eRhjHhLB30c.fkunux/RiWQ4LkzzaHGLiN4/f45Iur.	6	9	11212312	dshernandezq@gmail.com	\N	$2b$10$5LGHhWtT.OBYo.KgdDziqOXtDETPnotUB6JeGs1DeSht1GJEnXEwe	[96]	\N
102	Supervisor	General	02123124321	$2b$10$hgUjZ0LbXB8DhPVbhRff4.oX.oNs/mCTShBHHLfxW85cgf48xGUxu	6	100140	98989898	testing98989898@gmail.com	\N	$2b$10$m50MTt.8JKr1.U9T.qrDAOFacipnbToGCCUd3xtdAHXqfYvDajmAu	[]	\N
107	Alexis	Ramírez                 	04161344554	$2b$10$yFqsSXzAk8bZ8HpZl7G2kOtHKwDeHjwCOs8.FlAsln00wDQDsORai	6	84	6722311	alexisramirez@gmail.com	\N	$2b$10$t9XJx2DDyfsXSBpCnrNLYeuzh/UXXEGKp74nvSywCc/G//nZwvNt2	[96]	\N
113	Isaac	Cattoni	04143173929	$2b$10$HpQqNNAu/R9dJ3Kswx5Mk.gduCg8CJxym0AhQAICkJix4xrT6qgni	6	9	30551898	isaacattonibarca10@gmail.com	\N	$2b$10$bykw/8MtduioeiWBWysVB./SaFseXvPb4FCX51AK2tO8j7JDD8J1O	[12]	\N
114	Arnaldo	Barrios	04141231232	$2b$10$LGVFXPOLZyDdb8G/bTpL7..DHIRZH1GZyN6AZRpf1Zzq5ybxyZPLu	6	9	14565212	arnaldo.barrios@gmail.com	\N	$2b$10$g7DfKddP3aGpMKsLR3iEwuT68sQJJkFhC/IFORxWuOfVAgIF0bV2S	[96]	\N
115	Fernando	 Mozo	04121231232	$2b$10$E3kWo.P.ZP.R3bffmiSJc.I8U2UK7m30q3X2qUELbwd/JvStkW/gK	6	84	20121212	fernado.mozo@gmail.com	\N	$2b$10$dVvDLCdBqslAhUjjJus7Se9G0TFpJGeCvzefetAT27TS8q2rVD3ay	[96]	\N
116	Manuel	Gil	04161242436	$2b$10$ioaC4mIUHa9Ov2MLS0.oiOP2TI9t3J3hrv78ca.cabWW5W586WeWm	6	84	17341321	manuel.gil@gmail.com	\N	$2b$10$WONTQ2IBHIArZ.VaXWgeb.xlFeZy6ENolgw8l8142kIKXv8H.i8uO	[96]	\N
\.


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 218
-- Name: auditorias_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditorias_id_auditoria_seq', 1, false);


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 220
-- Name: clasificacion_id_clasificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clasificacion_id_clasificacion_seq', 100383, true);


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 222
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 4, true);


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 224
-- Name: documentos_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_id_documento_seq', 45, true);


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 226
-- Name: personas_id_persona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personas_id_persona_seq', 116, true);


--
-- TOC entry 4677 (class 2606 OID 108276)
-- Name: auditorias auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_pkey PRIMARY KEY (id_auditoria);


--
-- TOC entry 4679 (class 2606 OID 108278)
-- Name: clasificacion clasificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_pkey PRIMARY KEY (id_clasificacion);


--
-- TOC entry 4681 (class 2606 OID 108280)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- TOC entry 4683 (class 2606 OID 108282)
-- Name: documentos documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id_documento);


--
-- TOC entry 4685 (class 2606 OID 108284)
-- Name: personas personas_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_cedula_key UNIQUE (cedula);


--
-- TOC entry 4687 (class 2606 OID 108286)
-- Name: personas personas_gmail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_gmail_key UNIQUE (gmail);


--
-- TOC entry 4689 (class 2606 OID 108288)
-- Name: personas personas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 4705 (class 2620 OID 108289)
-- Name: clasificacion trg_proteger_clasificacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_proteger_clasificacion BEFORE INSERT OR DELETE OR UPDATE ON public.clasificacion FOR EACH ROW EXECUTE FUNCTION public.proteger_data_clasificacion();


--
-- TOC entry 4706 (class 2620 OID 108290)
-- Name: clasificacion trg_validar_clasificacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_clasificacion BEFORE INSERT OR UPDATE ON public.clasificacion FOR EACH ROW EXECUTE FUNCTION public.validar_clasificacion();

ALTER TABLE public.clasificacion DISABLE TRIGGER trg_validar_clasificacion;


--
-- TOC entry 4708 (class 2620 OID 108291)
-- Name: cursos trg_validar_codigo_cohorte; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_codigo_cohorte BEFORE INSERT OR UPDATE ON public.cursos FOR EACH ROW EXECUTE FUNCTION public.validar_codigo_cohorte();


--
-- TOC entry 4707 (class 2620 OID 108380)
-- Name: clasificacion trg_validar_codigo_curso; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_codigo_curso BEFORE INSERT OR UPDATE ON public.clasificacion FOR EACH ROW EXECUTE FUNCTION public.validar_codigo_curso();


--
-- TOC entry 4690 (class 2606 OID 108292)
-- Name: auditorias auditorias_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4691 (class 2606 OID 108297)
-- Name: auditorias auditorias_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4692 (class 2606 OID 108302)
-- Name: clasificacion clasificacion_id_icono_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_id_icono_fkey FOREIGN KEY (id_icono) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4693 (class 2606 OID 108307)
-- Name: clasificacion clasificacion_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4694 (class 2606 OID 108312)
-- Name: clasificacion clasificacion_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificacion
    ADD CONSTRAINT clasificacion_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4695 (class 2606 OID 108317)
-- Name: cursos cursos_id_facilitador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_facilitador_fkey FOREIGN KEY (id_facilitador) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4696 (class 2606 OID 108322)
-- Name: cursos cursos_id_foto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_foto_fkey FOREIGN KEY (id_foto) REFERENCES public.documentos(id_documento) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4697 (class 2606 OID 108327)
-- Name: cursos cursos_id_modalidad_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_modalidad_fkey1 FOREIGN KEY (id_modalidad) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4698 (class 2606 OID 108332)
-- Name: cursos cursos_id_nombre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_nombre_fkey FOREIGN KEY (id_nombre) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4699 (class 2606 OID 108337)
-- Name: cursos cursos_id_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4700 (class 2606 OID 108342)
-- Name: cursos cursos_id_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_type_fkey FOREIGN KEY (id_type) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4701 (class 2606 OID 108347)
-- Name: documentos documentos_id_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_id_tipo_fkey FOREIGN KEY (id_tipo) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4702 (class 2606 OID 108352)
-- Name: personas personas_id_genero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_genero_fkey FOREIGN KEY (id_genero) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4703 (class 2606 OID 108357)
-- Name: personas personas_id_pregunta_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_pregunta_fkey1 FOREIGN KEY (id_pregunta) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4704 (class 2606 OID 108362)
-- Name: personas personas_id_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.clasificacion(id_clasificacion) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2025-07-03 12:14:30

--
-- PostgreSQL database dump complete
--

