-- =====================================================================
-- Base de Datos: tickets (AI Ticket Workspace)
-- Arquitectura: PostgreSQL Nativo sin ORM (Prepared Statements)
-- Cumplimiento: OWASP, DBA Performance, Audit Trail
-- =====================================================================

-- 1. Tabla de Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    request_text TEXT NOT NULL,
    attachment_url TEXT,
    category VARCHAR(100),
    priority VARCHAR(50) DEFAULT 'Medium',
    summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    owner VARCHAR(255),
    ai_raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Comentarios
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL DEFAULT 'Agente de Soporte',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Auditoría Inmutable (Requisito Obligatorio Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'system',
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, AI_CLASSIFY
    resource VARCHAR(100) NOT NULL, -- TICKET, COMMENT
    resource_id INTEGER,
    details JSONB,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Índices para optimización de consultas frecuentes (DBA Best Practice)
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
