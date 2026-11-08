const { criarApp } = require('./app.js')
const porta = process.env.PORT || 3000

criarApp().listen(porta, () => console.log(`API CineTrack em http://localhost:${porta}`))
