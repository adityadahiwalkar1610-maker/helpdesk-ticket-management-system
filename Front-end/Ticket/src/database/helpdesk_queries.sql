
-- 1. Display all tickets
SELECT * FROM tickets;

-- 2. Find OPEN tickets
SELECT * FROM tickets
WHERE status = 'OPEN';

-- 3. Find HIGH priority tickets
SELECT * FROM tickets
WHERE priority = 'HIGH';

-- 4. Count tickets by status
SELECT status, COUNT(*) AS total_tickets
FROM tickets
GROUP BY status;

-- 5. Count tickets by priority
SELECT priority, COUNT(*) AS total_tickets
FROM tickets
GROUP BY priority;

-- 6. Display users and their tickets
SELECT u.id, u.name, u.email,
       t.id AS ticket_id, t.title, t.status, t.priority
FROM users u
INNER JOIN tickets t ON u.id = t.user_id;

-- 7. Find OPEN tickets for a particular user
SELECT * FROM tickets
WHERE user_id = 1 AND status = 'OPEN'; //user_id = { Their id }

-- 8. Update ticket status
UPDATE tickets
SET status = 'IN_PROGRESS',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
