const axios = require('axios');

module.exports = {
    name: 'cat',
    description: 'Envia uma imagem aleatória de gato!',
    async execute(message) {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const imageUrl = response.data[0].url;
            message.channel.send(imageUrl);
        } catch (error) {
            console.error(error);
            message.reply('🐱 Não consegui buscar uma imagem agora, tente novamente mais tarde.');
        }
    }
};
