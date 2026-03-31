import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));

// ── MongoDB ─────────────────────────────────────────────
// ⚠️  Move this to a .env file before deploying:
//     MONGO_URI=mongodb+srv://...
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://dhakshi081206_db_user:dhak123@ridelink.dtikqnl.mongodb.net/nammaRide?retryWrites=true&w=majority&appName=RideLink';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// health-check
app.get('/', (req, res) => res.json({ status: 'Namma Ride API running 🚀' }));

// ── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// ── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));