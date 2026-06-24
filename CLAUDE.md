# Breakfast Time — Guide Claude

## Projet
Site vitrine pour **Breakfast Time**, service de **livraison de petit déjeuner et brunch à domicile**. ⚠️ Ce n'est PAS une boulangerie ni un traiteur — c'est un service de livraison à domicile.
- Framework : Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- Repo GitHub : https://github.com/samimi0212/breakfast-time
- Déploiement : **Vercel** (auto-deploy depuis la branche `main`)

## Workflow de déploiement

Vercel surveille la branche `main` sur GitHub. Pour qu'une modification soit mise en ligne :

1. Faire les modifications dans le worktree courant
2. Committer les changements
3. Merger la branche `claude/...` dans `main` (dans le dépôt principal, pas le worktree)
4. Pousser `main` sur GitHub → Vercel déclenche automatiquement le déploiement

### Commandes exactes après avoir terminé les modifications

```bash
# Depuis le répertoire principal du projet
cd /Users/deborah/Documents/Breakfast\ Time/breakfast-time-site

# Récupérer les derniers changements de la branche de travail
git merge claude/NOM-DU-WORKTREE

# Pousser sur GitHub (déclenche Vercel)
git push origin main
```

> **Note** : `vercel` CLI et `gh` CLI ne sont pas installés. Le déploiement passe uniquement par le push GitHub.

## Commandes utiles

```bash
# Dev local
npm run dev

# Build de vérification avant déploiement
npm run build

# Tests
npm run test
```

## Structure du projet

```
src/
  components/    # Composants React (sections de la page)
  pages/         # Pages de l'app
  data/          # Données statiques (produits, etc.)
  hooks/         # Custom hooks
  lib/           # Utilitaires
public/          # Assets statiques
api/             # Fonctions serverless Vercel
```

## Notes importantes

- Le routage côté client est géré par `vercel.json` (rewrites vers `/index.html`)
- Package manager : npm (forcé pour Vercel, ne pas switcher vers bun/yarn)
- Le dossier `dist/` est le build de production (ignoré par git)
