
const bcrypt = require('bcryptjs');

const UserModel = require('../models/persona.js'); 

// Definimos el número de rondas para el hashing de bcrypt.
const saltRounds = 10;

exports.seed = async function(knex) {

    const superAdminEmail = 'superadmin@empresa.com';
    const superAdminCedula = '1234567890';
    const passwordClara = '123456'; 
    const respuestaClara = 'MiAnimalFavorito'; 
    
    async function findClassificationItemId(knex, categoryName, itemName) {
        console.log(`[SuperAdmin Seed Helper] Buscando item "${itemName}" en categoría "${categoryName}"...`);
        try {
           
            const category = await knex('public.clasificacion')
                .select('id_clasificacion')
                .where('nombre', categoryName)
                .first();

            if (!category) {
                throw new Error(`Categoría de clasificación "${categoryName}" no encontrada. Asegúrate de que la semilla de clasificaciones se ejecute primero.`);
            }

            const categoryId = category.id_clasificacion;
            console.log(`[SuperAdmin Seed Helper] Categoría "${categoryName}" encontrada con ID: ${categoryId}`);

            const item = await knex('public.clasificacion')
                .select('id_clasificacion')
                .where('nombre', itemName)
                .andWhere(function() {
                    this.where('type_id', categoryId)
                        .orWhere('parent_id', categoryId);
                })
                .first();

            if (!item) {
                throw new Error(`Item de clasificación "${itemName}" no encontrado dentro de la categoría "${categoryName}". Asegúrate de que exista y esté relacionado correctamente.`);
            }

            console.log(`[SuperAdmin Seed Helper] Item "${itemName}" encontrado con ID: ${item.id_clasificacion}`);
            return item.id_clasificacion; 

        } catch (error) {
            console.error(`[SuperAdmin Seed Helper] ❌ Error buscando ID de clasificación "${itemName}" en "${categoryName}": ${error.message}`);
            throw error; 
        }
    }
  
    console.log(`[SuperAdmin Seed] Verificando si el usuario Super Admin ('${superAdminEmail}' o '${superAdminCedula}') ya existe...`);
    try {
        const existingAdmin = await knex('public.personas')
            .where('gmail', superAdminEmail)
            .orWhere('cedula', superAdminCedula)
            .first();

        if (existingAdmin) {
            console.log(`[SuperAdmin Seed] ✅ El usuario Super Admin con email ${superAdminEmail} o cédula ${superAdminCedula} ya existe (ID: ${existingAdmin.id_persona}).`);
            console.log('[SuperAdmin Seed] === Omitiendo la siembra de un nuevo Super Admin ===');
            return; 
        }

        console.log(`[SuperAdmin Seed] Usuario Super Admin no encontrado. Procediendo a obtener IDs y sembrar...`);

        console.log("[SuperAdmin Seed] Obteniendo IDs de clasificación dinámicamente...");
        let genderId, roleId, questionId;
        try {
    
            genderId = await findClassificationItemId(knex, 'Genero', 'Masculino');
            roleId = await findClassificationItemId(knex, 'Rol', 'Super Administrador');
            questionId = await findClassificationItemId(knex, 'Pregunta', 'Cual es tu Animal favorito?'); // Nombre exacto de la pregunta

            console.log(`[SuperAdmin Seed] IDs obtenidos: Genero=${genderId}, Rol=${roleId}, Pregunta=${questionId}`);
            console.log("[SuperAdmin Seed] IDs de clasificación obtenidos correctamente.");

        } catch (error) {
            console.error("[SuperAdmin Seed] ❌ Error al obtener IDs de clasificación necesarios:", error.message);
            console.error('[SuperAdmin Seed] Asegúrate de que las categorías ("Genero", "Rol", "Pregunta") y los ítems ("Masculino", "Super Administrador", "Cual es tu Animal favorito?") existan en la tabla clasificacion y estén relacionados correctamente (type_id o parent_id).');
            console.error('[SuperAdmin Seed] === Siembra del Super Admin fallida debido a IDs de clasificación faltantes ===');
            return; // Salir si no se pueden obtener los IDs
        }
      
        const superAdminData = {
            nombre: 'Victor',
            apellido: 'Gainza',
            telefono: '1234567890',
            // Usamos los IDs obtenidos dinámicamente
            id_genero: genderId,
            id_rol: roleId,
            id_pregunta: questionId,
            cedula: superAdminCedula,
            gmail: superAdminEmail,
            id_foto: null, 
            id_status: null, // Considera buscar un ID por defecto para el estado 'Activo' si aplica
        };
      
        console.log(`[SuperAdmin Seed] Hasheando contraseña y respuesta...`);
        const hashedPassword = await bcrypt.hash(passwordClara, saltRounds);
        const hashedRespuesta = await bcrypt.hash(respuestaClara, saltRounds);
        console.log("[SuperAdmin Seed] Hashing completado.");

        superAdminData["contraseña"] = hashedPassword;
        superAdminData.respuesta = hashedRespuesta;

        console.log(`[SuperAdmin Seed] Insertando usuario Super Admin en la tabla 'public.personas'...`);
        const insertedRows = await knex('public.personas')
            .insert(superAdminData)
            .returning('id_persona');

        console.log(`[SuperAdmin Seed] ✔️ Usuario Super Admin sembrado (seeded) exitosamente.`);
        if (insertedRows && insertedRows.length > 0 && insertedRows[0].id_persona) {
             console.log(`[SuperAdmin Seed] Nuevo usuario Super Admin ID: ${insertedRows[0].id_persona}`);
        } else {
             console.log(`[SuperAdmin Seed] Usuario Super Admin sembrado, pero no se pudo obtener el ID del registro devuelto.`);
        }
        console.log('[SuperAdmin Seed] === Siembra del Super Admin completada ===');

    } catch (error) {
        // --- Manejo de Errores ---
        console.error('[SuperAdmin Seed] ❌ ¡ERROR FATAL al sembrar (seed) el usuario Super Admin!', error);

         if (error.code === '23505') {
             console.error('[SuperAdmin Seed] Detalle: Violación de restricción única (cédula o gmail duplicado).');
         } else if (error.code === '23503') {
              console.error('[SuperAdmin Seed] Detalle: Error de llave foránea. Asegúrate de que los IDs de clasificación obtenidos existan.');
         } else {
             console.error(`[SuperAdmin Seed] Detalle del error: ${error.message}`);
         }

        console.error('[SuperAdmin Seed] === Siembra del Super Admin fallida ===');
    }
};