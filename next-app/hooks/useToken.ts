import { useEffect, useState } from "react";

export default function useToken() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    (async () => {
      const res = await fetch("/api/verifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const json = (await res.json()) as {
        success: boolean;
        token?: { username: string; userId: string };
      };
      if (json.success) {
        setIsLoggedIn(true);
        setUsername(json.token?.username ?? "");
        setUserId(json.token?.userId ?? "");
      } else {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  return [isLoggedIn, username, userId] as [
    boolean | null,
    string | null,
    string | null
  ];
}
