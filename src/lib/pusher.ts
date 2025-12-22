import Pusher from "pusher";
import PusherClient from "pusher-js";

// Validate Pusher environment variables
const validatePusherEnv = () => {
  const required = [
    "PUSHER_APP_ID",
    "NEXT_PUBLIC_PUSHER_KEY",
    "PUSHER_SECRET",
    "NEXT_PUBLIC_PUSHER_CLUSTER",
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === "development") {
    console.warn(`Missing Pusher environment variables: ${missing.join(", ")}`);
  }

  return {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  };
};

const pusherEnv = validatePusherEnv();

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: pusherEnv.appId || "",
  key: pusherEnv.key || "",
  secret: pusherEnv.secret || "",
  cluster: pusherEnv.cluster || "",
  useTLS: true,
});

// Client-side Pusher instance (singleton)
let pusherClient: PusherClient | null = null;

export const getPusherClient = (): PusherClient => {
  if (!pusherClient) {
    pusherClient = new PusherClient(pusherEnv.key || "", {
      cluster: pusherEnv.cluster || "",
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
  }
  return pusherClient;
};
