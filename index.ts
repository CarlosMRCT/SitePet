import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  🐾 Senti PetStore - Backend        ║
╚══════════════════════════════════════╝

🚀 Server rodando em http://localhost:${PORT}
📊 Health check: http://localhost:${PORT}/health
📡 API: http://localhost:${PORT}/api/v1

Pressione Ctrl+C para parar
  `);
});
