# README del Proyecto

## Manual de Usuario

### Inicio de Sesión
1. Navega a la página de inicio de sesión (`/sign-in`).
2. Ingresa tu DNI y contraseña.
3. Haz clic en "Iniciar Sesión" para acceder a la aplicación.
4. Si no tienes sesión, serás redirigido automáticamente a esta página.

### Página Principal (Inicio)
- Después de iniciar sesión, llegarás a la página principal.
- Desde aquí, puedes acceder a las secciones: Perfil, Nueva Capacitación, Historial de Capacitaciones.
- Usa la navegación para moverte entre las diferentes áreas de la aplicación.

### Perfil
- En la sección de perfil, puedes ver tus datos personales.
- Para directores: Puedes editar nombre, apellido, teléfono y email. El DNI y el dominio del instituto son de solo lectura.
- Para referentes técnicos: Los datos son de solo lectura (funcionalidad en desarrollo).
- Al actualizar, se enviará la información al backend y se mostrará una notificación de éxito.

### Nueva Capacitación
- Accede a la página de nueva capacitación para crear una nueva sesión.
- Llena el formulario con los detalles requeridos.
- Envía el formulario para registrar la capacitación.

### Historial de Capacitaciones
- Ve el historial de capacitaciones realizadas.
- Aquí puedes revisar sesiones pasadas y sus detalles.

## Módulos

### Autenticación
Maneja la autenticación de usuarios, incluyendo la funcionalidad de inicio de sesión y gestión de sesiones.

### Inicio
Sirve como el panel principal o página de inicio, proporcionando navegación y acceso a varias funciones como perfil, capacitaciones y creación de nuevas capacitaciones.

### Solictar una visita
Permite a los usuarios crear nuevas sesiones de capacitación, incluyendo envío de formularios e integración con el backend.

###  Historial de Visitas
Gestiona el historial de sesiones de capacitación, permitiendo a los usuarios ver capacitaciones pasadas.

### Perfil

**Perfil de Director**
```mermaid
sequenceDiagram
    participant Usuario
    participant Página as perfil-director/page.tsx
    participant Vista as PerfilDirectorView
    participant TRPC as Cliente TRPC
    participant Proc as procedures.ts (perfilRouter)
    participant Backend

    %% Carga Inicial Comenzando desde la Página
    Usuario->>Página: Navegar a la página
    Página->>Página: getSession()
    alt Sin sesión
        Página->>Usuario: redirigir("/sign-in")
    else Con sesión
        Página->>TRPC: prefetchQuery(getDirector)
        TRPC->>Proc: getDirector.query()
        Proc->>Backend: GET /api/directors/{dni}
        Backend-->>Proc: Datos del director
        Proc-->>TRPC: Datos del director analizados
        TRPC-->>Página: Estado deshidratado

        Página->>Vista: Renderizar con HydrationBoundary & Suspense
        Vista->>TRPC: useSuspenseQuery(getDirector)
        TRPC-->>Vista: Datos hidratados
    end

    %% Flujo de Actualización
    Usuario->>Vista: Enviar formulario
    Vista->>TRPC: mutate(update)
    TRPC->>Proc: update.mutation(input)
    Proc->>Backend: PUT /api/directors/{dni}
    Backend-->>Proc: Datos del director actualizados
    Proc-->>TRPC: Datos actualizados analizados
    TRPC-->>Vista: onSuccess (invalidar consultas, mostrar toast, router.refresh)
```

**Perfil de Referente**
```mermaid
sequenceDiagram
    participant Usuario
    participant Página as perfil-referente/page.tsx
    participant Vista as PerfilDirectorView
    participant TRPC as Cliente TRPC
    participant Proc as procedures.ts (perfilRouter)
    participant Backend

    %% Carga Inicial Comenzando desde la Página
    Usuario->>Página: Navegar a la página
    Página->>Página: getSession()
    alt Sin sesión
        Página->>Usuario: redirigir("/sign-in")
    else Con sesión
        Página->>TRPC: prefetchQuery(getTechnitian)
        TRPC->>Proc: getDirector.query()
        Proc->>Backend: GET /api/tecnitian/{cuit}
        Backend-->>Proc: Datos del Referente
        Proc-->>TRPC: Datos del referente analizados
        TRPC-->>Página: Estado deshidratado

        Página->>Vista: Renderizar con HydrationBoundary & Suspense
        Vista->>TRPC: useSuspenseQuery(getTechnitian)
        TRPC-->>Vista: Datos hidratados
    end
```

