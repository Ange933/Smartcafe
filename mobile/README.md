# Smart Café Mobile

Application mobile React Native pour les clients du Smart Café.

## Installation

```bash
cd mobile
npm install
```

## Démarrage

### Pour iOS (nécessite macOS et Xcode)
```bash
npm run ios
```

### Pour Android (nécessite Android Studio)
```bash
npm run android
```

### Pour le Web
```bash
npm run web
```

### Avec Expo Go (recommandé pour le développement)
1. Installez l'app Expo Go sur votre smartphone
2. Lancez `npm start`
3. Scannez le QR code avec l'app Expo Go

Note : si la version d'Expo Go n'est pas compatible avec le SDK du projet, utilisez la version Web pour la démo.

## Configuration API

Pour tester sur un appareil physique, modifiez l'URL de l'API dans `src/services/api.ts` :

```typescript
const API_URL = 'http://VOTRE_IP_LOCAL:3000/api';
```

Trouvez votre IP locale :
- Windows : `ipconfig`
- macOS/Linux : `ifconfig`

## Fonctionnalités

- Consultation du menu par catégorie
- Affichage des produits avec nom, description et prix

## Technologies

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
