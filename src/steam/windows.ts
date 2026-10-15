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

export function steamDocuments(): Document[] {
  const docs = new Set<Document>();
  for (const ctx of navContexts()) {
    for (const tree of ctx.m_rgGamepadNavigationTrees ?? []) {
      const doc = tree.Root?.Element?.ownerDocument;
      if (doc) docs.add(doc);
    }
  }
  // Fuera de Steam (preview) no hay árboles: usamos el documento actual.
  if (docs.size === 0) docs.add(document);
  return [...docs];
}
