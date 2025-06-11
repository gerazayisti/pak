# PAK Dashboard - Suivi-Évaluation

Tableau de bord de suivi-évaluation et de planification pour le Port Autonome de Kribi.

## 🚀 Fonctionnalités

### Module 1 : Collecte & Centralisation
- Téléversement de fichiers PDF/Excel
- Extraction automatique des données
- Génération de matrices DPCG
- Interface de visualisation

### Module 2 : Prétraitement & Standardisation
- Upload de fichiers Excel
- Nettoyage et harmonisation des données
- Mise en forme automatique
- Export des fichiers standardisés

### Module 3 : Recherche intelligente & Résumé automatique
- Interface de recherche textuelle/vocale
- Système RAG avec embeddings et vector search
- Génération de résumés contextuels
- Export des résultats

### Module 4 : Génération de rapports
- Création automatique de rapports
- Formats multiples (PDF, Word, Excel)
- Indicateurs de performance
- Téléchargement des rapports

## 🛠️ Technologies

- **Frontend :** Next.js 14+, React, Tailwind CSS, shadcn/ui
- **Backend :** Flask/Django (Python)
- **Base de données vectorielle :** FAISS/Pinecone
- **LLM :** GPT-4/Mistral/LLaMA via LangChain

## 🚀 Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd pak-dashboard
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

## 🔒 Sécurité

- Authentification sécurisée
- Gestion des rôles (admin/utilisateur)
- Protection des données sensibles
- Interopérabilité avec l'application "Patrice"

## 📝 Licence

Ce projet est propriétaire et confidentiel. Tous droits réservés © Port Autonome de Kribi. 