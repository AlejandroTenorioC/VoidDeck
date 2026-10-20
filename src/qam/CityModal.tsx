// Layer 3: dialog to pick the screensaver weather city by name.
import { ConfirmModal, TextField } from "@decky/ui";
import { useRef, useState } from "react";
import { languageState, strings } from "../i18n";
import { findCity } from "../screensaver/weather";
import { setCity, settingsState } from "../settings";

export function CityModal({ closeModal }: { closeModal?: () => void }) {
  const copy = strings(languageState());
  const [query, setQuery] = useState(settingsState().city?.name ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Steam closes the dialog right after OK; while the search runs that close is ignored.
  const saving = useRef(false);

  const save = async () => {
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      const city = await findCity(query, languageState());
      if (!city) {
        setError(copy.cityNotFound);
        return;
      }
      setCity(city);
      closeModal?.();
    } catch {
      setError(copy.cityError);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };

  return (
    <ConfirmModal
      strTitle={copy.city}
      strOKButtonText={copy.save}
      strCancelButtonText={copy.cancel}
      bOKDisabled={busy || !query.trim()}
      onOK={save}
      closeModal={() => !saving.current && closeModal?.()}
      onCancel={closeModal}
    >
      <TextField
        label={copy.cityPrompt}
        description={error}
        value={query}
        focusOnMount
        onChange={(event) => setQuery(event.target.value)}
      />
    </ConfirmModal>
  );
}
