# MemeSynth 🤖✨

> Craft hilarious memes from your wildest ideas, instantly.

MemeSynth is a cutting-edge web application that leverages AI to generate memes from text prompts. Built with React, powered by OpenAI, and integrated with Web3 wallet connectivity for seamless micro-transactions.

![MemeSynth Preview](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop&crop=center)

## 🚀 Features

### ✨ AI-Powered Meme Generation
- **Smart Prompt Enhancement**: GPT-4 optimizes your ideas for better meme generation
- **High-Quality Images**: DALL-E 3 and Flux models for professional meme creation
- **Instant Results**: Generate memes in seconds with advanced AI

### 🎭 Template-Based Creation
- **Popular Templates**: Drake, Distracted Boyfriend, This is Fine, and more
- **Custom Text**: Add your own text to classic meme formats
- **Easy Customization**: Point-and-click meme creation

### 🌐 Social Sharing
- **Multi-Platform**: Share to Twitter, Facebook, Reddit, WhatsApp
- **One-Click Sharing**: Optimized sharing with pre-filled text
- **Direct Download**: Save memes locally in high quality

### 💳 Web3 Integration
- **Wallet Connectivity**: RainbowKit integration for seamless wallet connection
- **Micro-Transactions**: Pay-per-meme model with Stripe integration
- **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, Base, and Optimism

### 📱 Modern UX
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark Theme**: Beautiful gradient backgrounds and glass effects
- **Real-time Notifications**: Toast notifications for all actions
- **Optimistic Updates**: Instant UI feedback for better UX

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **RainbowKit** - Web3 wallet connection library
- **Wagmi** - React hooks for Ethereum
- **React Hot Toast** - Beautiful notifications

### Backend & Services
- **Supabase** - Backend as a Service (PostgreSQL)
- **OpenAI API** - AI image and text generation
- **OpenRouter** - Alternative AI model access
- **Stripe** - Payment processing via x402-axios
- **Vercel** - Deployment and hosting

### AI Models
- **DALL-E 3** - Primary image generation model
- **GPT-4** - Prompt enhancement and optimization
- **Flux 1.1 Pro** - Alternative high-quality image model

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key or OpenRouter API key
- Supabase project (optional, falls back to local state)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/memesynth.git
   cd memesynth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   VITE_OPENAI_API_KEY=sk-your-openai-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENAI_API_KEY` | Yes* | OpenAI API key for image generation |
| `VITE_OPENROUTER_API_KEY` | Yes* | Alternative to OpenAI for model access |
| `VITE_SUPABASE_URL` | No | Supabase project URL for data persistence |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `VITE_ANALYTICS_ID` | No | Google Analytics tracking ID |

*Either OpenAI or OpenRouter API key is required. Without API keys, the app runs in demo mode.

### Supabase Setup (Optional)

If you want to persist user data and memes:

1. Create a new Supabase project
2. Run the SQL schema from `src/utils/supabase.js`
3. Add your Supabase URL and anon key to `.env`

### Payment Setup (Optional)

For credit purchases:
1. The app uses x402-axios for Web3 payments
2. Payment processing is handled by Vistara's payment infrastructure
3. No additional setup required for basic functionality

## 📖 Usage

### Generating Memes

1. **Connect Your Wallet** (optional for demo mode)
   - Click "Connect Wallet" in the header
   - Choose your preferred wallet (MetaMask, WalletConnect, etc.)

2. **Create AI Memes**
   - Navigate to the "Create" tab
   - Enter a descriptive prompt (e.g., "A cat wearing sunglasses saying 'Deal with it'")
   - Click "Generate Meme"
   - Wait for AI to create your meme

3. **Use Templates**
   - Go to the "Templates" tab
   - Select a popular meme template
   - Add your custom text
   - Generate your meme

4. **Share Your Creations**
   - Use the social sharing buttons
   - Download high-quality images
   - Copy links for easy sharing

### Managing Credits

- **Free Credits**: New users get 3 free credits
- **Purchase More**: Buy additional credits with crypto payments
- **Track Usage**: Monitor your credit balance in the header

## 🎨 Design System

MemeSynth uses a custom design system built on Tailwind CSS:

### Colors
- **Background**: `hsl(220 20% 10%)` - Dark base
- **Primary**: `hsl(220 85% 45%)` - Blue accent
- **Accent**: `hsl(180 70% 50%)` - Cyan highlight
- **Surface**: `hsl(220 20% 15%)` - Card backgrounds

### Components
- **Glass Effects**: Backdrop blur with transparency
- **Gradient Backgrounds**: Dynamic color transitions
- **Smooth Animations**: 200ms ease-in-out transitions
- **Responsive Grid**: 12-column fluid layout

## 🔌 API Integration

### OpenAI Integration
```javascript
import { generateMemeWithAI } from './utils/aiGeneration';

const meme = await generateMemeWithAI("Your prompt here");
```

### Supabase Integration
```javascript
import { saveMeme, getUserMemes } from './utils/supabase';

// Save a meme
await saveMeme(memeData);

// Get user's memes
const memes = await getUserMemes(userId);
```

### Wallet Integration
```javascript
import { useUserContext } from './hooks/useUserContext';

const { user, credits, useCredit } = useUserContext();
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main**

### Docker

```bash
# Build the image
docker build -t memesynth .

# Run the container
docker run -p 3000:3000 memesynth
```

### Manual Build

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing powerful AI models
- **Supabase** for excellent backend services
- **RainbowKit** for seamless wallet integration
- **Tailwind CSS** for the utility-first CSS framework
- **React Community** for the amazing ecosystem

## 📞 Support

- **Documentation**: [API Documentation](docs/API_DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/memesynth/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vistara-apps/memesynth/discussions)

## 🗺️ Roadmap

### Q1 2024
- [ ] Advanced meme templates
- [ ] Batch meme generation
- [ ] Meme remix feature
- [ ] Community gallery

### Q2 2024
- [ ] Mobile app (React Native)
- [ ] NFT minting integration
- [ ] Collaborative meme creation
- [ ] Advanced AI models

### Q3 2024
- [ ] Meme contests and challenges
- [ ] Creator monetization
- [ ] Multi-language support
- [ ] Advanced analytics

---

<div align="center">

**Made with ❤️ by the MemeSynth Team**

[Website](https://memesynth.app) • [Twitter](https://twitter.com/memesynth) • [Discord](https://discord.gg/memesynth)

</div>
