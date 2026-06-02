# Serenity Rejuvenation - Spa Management Platform
A modern, full-featured spa management system built with Next.js 15, featuring a beautiful client-facing website and comprehensive dashboard for both users and administrators.

## Overview

Serenity Rejuvenation is a complete digital solution for spa businesses that combines an elegant public website with powerful management tools. The platform handles appointment bookings, client management, treatment tracking, and provides both customers and staff with intuitive interfaces designed for the wellness industry.

## Key Features

### For Clients
- **Beautiful Public Website**: Elegant, responsive design showcasing spa services and treatments
- **Online Booking System**: Easy appointment scheduling with service selection and add-ons
- **User Dashboard**: Personal client portal for managing appointments and viewing treatment history
- **Loyalty Program**: Built-in membership tiers and rewards system
- **Treatment Tracking**: Complete history of spa visits and services

### For Administrators  
- **Admin Dashboard**: Comprehensive management interface for business operations
- **User Management**: Monitor and manage client accounts and bookings
- **Service Management**: Easily update treatments, pricing, and availability
- **Analytics**: Track revenue, popular treatments, and client engagement
- **Booking Oversight**: View and manage all appointments in one place

### Technical Highlights
- **Modern Authentication**: Secure NextAuth.js integration with role-based access
- **Dark Mode Support**: Complete dark theme implementation across all pages
- **Mobile Responsive**: Optimized for all device sizes and screen types
- **Database Integration**: Robust Prisma ORM with PostgreSQL
- **Type Safety**: Full TypeScript implementation for reliability

## Technology Stack

### Frontend Framework
- **Next.js 15**: Latest React framework with App Router
- **React 19**: Modern UI development
- **TypeScript**: Type-safe development

### UI Components
- **shadcn/ui**: High-quality, accessible component library
- **Tailwind CSS**: Utility-first styling approach
- **Radix UI**: Accessible component primitives

### Backend & Database
- **NextAuth.js v5**: Authentication and session management
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Reliable relational database

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Git Hooks**: Automated code quality checks

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running locally or accessible
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/serenityrejuvenation.git
   cd serenityrejuvenation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/serenity_db"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Client Experience
1. **Browse Services**: Visitors can explore available treatments and pricing
2. **Create Account**: Simple signup process with email verification
3. **Book Appointments**: Select services, choose time slots, add extras
4. **Manage Bookings**: View, cancel, or reschedule through personal dashboard
5. **Track Progress**: See treatment history and loyalty points

### Admin Experience
1. **Access Dashboard**: Secure admin login with role-based access
2. **Monitor Bookings**: View all appointments and client information
3. **Manage Services**: Update treatments, pricing, and availability
4. **Analyze Data**: Review business metrics and client engagement
5. **Client Management**: Handle user accounts and preferences

### Authentication Flow
- **Public Pages**: Accessible to everyone
- **Protected Routes**: Require authentication (dashboards, booking)
- **Role-Based Access**: Admin routes restricted to administrators
- **Session Management**: Secure token-based authentication

## Customization

### Styling
The project uses a sophisticated burgundy and gold color scheme (`#271024` and `#e3ae72`). To customize:

1. Update color variables in `tailwind.config.ts`
2. Modify theme in `src/app/globals.css`
3. Adjust component-specific styles in respective files

### Adding New Features
The modular structure makes it easy to extend:

- **New Pages**: Add to appropriate folder in `src/app/`
- **Components**: Create in `src/components/` following existing patterns
- **Database Models**: Update `prisma/schema.prisma` and run migrations
- **API Routes**: Add to `src/app/api/` for backend functionality

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
Ensure your hosting platform supports:
- Node.js runtime
- PostgreSQL database
- Environment variable configuration

## Contributing

We welcome contributions that improve the platform. Please follow these guidelines:

1. **Code Style**: Follow existing TypeScript and formatting conventions
2. **Testing**: Test thoroughly before submitting pull requests
3. **Documentation**: Update relevant documentation for new features
4. **Commit Messages**: Use clear, descriptive commit messages

### Development Workflow
1. Create a feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly including edge cases
4. Submit a pull request with description of changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review code comments and inline documentation

## Acknowledgments

Built with modern web technologies and best practices to provide a premium digital experience for spa businesses and their clients.

---

**Serenity Rejuvenation** - Elevating the digital spa experience with thoughtful design and robust functionality.