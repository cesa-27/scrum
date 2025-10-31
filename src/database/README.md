# 🗄️ Database Setup Guide

Esta guía te ayudará a conectar tu aplicación a Supabase y poblar la base de datos con datos iniciales.

## 📋 Requisitos Previos

1. Una cuenta de Supabase (gratis en [supabase.com](https://supabase.com))
2. Un proyecto creado en Supabase

## 🚀 Pasos para Conectar a Supabase

### 1. Crear el Proyecto en Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Espera a que el proyecto esté completamente inicializado (~2 minutos)

### 2. Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Abre el archivo `/database/schema.sql` de este proyecto
3. Copia todo el contenido
4. Pega el contenido en el SQL Editor de Supabase
5. Haz clic en **Run** para ejecutar el script

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Índices para mejor rendimiento
- ✅ Políticas de seguridad (RLS)
- ✅ Funciones y triggers automáticos

### 3. Poblar Datos Iniciales

Después de crear las tablas, necesitas insertar los datos iniciales (lecciones, quizzes, juegos, casos, recursos).

**Opción A: Usar el SQL Editor (Recomendado)**

Ejecuta el archivo `/database/seed.sql` en el SQL Editor:

```sql
-- Este archivo contendrá los INSERTs para poblar las tablas
-- con los datos de /constants/seeds.ts
```

**Opción B: Usar la aplicación**

Los servicios ya están configurados para usar los datos de `/constants/seeds.ts` como fallback, por lo que funcionará inmediatamente mientras migras los datos a Supabase.

### 4. Configurar Variables de Entorno

1. En Supabase, ve a **Settings > API**
2. Copia las siguientes credenciales:
   - **Project URL** (URL de tu proyecto)
   - **Anon/Public Key** (Clave pública)

3. Créa un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_project_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

4. Reinicia el servidor de desarrollo

### 5. Verificar la Conexión

Una vez configuradas las variables de entorno:

1. Abre la aplicación
2. Regístrate con un nuevo usuario
3. Deberías ver tu progreso guardándose en Supabase
4. En Supabase, ve a **Table Editor** y verifica que los datos se estén guardando

## 📊 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `user_profiles` | Información extendida del perfil del usuario |
| `user_progress` | Progreso general, puntos, medallas, racha |
| `lessons` | Contenido de todas las lecciones |
| `user_lessons` | Lecciones completadas por cada usuario |
| `quizzes` | Metadata de los quizzes |
| `quiz_questions` | Preguntas de cada quiz |
| `user_quiz_attempts` | Intentos de quizzes por usuario |
| `drag_drop_games` | Juegos de arrastrar y soltar |
| `user_game_scores` | Puntajes de juegos |
| `case_simulations` | Casos del simulador |
| `user_case_attempts` | Intentos de casos |
| `achievements` | Logros disponibles |
| `user_achievements` | Logros desbloqueados |
| `resources` | Biblioteca de recursos |
| `activity_logs` | Feed de actividad del usuario |

### Relaciones

```
auth.users (Supabase Auth)
    ├── user_profiles (1:1)
    ├── user_progress (1:1)
    ├── user_lessons (1:N)
    ├── user_quiz_attempts (1:N)
    ├── user_game_scores (1:N)
    ├── user_case_attempts (1:N)
    ├── user_achievements (1:N)
    └── activity_logs (1:N)

lessons (N:N) ← user_lessons → auth.users
quizzes (N:N) ← user_quiz_attempts → auth.users
drag_drop_games (N:N) ← user_game_scores → auth.users
case_simulations (N:N) ← user_case_attempts → auth.users
achievements (N:N) ← user_achievements → auth.users
```

## 🔒 Seguridad

### Row Level Security (RLS)

Todas las tablas de usuario tienen RLS habilitado. Los usuarios solo pueden:
- ✅ Ver sus propios datos
- ✅ Crear registros asociados a su usuario
- ✅ Actualizar sus propios datos
- ❌ NO pueden ver datos de otros usuarios

Las tablas de contenido (lessons, quizzes, games, etc.) son de solo lectura para usuarios autenticados.

## 📈 Consultas Útiles

### Ver progreso de un usuario
```sql
SELECT * FROM user_progress 
WHERE user_id = 'user_uuid_here';
```

### Ver lecciones completadas
```sql
SELECT l.title, ul.completed_at
FROM user_lessons ul
JOIN lessons l ON ul.lesson_id = l.id
WHERE ul.user_id = 'user_uuid_here'
  AND ul.completed = true
ORDER BY ul.completed_at DESC;
```

### Ver mejores puntajes de quizzes
```sql
SELECT q.title, MAX(uqa.score) as best_score
FROM user_quiz_attempts uqa
JOIN quizzes q ON uqa.quiz_id = q.id
WHERE uqa.user_id = 'user_uuid_here'
GROUP BY q.id, q.title
ORDER BY best_score DESC;
```

### Ver actividad reciente
```sql
SELECT * FROM activity_logs
WHERE user_id = 'user_uuid_here'
ORDER BY created_at DESC
LIMIT 10;
```

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado completamente el schema.sql
- Verifica que todas las tablas se crearon en el Table Editor

### Error: "permission denied"
- Verifica que las políticas RLS estén creadas correctamente
- Asegúrate de estar autenticado

### Los datos no se guardan
- Verifica las variables de entorno (.env.local)
- Comprueba la consola del navegador para errores
- Revisa los logs de Supabase en la sección Logs

### Modo Desarrollo (Sin Supabase)
La aplicación funciona perfectamente SIN Supabase usando:
- localStorage para persistencia
- Datos seed de `/constants/seeds.ts`
- Autenticación mock

## 🔄 Migración de localStorage a Supabase

Si ya tienes datos en localStorage y quieres migrarlos:

1. Los datos en localStorage seguirán funcionando
2. Al conectar Supabase, puedes:
   - Empezar desde cero (recomendado)
   - O mantener localStorage como backup temporal

## 🆘 Soporte

Si encuentras problemas:
1. Revisa la documentación de Supabase: https://supabase.com/docs
2. Revisa los logs en Supabase Dashboard
3. Verifica la consola del navegador para errores JavaScript

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Cliente JavaScript](https://supabase.com/docs/reference/javascript/introduction)
