"use client";

import { useId, useRef, useState } from "react";

/**
 * Δίνει στις φόρμες τα δύο anti-spam πεδία που περιμένει το API.
 *
 * Το honeypot είναι εκτός οθόνης αντί για `display: none` — τα bots αγνοούν τα
 * κρυμμένα με display, αλλά συμπληρώνουν ό,τι βρίσκουν στο DOM. Το
 * `aria-hidden` + `tabIndex={-1}` το κρατούν έξω από screen readers και από τη
 * σειρά του Tab, ώστε να μην το συναντήσει ποτέ πραγματικός χρήστης.
 */
export function useFormGuard() {
  const mountedAt = useRef(Date.now());
  const [honeypotValue, setHoneypotValue] = useState("");
  // Η σελίδα /contact έχει δύο φόρμες, άρα δύο honeypot. Με σταθερό id θα είχαμε
  // διπλότυπο id στο DOM και το <label> θα έδειχνε σε λάθος πεδίο.
  const fieldId = useId();

  const guardPayload = () => ({ _hp: honeypotValue, _t: mountedAt.current });

  const honeypotField = (
    <div
      aria-hidden="true"
      className="absolute w-px h-px overflow-hidden -left-[9999px] top-auto"
    >
      <label htmlFor={fieldId}>Μην συμπληρώνετε αυτό το πεδίο</label>
      <input
        id={fieldId}
        name="website-url"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypotValue}
        onChange={(e) => setHoneypotValue(e.target.value)}
      />
    </div>
  );

  return { guardPayload, honeypotField };
}
