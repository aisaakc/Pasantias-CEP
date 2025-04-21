
const bcrypt = require('bcryptjs');

const saltRounds = 10; 

exports.seed = async function(knex) {

  const superAdminEmail = 'superadmin@empresa.com'; 
  const superAdminCedula = '1234567890';

  const passwordClara = '123456'; 
  const respuestaClara = 'MiAnimalFavorito'; 

  const superAdminData = {
    nombre: 'Victor', 
    apellido: 'Gainza', 
    telefono: '1234567890', 
    
    id_genero: 5, 
    id_rol: 7,    
    id_pregunta: 17, 

    cedula: superAdminCedula,
    gmail: superAdminEmail,
    id_foto: null, 
    id_status: null, 
  };
  
  console.log(`[SuperAdmin Seed] Verificando si el usuario Super Admin ('${superAdminEmail}' o '${superAdminCedula}') ya existe...`);
  const existingAdmin = await knex('public.personas') 
    .where('gmail', superAdminEmail)
    .orWhere('cedula', superAdminCedula)
    .first(); 

  if (existingAdmin) {
    console.log(`[SuperAdmin Seed] El usuario Super Admin con email ${superAdminEmail} o cédula ${superAdminCedula} ya existe (ID: ${existingAdmin.id_persona}).`);
    console.log('[SuperAdmin Seed] === Omitiendo la siembra de un nuevo Super Admin ===');
    return; 
  }

  console.log(`[SuperAdmin Seed] Usuario Super Admin no encontrado. Procediendo a hashear e insertar...`);
  try {
    
    console.log("[SuperAdmin Seed] Hashing de contraseña y respuesta...");
   
    const hashedPassword = await bcrypt.hash(passwordClara, saltRounds);
    const hashedRespuesta = await bcrypt.hash(respuestaClara, saltRounds);
    console.log("[SuperAdmin Seed] Hashing completado.");

    superAdminData["contraseña"] = hashedPassword;
    superAdminData.respuesta = hashedRespuesta;

    const insertedRows = await knex('public.personas')
      .insert(superAdminData)
      .returning('id_persona'); 

    console.log(`[SuperAdmin Seed] ✔️ Usuario Super Admin sembrado (seeded) exitosamente.`);
    console.log(`[SuperAdmin Seed] Nuevo usuario Super Admin ID: ${insertedRows[0].id_persona}`); 
    console.log('[SuperAdmin Seed] === Siembra del Super Admin completada ===');

  } catch (error) {
    console.error('[SuperAdmin Seed] ❌ ¡ERROR FATAL al sembrar (seed) el usuario Super Admin!', error);
    console.error('[SuperAdmin Seed] === Siembra del Super Admin fallida ===');
  }
};