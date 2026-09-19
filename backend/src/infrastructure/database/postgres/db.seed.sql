-- =====================================================================
-- Datos Semilla (db.seed.sql) - AI Ticket Workspace
-- Genera datos iniciales para la presentación demo
-- =====================================================================

INSERT INTO tickets (customer_name, request_text, attachment_url, category, priority, summary, status, owner, created_at, updated_at)
VALUES
(
    'Bancolombia Corporativo',
    'Requerimos con urgencia la conciliación bancaria del cierre contable Q3. Existen discrepancias en las transferencias ACH por un valor de $45,000 USD.',
    'https://drive.google.com/file/d/demo_conciliacion_q3/view',
    'Finance',
    'High',
    'Discrepancia contable de $45,000 USD en conciliación ACH para cierre Q3.',
    'open',
    'Carlos Mendoza',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    'TechSolutions Global',
    'Necesitamos revisión y firma de adenda al acuerdo de confidencialidad (NDA) y cláusulas de propiedad intelectual con el nuevo proveedor de nube antes del viernes.',
    'https://drive.google.com/file/d/demo_nda_cloud/view',
    'Legal',
    'Medium',
    'Revisión legal de adenda NDA y cesión de propiedad intelectual.',
    'in_progress',
    'Dra. Marcela Rivas',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '4 hours'
),
(
    'Logística Andina S.A.',
    'Solicitud de orden de compra para adquisición de 15 estaciones de trabajo ThinkPad y licencias empresariales para el equipo de desarrollo.',
    NULL,
    'Procurement',
    'Low',
    'Adquisición de 15 equipos ThinkPad y licencias de software.',
    'open',
    NULL,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours'
),
(
    'FinTech Innovators',
    'El clúster de Kubernetes en US-East-1 presenta latencia intermitente superior a 1500ms en el gateway de pagos tras el despliegue v2.4.',
    'https://drive.google.com/file/d/demo_k8s_logs/view',
    'Operations',
    'High',
    'Alta latencia en gateway de pagos sobre clúster Kubernetes US-East-1.',
    'in_progress',
    'Esteban Ruiz',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '1 hour'
);

-- Comentarios de prueba
INSERT INTO comments (ticket_id, author, content, created_at)
VALUES
(1, 'Carlos Mendoza', 'He solicitado el extracto detallado al área de tesorería para validar las transacciones.', NOW() - INTERVAL '1 day'),
(2, 'Dra. Marcela Rivas', 'Revisadas las cláusulas 4 y 8. Pendiente visto bueno de la gerencia legal.', NOW() - INTERVAL '3 hours'),
(4, 'Esteban Ruiz', 'Se escaló el número de réplicas en los pods de pago. Monitoreando métricas en Datadog.', NOW() - INTERVAL '30 minutes');

-- Registros de auditoría iniciales
INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address, created_at)
VALUES
('sysadmin', 'CREATE', 'TICKET', 1, '{"customer": "Bancolombia Corporativo", "category": "Finance"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '2 days'),
('sysadmin', 'CREATE', 'TICKET', 2, '{"customer": "TechSolutions Global", "category": "Legal"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '1 day'),
('carlos.mendoza', 'UPDATE', 'TICKET', 1, '{"status": "open", "owner": "Carlos Mendoza"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '1 day'),
('esteban.ruiz', 'UPDATE', 'TICKET', 4, '{"status": "in_progress", "owner": "Esteban Ruiz"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '1 hour');
