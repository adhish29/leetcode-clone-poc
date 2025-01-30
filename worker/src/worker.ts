import { createClient } from "redis";
const client = createClient();

function getResult() {
  const types = [
    "Compile Error",
    "Runtime Error (RE)",
    "Time Limit Exceeded (TLE)",
    "Memory Limit Exceeded (MLE)",
    "Wrong Answer (WA)",
    "Output Limit Exceeded",
    "Presentation Error",
    "Internal Error",
    "Success", // Added "Success" as a possible outcome
  ];
  return types[Math.floor(Math.random() * types.length)];
  //   console.log(submissionErrors);
}

async function processSubmission(submission: string): Promise<{
  [key: string]: string;
}> {
  const { user, problemId, language } = JSON.parse(submission);

  const result = getResult();

  console.log("user: ", user);
  console.log("problemId: ", problemId);
  console.log("language: ", language);
  console.log("result: ", result);
  //actual processing logic

  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problemId}.`);

  return {
    user,
    problemId,
    language,
    result,
  };
}

(async () => {
  try {
    await client.connect();
    console.log("connected to redis server");

    while (1) {
      console.log("waiting for submissions to process...");

      try {
        const submission = await client.brPop("problems", 0);
        // console.log(submission);
        const { user, problemId, language, result } = await processSubmission(
          submission.element
        );
        await client.publish(
          `${user}.problem_done`,
          JSON.stringify({ user, problemId, language, result })
        );
      } catch (error) {
        console.error("Error processing submission:", error);
      }
    }
  } catch (error) {
    console.log("error in connecting to redis client", error);
  }
})();
