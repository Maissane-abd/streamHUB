# streamHUB - Design Patterns en JavaScript

## 🎯 Objectif

Refactorer une plateforme de streaming/chat en ligne en appliquant les design patterns et les principes SOLID.

## 📋 Contexte

Je travaille sur **StreamHub**, une plateforme de streaming en direct avec chat intégré (comme Twitch/YouTube Live). Le code avant refactoring fonctionne mais est difficile à maintenir et à étendre. Ma mission : refactorer le code en appliquant les design patterns appropriés.

## 🎮 Fonctionnalités de l'application

### 1. Système de Chat
- Messages texte, emojis, GIFs, stickers
- Donations avec messages
- Messages de modération (ban, timeout, clear)

### 2. Système d'abonnement
- Niveaux : Gratuit, Premium, VIP, Partner
- Avantages différents selon le niveau
- Calcul de prix avec réductions

### 3. Notifications en temps réel
- Nouveau follower
- Nouvelle donation
- Nouvel abonné
- Message dans le chat
- Stream en ligne/hors ligne

### 4. Intégration de services externes
- API Twitch
- API YouTube
- Processeurs de paiement (Stripe, PayPal, Crypto)
- Service de modération automatique

### 5. Modération
- Filtre de spam
- Filtre de langage inapproprié
- Vérification de liens
- Rate limiting

## 🎯 Design Patterns implémentés

### 1. Observer Pattern
**Où l'utiliser :**
- Notifications en temps réel du chat
- Mise à jour du compteur de viewers
- Notifications de donations/follows
- Système d'événements du stream

**Pourquoi :** Le chat doit notifier plusieurs composants (UI, analytics, logs, modération) à chaque message.

### 2. Strategy Pattern
**Où l'utiliser :**
- Différents types d'abonnement (calcul de prix, avantages)
- Algorithmes de modération
- Stratégies de paiement

**Pourquoi :** Éviter les if/else pour gérer les différents niveaux d'abonnement et méthodes de paiement.

### 3. Factory Pattern
**Où l'utiliser :**
- Création de différents types de messages (texte, emoji, gif, donation)
- Création de notifications
- Création d'événements

**Pourquoi :** Centraliser la logique de création d'objets complexes.

### 4. Decorator Pattern
**Où l'utiliser :**
- Ajout de badges aux messages (modérateur, abonné, VIP)
- Ajout de couleurs/styles aux messages
- Middleware pour la modération
- Logging et analytics

**Pourquoi :** Ajouter dynamiquement des fonctionnalités aux messages sans modifier leur structure de base.

### 5. Adapter Pattern
**Où l'utiliser :**
- Intégration des APIs externes (Twitch, YouTube)
- Adaptation des différents processeurs de paiement
- Services de modération tiers

**Pourquoi :** Créer une interface unifiée pour des services ayant des APIs différentes.

## 📐 Principes SOLID respectés

### S - Single Responsibility
- Séparer la gestion du chat, des notifications, de la modération, des paiements
- Une classe = une responsabilité

### O - Open/Closed
- Pouvoir ajouter de nouveaux types de messages sans modifier le code existant
- Pouvoir ajouter de nouveaux niveaux d'abonnement facilement

### L - Liskov Substitution
- Tous les types de messages doivent être interchangeables
- Toutes les stratégies de paiement doivent fonctionner de la même manière

### I - Interface Segregation
- Interfaces spécifiques pour chaque type de fonctionnalité
- Pas d'interfaces trop larges

### D - Dependency Inversion
- Dépendre d'abstractions, pas d'implémentations concrètes
- Injection de dépendances partout


## Ma démarche de refactorisation

Pour refactoriser le code j'ai : 

SRP en premier - séparer les responsabilités
DIP - créer des interfaces et injecter les dépendances
Strategy - pour les abonnements et paiements
Observer - pour les notifications
Factory - pour les messages
Decorator - pour enrichir les messages
Adapter - pour les services externes
OCP/LSP/ISP - vérifier le respect de ces principes

Au nom des fonctions et des fonctionnalité de l'application j'ai crée differentes classe pour les regrouper une premiere fois avec de les diviser petit a petit selon les consignes. 

## Difficultés rencontrées et solutions

J'en rencontré beaucoup de mal avec l'application du SRP, j'ai encore du mal à savoir ce que veut dire avoir qu'une seule responsabilité.

# ABDALLAH Maïssane