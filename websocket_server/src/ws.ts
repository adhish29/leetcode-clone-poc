import WebSocket, { WebSocketServer } from "ws";
import { createClient } from "redis";

const client = createClient();
const wss = new WebSocketServer({ port: 8080 });

async function main() {
  wss.on("connection", (ws) => {
    console.log("client connected");
    ws.on("message", async (data) => {
      //   console.log(data.toString());
      const message = JSON.parse(data.toString());
      if (!message || !message.userName) {
        ws.send(JSON.stringify({ msg: "please send the userName!!!" }));
      } else {
        const userName: string = message.userName;
        await client.subscribe(
          `${userName.toLowerCase()}.problem_done`,
          (pubMessage) => {
            ws.send(pubMessage);
          }
        );
      }
    });

    ws.on("close", () => {
      console.log("client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });
}

(async () => {
  try {
    await client.connect();
    console.log("connected to redis server");
    await main();
  } catch (error) {
    console.log("error in connecting to redis client", error);
  }
})();
