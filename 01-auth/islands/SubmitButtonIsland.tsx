import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { DevBorder } from "../components/DevBorder.tsx";

interface SubmitButtonIslandProps {
  text: string;
}

export default function SubmitButtonIsland({ text }: SubmitButtonIslandProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <DevBorder componentName="SubmitButtonIsland">
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={() => {
          setIsSubmitting(true);

          // max submit time
          setTimeout(() => setIsSubmitting(false), 20000);

          // submit on current form
          document.activeElement?.closest("form")?.requestSubmit();

          // check if form is submitting
          // and update isSubmitting state
          const form = document.activeElement?.closest("form");
          if (form) {
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === "attributes") {
                  setIsSubmitting(form.classList.contains("submitting"));
                }
              });
            });
            observer.observe(form, { attributes: true });
          }
        }}
        class={`px-6 py-3 text-white rounded transition-colors ${
          isSubmitting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Enviando..." : text}
      </button>
    </DevBorder>
  );
}
