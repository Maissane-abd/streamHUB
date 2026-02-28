class StreamHub {
  constructor() {
    this.messages = [];
    this.viewers = [];
    this.streamOnline = false;
    this.chatLogs = [];
    this.analyticsData = [];
  }

  sendMessage(username, content, type, donationAmount, subscriberLevel) {
    const message = {
      username,
      content,
      timestamp: new Date(),
      type
    };

    if (type === 'text') {
      if (content.length > 500) {
        console.log('Message trop long');
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
    } else if (type === 'emoji') {
      message.emoji = content;
    } else if (type === 'gif') {
      message.gifUrl = content;
    } else if (type === 'donation') {
      message.amount = donationAmount;
      message.highlighted = true;
      console.log(`💰 Nouvelle donation de ${donationAmount}€ de ${username}!`);
      console.log(`Email envoyé au streamer`);
      console.log(`Analytics: donation enregistrée`);
      console.log(`UI mise à jour avec l'alerte de donation`);
    }

    if (subscriberLevel === 'vip') {
      message.badge = '⭐ VIP';
      message.color = 'gold';
    } else if (subscriberLevel === 'premium') {
      message.badge = '💎 Premium';
      message.color = 'purple';
    } else if (subscriberLevel === 'partner') {
      message.badge = '👑 Partner';
      message.color = 'red';
    }

    this.messages.push(message);
    console.log(`[${message.timestamp.toISOString()}] ${message.username}: ${message.content}`);

    this.chatLogs.push(message);
    this.analyticsData.push({ event: 'message', user: username, time: new Date() });

    document.getElementById('chat').innerHTML += `<div>${username}: ${content}</div>`;
    document.getElementById('message-count').textContent = this.messages.length;
  }

  containsBadWords(content) {
    const badWords = ['spam', 'scam', 'hack'];
    return badWords.some(word => content.toLowerCase().includes(word));
  }

  containsSpam(content) {
    return content.length > 100 && content.split(' ').length < 5;
  }

  subscribe(username, level, paymentMethod, paymentDetails) {
    let price = 0;

    if (level === 'premium') {
      price = 4.99;
    } else if (level === 'vip') {
      price = 9.99;
    } else if (level === 'partner') {
      price = 24.99;
    }

    if (paymentMethod === 'stripe') {
      console.log(`Processing Stripe payment: ${price}€`);
      console.log(`Card: ${paymentDetails.cardNumber}`);
      const token = 'stripe_' + Math.random();
      console.log(`Payment successful: ${token}`);
    } else if (paymentMethod === 'paypal') {
      console.log(`Processing PayPal payment: ${price}€`);
      console.log(`Email: ${paymentDetails.email}`);
      const orderId = 'pp_' + Math.random();
      console.log(`Payment successful: ${orderId}`);
    } else if (paymentMethod === 'crypto') {
      console.log(`Processing Crypto payment: ${price}€`);
      console.log(`Wallet: ${paymentDetails.wallet}`);
      const txHash = 'btc_' + Math.random();
      console.log(`Payment successful: ${txHash}`);
    }

    this.viewers.push({ username, level, joinedAt: new Date() });

    console.log(`Email envoyé à ${username}: Merci de votre abonnement!`);
    console.log(`SMS envoyé: Abonnement activé`);
    console.log(`Analytics: nouvel abonné ${level}`);
    console.log(`UI mise à jour avec le badge`);

    document.getElementById('subscriber-count').textContent = this.viewers.length;
  }

  calculateSubscriptionPrice(level, couponCode, isGift) {
    let price = 0;

    if (level === 'premium') {
      price = 4.99;
    } else if (level === 'vip') {
      price = 9.99;
    } else if (level === 'partner') {
      price = 24.99;
    }

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

  getSubscriptionBenefits(level) {
    if (level === 'premium') {
      return {
        emotes: true,
        badge: '💎',
        adFree: true,
        chatColor: 'purple'
      };
    } else if (level === 'vip') {
      return {
        emotes: true,
        badge: '⭐',
        adFree: true,
        chatColor: 'gold',
        customEmotes: true,
        prioritySupport: true
      };
    } else if (level === 'partner') {
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
    } else {
      return { emotes: false, badge: '', adFree: false };
    }
  }

  followUser(username) {
    console.log(`${username} suit maintenant cette chaîne!`);
    console.log(`Email envoyé au streamer`);
    console.log(`Analytics: nouveau follower`);
    console.log(`UI mise à jour`);
    console.log(`Notification push envoyée`);

    document.getElementById('follower-count').textContent = parseInt(
      document.getElementById('follower-count').textContent
    ) + 1;
  }

  startStream(streamTitle, game, twitchApiKey, youtubeApiKey) {
    this.streamOnline = true;

    console.log(`Starting stream: ${streamTitle} - ${game}`);

    if (twitchApiKey) {
      console.log('Connecting to Twitch API...');
      console.log(`POST https://api.twitch.tv/helix/streams`);
      console.log(`Authorization: Bearer ${twitchApiKey}`);
      console.log(`Body: { title: ${streamTitle}, game_id: ${game} }`);
    }

    if (youtubeApiKey) {
      console.log('Connecting to YouTube API...');
      console.log(`POST https://www.googleapis.com/youtube/v3/liveBroadcasts`);
      console.log(`key: ${youtubeApiKey}`);
      console.log(`Body: { snippet: { title: ${streamTitle} } }`);
    }

    console.log(`Email envoyé aux abonnés`);
    console.log(`Notification push envoyée`);
    console.log(`Tweet automatique posté`);
    console.log(`Discord notification envoyée`);

    document.getElementById('stream-status').textContent = 'EN LIGNE';
    document.getElementById('stream-status').style.color = 'red';
  }

  stopStream() {
    this.streamOnline = false;

    console.log('Stopping stream...');
    console.log('Disconnecting from Twitch');
    console.log('Disconnecting from YouTube');
    console.log('Saving VOD...');
    console.log('Generating stats...');
    console.log('Sending thank you email to viewers');

    document.getElementById('stream-status').textContent = 'HORS LIGNE';
    document.getElementById('stream-status').style.color = 'gray';

    this.messages = [];
    this.viewers = [];
  }

  moderateMessage(messageId, action, reason) {
    const message = this.messages.find(m => m.id === messageId);

    if (action === 'delete') {
      console.log(`Message supprimé: ${reason}`);
      this.messages = this.messages.filter(m => m.id !== messageId);
    } else if (action === 'timeout') {
      console.log(`Utilisateur timeout: ${message.username} - ${reason}`);
      console.log(`Email envoyé à l'utilisateur`);
      console.log(`Log de modération créé`);
    } else if (action === 'ban') {
      console.log(`Utilisateur banni: ${message.username} - ${reason}`);
      console.log(`Email envoyé à l'utilisateur`);
      console.log(`Log de modération créé`);
      console.log(`Blacklist mise à jour`);
    }

    document.getElementById(`message-${messageId}`).remove();
  }

  generateAnalytics() {
    console.log('=== ANALYTICS REPORT ===');
    console.log(`Total messages: ${this.messages.length}`);
    console.log(`Total viewers: ${this.viewers.length}`);
    console.log(`Stream duration: ${this.streamOnline ? 'En cours' : 'Terminé'}`);

    const report = {
      totalMessages: this.messages.length,
      totalViewers: this.viewers.length,
      averageMessagePerMinute: this.messages.length / 60,
      topChatters: [],
      revenue: 0
    };

    return JSON.stringify(report);
  }

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
  }
}

console.log('=== STREAMHUB - Code à refactorer ===\n');

const hub = new StreamHub();

console.log('1. Démarrage du stream');
hub.startStream('Coding Session', 'Programming', 'twitch_key_123', 'youtube_key_456');
console.log('');

console.log('2. Nouveau follower');
hub.followUser('Alice');
console.log('');

console.log('3. Abonnement Premium');
hub.subscribe('Bob', 'premium', 'stripe', { cardNumber: '****1234' });
console.log('');

console.log('4. Messages dans le chat');
hub.sendMessage('Alice', 'Hello everyone!', 'text', null, null);
hub.sendMessage('Bob', 'Great stream!', 'text', null, 'premium');
hub.sendMessage('Charlie', '🎉', 'emoji', null, null);
console.log('');

console.log('5. Donation');
hub.sendMessage('David', 'Keep up the good work!', 'donation', 50, null);
console.log('');

console.log('6. Calcul de prix avec coupon');
const price = hub.calculateSubscriptionPrice('vip', 'WELCOME10', false);
console.log(`Prix VIP avec coupon: ${price}€`);
console.log('');

console.log('7. Export du chat');
const chatHistory = hub.exportChatHistory('json');
console.log('Chat exporté');

