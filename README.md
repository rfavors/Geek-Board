# The Geek-Board

A lightweight, modern online whiteboard optimized for Coolify deployment with minimal hosting costs.

## 🚀 Features

- **Email-based authentication** using Supabase
- **Freehand drawing** with multiple colors and brush sizes
- **Text tool** for adding text blocks
- **Undo/Redo** functionality
- **Grid toggle** for precise drawing
- **Export functionality** - Save boards as PNG, JPG, or PDF
- **Local storage** - No database costs for board data
- **PWA support** - Installable on mobile devices
- **Dark mode** interface
- **Auto-save** to localStorage

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Drawing**: Fabric.js
- **Export**: html2canvas + jsPDF
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **PWA**: Vite PWA Plugin

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geek-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. No additional database setup required - we only use Supabase for authentication

## 🚀 Deployment on Coolify

### Method 1: Docker Deployment

1. **Push your code to a Git repository**

2. **Create a new project in Coolify**
   - Select "Docker" as the build pack
   - Point to your repository
   - Set the Dockerfile path to `./Dockerfile`

3. **Set environment variables in Coolify**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_URL=https://your-domain.com
   ```

4. **Deploy**
   - Coolify will build and deploy automatically
   - The app will be available on port 80

### Method 2: Static Site Deployment

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder to Coolify**
   - Select "Static Site" as the deployment type
   - Upload the contents of the `dist` folder

## 💰 Cost Optimization

- **No database costs** - All board data stored in localStorage
- **Minimal server resources** - Static files only
- **Supabase free tier** - 50,000 monthly active users
- **Lightweight build** - Optimized bundle size

## 🎨 Usage

1. **Sign up/Login** with email and password
2. **Start drawing** using the pen tool
3. **Change colors** from the color palette
4. **Adjust brush size** with +/- buttons
5. **Add text** using the text tool
6. **Toggle grid** for precise alignment
7. **Export boards** as PNG, JPG, or PDF
8. **Auto-save** keeps your work safe locally

## 🔒 Security

- Email-only authentication
- No sensitive data stored in database
- Secure Supabase integration
- HTTPS enforced in production

## 📱 PWA Features

- Installable on mobile devices
- Offline functionality for drawing
- App-like experience
- Custom app icons and splash screen

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Website**: [The Geektrepreneur](https://thegeektrepreneur.com)
- **Supabase**: [supabase.com](https://supabase.com)
- **Coolify**: [coolify.io](https://coolify.io)

---

**Built with ❤️ by The Geektrepreneur**