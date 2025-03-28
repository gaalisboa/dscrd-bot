const { SpotifyExtractor } = require("@discord-player/extractor");
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
                console.error("DISGRAÇA\n" + result)
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
            console.log(result);
        } catch (error) {
            console.error(error);
            message.reply('❌ Erro ao tentar tocar a música.');
        }
    }
};
