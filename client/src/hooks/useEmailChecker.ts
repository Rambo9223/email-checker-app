import { useCallback, useState } from "react";
import type { EmailApiResponse, ValidationReport } from "../types/email";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

type RequestState =
  | { status: "idle" }
  | { status: "loading"; fileName: string }
  | { status: "success"; report: ValidationReport }
  | { status: "error"; message: string };

export function useEmailChecker() {
  const [state, setState] = useState<RequestState>({ status: "idle" });

  const checkEmail = useCallback(async (file: File) => {
    setState({ status: "loading", fileName: file.name });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/email/check`, {
        method: "POST",
        body: formData,
      });

      const json: EmailApiResponse = await res.json();

      if (!json.success) {
        setState({ status: "error", message: json.error });
        return;
      }

      setState({ status: "success", report: json.data });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? `Could not reach the server — ${err.message}`
            : "Could not reach the server",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, checkEmail, reset };
}
