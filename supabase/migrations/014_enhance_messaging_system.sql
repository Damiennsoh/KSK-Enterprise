-- ============================================================
-- Enhanced Messaging System
-- ============================================================

-- Update inquiries table to support enhanced messaging
ALTER TABLE inquiries 
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Update type check to include more inquiry types
ALTER TABLE inquiries 
  DROP CONSTRAINT IF EXISTS inquiries_type_check;

ALTER TABLE inquiries 
  ADD CONSTRAINT inquiries_type_check 
  CHECK (type IN ('labour', 'construction', 'general', 'order', 'rental'));

-- Update status check to include archived status
ALTER TABLE inquiries 
  DROP CONSTRAINT IF EXISTS inquiries_status_check;

ALTER TABLE inquiries 
  ADD CONSTRAINT inquiries_status_check 
  CHECK (status IN ('new', 'in_progress', 'resolved', 'archived'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_inquiries_is_read ON inquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_inquiries_is_archived ON inquiries(is_archived);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries(type);
