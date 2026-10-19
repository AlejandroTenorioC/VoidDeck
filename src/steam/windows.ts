// Documents for Steam windows (main, menu, Quick Access…).
// The plugin lives in SharedJSContext; each window is a separate document reached
// through the controller's navigation trees.

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
  // Outside Steam (preview), there are no trees, so use the current document.
  if (docs.size === 0) docs.add(document);
  return [...docs];
}

/**
 * The windows behind those documents. The plugin runs in the shared context, so the
 * class names of the on-screen keyboard have to be read from the window that draws it.
 */
export function steamWindows(): Window[] {
  const wins = new Set<Window>();
  for (const doc of steamDocuments()) {
    const view = doc.defaultView;
    if (view) wins.add(view);
  }
  return [...wins];
}
