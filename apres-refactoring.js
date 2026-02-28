// Validation et création des messages
class MessageValidator {
    constructor() {
        this.badWords = ['spam', 'scam', 'hack'];
    }

    containsBadWords(content) {
        return this.badWords.some(word => content.toLowerCase().includes(word));
    }

    containsSpam(content) {
        return content.length > 100 && content.split(' ').length < 5;
    }

    valide(content) {
        if (content.length > 500) {
            console.log('Message trop long')
            return;
        }
        if (this.containsBadWords(content)) {
            console.log('Message bloqué: langage inapproprié');
            return;
        }
        if (this.containsSpam(content)) {
            console.log('Message bloqué: spam détecté');
            return;
        }
        return true;
    }
}

// Classe de base pour tous les messages
class MessageBase {
    constructor(username, content) {
        this.username = username;
        this.content = content;
        this.timestamp = new Date();
    }

    sendMessage(notificationCenter) {
        throw new Error('La méthode send doit être implémentée par les sous-classes');
    }
}

// Decorator de base
class MessageDecorator extends MessageBase {
    constructor(message) {
        super(message.username, message.content);
        this.message = message;
    }

    sendMessage(notificationCenter) {
        return this.message.sendMessage(notificationCenter);
    }
}

// Mettre le message en gras
class GrasDecorator extends MessageDecorator {

    getContent() {
        return `**${this.message.content}**`;
    }
    sendMessage(notificationCenter) {
        this.message.content = this.getContent();
        console.log("Message mis en gras");
        return super.sendMessage(notificationCenter);
    }
}

class BadgeDecorator extends MessageDecorator {
    getContent() {
        return `${this.badge} ${this.message.content}`;
    }

    sendMessage(notificationCenter) {
        this.message.content = this.getContent();
        return super.sendMessage(notificationCenter);
    }
}

// Traitement des message type text
class TextMessage extends MessageBase {
    constructor(username, content, validator) {
        super(username, content);
        this.validator = validator;
    }

    sendMessage(notificationCenter) {
        const valid = this.validator.valide(this.content);
        if (!valid) {
            console.log(`Message bloqué: ${this.content}`);
            return null;
        }
        console.log(`Message texte envoyé: ${this.content}`);
        notificationCenter.notify('new_message', this);
        return this;
    }
}


// Traitement des message type emoji
class EmojiMessage extends MessageBase {
    sendMessage(notificationCenter) {
        console.log(`Emoji envoyé: ${this.content}`);
        notificationCenter.notify('new_message', this);
        return this;
    }
}

// Traitements des message type GIF
class GifMessage extends MessageBase {
    sendMessage(notificationCenter) {
        this.gifUrl = this.content;
        console.log(`GIF envoyé: ${this.gifUrl}`);
        notificationCenter.notify('new_message', this);
        return this;
    }
}

// Traitement des message type donation
class DonationMessage extends MessageBase {
    constructor(username, content, amount) {
        super(username, content);
        this.amount = amount;
        this.highlighted = true;
    }

    sendMessage(notificationCenter) {
        console.log(`💰 Donation de ${this.amount}€ par ${this.username}`);
        notificationCenter.notify('donation', this);
        return this;
    }
}

// Traitement des message type follow
class FollowMessage extends MessageBase {
    sendMessage(notificationCenter) {
        console.log(`${this.username} a follow la chaîne`);
        notificationCenter.notify('follow', this);
        return this;
    }
}


// Facto des message
class MessageFactory {
    constructor(validator) {
        this.validator = validator;
    }

    createMessage(type, username, content, extra = {}) {
        switch (type) {
            case 'text':
                return new TextMessage(username, content, this.validator);
            case 'emoji':
                return new EmojiMessage(username, content);
            case 'gif':
                return new GifMessage(username, content);
            case 'donation':
                return new DonationMessage(username, content, extra.amount || 0);
            case 'follow':
                return new FollowMessage(username, content);
            default:
                throw new Error(`Type de message inconnu: ${type}`);
        }
    }
}

class ChatManager {
    constructor(notificationCenter) {
        this.messages = [];
        this.validator = new MessageValidator();
        this.notificationCenter = notificationCenter;
        this.factory = new MessageFactory(this.validator);
    };

    sendMessage(username, content, type, extra = {}) {
        const message = this.factory.createMessage(type, username, content, extra);
        const sentMessage = message.sendMessage(this.notificationCenter);
        if (sentMessage) {
            this.messages.push(sentMessage);
            console.log("Message envoyé avec succès");
        }
        return sentMessage;
    };
}

// Gestion du stream avec pattern Adaptater
// Interface commune
class StreamService {
    startStream(streamTitle, game) {
        throw new Error("startStream doit être implémenté");
    }
    stopStream() {
        throw new Error("stopStream doit être implémenté");
    }
}

// Adapter pour Twitch
class TwitchAdapter extends StreamService {
    constructor(twitchApiKey) {
        super();
        this.twitchApiKey = twitchApiKey;
    }

    startStream(streamTitle, game) {
        console.log('Connecting to Twitch API...');
        console.log(`POST https://api.twitch.tv/helix/streams`);
        console.log(`Authorization: Bearer ${this.twitchApiKey}`);
        console.log(`Body: { title: ${streamTitle}, game_id: ${game} }`);
    }

    stopStream() {
        console.log('Disconnecting from Twitch');
    }
}

// Adapter pour YouTube
class YouTubeAdapter extends StreamService {
    constructor(youtubeApiKey) {
        super();
        this.youtubeApiKey = youtubeApiKey;
    }

    startStream(streamTitle, game) {
        console.log('Connecting to YouTube API...');
        console.log(`POST https://www.googleapis.com/youtube/v3/liveBroadcasts`);
        console.log(`key: ${this.youtubeApiKey}`);
        console.log(`Body: { snippet: { title: ${streamTitle} } }`);
    }

    stopStream() {
        console.log('Disconnecting from YouTube');
    }
}


class StreamManager {
    constructor(services = []) {
        this.streamOnline = false;
        this.services = services;
    }

    startStream(streamTitle, game) {
        this.streamOnline = true;

        console.log(`Starting stream: ${streamTitle} - ${game}`);

        this.services.forEach(service => service.startStream(streamTitle, game));
    }

    stopStream() {
        this.streamOnline = false;

        console.log('Stopping stream...');
        console.log('Saving VOD...');
        console.log('Generating stats...');
        console.log('Sending thank you email to viewers');
        this.services.forEach(service => service.stopStream());
    }
}

// Notifications push/email/Discord
class Observer {
    update(event, data) {
        throw new Error('La méthode update doit être implémentée');
    }
}

class NotificationCenter {
    constructor() {
        // this.items = [];
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(event, data) {
        this.observers.forEach(observer => {
            observer.update(event, data);
        });
    }
}

class EmailNotifier extends Observer {
    sendNotification(username, content) {
        console.log(`📧 Email envoyé ${username, content || 'tous'} : ${content}`);
    }
    update(event, data) {
        if (event === 'new_message') {
            console.log(`📧 Email reçu de ${data.username}: ${data.content}`);
        }
    }
}

class SmsNotifier extends Observer {
    sendNotification(username, content) {
        console.log(`📱 SMS de ${username, content || 'tous'} : ${content}`);
    }
    update(event, data) {
        if (event === 'new_message') {
            console.log(`📧 Nouveau sms de ${data.username}: ${data.content}`);
        }
    }
}

class PushNotifier extends Observer {
    update(event, data) {
        if (event === 'new_message') {
            console.log(`🔔 Notification push de ${data.username}: ${data.content}`);
        }
    }
}

class Discord extends Observer {
    update(event, data) {
        console.log(`💬 Notif Discord  : ${event}`, data);
    }

}

class Follow extends Observer {
    update(event, data) {
        if (event === 'follow') {
            console.log(`${data.username} a follow la chaîne`);
        }
    }

}

class Donation extends Observer {
    update(event, data) {
        if (event === 'donation') {
            console.log(`💰 Nouvelle donation de ${data.amount}€ par ${data.username}`);
        }
    }
}

// Moderation des messages
// Interface de stratégie
class ModerationStrategy {
    execute(message, reason) {
        throw new Error('La méthode execute doit être implémentée');
    }
}

// Stratégie Delete
class DeleteStrategy extends ModerationStrategy {
    action(message, reason) {
        console.log(`Message supprimé: ${reason}`);
    }
}

// Stratégie Timeout
class TimeoutStrategy extends ModerationStrategy {
    action(message, reason) {
        console.log(`Utilisateur timeout: ${message.username} - ${reason}`);
    }
}

// Stratégie Ban
class BanStrategy extends ModerationStrategy {
    action(message, reason) {
        console.log(`Utilisateur banni: ${message.username} - ${reason}`);
    }
}

class ModerationManager {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    modererMessage(message, reason) {
        if (!this.strategy) {
            throw new Error('Aucune stratégie de modération définie');
        }
        this.strategy.action(message, reason);
    }
};

// Génération de rapports
class Analytics {
    constructor(messages, viewers, streamOnline, chatLogs) {
        this.messages = messages;
        this.viewers = viewers;
        this.streamOnline = streamOnline;
        this.chatLogs = chatLogs;
    }
    generateAnalytics() {

        const report = {
            streamStatus: this.streamOnline ? 'En cours' : 'Terminé',
            totalMessages: this.messages.length,
            totalViewers: this.viewers.length,
            averageMessagePerMinute: this.messages.length / 60,
            topChatters: [],
            revenue: 0
        };

        return JSON.stringify(report);
    };

    exportChatHistory(format) {
        if (format === 'json') {
            return JSON.stringify(this.chatLogs);
        } else if (format === 'csv') {
            let csv = 'username,message,timestamp\n';
            this.chatLogs.forEach(log => {
                csv += `${log.username},${log.content},${log.timestamp}\n`;
            });
            return csv;
        } else if (format === 'txt') {
            let txt = '';
            this.chatLogs.forEach(log => {
                txt += `[${log.timestamp}] ${log.username}: ${log.content}\n`;
            });
            return txt;
        }
    };
}

// Gestion des paiements
class PaymentManager {

    constructor(paymentStrategy, subManager) {
        this.paymentStrategy = paymentStrategy;
        this.subManager = subManager;
    }

    subscribe(username, paymentDetails, couponCode = '', isGift = false) {
        let price = this.subManager.calculateSubscriptionPrice(couponCode, isGift);
        price = parseFloat(price.toFixed(2));
        this.paymentStrategy.pay(username, price, paymentDetails);
        console.log(`Payment réussi pour ${username}`);
    }
};

// Interface pour la stratégie de paiement
class PaymentService {
    pay(username, amount, paymentDetails) {
        throw new Error('Implémenter pay');
    }
}

class StripePaymentService extends PaymentService {
    constructor(stripeService) {
        super();
        this.stripeService = stripeService;
    }
    pay(username, amount, paymentDetails) {
        this.stripeService.pay(username, amount, paymentDetails);
        console.log(`Processing Stripe payment:  ${username} paye ${amount}€`);
        console.log(`Card: ${paymentDetails.cardNumber}`);
        const token = 'stripe_' + Math.random();
        console.log(`Payment successful: ${token}`);
    }
}

class PaypalPaymentService extends PaymentService {
    constructor(paypalService) {
        super();
        this.paypalService = paypalService;
    }
    pay(username, amount, paymentDetails) {
        this.paypalService.pay(username, amount, paymentDetails);
        console.log(`Processing PayPal payment : ${username} paye ${amount}€`);
        console.log(`Email: ${paymentDetails.email}`);
        const orderId = 'pp_' + Math.random();
        console.log(`Payment successful: ${orderId}`);
    }
}

class CryptoPaymentService extends PaymentService {
    constructor(cryptoService) {
        super();
        this.cryptoService = cryptoService;
    }
    pay(username, amount, paymentDetails) {
        this.cryptoService.pay(username, amount, paymentDetails);
        console.log(`Processing Crypto payment: ${username} paye ${amount}€`);
        console.log(`Wallet: ${paymentDetails.wallet}`);
        const txHash = 'btc_' + Math.random();
        console.log(`Payment successful: ${txHash}`)
    }
}

// Gestion des abonnements
// Interface pour la stratégie d'abonnement
class SubStrategy {
    calculatePrice(couponCode, isGift) {
        throw new Error('La méthode doit être implémentée');
    }

    getBenefits() {
        throw new Error('La méthode doit être implémentée');
    }
}

// Stratégie Premium
class SubPremium extends SubStrategy {
    calculatePrice(couponCode, isGift) {
        let price = 4.99;

        if (couponCode === 'WELCOME10') {
            price *= 0.9;
        } else if (couponCode === 'SUMMER20') {
            price *= 0.8;
        }

        if (isGift) {
            price *= 1.1;
        }

        return price;
    }

    getBenefits() {
        return {
            emotes: true,
            badge: '💎',
            adFree: true,
            chatColor: 'purple'
        };
    }
}

// Stratégie VIP
class SubVip extends SubStrategy {
    calculatePrice(couponCode, isGift) {
        let price = 9.99;

        if (couponCode === 'WELCOME10') {
            price *= 0.9;
        } else if (couponCode === 'SUMMER20') {
            price *= 0.8;
        }

        if (isGift) {
            price *= 1.1;
        }

        return price;
    }

    getBenefits() {
        return {
            emotes: true,
            badge: '⭐',
            adFree: true,
            chatColor: 'gold',
            customEmotes: true,
            prioritySupport: true
        };
    }
}

// Stratégie Partner
class SubPartner extends SubStrategy {
    calculatePrice(couponCode, isGift) {
        let price = 24.99;

        if (couponCode === 'WELCOME10') {
            price *= 0.9;
        } else if (couponCode === 'SUMMER20') {
            price *= 0.8;
        }

        if (isGift) {
            price *= 1.1;
        }

        return price;
    }

    getBenefits() {
        return {
            emotes: true,
            badge: '👑',
            adFree: true,
            chatColor: 'red',
            customEmotes: true,
            prioritySupport: true,
            exclusiveContent: true,
            monthlyGiveaway: true
        };
    }
}

class SubManager {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    calculateSubscriptionPrice(couponCode, isGift) {
        if (!this.strategy) {
            throw new Error('Aucune stratégie d’abonnement définie')
        };
        const price = this.strategy.calculatePrice(couponCode, isGift);
        return parseFloat(price.toFixed(2));
    }

    getSubscriptionBenefits() {
        if (!this.strategy) {
            throw new Error('Aucune stratégie d’abonnement définie')
        };
        return this.strategy.getBenefits();
    }
}

//Tests
console.log('=== STREAMHUB - Code refactorer ===\n');

// Setup
const validator = new MessageValidator();
const notifCenter = new NotificationCenter();

// Observers
notifCenter.subscribe(new EmailNotifier());
notifCenter.subscribe(new SmsNotifier());
notifCenter.subscribe(new PushNotifier());
notifCenter.subscribe(new Discord());
notifCenter.subscribe(new Follow());
notifCenter.subscribe(new Donation());

// Chat manager
const chatManager = new ChatManager(notifCenter);

// Stream manager
const twitch = new TwitchAdapter('twitch_key_123');
const youtube = new YouTubeAdapter('youtube_key_456');
const streamManager = new StreamManager([twitch, youtube]);

// Subscription manager
const subManager = new SubManager(new SubPremium());

// Payment manager
const paymentManager = new PaymentManager(new StripePaymentService({ pay: () => {} }), subManager);

// 1. Démarrage du stream 
console.log('1. Démarrage du stream');
streamManager.startStream('Coding Session', 'Programming');
console.log('');

// 2. Nouveau follower 
console.log('2. Nouveau follower');
const followMsg = new FollowMessage('Alice', '');
followMsg.sendMessage(notifCenter);

// 3. Abonnement Premium
console.log('3. Abonnement Premium');
paymentManager.subscribe('Bob', 'premium', { cardNumber: '****1234' });
console.log('');

// 4. Messages dans le chat
console.log('4. Messages dans le chat');
chatManager.sendMessage('Alice', 'Hello everyone!', 'text');
chatManager.sendMessage('Bob', 'Great stream!', 'text');
chatManager.sendMessage('Charlie', '🎉', 'emoji');
console.log('');

// 5. Donation
console.log('5. Donation');
chatManager.sendMessage('David', 'Keep up the good work!', 'donation', { amount: 50 });
console.log('');

// 6. Calcul de prix avec coupon
console.log('6. Calcul de prix avec coupon');
const price = subManager.calculateSubscriptionPrice('vip', true);
console.log(`Prix VIP avec coupon: ${price}€`);
console.log('');

// 7. Export du chat
console.log('7. Export du chat');
const chatHistory = new Analytics(chatManager.messages, ['Alice', 'Bob', 'Charlie', 'David'], streamManager.streamOnline, chatManager.messages).exportChatHistory('json');
console.log('Chat exporté:', chatHistory);
console.log('');

// 8. Arrêt du stream
console.log('8. Arrêt du stream');
streamManager.stopStream();
console.log('');