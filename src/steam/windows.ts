// Documentos de las ventanas de Steam (principal, menú, Acceso rápido...).
// El plugin vive en SharedJSContext; cada ventana es un documento aparte al que llegamos
// a través de los árboles de navegación del mando.

type NavTree = { m_ID?: string; Root?: { Element?: Element } };
type NavContext = { m_rgGamepadNavigationTrees?: NavTree[] };

function navContexts(): NavContext[] {
  const w = window as any;
  const controller = w.GamepadNavTree?.m_context?.m_controller ?? w.FocusNavController;
  return controller?.m_rgAllContexts ?? [];
}

/**
 * Ventanas que reciben entrada del mando. Incluye la de notificaciones (logros, amigos...), que no tiene
 * árbol de navegación propio y por eso no aparece en navContexts().
 */
function inputSourceDocuments(): Document[] {
  const sources: { m_targetWindow?: Window }[] =
    (window as any).SteamUIStore?.m_GamepadNavigationManager?.m_rgGamepadInputSources ?? [];
  const docs: Document[] = [];
  for (const source of sources) {
    try {
      const doc = source?.m_targetWindow?.document;
      if (doc) docs.push(doc);
    } catch {
      // Ventana cerrada o de otro origen: se ignora.
    }
  }
  return docs;
}

export function steamDocuments(): Document[] {
  const docs = new Set<Document>();
  for (const ctx of navContexts()) {
    for (const tree of ctx.m_rgGamepadNavigationTrees ?? []) {
      const doc = tree.Root?.Element?.ownerDocument;
      if (doc) docs.add(doc);
    }
  }
  for (const doc of inputSourceDocuments()) docs.add(doc);
  // Fuera de Steam (preview) no hay árboles: usamos el documento actual.
  if (docs.size === 0) docs.add(document);
  return [...docs];
}
