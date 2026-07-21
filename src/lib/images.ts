const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80`;

/** All photography is real Unsplash imagery (Unsplash License). */
export const IMG = {
  /* Editorial / lifestyle */
  editorialSuit: unsplash("photo-1543896777-b3b82d89c491"),
  streetJoy: unsplash("photo-1665396695736-4c1a7eb96597"),
  urbanListener: unsplash("photo-1594434533760-02e0f3faaa68"),
  redBluePortrait: unsplash("photo-1633268288844-28df1f1f68d9"),

  /* Product photography */
  productOne: unsplash("photo-1618366712010-f4ae9c647dcb"),
  productNoir: unsplash("photo-1487215078519-e21cc028cb29"),
  productPop: unsplash("photo-1505740420928-5e560c06d30e"),
  productHeritage: unsplash("photo-1484704849700-f032a568e944"),

  /* Macro details */
  macroSilver: unsplash("photo-1520170350707-b2da59970118"),
  macroTopDown: unsplash("photo-1583394838336-acd977736f90"),
  macroFolded: unsplash("photo-1558756520-22cfe5d382ca"),
} as const;
