-- Database schema for the chat system

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(36) NOT NULL UNIQUE,
  user_id VARCHAR(100) NOT NULL,
  business_context VARCHAR(100) NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_activity DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (room_id),
  INDEX (user_id),
  INDEX (business_context)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  business_context VARCHAR(100) NOT NULL DEFAULT 'general',
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (room_id),
  INDEX (user_id),
  INDEX (role),
  INDEX (business_context),
  INDEX (timestamp)
);

-- Context rules table
CREATE TABLE IF NOT EXISTS context_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  business_context VARCHAR(100) NOT NULL UNIQUE,
  allowed_topics JSON NOT NULL,
  restricted_topics JSON NOT NULL,
  ai_model ENUM('gemini', 'huggingface', 'grok') NOT NULL DEFAULT 'gemini',
  prompt_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (business_context),
  INDEX (is_active)
);

-- Prompt templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  ai_model ENUM('gemini', 'huggingface', 'grok') NOT NULL DEFAULT 'gemini',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (name),
  INDEX (ai_model),
  INDEX (is_default)
);

-- Scraping projects table
CREATE TABLE IF NOT EXISTS scraping_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Scraping URLs table
CREATE TABLE IF NOT EXISTS scraping_urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  url VARCHAR(2048) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  last_scraped DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES scraping_projects(id) ON DELETE CASCADE,
  INDEX (status)
);

-- Scraped data table
CREATE TABLE IF NOT EXISTS scraped_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url_id INT NOT NULL,
  data_type ENUM('raw_html', 'cleaned_text', 'semantic', 'vectorized') NOT NULL,
  content LONGTEXT NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (url_id) REFERENCES scraping_urls(id) ON DELETE CASCADE,
  INDEX (data_type)
);

-- Insert default admin user
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2b$10$mLZKHhKMbQvhN8CuKxQYPO.kqdJ9LV/RWVV5zSGY1xJM1cUNpYZHu', 'admin')
ON DUPLICATE KEY UPDATE username = 'admin';

-- Insert default context rules
INSERT INTO context_rules (name, business_context, allowed_topics, restricted_topics, prompt_template, is_active)
VALUES ('General', 'general', '[]', '[]', 'You are an AI assistant. Please provide information about the following query: {{message}}', TRUE),
       ('UAE Government', 'uae-government', '["tourism", "culture", "history", "government services"]', '["politics", "religion", "controversial topics"]', 'You are an AI assistant specialized in UAE government information. Please provide information about the following query: {{message}}', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default prompt templates
INSERT INTO prompt_templates (name, description, template, ai_model, is_default)
VALUES ('Standard', 'Standard prompt template for general queries', 'You are an AI assistant. Please provide information about the following query: {{message}}', 'gemini', TRUE),
       ('Detailed', 'Detailed prompt template with comprehensive responses', 'You are an AI assistant. Please provide a detailed and comprehensive response to the following query, including relevant examples and explanations: {{message}}', 'gemini', FALSE),
       ('Concise', 'Concise prompt template with brief responses', 'You are an AI assistant. Please provide a brief and concise response to the following query: {{message}}', 'gemini', FALSE)
ON DUPLICATE KEY UPDATE name = VALUES(name);
