// Les commandes des particuliers passent par Delicity (sous-domaine dédié).
// Le panier/checkout du site reste réservé aux commandes pro (page événements).
export const ORDER_URL = "https://commandes.breakfast-time.fr";

// L'icône panier n'a de sens que dans le parcours pro (événements → panier → commande),
// ou si un panier est déjà en cours.
export const showCartIcon = (pathname: string, count: number) =>
  count > 0 || /^(\/en)?\/(evenements|panier|commande)/.test(pathname);
