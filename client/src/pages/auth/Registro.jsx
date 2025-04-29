import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { register } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { registroSchema } from "../../schemas/registro.shema";



export default function Registro() {
  const { generos, roles, preguntas, fetchOpcionesRegistro } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpcionesRegistro();
  }, []);

  // Validación con Zod
  const validateWithZod = (values) => {
    try {
      registroSchema.parse(values);
      return {};
    } catch (error) {
      const formErrors = {};
      error.errors.forEach((err) => {
        formErrors[err.path[0]] = err.message;
      });
      return formErrors;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      
      <div className="w-1/2 h-full bg-gradient-to-br from-blue-900 to-blue-600 flex justify-center items-center p-10">
        <div className="text-white text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight drop-shadow-md">
            Coordinación de Extensión Profesional
          </h1>
          <p className="text-lg">
            Fomentamos la formación continua mediante cursos, talleres y diplomados que potencian tu desarrollo profesional.
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-all"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>

      {/* Formulario */}
      <div className="w-1/2 h-full flex justify-center items-center bg-gray-50 p-6">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold text-center mb-6">Registro</h1>
          <Formik
            initialValues={{
              nombre: "",
              apellido: "",
              telefono: "",
              cedula: "",
              gmail: "",
              id_genero: "",
              id_rol: "",
              id_pregunta: "",
              respuesta: "",
              contraseña: "",
            }}
            validate={validateWithZod}
            onSubmit={async (values, { resetForm }) => {
              setLoading(true);
              try {
                await register(values);
                toast.success("Usuario registrado correctamente");
                resetForm();
                navigate("/login");
              } catch (error) {
                const msg = error.response?.data?.error || "Error al registrar";
                toast.error(msg);
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <Field name="nombre" placeholder="Nombre" className="w-full p-2 border rounded" />
                <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm" />

                <Field name="apellido" placeholder="Apellido" className="w-full p-2 border rounded" />
                <ErrorMessage name="apellido" component="div" className="text-red-500 text-sm" />

                <Field name="telefono" placeholder="Teléfono" className="w-full p-2 border rounded" />
                <ErrorMessage name="telefono" component="div" className="text-red-500 text-sm" />

                <Field name="cedula" placeholder="Cédula" className="w-full p-2 border rounded" />
                <ErrorMessage name="cedula" component="div" className="text-red-500 text-sm" />

                <Field name="gmail" type="email" placeholder="Correo electrónico" className="w-full p-2 border rounded" />
                <ErrorMessage name="gmail" component="div" className="text-red-500 text-sm" />

                <Field as="select" name="id_genero" className="w-full p-2 border rounded">
                  <option value="">Selecciona un género</option>
                  {generos.map((g) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </Field>
                <ErrorMessage name="id_genero" component="div" className="text-red-500 text-sm" />

                <Field as="select" name="id_rol" className="w-full p-2 border rounded">
                  <option value="">Selecciona un tipo de participante</option>
                  {roles.filter((r) => [12, 13, 14].includes(r.id)).map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </Field>
                <ErrorMessage name="id_rol" component="div" className="text-red-500 text-sm" />

                <Field as="select" name="id_pregunta" className="w-full p-2 border rounded">
                  <option value="">Selecciona una pregunta</option>
                  {preguntas.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </Field>
                <ErrorMessage name="id_pregunta" component="div" className="text-red-500 text-sm" />

                <Field name="respuesta" placeholder="Respuesta secreta" className="w-full p-2 border rounded" />
                <ErrorMessage name="respuesta" component="div" className="text-red-500 text-sm" />

                <Field type="password" name="contraseña" placeholder="Contraseña" className="w-full p-2 border rounded" />
                <ErrorMessage name="contraseña" component="div" className="text-red-500 text-sm" />

                <button type="submit" disabled={isSubmitting || loading} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
                  {loading ? "Registrando..." : "Registrarse"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
