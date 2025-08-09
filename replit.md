# Form Builder Application

## Overview

This is a dynamic form builder application built with React, TypeScript, and Redux that allows users to create, configure, and manage custom forms. The application provides an intuitive drag-and-drop interface for building forms with various field types including text, number, textarea, select, radio, checkbox, and date fields. Each field can be configured with custom labels, validation rules, and default values. The application includes derived fields that can automatically calculate values based on other fields (like age from birth date). Forms are persisted using localStorage and can be previewed in real-time to simulate the end-user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React architecture with TypeScript for type safety. The user interface is built with shadcn/ui components based on Radix UI primitives, providing a consistent and accessible design system. The application follows a component-based architecture with clear separation of concerns between presentation, business logic, and state management.

### State Management
Redux Toolkit is used for centralized state management with three main slices:
- **formBuilderSlice**: Manages the current form being built, field configurations, and selected field state
- **previewSlice**: Handles form preview functionality, field values, validation errors, and submission state
- **savedFormsSlice**: Manages the collection of saved forms with search and sorting capabilities

### Routing and Navigation
The application uses Wouter for client-side routing with three main routes:
- `/create`: Form builder interface for creating and editing forms
- `/preview`: Real-time form preview and testing environment
- `/myforms`: Saved forms management and organization

### Data Persistence
Forms are persisted using browser localStorage with utility functions for CRUD operations. The storage layer includes functions for saving, loading, deleting, and exporting forms. Form schemas are validated using Zod for type safety and data integrity.

### Form Field System
The application supports seven field types (text, number, textarea, select, radio, checkbox, date) with comprehensive configuration options. Each field can have validation rules (required, min/max length, email format, custom password rules), custom labels, placeholders, and default values. Derived fields can automatically calculate values based on parent fields using predefined formulas or custom calculations.

### Validation Engine
A custom validation system validates individual fields and entire forms in real-time. Validation rules are configurable per field with custom error messages. The system supports both synchronous validation (required, length, format) and derived field calculations.

### Drag and Drop Interface
The form builder uses HTML5 drag and drop API for intuitive field placement and reordering. Fields can be dragged from a palette onto the form canvas and reordered within the form structure.

### Theme System
The application includes a comprehensive theming system with light/dark mode support using CSS variables and Tailwind CSS. Theme preferences are persisted in localStorage with system preference detection.

## External Dependencies

### UI Component Library
- **Radix UI**: Provides accessible, unstyled UI primitives for complex components like dialogs, dropdowns, and form controls
- **shadcn/ui**: Pre-built components based on Radix UI with consistent styling using Tailwind CSS
- **Lucide React**: Icon library for consistent iconography throughout the application

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **class-variance-authority**: Type-safe utility for creating component variants
- **clsx**: Utility for conditional CSS class names

### State Management and Data Fetching
- **Redux Toolkit**: Simplified Redux setup with built-in best practices for state management
- **React Query (TanStack Query)**: Server state management and caching (configured for potential future API integration)

### Form Handling and Validation
- **React Hook Form**: Performance-focused form library with minimal re-renders
- **Hookform Resolvers**: Integration layer for validation schema libraries
- **Zod**: TypeScript-first schema validation for form data and API contracts

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static type checking for improved developer experience and code reliability
- **ESBuild**: Fast JavaScript bundler for production builds

### Database and Backend (Configured but Optional)
- **Drizzle ORM**: Type-safe SQL ORM configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database (configured but not actively used as forms are stored in localStorage)
- **Express.js**: Web framework for potential API endpoints (minimal backend setup included)

### Utilities
- **nanoid**: URL-safe unique string ID generator for form and field identification
- **date-fns**: Date utility library for date field handling and derived calculations
- **wouter**: Lightweight client-side routing library