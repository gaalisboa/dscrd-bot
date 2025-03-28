// const { useMainPlayer } = require("discord-player");
// const playdl = require("play-dl");

// module.exports = {
//     name: 'play',
//     description: 'Toca uma música do YouTube!',
//     async execute(message, args) {
//         if (!message.member.voice.channel) {
//             return message.reply('❌ Você precisa estar em um canal de voz!');
//         }

//         if (!args.length) {
//             return message.reply('🎵 Você precisa fornecer o nome ou link da música!');
//         }

//         const player = useMainPlayer();
//         const query = args.join(' ');

//         try {
//             // Verifica se é um link ou uma pesquisa
//             let url;
//             if (query.includes("youtube.com") || query.includes("youtu.be")) {
//                 console.log("direct link");
//                 url = query;
//             } else {
//                 console.log("search");
//                 const searchResults = await playdl.search(query, { limit: 1 });
//                 console.log("searched");

//                 if (!searchResults.length) {
//                     return message.reply("❌ Nenhuma música encontrada!");
//                 }
//                 url = searchResults[0].url;
//             }

//             // Criar uma fila no Discord Player
//             const queue = await player.nodes.create(message.guild, {
//                 metadata: message.channel
//             });

//             // Conectar ao canal de voz
//             if (!queue.connection) await queue.connect(message.member.voice.channel);

//             // Adicionar a música na fila usando a URL diretamente
//             console.log(url);
//             await queue.play(url);

//             message.reply(`🎶 Tocando agora: **${url}**`);
//         } catch (error) {
//             console.error(error);
//             message.reply('❌ Erro ao tentar tocar a música.');
//         }
//     }
// };

const { useMainPlayer } = require("discord-player");

module.exports = {
    name: 'play',
    description: 'Toca uma música do YouTube!',
    async execute(message, args) {
        if (!message.member.voice.channel) {
            return message.reply('❌ Você precisa estar em um canal de voz!');
        }

        if (!args.length) {
            return message.reply('🎵 Você precisa fornecer o nome ou link da música!');
        }

        const player = useMainPlayer();
        const query = args.join(' ');

        try {
            // Buscar a música usando o player
            const result = await player.search(query, {
                requestedBy: message.author
            });

            if (!result.hasTracks()) {
                return message.reply("❌ Nenhuma música encontrada!");
            }

            const track = result.tracks[0]; // Pega a primeira música da busca

            // Criar uma fila no Discord Player
            const queue = await player.nodes.create(message.guild, {
                metadata: message.channel
            });

            // Conectar ao canal de voz
            if (!queue.connection) await queue.connect(message.member.voice.channel);

            // Adicionar a música na fila
            await queue.addTrack(track);

            // Se a fila não estiver tocando, inicie
            if (!queue.isPlaying()) {
                await queue.node.play();
            }

            message.reply(`🎶 Tocando agora: **${track.title}**`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Erro ao tentar tocar a música.');
        }
    }
};
